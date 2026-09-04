import React from "react";
import styled from "styled-components";

export default function PartyPostHeader() {
  const handleDownload = (e, fileName) => {
    e.preventDefault();

    window.open(fileName);
  };

  return (
    <Header>
      <HeaderLeft>
        <Badge>당직 관리</Badge>
        <Title>당직일지 작성</Title>
      </HeaderLeft>
      <HeaderRight>
        <DownloadButton
          href="/phone.xls"
          download
          onClick={(e) => handleDownload(e, "/phone.xls")}
        >
          비상 연락망 (Excel)
        </DownloadButton>
        <DownloadButton
          href="/check.pdf"
          download
          onClick={(e) => handleDownload(e, "/check.pdf")}
        >
          건물 체크 순서도 (PDF)
        </DownloadButton>
      </HeaderRight>
    </Header>
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
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;
const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
`;
const Badge = styled.span`
  background-color: #e0f2fe;
  color: #0284c7;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  display: inline-block;
  margin-bottom: 8px;
  width: fit-content;
`;
const Title = styled.h2`
  margin: 0;
  color: #0f172a;
  font-size: 1.8rem;
  font-weight: 800;
`;
const HeaderRight = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
`;
const DownloadButton = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: #ffffff;
  color: #334155;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  &:hover {
    background-color: #f8fafc;
    border-color: #94a3b8;
    color: #0f172a;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }
  &:active {
    transform: translateY(0);
  }
`;
