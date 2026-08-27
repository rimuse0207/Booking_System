// src/pages/ReservationBoard.jsx
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

const INITIAL_DATA = [
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
];

export default function ReservationBoard() {
  const { state, actions } = useReservation(INITIAL_DATA);
  const scrollRef = useRef(null);

  // 현재 시간 스크롤 로직 (UI 영역이므로 컴포넌트에 유지)
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
        {/* 상단 날짜 컨트롤러 및 헤더 영역 (컴포넌트화 가능) */}
        <BoardHeader
          date={state.currentDate}
          setDate={actions.setCurrentDate}
        />

        <ScrollWrapper ref={scrollRef}>
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

// 레이아웃 Styled Components
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
