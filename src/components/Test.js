import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";

// --- [1] 기본 상수 및 데이터 설정 ---
const ROOMS = Array.from({ length: 9 }, (_, i) => `회의실 ${i + 1}`);
const START_HOUR = 0;
const END_HOUR = 24;
const HOURS = Array.from(
  { length: END_HOUR - START_HOUR },
  (_, i) => START_HOUR + i,
);

const SLOT_WIDTH = 120; // 1시간 = 120px
const MINUTE_WIDTH = SLOT_WIDTH / 60; // 1분 = 2px

const timeToMins = (timeStr) => {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
};

const minsToTime = (mins) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

export default function ReservationBoard() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const [reservations, setReservations] = useState([
    {
      id: 1,
      roomIndex: 0,
      title: "주간 업무 보고",
      user: "관리자",
      start: "09:30",
      end: "11:00",
    },
    {
      id: 2,
      roomIndex: 2,
      title: "인프라 점검",
      user: "김철수",
      start: "13:00",
      end: "16:30",
    },
    {
      id: 3,
      roomIndex: 8,
      title: "야간 배포 작업",
      user: "이영희",
      start: "22:00",
      end: "23:30",
    },
  ]);

  const [draft, setDraft] = useState(null);
  const [dragState, setDragState] = useState(null);

  // 💡 [새로 추가된 상태] 모달창 표시 여부 및 입력 폼 데이터
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalForm, setModalForm] = useState({
    title: "",
    isAllDay: false,
    sendEmail: false,
  });

  const scrollRef = useRef(null);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    if (scrollRef.current) {
      const now = new Date();
      const currentPixelPosition =
        (now.getHours() + now.getMinutes() / 60) * SLOT_WIDTH;
      const containerWidth = scrollRef.current.clientWidth;
      const scrollTo = currentPixelPosition - containerWidth / 2 + 100;
      scrollRef.current.scrollLeft = Math.max(0, scrollTo);
    }
  }, []);

  // 드래그 중 충돌 방지 로직 (Boundary Clamping)
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
          newEnd = Math.max(newStart + 30, dragState.initialEnd + diffMins);
          newEnd = Math.min(dragState.maxBound, newEnd);
        } else {
          newStart = Math.min(newEnd - 30, dragState.initialStart + diffMins);
          newStart = Math.max(dragState.minBound, newStart);
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

  // 빈 공간 클릭 (가예약 박스 생성)
  const handleSlotClick = (e, roomIndex, hour, isSecondHalf) => {
    e.stopPropagation();
    if (dragState || isDraggingRef.current || isModalOpen) return;

    const startMin = hour * 60 + (isSecondHalf ? 30 : 0);
    const endMin = startMin + 30;

    // 클릭한 곳이 이미 예약된 시간과 겹치는지 검사
    const isOccupied = reservations.some((r) => {
      if (r.roomIndex !== roomIndex) return false;
      return startMin < timeToMins(r.end) && endMin > timeToMins(r.start);
    });

    if (isOccupied) return;

    setDraft({ roomIndex, startMin, endMin });
  };

  const handleDragStart = (e, type, roomIndex) => {
    e.stopPropagation();
    e.preventDefault();

    const roomRes = reservations.filter((r) => r.roomIndex === roomIndex);
    let minBound = 0;
    let maxBound = 24 * 60;

    roomRes.forEach((r) => {
      const rStart = timeToMins(r.start);
      const rEnd = timeToMins(r.end);
      if (type === "right" && rStart >= draft.startMin) {
        maxBound = Math.min(maxBound, rStart);
      }
      if (type === "left" && rEnd <= draft.endMin) {
        minBound = Math.max(minBound, rEnd);
      }
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
  };

  // 💡 [새로 추가됨] 툴팁에서 체크(✓) 버튼 클릭 시 모달 열기
  const openReservationModal = (e) => {
    e.stopPropagation();
    // 폼 초기화 후 모달 열기
    setModalForm({ title: "", isAllDay: false, sendEmail: false });
    setIsModalOpen(true);
  };

  // 💡 [새로 추가됨] 모달창에서 '예약 확정' 클릭 시 실제 예약 등록
  const submitReservation = () => {
    // 종일 모드일 경우 시간을 00:00 ~ 24:00으로 덮어씌움
    const finalStartMin = modalForm.isAllDay ? 0 : draft.startMin;
    const finalEndMin = modalForm.isAllDay ? 24 * 60 : draft.endMin;

    const newReservation = {
      id: Date.now(),
      roomIndex: draft.roomIndex,
      title: modalForm.title || "제목 없는 회의", // 제목이 비어있을 경우 기본값
      user: "IT Manager",
      start: minsToTime(finalStartMin),
      end: minsToTime(finalEndMin),
      isAllDay: modalForm.isAllDay,
      sendEmail: modalForm.sendEmail,
    };

    setReservations([...reservations, newReservation]);
    setDraft(null);
    setIsModalOpen(false);
  };

  const cancelDraftBtn = (e) => {
    e.stopPropagation();
    setDraft(null);
  };

  const cancelDraftOnBg = () => {
    // 💡 모달이 열려있거나 드래그 중일 때는 배경을 눌러도 취소되지 않음
    if (isDraggingRef.current || isModalOpen) return;
    setDraft(null);
  };

  // 폼 입력 핸들러
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setModalForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePrevDay = () =>
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 1)));
  const handleNextDay = () =>
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)));
  const handleDateChange = (e) => {
    if (e.target.value) setCurrentDate(new Date(e.target.value));
  };

  const localDateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;
  const formattedDate = `${currentDate.getFullYear()}. ${String(currentDate.getMonth() + 1).padStart(2, "0")}. ${String(currentDate.getDate()).padStart(2, "0")}`;
  const dayName = ["일", "월", "화", "수", "목", "금", "토"][
    currentDate.getDay()
  ];

  const getBoxStyleByMins = (startMin, endMin) => ({
    left: `${startMin * MINUTE_WIDTH}px`,
    width: `${(endMin - startMin) * MINUTE_WIDTH}px`,
  });

  return (
    <PageContainer onClick={cancelDraftOnBg}>
      {/* 글로벌 네비게이션 */}
      <TopMenu>
        <Logo>DHK Solution</Logo>
        <NavLinks>
          <NavLink $active>타임테이블</NavLink>
          <NavLink>나의 예약</NavLink>
          <NavLink>회의실 관리</NavLink>
        </NavLinks>
        <UserProfile>
          <Avatar>M</Avatar>
          <UserName>IT Manager 님</UserName>
        </UserProfile>
      </TopMenu>

      <ContentContainer>
        {/* 날짜 선택 헤더 */}
        <Header>
          <HeaderLeft>
            <Badge>예약 시스템</Badge>
            <Title>회의실 타임테이블</Title>
          </HeaderLeft>

          <DateController onClick={(e) => e.stopPropagation()}>
            <DateBtn onClick={handlePrevDay}>&lt;</DateBtn>
            <DateLabel>
              <HiddenDatePicker
                type="date"
                value={localDateString}
                onChange={handleDateChange}
              />
              <DateDisplay>
                {formattedDate} ({dayName})
              </DateDisplay>
            </DateLabel>
            <DateBtn onClick={handleNextDay}>&gt;</DateBtn>
          </DateController>
        </Header>

        <ScrollWrapper ref={scrollRef}>
          <BoardWrapper $isDragging={!!dragState}>
            <GridHeader>
              <RoomCorner>ROOMS</RoomCorner>
              <TimeRow>
                {HOURS.map((hour) => (
                  <TimeHeaderCell key={hour}>
                    <HourLabel>{`${String(hour).padStart(2, "0")}:00`}</HourLabel>
                    <MinuteLabels>
                      <MinLabel>00</MinLabel>
                      <MinLabel>30</MinLabel>
                    </MinuteLabels>
                  </TimeHeaderCell>
                ))}
              </TimeRow>
            </GridHeader>

            <GridBody>
              {ROOMS.map((room, roomIdx) => (
                <RoomRow key={roomIdx}>
                  <RoomLabel>{room}</RoomLabel>

                  <TimelineArea
                    $isActive={draft && draft.roomIndex === roomIdx}
                  >
                    {HOURS.map((hour) => {
                      const isOffHour = hour < 9 || hour >= 18;
                      return (
                        <SlotCell key={hour}>
                          <HalfSlot
                            $isOffHour={isOffHour}
                            onClick={(e) =>
                              handleSlotClick(e, roomIdx, hour, false)
                            }
                          />
                          <HalfSlot
                            $isOffHour={isOffHour}
                            onClick={(e) =>
                              handleSlotClick(e, roomIdx, hour, true)
                            }
                          />
                        </SlotCell>
                      );
                    })}

                    {/* 확정된 기존 예약 블록 */}
                    {reservations
                      .filter((res) => res.roomIndex === roomIdx)
                      .map((res) => (
                        <ReservationBox
                          key={res.id}
                          style={getBoxStyleByMins(
                            timeToMins(res.start),
                            timeToMins(res.end),
                          )}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <BoxTitle>{res.title}</BoxTitle>
                          <BoxFooter>
                            <BoxTime>
                              {res.isAllDay
                                ? "종일"
                                : `${res.start} - ${res.end}`}
                            </BoxTime>
                            <BoxUser>{res.user}</BoxUser>
                          </BoxFooter>
                        </ReservationBox>
                      ))}

                    {/* 가예약(Draft) 및 플로팅 바 렌더링 */}
                    {draft && draft.roomIndex === roomIdx && (
                      <DraftBox
                        style={getBoxStyleByMins(draft.startMin, draft.endMin)}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* 외부 플로팅 툴팁 바 */}
                        {!dragState && !isModalOpen && (
                          <FloatingBar $isFirstRow={roomIdx === 0}>
                            <FloatingTime>
                              {minsToTime(draft.startMin)} -{" "}
                              {minsToTime(draft.endMin)}
                            </FloatingTime>
                            <Divider />
                            {/* 💡 체크(✓) 버튼 클릭 시 openReservationModal 실행 */}
                            <IconBtn $primary onClick={openReservationModal}>
                              ✓
                            </IconBtn>
                            <IconBtn onClick={cancelDraftBtn}>✕</IconBtn>
                          </FloatingBar>
                        )}

                        <DragHandleLeft
                          onMouseDown={(e) =>
                            handleDragStart(e, "left", roomIdx)
                          }
                        >
                          <div className="handle-bar" />
                        </DragHandleLeft>

                        <DragHandleRight
                          onMouseDown={(e) =>
                            handleDragStart(e, "right", roomIdx)
                          }
                        >
                          <div className="handle-bar" />
                        </DragHandleRight>
                      </DraftBox>
                    )}
                  </TimelineArea>
                </RoomRow>
              ))}
            </GridBody>
          </BoardWrapper>
        </ScrollWrapper>
      </ContentContainer>

      {/* 💡 [새로 추가됨] 상세 예약 모달창 (오버레이 포함) */}
      {isModalOpen && draft && (
        <ModalOverlay onClick={() => setIsModalOpen(false)}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>회의실 예약 세부 설정</ModalTitle>
              <CloseBtn onClick={() => setIsModalOpen(false)}>✕</CloseBtn>
            </ModalHeader>

            <ModalBody>
              <FormGroup>
                <Label>회의 제목</Label>
                <Input
                  type="text"
                  name="title"
                  placeholder="예: 주간 인프라 점검 회의"
                  value={modalForm.title}
                  onChange={handleFormChange}
                  autoFocus
                />
              </FormGroup>

              <FormGroup>
                <Label>선택된 회의실 및 시간</Label>
                <TimeInfoBox>
                  <RoomTag>{ROOMS[draft.roomIndex]}</RoomTag>
                  {/* 종일 모드 체크 시 시간 텍스트 변경 */}
                  <TimeText>
                    {modalForm.isAllDay
                      ? `${formattedDate} (종일)`
                      : `${formattedDate} ${minsToTime(draft.startMin)} ~ ${minsToTime(draft.endMin)}`}
                  </TimeText>
                </TimeInfoBox>
              </FormGroup>

              <ToggleGroup>
                <CheckboxLabel>
                  <input
                    type="checkbox"
                    name="isAllDay"
                    checked={modalForm.isAllDay}
                    onChange={handleFormChange}
                  />
                  <span>종일 모드로 예약 (00:00 - 24:00)</span>
                </CheckboxLabel>
                <CheckboxLabel>
                  <input
                    type="checkbox"
                    name="sendEmail"
                    checked={modalForm.sendEmail}
                    onChange={handleFormChange}
                  />
                  <span>참석자 및 관련자에게 메일 발송</span>
                </CheckboxLabel>
              </ToggleGroup>
            </ModalBody>

            <ModalFooter>
              <Button onClick={() => setIsModalOpen(false)}>취소</Button>
              <Button $primary onClick={submitReservation}>
                예약 확정
              </Button>
            </ModalFooter>
          </ModalContainer>
        </ModalOverlay>
      )}
    </PageContainer>
  );
}

// --- [7] Styled Components ---

/* (기존 PageContainer, Header 등 레이아웃 스타일은 유지됩니다) */
const PageContainer = styled.div`
  --label-width: 140px;
  @media (max-width: 768px) {
    --label-width: 80px;
  }
  width: 100%;
  min-height: 100vh;
  background-color: #f8fafc;
  font-family:
    "Pretendard",
    -apple-system,
    sans-serif;
  display: flex;
  flex-direction: column;
`;
const TopMenu = styled.nav`
  width: 100%;
  height: 60px;
  background-color: #ffffff;
  border-bottom: 1px solid #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  box-sizing: border-box;
  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;
const Logo = styled.div`
  font-size: 1.25rem;
  font-weight: 800;
  color: #0369a1;
  letter-spacing: -0.5px;
`;
const NavLinks = styled.div`
  display: flex;
  gap: 32px;
  height: 100%;
  @media (max-width: 768px) {
    display: none;
  }
`;
const NavLink = styled.div`
  display: flex;
  align-items: center;
  font-weight: ${(props) => (props.$active ? "700" : "500")};
  color: ${(props) => (props.$active ? "#0369A1" : "#64748B")};
  border-bottom: ${(props) =>
    props.$active ? "3px solid #0EA5E9" : "3px solid transparent"};
  cursor: pointer;
  &:hover {
    color: #0369a1;
  }
`;
const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #e0f2fe;
  color: #0284c7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;
const UserName = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: #334155;
  @media (max-width: 768px) {
    display: none;
  }
`;

const ContentContainer = styled.div`
  padding: 32px;
  width: 100%;
  box-sizing: border-box;
  flex: 1;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    padding: 16px;
  }
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
`;
const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;
const Badge = styled.span`
  background-color: #e0f2fe;
  color: #0284c7;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
`;
const Title = styled.h2`
  margin: 0;
  color: #0f172a;
  font-size: 1.5rem;
  font-weight: 700;
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const DateController = styled.div`
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 4px 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;
const DateBtn = styled.button`
  background: none;
  border: none;
  padding: 8px 12px;
  font-size: 1.1rem;
  font-weight: 700;
  color: #475569;
  cursor: pointer;
  border-radius: 4px;
  &:hover {
    background-color: #f1f5f9;
    color: #0f172a;
  }
`;
const DateLabel = styled.label`
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin: 0 16px;
  min-width: 150px;
  justify-content: center;
  &:hover > div {
    color: #0369a1;
  }
`;
const HiddenDatePicker = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  &::-webkit-calendar-picker-indicator {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
`;
const DateDisplay = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
`;

const ScrollWrapper = styled.div`
  width: 100%;
  flex: 1;
  min-height: 400px;
  overflow: auto;
  border: 1px solid #94a3b8;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  scroll-behavior: smooth;
  &::-webkit-scrollbar {
    width: 8px;
    height: 10px;
  }
  &::-webkit-scrollbar-track {
    background: #f8fafc;
  }
  &::-webkit-scrollbar-thumb {
    background: #94a3b8;
    border-radius: 8px;
  }
`;
const BoardWrapper = styled.div`
  width: calc(var(--label-width) + ${SLOT_WIDTH * 24}px);
  display: flex;
  flex-direction: column;
  position: relative;
  user-select: ${(props) => (props.$isDragging ? "none" : "auto")};
`;
const GridHeader = styled.div`
  display: flex;
  height: 60px;
  background-color: #ffffff;
  border-bottom: 1px solid #94a3b8;
  box-sizing: border-box;
  position: sticky;
  top: 0;
  z-index: 30;
`;
const RoomCorner = styled.div`
  width: var(--label-width);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
  color: #475569;
  background-color: #f8fafc;
  border-right: 1px solid #94a3b8;
  box-sizing: border-box;
  position: sticky;
  left: 0;
  z-index: 40;
`;
const TimeRow = styled.div`
  display: flex;
  width: ${SLOT_WIDTH * 24}px;
`;
const TimeHeaderCell = styled.div`
  width: ${SLOT_WIDTH}px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #cbd5e1;
  box-sizing: border-box;
`;
const HourLabel = styled.div`
  text-align: center;
  font-weight: 700;
  color: #1e293b;
  padding: 8px 0 4px 0;
  font-size: 0.9rem;
`;
const MinuteLabels = styled.div`
  display: flex;
  flex: 1;
`;
const MinLabel = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  font-size: 0.7rem;
  color: #64748b;
  padding-bottom: 4px;
  position: relative;
  &:first-child::after {
    content: "";
    position: absolute;
    right: 0;
    bottom: 0;
    height: 8px;
    border-right: 1px solid #cbd5e1;
  }
`;

const GridBody = styled.div`
  display: flex;
  flex-direction: column;
`;
const RoomRow = styled.div`
  display: flex;
  height: 90px;
  border-bottom: 1px solid #cbd5e1;
  box-sizing: border-box;
`;
const RoomLabel = styled.div`
  width: var(--label-width);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding-left: 20px;
  background-color: #ffffff;
  border-right: 1px solid #94a3b8;
  box-sizing: border-box;
  font-weight: 700;
  color: #1e293b;
  font-size: 0.95rem;
  position: sticky;
  left: 0;
  z-index: 20;
  @media (max-width: 768px) {
    padding-left: 0;
    justify-content: center;
    font-size: 0.85rem;
  }
`;
const TimelineArea = styled.div`
  display: flex;
  width: ${SLOT_WIDTH * 24}px;
  position: relative;
  z-index: ${(props) => (props.$isActive ? 10 : 1)};
`;
const SlotCell = styled.div`
  width: ${SLOT_WIDTH}px;
  flex-shrink: 0;
  height: 100%;
  display: flex;
  box-sizing: border-box;
`;
const HalfSlot = styled.div`
  flex: 1;
  height: 100%;
  box-sizing: border-box;
  background-color: ${(props) => (props.$isOffHour ? "#E2E8F0" : "#FFFFFF")};
  transition: background-color 0.15s ease;
  &:first-child {
    border-right: 1px dashed #cbd5e1;
  }
  &:last-child {
    border-right: 1px solid #cbd5e1;
  }
  &:hover {
    background-color: #dbeafe;
    cursor: crosshair;
  }
`;

const ReservationBox = styled.div`
  position: absolute;
  top: 8px;
  height: 73px;
  background-color: #f0f9ff;
  border-radius: 6px;
  border: 1px solid #bae6fd;
  border-left: 5px solid #0ea5e9;
  padding: 8px 12px;
  box-sizing: border-box;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  @media (max-width: 768px) {
    padding: 6px 8px;
  }
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(14, 165, 233, 0.2);
    background-color: #e0f2fe;
    cursor: pointer;
    z-index: 11;
  }
`;
const BoxTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 700;
  color: #0369a1;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;
const BoxFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const BoxTime = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #0284c7;
  white-space: nowrap;
`;
const BoxUser = styled.div`
  font-size: 0.75rem;
  color: #38bdf8;
  white-space: nowrap;
  background: #ffffff;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid #e0f2fe;
  @media (max-width: 768px) {
    display: none;
  }
`;

const DraftBox = styled.div`
  position: absolute;
  top: 8px;
  height: 73px;
  background-color: rgba(238, 242, 255, 0.9);
  backdrop-filter: blur(2px);
  border-radius: 6px;
  border: 2px solid #6366f1;
  box-sizing: border-box;
  z-index: 15;
`;

const FloatingBar = styled.div`
  position: absolute;
  top: ${(props) => (props.$isFirstRow ? "82px" : "-42px")};
  left: 50%;
  transform: translateX(-50%);
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  padding: 6px 10px;
  gap: 8px;
  z-index: 100;
  pointer-events: auto;
  white-space: nowrap;
  animation: popIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  @keyframes popIn {
    0% {
      opacity: 0;
      transform: translate(
        -50%,
        ${(props) => (props.$isFirstRow ? "-10px" : "10px")}
      );
    }
    100% {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }
`;
const FloatingTime = styled.div`
  font-size: 0.85rem;
  font-weight: 700;
  color: #4338ca;
`;
const Divider = styled.div`
  width: 1px;
  height: 16px;
  background-color: #e2e8f0;
`;
const IconBtn = styled.button`
  background-color: ${(props) => (props.$primary ? "#4F46E5" : "#F1F5F9")};
  color: ${(props) => (props.$primary ? "#FFFFFF" : "#64748B")};
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.15s ease;
  &:hover {
    background-color: ${(props) => (props.$primary ? "#4338CA" : "#E2E8F0")};
    color: ${(props) => (props.$primary ? "#FFFFFF" : "#334155")};
  }
`;

const DragHandle = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 16px;
  cursor: ew-resize;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
  &:hover .handle-bar {
    background-color: #3730a3;
    transform: scaleY(1.2);
  }
`;
const DragHandleLeft = styled(DragHandle)`
  left: -8px;
`;
const DragHandleRight = styled(DragHandle)`
  right: -8px;
`;

// ====== 💡 [새로 추가됨] 모달 관련 스타일 ======
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.5); /* 어두운 반투명 배경 */
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999; /* 화면 최상단 */
  animation: fadeIn 0.2s ease;
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContainer = styled.div`
  background: #ffffff;
  width: 420px;
  border-radius: 12px;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.2s ease;
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ModalHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
`;
const CloseBtn = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #94a3b8;
  cursor: pointer;
  &:hover {
    color: #0f172a;
  }
`;

const ModalBody = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 700;
  color: #334155;
`;
const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 1rem;
  color: #1e293b;
  outline: none;
  &:focus {
    border-color: #0ea5e9;
    box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.15);
  }
  &::placeholder {
    color: #94a3b8;
  }
`;

const TimeInfoBox = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
`;
const RoomTag = styled.span`
  background: #e0f2fe;
  color: #0369a1;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 700;
`;
const TimeText = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: #1e293b;
`;

const ToggleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
`;
const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 0.95rem;
  color: #334155;
  input {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: #0ea5e9;
  }
  &:hover {
    color: #0f172a;
  }
`;

const ModalFooter = styled.div`
  padding: 16px 24px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;
const Button = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  ${(props) =>
    props.$primary
      ? `background: #0EA5E9; color: white; border: none; &:hover { background: #0284C7; }`
      : `background: #FFFFFF; color: #475569; border: 1px solid #CBD5E1; &:hover { background: #F1F5F9; color: #0F172A; }`}
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = `.handle-bar { width: 6px; height: 24px; background-color: #6366F1; border-radius: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.2); transition: all 0.2s ease; }`;
document.head.appendChild(styleSheet);
