import React from "react";
import styled from "styled-components";
import { TopMenu } from "../Navigation/TopNavigation";
import { useUserManagement } from "../../hooks/User/useUserManagement";

import UserHeader from "../../components/UserManagement/UserHeader";
import UserTable from "../../components/UserManagement/UserTable";
import UserFormModal from "../../components/UserManagement/UserFormModal";

export default function UserManagement() {
  const { state, actions } = useUserManagement();

  return (
    <PageContainer>
      <TopMenu />

      <ContentContainer>
        <UserHeader state={state} actions={actions} />
        <UserTable state={state} actions={actions} />
      </ContentContainer>

      <UserFormModal state={state} actions={actions} />
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
