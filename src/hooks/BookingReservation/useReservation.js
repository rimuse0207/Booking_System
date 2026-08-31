// src/hooks/useReservation.js
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import moment from "moment";
import {
  SLOT_WIDTH,
  MINUTE_WIDTH,
  timeToMins,
  minsToTime,
} from "../../constants/BookingReservation/reservation";
import { Request_Get_Axios, Request_Post_Axios } from "../../API/index";
import { useSelector } from "react-redux";
import { useLoginChecking } from "../Login/useLoginChecking";
import { useToast } from "../../constants/Toast/ToastContext";

const getMinsFromDateStr = (dateString) => {
  const m = moment(dateString);
  return m.hours() * 60 + m.minutes();
};

export const useReservation = () => {
  const LoginInfo = useSelector(
    (state) => state.Login_Info_Reducer_State.Login_Info,
  );
  const { showToast } = useToast();
  const { actions } = useLoginChecking();

  // --- 1. 상태(State) 선언 ---
  const [SelectBasicTitle, setSelectBasicTitle] = useState("Company_Room");
  const [currentDate, setCurrentDate] = useState(new Date());

  // 💡 층수 필터 상태 추가 (기본값: ALL)
  const [floorFilter, setFloorFilter] = useState("ALL");

  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);

  const [draft, setDraft] = useState(null);
  const [dragState, setDragState] = useState(null);
  const isDraggingRef = useRef(false);

  // 모달 제어 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // 신규 폼 모달
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // 상세 보기 모달
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // 수정 폼 모달

  const [selectedReservation, setSelectedReservation] = useState(null);
  const [modalForm, setModalForm] = useState({
    subject: `${LoginInfo.company} ${LoginInfo.name}님의 회의실 예약`,
    isAllDay: false,
    sendEmail: false,
  });

  // --- 💡 1-1. 층수 및 예외(차량) 필터링 로직 (useMemo 적용 최적화) ---
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      // 1) 전체 보기면 무조건 통과
      if (floorFilter === "ALL") return true;

      // 이름 속성 매핑 (DB 스키마 구조에 맞게 안전하게 속성 참조)
      const roomName = room.brity_works_room_info_name;

      // 2) 법인차량 예외 처리 (이름에 '차량'이 포함되어 있다면 무조건 통과)
      if (roomName.includes("차량")) return true;

      // 3) 2F / 6F 필터 선택 시 해당 문자로 시작하는 방만 통과
      if (floorFilter === "2F" && roomName.startsWith("2F")) return true;
      if (floorFilter === "6F" && roomName.startsWith("6F")) return true;

      return false;
    });
  }, [rooms, floorFilter]);

  // --- 2. 모달 열기/닫기 및 흐름 제어 액션 ---

  // (신규) 툴팁 체크 버튼 누를 때 -> 신규 예약 폼 모달 열기
  const openReservationModal = useCallback(() => {
    setModalForm({
      subject: `${LoginInfo.company} ${LoginInfo.name}님의 회의실 예약`,
      isAllDay: false,
      sendEmail: false,
    });
    setIsModalOpen(true);
  }, [LoginInfo.name]);

  const closeDetailModal = useCallback(() => {
    setSelectedReservation(null);
    setIsDetailModalOpen(false);
  }, []);

  const closeEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setSelectedReservation(null);
  }, []);

  // 기존 예약 클릭 시 상세 보기 모달 열기
  const handleReservationClick = useCallback((reservation) => {
    setSelectedReservation(reservation);
    setIsDetailModalOpen(true);
  }, []);

  // (수정 1) 상세 창에서 '수정' 버튼 클릭 시 -> 드래그 가능한 가예약(Draft) 블록 생성
  const editReservation = useCallback(
    (reservation) => {
      closeDetailModal();

      const rStart = getMinsFromDateStr(reservation.startTime);
      const rEnd = getMinsFromDateStr(reservation.endTime);

      // 💡 rooms 대신 filteredRooms 배열에서 인덱스 탐색
      const targetRoomIndex = filteredRooms.findIndex(
        (r) => r.brity_works_room_info_targetId === reservation.roomId,
      );

      setDraft({
        roomIndex: targetRoomIndex,
        startMin: rStart,
        endMin: rEnd,
        editId: reservation.uid,
        originalData: reservation,
      });
    },
    [closeDetailModal, filteredRooms],
  );

  const confirmDragEdit = useCallback(() => {
    if (!draft || !draft.originalData) return;

    const baseDate = moment(draft.originalData.startTime).format("YYYY-MM-DD");
    const newStartStr = `${baseDate}T${minsToTime(draft.startMin)}:00`;
    const newEndStr = `${baseDate}T${minsToTime(draft.endMin)}:00`;

    const updatedRes = {
      ...draft.originalData,
      startTime: newStartStr,
      endTime: newEndStr,
    };

    setSelectedReservation(updatedRes);
    setIsEditModalOpen(true);
    setDraft(null);
  }, [draft]);

  // --- 3. 데이터 패칭 및 API 호출 액션 ---

  // 데이터 조회
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const dateStr = moment(currentDate).format("YYYY-MM-DD");
        await actions.LoginTokenChecking();

        const [roomsRes, reservationsRes] = await Promise.all([
          Request_Get_Axios("/RoomApp/rooms", {
            SelectBasicTitle,
          }),
          Request_Get_Axios(`/RoomApp/reservations`, {
            SelectBasicTitle,
            date: dateStr,
          }),
        ]);
        console.log(reservationsRes);
        if (roomsRes?.data) setRooms(roomsRes.data);
        if (reservationsRes?.data) setReservations(reservationsRes.data);
      } catch (error) {
        console.error("데이터 조회 에러:", error);
      } finally {
        setLoading(false);
        setDraft(null);
        setDragState(null);
        setIsModalOpen(false);
      }
    };

    fetchData();
  }, [currentDate, SelectBasicTitle]);

  // 신규 예약 API 호출
  const submitReservation = useCallback(async () => {
    console.log("modalForm", modalForm);
    const finalStartMin = modalForm.isAllDay ? 0 : draft.startMin;
    const finalEndMin = modalForm.isAllDay ? 24 * 60 : draft.endMin;

    // 💡 rooms 대신 filteredRooms 에서 인덱스로 타겟 ID 조회
    const targetRoomId =
      filteredRooms[draft.roomIndex]?.brity_works_room_info_targetId;

    const newReservationData = {
      roomId: targetRoomId,
      startDate: moment(currentDate).format("YYYY-MM-DD"),
      endDate: modalForm.endDate
        ? moment(modalForm.endDate).format("YYYY-MM-DD")
        : moment(currentDate).format("YYYY-MM-DD"),
      subject:
        modalForm.subject ||
        `${LoginInfo.company} ${LoginInfo.name}님의 회의실 예약`,
      startTime: minsToTime(finalStartMin),
      endTime: minsToTime(finalEndMin),
      allDayYn: modalForm.isAllDay ? "Y" : "N",
    };

    try {
      const response = await Request_Post_Axios(
        "/RoomApp/saveReservations",
        newReservationData,
      );

      if (response.status) {
        if (response.data.status === 200 && response.data.statusText === "OK") {
          setReservations((prev) => [...prev, response.data.result]);
          setDraft(null);
          setIsModalOpen(false);
          showToast("예약이 완료 되었습니다.", "success");
        } else {
          showToast(response.data.message, "error");
        }
      }
    } catch (error) {
      console.error("신규 예약 등록 실패:", error);
      showToast("예약 저장 중 오류가 발생했습니다.", "error");
    }
  }, [draft, modalForm, currentDate, filteredRooms, LoginInfo]);

  // 기존 예약 수정 API 호출
  const submitEditReservation = useCallback(
    async (updatedData) => {
      try {
        const req = await Request_Post_Axios(
          "/RoomApp/updateReservations",
          updatedData,
        );
        console.log(req);
        // setReservations((prev) =>
        //   prev.map((r) => (r.uid === updatedData.uid ? updatedData : r)),
        // );
        // closeEditModal();

        if (req.status) {
          if (req.data.status === 200 && req.data.statusText === "OK") {
            setReservations((prev) =>
              prev.map((r) => (r.uid === updatedData.uid ? updatedData : r)),
            );
            closeEditModal();
            showToast("회의실 예약이 수정되었습니다.", "success");
          } else {
            showToast(req.data.message, "error");
          }
        }
      } catch (error) {
        console.error("예약 수정 실패:", error);
        showToast("예약 수정 중 오류가 발생했습니다.", "error");
      }
    },
    [closeEditModal],
  );

  // 예약 삭제 API 호출
  const deleteReservation = useCallback(
    async (reservationId) => {
      if (!window.confirm("정말로 이 예약을 삭제하시겠습니까?")) return;

      try {
        await Request_Post_Axios(`/RoomApp/deleteReservations`, {
          reservationId,
        });

        setReservations((prev) =>
          prev.filter((r) => r.uid !== reservationId.uid),
        );
        closeDetailModal();
        showToast("회의실 예약이 삭제되었습니다.", "success");
      } catch (error) {
        console.error("삭제 실패:", error);
        showToast("예약 삭제 중 오류가 발생했습니다.", "error");
      }
    },
    [closeDetailModal],
  );

  // --- 4. 드래그 UI 및 충돌 방지 제어 로직 ---

  // 마우스 드래그 이벤트 (스냅 효과)
  useEffect(() => {
    if (!dragState) return;

    const handleMouseMove = (e) => {
      isDraggingRef.current = true;
      const diffX = e.clientX - dragState.startX;
      const diffMins = Math.round(diffX / (30 * MINUTE_WIDTH)) * 30;

      setDraft((prev) => {
        if (!prev) return null;
        let newStart = prev.startMin;
        let newEnd = prev.endMin;

        if (dragState.type === "right") {
          newEnd = Math.min(
            dragState.maxBound,
            Math.max(newStart + 30, dragState.initialEnd + diffMins),
          );
        } else {
          newStart = Math.max(
            dragState.minBound,
            Math.min(newEnd - 30, dragState.initialStart + diffMins),
          );
        }
        return { ...prev, startMin: newStart, endMin: newEnd };
      });
    };

    const handleMouseUp = () => {
      setDragState(null);
      setTimeout(() => {
        isDraggingRef.current = false;
      }, 100);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragState]);

  // 빈 슬롯 클릭 처리
  const handleSlotClick = useCallback(
    async (roomIndex, hour, isSecondHalf) => {
      const LoginChecking = await actions.LoginTokenChecking();
      if (!LoginChecking) {
        return showToast("로그인 이후 예약이 가능합니다.", "error");
      }
      if (dragState || isDraggingRef.current || isModalOpen) return;

      const startMin = hour * 60 + (isSecondHalf ? 30 : 0);
      const endMin = startMin + 30;

      // 💡 rooms 대신 filteredRooms 에서 타겟 ID 조회
      const targetRoomId =
        filteredRooms[roomIndex]?.brity_works_room_info_targetId;

      const isOccupied = reservations.some((r) => {
        if (r.roomId !== targetRoomId) return false;

        const rStart = getMinsFromDateStr(r.startTime);
        const rEnd = getMinsFromDateStr(r.endTime);
        return startMin < rEnd && endMin > rStart;
      });

      if (!isOccupied) setDraft({ roomIndex, startMin, endMin });
    },
    [dragState, isModalOpen, reservations, filteredRooms],
  );

  // 드래그 시작 시 한계선 계산
  const handleDragStart = useCallback(
    (e, type, roomIndex) => {
      e.stopPropagation();
      e.preventDefault();

      // 💡 rooms 대신 filteredRooms 에서 타겟 ID 조회
      const targetRoomId =
        filteredRooms[roomIndex]?.brity_works_room_info_targetId;

      // 현재 수정 중인 자기 자신(editId)은 충돌 블록에서 제외!
      const roomRes = reservations.filter(
        (r) => r.roomId === targetRoomId && r.uid !== draft?.editId,
      );

      let minBound = 0,
        maxBound = 24 * 60;

      roomRes.forEach((r) => {
        const rStart = getMinsFromDateStr(r.startTime);
        const rEnd = getMinsFromDateStr(r.endTime);

        if (type === "right" && rStart >= draft.startMin)
          maxBound = Math.min(maxBound, rStart);
        if (type === "left" && rEnd <= draft.endMin)
          minBound = Math.max(minBound, rEnd);
      });

      setDragState({
        active: true,
        type,
        startX: e.clientX,
        initialStart: draft.startMin,
        initialEnd: draft.endMin,
        minBound,
        maxBound,
      });
    },
    [draft, reservations, filteredRooms],
  );

  return {
    state: {
      SelectBasicTitle,
      currentDate,

      floorFilter, // 💡 컴포넌트(Header)에서 사용할 필터 상태

      rooms: filteredRooms, // 💡 컴포넌트는 원본 rooms가 아닌 필터링된 rooms를 렌더링하도록 덮어씌움
      reservations,
      draft,
      dragState,
      isModalOpen,
      modalForm,
      isDraggingRef,
      loading,
      LoginInfo,
      isDetailModalOpen,
      selectedReservation,
      isEditModalOpen,
    },
    actions: {
      setSelectBasicTitle,
      setCurrentDate,

      setFloorFilter, // 💡 컴포넌트(Header)에서 필터값을 바꿀 함수

      setDraft,
      setIsModalOpen,
      setModalForm,
      handleSlotClick,
      handleDragStart,

      // 모달/UI 전환 관련
      openReservationModal,
      handleReservationClick,
      closeDetailModal,
      editReservation,
      closeEditModal,
      confirmDragEdit,

      // 실제 서버 데이터 변경 처리
      submitReservation,
      submitEditReservation,
      deleteReservation,
    },
  };
};
