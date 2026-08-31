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

  const [SelectBasicTitle, setSelectBasicTitle] = useState("Company_Room");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [floorFilter, setFloorFilter] = useState("ALL");

  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);

  const [draft, setDraft] = useState(null);
  const [dragState, setDragState] = useState(null);
  const isDraggingRef = useRef(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [selectedReservation, setSelectedReservation] = useState(null);
  const [modalForm, setModalForm] = useState({
    subject: `${LoginInfo.company} ${LoginInfo.name}님의 회의실 예약`,
    isAllDay: false,
    sendEmail: false,
  });

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      if (floorFilter === "ALL") return true;
      const roomName = room.brity_works_room_info_name;
      if (roomName.includes("차량")) return true;
      if (floorFilter === "2F" && roomName.startsWith("2F")) return true;
      if (floorFilter === "6F" && roomName.startsWith("6F")) return true;
      return false;
    });
  }, [rooms, floorFilter]);

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

  const handleReservationClick = useCallback((reservation) => {
    setSelectedReservation(reservation);
    setIsDetailModalOpen(true);
  }, []);

  const editReservation = useCallback(
    (reservation) => {
      closeDetailModal();

      const rStart = getMinsFromDateStr(reservation.startTime);
      const rEnd = getMinsFromDateStr(reservation.endTime);

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

  const submitReservation = useCallback(async () => {
    const finalStartMin = modalForm.isAllDay ? 0 : draft.startMin;
    const finalEndMin = modalForm.isAllDay ? 24 * 60 : draft.endMin;

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

  const submitEditReservation = useCallback(
    async (updatedData) => {
      try {
        const req = await Request_Post_Axios(
          "/RoomApp/updateReservations",
          updatedData,
        );

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

  // --- 💡 모바일 터치 및 마우스 하이브리드 드래그 처리 ---
  useEffect(() => {
    if (!dragState) return;

    // e.clientX를 마우스/터치 구분해서 가져오는 헬퍼 함수
    const getClientX = (e) => {
      return e.touches && e.touches.length > 0
        ? e.touches[0].clientX
        : e.clientX;
    };

    const handleMove = (e) => {
      isDraggingRef.current = true;
      const clientX = getClientX(e);
      if (!clientX) return;

      const diffX = clientX - dragState.startX;
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

    const handleUp = () => {
      setDragState(null);
      setTimeout(() => {
        isDraggingRef.current = false;
      }, 100);
    };

    // 마우스 이벤트
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
    // 모바일 터치 이벤트
    document.addEventListener("touchmove", handleMove, { passive: false });
    document.addEventListener("touchend", handleUp);
    document.addEventListener("touchcancel", handleUp);

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
      document.removeEventListener("touchmove", handleMove);
      document.removeEventListener("touchend", handleUp);
      document.removeEventListener("touchcancel", handleUp);
    };
  }, [dragState]);

  // 빈 슬롯 클릭 처리
  const handleSlotClick = useCallback(
    async (roomIndex, hour, isSecondHalf) => {
      const LoginChecking = await actions.LoginTokenChecking();
      if (!LoginChecking) {
        return showToast("로그인 이후 예약이 가능합니다.", "error");
      }

      // 💡 [버그 픽스] 이미 드래프트(가예약 박스)가 선택된 상태에서 다른 곳을 클릭하면 무시하거나 취소 처리
      if (draft || dragState || isDraggingRef.current || isModalOpen) {
        // 이미 박스가 띄워져 있다면 새 박스를 그리지 않는다. (기존 드래프트 유실/NaN 에러 방지)
        return;
      }

      const startMin = hour * 60 + (isSecondHalf ? 30 : 0);
      const endMin = startMin + 30;

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
    [draft, dragState, isModalOpen, reservations, filteredRooms],
  );

  // 드래그 시작 시 한계선 계산 (모바일 터치 호환)
  const handleDragStart = useCallback(
    (e, type, roomIndex) => {
      e.stopPropagation();
      // 터치 스크롤 방지는 컴포넌트의 CSS(touch-action: none)와 함께 처리

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;

      const targetRoomId =
        filteredRooms[roomIndex]?.brity_works_room_info_targetId;

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
        startX: clientX,
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
      floorFilter,
      rooms: filteredRooms,
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
      setFloorFilter,
      setDraft,
      setIsModalOpen,
      setModalForm,
      handleSlotClick,
      handleDragStart,
      openReservationModal,
      handleReservationClick,
      closeDetailModal,
      editReservation,
      closeEditModal,
      confirmDragEdit,
      submitReservation,
      submitEditReservation,
      deleteReservation,
    },
  };
};
