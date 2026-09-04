import React from "react";
import styled from "styled-components";
import { usePartyPost } from "../../hooks/PartyPost/usePartyPost";
import PartyPostHeader from "../../components/PartyPost/PartyPostHeader";
import PartyPostLogForm from "../../components/PartyPost/PartyPostLogForm";

export default function PartyPost() {
  const { state, actions } = usePartyPost();

  return (
    <PageContainer>
      <ContentContainer>
        <PartyPostHeader />
        <PartyPostLogForm state={state} actions={actions} />
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
  padding: 32px 48px;
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
  @media (max-width: 1024px) {
    padding: 24px;
  }
`;
