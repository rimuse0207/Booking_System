import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import moment from "moment";
import { useMealPlan } from "../../hooks/MealPlan/useMealPlan";
import { TopMenu } from "../Navigation/TopNavigation";
export default function MealPlan() {
  const { state, actions } = useMealPlan();
  const { meals, weekLabel, dateRange, isLoading } = state;
  const { goPrevWeek, goNextWeek } = actions;

  const todayStr = moment().format("YYYY. MM. DD");
  const todayCardRef = useRef(null);

  // 모바일 렌더링 시 오늘 날짜로 오토 스크롤
  useEffect(() => {
    // 로딩이 끝났고, 데이터가 존재하며, 모바일 화면일 때만 스크롤
    if (
      todayCardRef.current &&
      window.innerWidth <= 768 &&
      !isLoading &&
      meals.length > 0
    ) {
      setTimeout(() => {
        todayCardRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 300);
    }
  }, [meals, isLoading]);

  return (
    <PageContainer>
      <TopMenu />

      <ContentContainer>
        {/* 상단 헤더 영역 */}
        <Header>
          <HeaderLeft>
            <Badge>구내식당</Badge>
            <Title>{weekLabel}</Title>
          </HeaderLeft>

          <Controller>
            <ControlBtn onClick={goPrevWeek}>이전 주</ControlBtn>
            <CurrentWeekText>{dateRange}</CurrentWeekText>
            <ControlBtn onClick={goNextWeek}>다음 주</ControlBtn>
          </Controller>
        </Header>

        {/* 💡 컨텐츠 렌더링 분기: 로딩 중 -> 데이터 없음 -> 식단표 표시 */}
        {isLoading ? (
          <LoadingWrapper>식단 데이터를 불러오는 중입니다...</LoadingWrapper>
        ) : meals.length === 0 ? (
          // 💡 데이터가 빈 배열일 때 표시되는 깔끔한 Empty State UI
          <EmptyWrapper>
            <EmptyTitle>등록된 식단이 없습니다.</EmptyTitle>
            <EmptySub>
              해당 주차의 식단표가 아직 업데이트되지 않았습니다.
            </EmptySub>
          </EmptyWrapper>
        ) : (
          <GridContainer>
            {meals.map((meal) => {
              const isToday = meal.date === todayStr;

              return (
                <MealCard
                  key={meal.id}
                  $isToday={isToday}
                  ref={isToday ? todayCardRef : null}
                >
                  {isToday && <TodayLabel>TODAY</TodayLabel>}

                  <CardHeader>
                    <DayText $isToday={isToday}>{meal.day}</DayText>
                    <DateText $isToday={isToday}>{meal.date}</DateText>
                  </CardHeader>

                  <CardBody>
                    <Section>
                      <SectionTitle>기본 제공</SectionTitle>
                      <MenuList $type="main">
                        <MenuText $bold>{meal.rice}</MenuText>
                        <MenuText $bold>{meal.soup}</MenuText>
                      </MenuList>
                    </Section>

                    <Section>
                      <SectionTitle>찬류</SectionTitle>
                      <MenuList $type="side">
                        <MenuText>{meal.side1}</MenuText>
                        <MenuText>{meal.side2}</MenuText>
                        <MenuText>{meal.side3}</MenuText>
                        <MenuText>{meal.side4}</MenuText>
                        <MenuText>{meal.side5}</MenuText>
                      </MenuList>
                    </Section>
                  </CardBody>
                </MealCard>
              );
            })}
          </GridContainer>
        )}
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
  display: flex;
  flex-direction: column;
`;

const ContentContainer = styled.div`
  padding: 32px;
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
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
  font-size: 0.85rem;
  font-weight: 800;
`;

const Title = styled.h2`
  margin: 0;
  color: #0f172a;
  font-size: 1.6rem;
  font-weight: 800;
  @media (max-width: 768px) {
    font-size: 1.35rem;
  }
`;

const Controller = styled.div`
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

const ControlBtn = styled.button`
  background: none;
  border: none;
  padding: 8px 12px;
  font-size: 0.9rem;
  font-weight: 700;
  color: #475569;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
  &:hover {
    background-color: #f1f5f9;
    color: #0f172a;
  }
`;

const CurrentWeekText = styled.div`
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e293b;
  padding: 0 16px;
`;

/* 💡 식단이 없을 때 렌더링되는 디자인 */
const EmptyWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border: 1px dashed #cbd5e1; /* 점선으로 부드러운 느낌 */
  border-radius: 12px;
  min-height: 400px;
  gap: 12px;
`;

const EmptyTitle = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #475569;
`;

const EmptySub = styled.div`
  font-size: 0.95rem;
  font-weight: 500;
  color: #94a3b8;
`;

const LoadingWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 700;
  color: #64748b;
  min-height: 400px;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  width: 100%;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const MealCard = styled.div`
  position: relative;
  background: #ffffff;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  ${(props) =>
    props.$isToday
      ? `
    border: 2px solid #0EA5E9;
    box-shadow: 0 10px 25px -5px rgba(14, 165, 233, 0.2), 0 8px 10px -6px rgba(14, 165, 233, 0.1);
    transform: translateY(-4px);
  `
      : `
    border: 1px solid #E2E8F0;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  `}

  &:hover {
    ${(props) =>
      !props.$isToday &&
      `
      transform: translateY(-2px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08);
      border-color: #CBD5E1;
    `}
  }
`;

const TodayLabel = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background-color: #0ea5e9;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 800;
  padding: 6px 14px;
  border-bottom-left-radius: 12px;
  letter-spacing: 0.5px;
`;

const CardHeader = styled.div`
  padding: 24px 20px 12px 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const DayText = styled.div`
  font-size: 1.35rem;
  font-weight: 800;
  color: ${(props) => (props.$isToday ? "#0EA5E9" : "#0F172A")};
`;

const DateText = styled.div`
  font-size: 0.85rem;
  font-weight: ${(props) => (props.$isToday ? "700" : "600")};
  color: ${(props) => (props.$isToday ? "#0284C7" : "#64748B")};
`;

const CardBody = styled.div`
  padding: 0 20px 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SectionTitle = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  color: #94a3b8;
  margin-bottom: 2px;
`;

const MenuList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 14px;

  border-left: 3px solid
    ${(props) => (props.$type === "main" ? "#4F46E5" : "#0EA5E9")};
`;

const MenuText = styled.div`
  font-size: 0.95rem;
  color: ${(props) => (props.$bold ? "#1E293B" : "#334155")};
  font-weight: ${(props) => (props.$bold ? "700" : "500")};
  line-height: 1.3;
  word-break: keep-all;
`;
