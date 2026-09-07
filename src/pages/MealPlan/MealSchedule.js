import React from "react";
import styled from "styled-components";
import { TopMenu } from "../Navigation/TopNavigation";
import { useMealSchedule } from "../../hooks/MealPlan/useMealSchedule";
import MealScheduleHeader from "../../components/MealPlan/MealScheduleHeader";
import MealScheduleForm from "../../components/MealPlan/MealScheduleForm";

export default function MealSchedule() {
  const { state, actions } = useMealSchedule();

  return (
    <PageContainer>
      <TopMenu />

      <ContentContainer>
        {/* 상단 타이틀 영역 */}
        <MealScheduleHeader />

        {/* 쿼리 입력 폼 영역 */}
        <MealScheduleForm state={state} actions={actions} />
      </ContentContainer>
    </PageContainer>
  );
}

// --- Styled Components ---
const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: "Pretendard", sans-serif;
`;

const ContentContainer = styled.div`
  padding: 32px 48px;
  max-width: 1200px;
  margin: 0 auto;
  @media (max-width: 768px) {
    padding: 24px;
  }
`;
