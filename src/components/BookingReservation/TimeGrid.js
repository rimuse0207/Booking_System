// src/components/TimeGrid.jsx
import React from "react";
import styled from "styled-components";
import {
  ROOMS,
  HOURS,
  SLOT_WIDTH,
  MINUTE_WIDTH,
  timeToMins,
  minsToTime,
} from "../../constants/BookingReservation/reservation";
import moment from "moment";

export function TimeGrid({ state, actions }) {
  const {
    SelectBasicTitle,
    reservations,
    draft,
    dragState,
    isModalOpen,
    rooms,
    LoginInfo,
  } = state;
  const {
    handleSlotClick,
    handleDragStart,
    setDraft,
    submitReservation,
    openReservationModal,
    confirmDragEdit,
    setSelectBasicTitle,
  } = actions;

  const getBoxStyleByMins = (startMin, endMin) => ({
    left: `${startMin * MINUTE_WIDTH}px`,
    width: `${(endMin - startMin) * MINUTE_WIDTH - 5}px`,
  });

  const cancelDraftBtn = (e) => {
    e.stopPropagation();
    setDraft(null);
  };

  const handleCheckClick = (e) => {
    e.stopPropagation();
    if (draft.editId) {
      confirmDragEdit();
    } else {
      openReservationModal(e);
    }
  };

  return (
    <BoardWrapper $isDragging={!!dragState}>
      <GridHeader>
        <RoomCorner>
          {/* 💡 투박한 기본 select 대신 커스텀 스타일이 적용된 CategorySelect 사용 */}
          <CategorySelect
            value={SelectBasicTitle}
            onChange={(e) => setSelectBasicTitle(e.target.value)}
          >
            <option value={"Company_Room"}>회의실</option>
            {LoginInfo.company === "DHKS" && (
              <option value={"Company_Car"}>법인차량</option>
            )}
          </CategorySelect>
        </RoomCorner>
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
        {rooms.map((room, roomIdx) => (
          <RoomRow key={room.brity_works_room_info_userId}>
            <RoomLabel>{room.brity_works_room_info_name}</RoomLabel>

            <TimelineArea $isActive={draft && draft.roomIndex === roomIdx}>
              {HOURS.map((hour) => {
                const isOffHour = hour < 9 || hour >= 18;
                return (
                  <SlotCell key={hour}>
                    <HalfSlot
                      $isOffHour={isOffHour}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSlotClick(roomIdx, hour, false);
                      }}
                    />
                    <HalfSlot
                      $isOffHour={isOffHour}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSlotClick(roomIdx, hour, true);
                      }}
                    />
                  </SlotCell>
                );
              })}

              {reservations
                .filter(
                  (res) => res.roomId === room.brity_works_room_info_targetId,
                )
                .filter((res) => res.uid !== draft?.editId)
                .map((res) => {
                  const isMine = res.ownerEmail === LoginInfo?.id;

                  return (
                    <ReservationBox
                      key={res.uid}
                      $isMine={isMine}
                      style={getBoxStyleByMins(
                        timeToMins(moment(res.startTime).format("HH:mm")),
                        timeToMins(moment(res.endTime).format("HH:mm")),
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        actions.handleReservationClick(res);
                      }}
                      $TextCenter={res.allDayYn === "Y"}
                    >
                      <BoxTitle $isMine={isMine}>{res.subject}</BoxTitle>
                      <BoxUser $isMine={isMine}>{res.ownerName}</BoxUser>
                      <BoxFooter>
                        <BoxTime $isMine={isMine}>
                          {res.allDayYn === "Y"
                            ? "종일"
                            : `${moment(res.startTime).format("HH:mm")} - ${moment(res.endTime).format("HH:mm")}`}
                        </BoxTime>
                      </BoxFooter>
                    </ReservationBox>
                  );
                })}

              {draft && draft.roomIndex === roomIdx && (
                <DraftBox
                  $isEditMode={!!draft.editId}
                  style={getBoxStyleByMins(draft.startMin, draft.endMin)}
                  onClick={(e) => e.stopPropagation()}
                >
                  {draft.editId && draft.originalData && (
                    <DraftInner>
                      <BoxTitle $isMine={true}>
                        {draft.originalData.subject}
                      </BoxTitle>
                      <BoxUser $isMine={true}>
                        {draft.originalData.ownerName}
                      </BoxUser>
                      <BoxFooter>
                        <BoxTime $isMine={true}>
                          {minsToTime(draft.startMin)} -{" "}
                          {minsToTime(draft.endMin)}
                        </BoxTime>
                      </BoxFooter>
                    </DraftInner>
                  )}

                  {!dragState && !isModalOpen && (
                    <FloatingBar $isFirstRow={roomIdx === 0}>
                      {draft.editId && <EditBadge>수정 중</EditBadge>}

                      <FloatingTime $isEditMode={!!draft.editId}>
                        {minsToTime(draft.startMin)} -{" "}
                        {minsToTime(draft.endMin)}
                      </FloatingTime>
                      <Divider />

                      <IconBtn
                        $primary
                        $isEditMode={!!draft.editId}
                        onClick={handleCheckClick}
                      >
                        ✓
                      </IconBtn>
                      <IconBtn onClick={cancelDraftBtn}>✕</IconBtn>
                    </FloatingBar>
                  )}

                  <DragHandleLeft
                    $isEditMode={!!draft.editId}
                    onMouseDown={(e) => handleDragStart(e, "left", roomIdx)}
                  >
                    <HandleBar $isEditMode={!!draft.editId} />
                  </DragHandleLeft>

                  <DragHandleRight
                    $isEditMode={!!draft.editId}
                    onMouseDown={(e) => handleDragStart(e, "right", roomIdx)}
                  >
                    <HandleBar $isEditMode={!!draft.editId} />
                  </DragHandleRight>
                </DraftBox>
              )}
            </TimelineArea>
          </RoomRow>
        ))}
      </GridBody>
    </BoardWrapper>
  );
}

// --- Styled Components ---

const BoardWrapper = styled.div`
  --label-width: 140px;
  @media (max-width: 768px) {
    --label-width: 80px;
  }
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
  background-color: #f8fafc;
  border-right: 1px solid #94a3b8;
  box-sizing: border-box;
  position: sticky;
  left: 0;
  z-index: 40;
`;

/* 💡 추가된 카테고리 셀렉트 박스 디자인 */
const CategorySelect = styled.select`
  appearance: none; /* 브라우저 기본 화살표 제거 */
  width: 85%;
  padding: 8px 28px 8px 12px;
  font-size: 0.9rem;
  font-weight: 700;
  color: #1e293b;
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;
  font-family: inherit;

  /* 💡 아이콘 대신 순수 CSS(인라인 SVG)를 사용하여 깔끔한 화살표 구현 */
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 14px;

  /* 긴 글씨 방지 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    border-color: #94a3b8;
  }

  &:focus {
    border-color: #0ea5e9;
    box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.15);
  }

  /* 모바일(80px 너비)일 때 안 깨지도록 미세 조정 */
  @media (max-width: 768px) {
    width: 90%;
    padding: 6px 20px 6px 6px;
    font-size: 0.75rem;
    background-position: right 4px center;
    background-size: 12px;
  }
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
  background-color: ${(props) => (props.$isMine ? "#EEF2FF" : "#f0f9ff")};
  border-radius: 6px;
  border: 1px solid ${(props) => (props.$isMine ? "#C7D2FE" : "#bae6fd")};
  border-left: 5px solid ${(props) => (props.$isMine ? "#4F46E5" : "#0ea5e9")};
  padding: 8px 12px;
  box-sizing: border-box;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: ${(props) => (props.$TextCenter ? "center" : "")};

  &:hover {
    transform: translateY(-2px);
    background-color: ${(props) => (props.$isMine ? "#E0E7FF" : "#e0f2fe")};
    box-shadow: 0 6px 12px
      ${(props) =>
        props.$isMine ? "rgba(79, 70, 229, 0.2)" : "rgba(14, 165, 233, 0.2)"};
    cursor: pointer;
    z-index: 11;
  }
`;

const BoxTitle = styled.div`
  font-size: 0.7rem;
  font-weight: 700;
  color: ${(props) => (props.$isMine ? "#3730A3" : "#0369a1")};
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
  color: ${(props) => (props.$isMine ? "#4338CA" : "#0284c7")};
  white-space: nowrap;
`;

const BoxUser = styled.div`
  font-size: 0.6rem;
  color: ${(props) => (props.$isMine ? "#4F46E5" : "#38bdf8")};
  white-space: nowrap;
  background: #ffffff;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid ${(props) => (props.$isMine ? "#C7D2FE" : "#e0f2fe")};
  overflow: hidden;
  @media (max-width: 768px) {
    display: none;
  }
`;

const DraftInner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 8px 12px;
  box-sizing: border-box;
  overflow: hidden;
  pointer-events: none;
  opacity: 0.7;
`;

const DraftBox = styled.div`
  position: absolute;
  top: 8px;
  height: 73px;
  background-color: ${(props) =>
    props.$isEditMode
      ? "rgba(254, 252, 232, 0.9)"
      : "rgba(238, 242, 255, 0.9)"};
  backdrop-filter: blur(2px);
  border-radius: 6px;
  border: 2px dashed ${(props) => (props.$isEditMode ? "#F59E0B" : "#6366F1")};
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

const EditBadge = styled.span`
  background-color: #fef3c7;
  color: #d97706;
  border: 1px solid #fde68a;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 800;
`;

const FloatingTime = styled.div`
  font-size: 0.85rem;
  font-weight: 700;
  color: ${(props) => (props.$isEditMode ? "#D97706" : "#4338ca")};
`;

const Divider = styled.div`
  width: 1px;
  height: 16px;
  background-color: #e2e8f0;
`;

const IconBtn = styled.button`
  background-color: ${(props) =>
    props.$primary ? (props.$isEditMode ? "#F59E0B" : "#4F46E5") : "#F1F5F9"};
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
    background-color: ${(props) =>
      props.$primary ? (props.$isEditMode ? "#D97706" : "#4338CA") : "#E2E8F0"};
    color: ${(props) => (props.$primary ? "#FFFFFF" : "#334155")};
  }
`;

const HandleBar = styled.div`
  width: 6px;
  height: 24px;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  background-color: ${(props) => (props.$isEditMode ? "#F59E0B" : "#6366F1")};
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
  &:hover ${HandleBar} {
    transform: scaleY(1.2);
    background-color: ${(props) => (props.$isEditMode ? "#D97706" : "#3730a3")};
  }
`;

const DragHandleLeft = styled(DragHandle)`
  left: -8px;
`;
const DragHandleRight = styled(DragHandle)`
  right: -8px;
`;
