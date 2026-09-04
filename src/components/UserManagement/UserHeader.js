import React from "react";
import styled from "styled-components";

export default function UserHeader({ state, actions }) {
  return (
    <>
      <Header>
        <HeaderLeft>
          <Badge>DHK 사용자 설정</Badge>
          <Title>사용자 관리</Title>
        </HeaderLeft>
        <HeaderRight>
          <PrimaryBtn onClick={actions.openAddModal}>
            + 신규 사용자 등록
          </PrimaryBtn>
        </HeaderRight>
      </Header>

      <FilterContainer>
        <FilterGroup style={{ flex: 1, maxWidth: "400px" }}>
          <FilterLabel>검색</FilterLabel>
          <SearchInput
            type="text"
            placeholder="이름, 이메일, 팀명으로 검색"
            value={state.searchKeyword}
            onChange={(e) => actions.setSearchKeyword(e.target.value)}
          />
        </FilterGroup>
      </FilterContainer>
    </>
  );
}

// --- Styled Components ---
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
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
const HeaderRight = styled.div``;
const PrimaryBtn = styled.button`
  background-color: #0ea5e9;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 0.95rem;
  font-weight: 700;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background-color: #0284c7;
    box-shadow: 0 4px 6px rgba(14, 165, 233, 0.2);
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0);
  }
`;
const FilterContainer = styled.div`
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
`;
const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;
const FilterLabel = styled.label`
  font-size: 0.8rem;
  font-weight: 700;
  color: #64748b;
`;
const SearchInput = styled.input`
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  outline: none;
  font-family: inherit;
  font-size: 0.95rem;
  width: 100%;
  box-sizing: border-box;
  &:focus {
    border-color: #0ea5e9;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
  }
`;
