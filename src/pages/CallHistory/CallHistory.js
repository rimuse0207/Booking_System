import React from "react";
import styled from "styled-components";
import { useUserCallHistory } from "../../hooks/CallHistory/useUserCallHistory";
import SupportForm from "./SupportForm";
import SupportList from "./SupportList";
import { AddItemModal } from "./Modal/AddItemModal";
import { TopMenu } from "../Navigation/TopNavigation";
import { useNavigate } from "react-router-dom"; // react-router-dom 연동

export default function CallHistory() {
  const { state, actions } = useUserCallHistory();
  const { currentUser } = state;
  const navigate = useNavigate();

  return (
    <PageContainer>
      <TopMenu />

      <ContentContainer>
        <Header>
          <HeaderLeft>
            <Badge>CE 통화기록 관리</Badge>
            <Title>근무 외 대응 이력 관리 시스템</Title>
          </HeaderLeft>

          {currentUser.isAdmin && (
            <AdminRouteBtn onClick={() => navigate("/Admin/CallHistory")}>
              관리 페이지 이동
            </AdminRouteBtn>
          )}
        </Header>

        <SupportForm state={state} actions={actions} />
        <SupportList state={state} actions={actions} />
        <AddItemModal state={state} actions={actions} />
      </ContentContainer>
    </PageContainer>
  );
}

// 스타일 컴포넌트
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
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
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
const AdminRouteBtn = styled.button`
  background-color: #ffffff;
  color: #475569;
  border: 1px solid #cbd5e1;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  &:hover {
    background-color: #f1f5f9;
    color: #0f172a;
  }
`;
