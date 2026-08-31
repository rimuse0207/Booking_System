import React, { useState } from "react";
import styled from "styled-components";
import { TopMenu } from "../Navigation/TopNavigation";
import { AllScheduleView } from "../../components/Schedule/AllScheduleView";
import { MyScheduleView } from "../../components/Schedule/MyScheduleView";

export default function Schedule() {
  const [viewMode, setViewMode] = useState("all");

  return (
    <PageContainer>
      <TopMenu />

      <ContentContainer>
        <Header>
          <HeaderLeft>
            <Badge>일정 관리</Badge>
            <Title>{viewMode === "all" ? "전체 일정 현황" : "나의 일정"}</Title>
          </HeaderLeft>

          <SwitchContainer>
            <SwitchBtn
              $active={viewMode === "all"}
              onClick={() => setViewMode("all")}
            >
              전체 일정
            </SwitchBtn>
            <SwitchBtn
              $active={viewMode === "my"}
              onClick={() => setViewMode("my")}
            >
              나의 일정
            </SwitchBtn>
          </SwitchContainer>
        </Header>

        {viewMode === "all" ? <AllScheduleView /> : <MyScheduleView />}
      </ContentContainer>
    </PageContainer>
  );
}

// Styled Components
const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: "Pretendard", sans-serif;
  display: flex;
  flex-direction: column;
`;

const ContentContainer = styled.div`
  padding: 32px 48px;
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
  @media (max-width: 1024px) {
    padding: 24px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 24px;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const HeaderLeft = styled.div``;

const Badge = styled.span`
  background-color: #e0f2fe;
  color: #0284c7;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  display: inline-block;
  margin-bottom: 8px;
`;

const Title = styled.h2`
  margin: 0;
  color: #0f172a;
  font-size: 1.8rem;
  font-weight: 800;
`;

const SwitchContainer = styled.div`
  display: flex;
  background-color: #e2e8f0;
  border-radius: 30px;
  padding: 4px;
`;

const SwitchBtn = styled.button`
  padding: 8px 20px;
  border-radius: 26px;
  font-size: 0.95rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${(props) => (props.$active ? "#0ea5e9" : "transparent")};
  color: ${(props) => (props.$active ? "#ffffff" : "#64748b")};
  box-shadow: ${(props) =>
    props.$active ? "0 2px 6px rgba(14,165,233,0.3)" : "none"};
  &:hover {
    color: ${(props) => (props.$active ? "#ffffff" : "#334155")};
  }
`;
