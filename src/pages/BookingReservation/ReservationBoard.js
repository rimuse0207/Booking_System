import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import { useReservation } from "../../hooks/BookingReservation/useReservation";
import { ReservationModal } from "../../components/BookingReservation/ReservationModal";
import { SLOT_WIDTH } from "../../constants/BookingReservation/reservation";
import { BoardHeader } from "../../components/BookingReservation/BoardHeader";
import { TopMenu } from "../Navigation/TopNavigation";
import { TimeGrid } from "../../components/BookingReservation/TimeGrid";
import { ReservationDetailModal } from "../../components/BookingReservation/ReservationDetailModal";
import { ReservationEditModal } from "../../components/BookingReservation/ReservationEditorModal";

export default function ReservationBoard() {
  // 💡 데이터 통신 및 필터링 등 모든 로직은 훅이 담당
  const { state, actions } = useReservation();
  const scrollRef = useRef(null);

  // 현재 시간으로 스크롤 이동
  useEffect(() => {
    if (scrollRef.current) {
      const now = new Date();
      const scrollTo =
        (now.getHours() + now.getMinutes() / 60) * SLOT_WIDTH -
        scrollRef.current.clientWidth / 2 +
        100;
      scrollRef.current.scrollLeft = Math.max(0, scrollTo);
    }
  }, []);

  const cancelDraftOnBg = () => {
    if (state.isDraggingRef.current || state.isModalOpen) return;
    actions.setDraft(null);
  };

  return (
    <PageContainer onClick={cancelDraftOnBg}>
      <TopMenu />

      <ContentContainer>
        {/* 💡 헤더에 현재 선택된 날짜와 층수 필터 상태 전달 */}
        <BoardHeader
          date={state.currentDate}
          setDate={actions.setCurrentDate}
          floorFilter={state.floorFilter}
          setFloorFilter={actions.setFloorFilter}
          SelectBasicTitle={state.SelectBasicTitle}
        />

        <ScrollWrapper ref={scrollRef}>
          {/* 💡 훅에서 이미 필터링된 state를 넘기므로 안전함 */}
          <TimeGrid state={state} actions={actions} />
        </ScrollWrapper>
      </ContentContainer>

      {state.isModalOpen && state.draft && (
        <ReservationModal state={state} actions={actions} />
      )}
      {state.isDetailModalOpen && state.selectedReservation && (
        <ReservationDetailModal state={state} actions={actions} />
      )}
      {state.isEditModalOpen && state.selectedReservation && (
        <ReservationEditModal state={state} actions={actions} />
      )}
    </PageContainer>
  );
}

// --- Styled Components ---
const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: "Pretendard", sans-serif;
  display: flex;
  flex-direction: column;
`;
const ContentContainer = styled.div`
  padding: 32px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;
const ScrollWrapper = styled.div`
  flex: 1;
  overflow: auto;
  border: 1px solid #94a3b8;
  border-radius: 8px;
  background-color: #ffffff;
  scroll-behavior: smooth;
`;
