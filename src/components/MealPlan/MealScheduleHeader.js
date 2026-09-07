import React from "react";
import styled from "styled-components";

export default function MealScheduleHeader() {
  return (
    <Header>
      <HeaderLeft>
        <Badge>식단표 관리</Badge>
        <Title>식단표 등록</Title>
      </HeaderLeft>
    </Header>
  );
}

// --- Styled Components ---
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 24px;
`;
const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
`;
const Badge = styled.span`
  background-color: #e2e8f0;
  color: #475569;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  width: fit-content;
  margin-bottom: 8px;
`;
const Title = styled.h2`
  margin: 0;
  color: #0f172a;
  font-size: 1.8rem;
  font-weight: 800;
`;
