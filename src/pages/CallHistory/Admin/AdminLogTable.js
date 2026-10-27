import React from "react";
import styled from "styled-components";
import * as XLSX from "xlsx"; // 💡 엑셀 라이브러리 임포트

export default function AdminLogTable({ logs, selectedMonth, onPrev, onNext }) {
  const handleExcelDownload = () => {
    if (logs.length === 0) {
      alert("다운로드할 데이터가 없습니다.");
      return;
    }

    const excelData = logs.map((log) => ({
      대응일자: log.response_date,
      "소속 팀": log.team_name,
      대응자: log.responderName,
      고객사: log.company_name,
      "사이트(지역)": log.site_name,
      "장비 모델": log.equipment_name,
      "고객사 담당자": log.customer_contact,
      "시작 시간": log.start_time,
      "종료 시간": log.end_time,
      구분: log.category,
      "상세 내용": log.content,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    worksheet["!cols"] = [
      { wch: 15 }, // 대응일자
      { wch: 15 }, // 소속 팀
      { wch: 12 }, // 대응자
      { wch: 20 }, // 고객사
      { wch: 15 }, // 사이트
      { wch: 20 }, // 장비 모델
      { wch: 15 }, // 고객 담당자
      { wch: 10 }, // 시작 시간
      { wch: 10 }, // 종료 시간
      { wch: 10 }, // 구분
      { wch: 50 }, // 상세 내용 (길게)
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "대응이력");

    // 3. 파일 다운로드 트리거 (파일명: 대응이력_YYYYMM.xlsx)
    const fileName = `대응이력_${selectedMonth.replace(". ", "")}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <TableWrapper>
      <TableHeader>
        <TitleBox>
          <Title>근무 외 대응 이력 현황</Title>
          <Badge>총 {logs.length}건</Badge>

          <ExcelBtn onClick={handleExcelDownload} disabled={logs.length === 0}>
            📗 Excel 다운로드
          </ExcelBtn>
        </TitleBox>

        <MonthNavigator>
          <NavBtn onClick={onPrev}>&lt;</NavBtn>
          <CurrentMonth>{selectedMonth}</CurrentMonth>
          <NavBtn onClick={onNext}>&gt;</NavBtn>
        </MonthNavigator>
      </TableHeader>

      <TableContainer>
        <StyledTable>
          <thead>
            <tr>
              <th>대응일자</th>
              <th>소속 팀</th>
              <th>대응자</th>
              <th>고객사 (사이트)</th>
              <th>장비 모델</th>
              <th>고객사 담당자</th>
              <th>지원 시간</th>
              <th>구분</th>
              <th className="content-col">상세 내용</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td
                  colSpan="9"
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#94a3b8",
                  }}
                >
                  {selectedMonth}에 등록된 이력이 없습니다.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id}>
                  <td className="center">{log.response_date}</td>
                  <td className="center">{log.team_name}</td>
                  <td className="center bold">{log.responderName}</td>
                  <td>
                    {log.company_name} <br />
                    <span className="sub">{log.site_name}</span>
                  </td>
                  <td className="bold">{log.equipment_name}</td>
                  <td className="center">{log.customer_contact}</td>
                  <td className="center">
                    {log.start_time} ~ {log.end_time}
                  </td>
                  <td className="center">
                    <CatBadge>{log.category}</CatBadge>
                  </td>
                  <td className="content-col">{log.content}</td>
                </tr>
              ))
            )}
          </tbody>
        </StyledTable>
      </TableContainer>
    </TableWrapper>
  );
}

// --- Styled Components ---
const TableWrapper = styled.div`
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
`;
const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
`;
const TitleBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;
const Title = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  color: #0f172a;
`;
const Badge = styled.span`
  background: #e0f2fe;
  color: #0284c7;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 800;
`;

// 💡 엑셀 버튼 스타일 추가
const ExcelBtn = styled.button`
  background: #16a34a;
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
  &:hover:not(:disabled) {
    background: #15803d;
  }
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const MonthNavigator = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  background: #f8fafc;
  padding: 6px 16px;
  border-radius: 30px;
  border: 1px solid #e2e8f0;
`;
const CurrentMonth = styled.div`
  font-size: 1rem;
  font-weight: 800;
  color: #0f172a;
  min-width: 80px;
  text-align: center;
`;
const NavBtn = styled.button`
  background: white;
  border: 1px solid #cbd5e1;
  color: #475569;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: 800;
  &:hover {
    background: #e0f2fe;
    color: #0284c7;
  }
`;
const TableContainer = styled.div`
  overflow-x: auto;
  width: 100%;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;
const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 1200px;
  th,
  td {
    padding: 14px;
    border-bottom: 1px solid #e2e8f0;
    font-size: 0.9rem;
    color: #1e293b;
    vertical-align: middle;
  }
  th {
    background: #f8fafc;
    font-weight: 700;
    color: #475569;
    text-align: left;
  }
  .center {
    text-align: center;
  }
  .bold {
    font-weight: 700;
  }
  .sub {
    font-size: 0.8rem;
    color: #64748b;
  }
  .content-col {
    max-width: 300px;
    white-space: pre-wrap;
    line-height: 1.5;
    color: #475569;
  }
  tbody tr:hover {
    background: #f8fafc;
  }
`;
const CatBadge = styled.span`
  background: #f1f5f9;
  color: #475569;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
`;
