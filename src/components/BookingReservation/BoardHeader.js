import React from "react";
import styled from "styled-components";

export function BoardHeader({ date, setDate }) {
  // 날짜 이동 핸들러 (이전날/다음날)
  const handlePrevDay = () => {
    const prev = new Date(date);
    prev.setDate(prev.getDate() - 1);
    setDate(prev);
  };

  const handleNextDay = () => {
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    setDate(next);
  };

  // 달력 인풋 변경 핸들러
  const handleDateChange = (e) => {
    if (e.target.value) {
      setDate(new Date(e.target.value));
    }
  };

  // 날짜 포맷팅 (달력 input용 YYYY-MM-DD)
  const localDateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  // 화면 표시용 (YYYY. MM. DD)
  const formattedDate = `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, "0")}. ${String(date.getDate()).padStart(2, "0")}`;
  const dayName = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];

  return (
    <Header>
      <HeaderLeft>
        <Badge>예약 시스템</Badge>
        <Title>회의실 예약</Title>
      </HeaderLeft>

      <DateController onClick={(e) => e.stopPropagation()}>
        <DateBtn onClick={handlePrevDay}>&lt;</DateBtn>
        <DateLabel>
          <HiddenDatePicker
            type="date"
            value={localDateString}
            onChange={handleDateChange}
          />
          <DateDisplay>
            {formattedDate} ({dayName})
          </DateDisplay>
        </DateLabel>
        <DateBtn onClick={handleNextDay}>&gt;</DateBtn>
      </DateController>
    </Header>
  );
}

// --- Styled Components ---

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
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
  font-size: 0.8rem;
  font-weight: 700;
`;

const Title = styled.h2`
  margin: 0;
  color: #0f172a;
  font-size: 1.5rem;
  font-weight: 700;
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const DateController = styled.div`
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

const DateBtn = styled.button`
  background: none;
  border: none;
  padding: 8px 12px;
  font-size: 1.1rem;
  font-weight: 700;
  color: #475569;
  cursor: pointer;
  border-radius: 4px;
  &:hover {
    background-color: #f1f5f9;
    color: #0f172a;
  }
`;

const DateLabel = styled.label`
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin: 0 16px;
  min-width: 150px;
  justify-content: center;
  &:hover > div {
    color: #0369a1;
  }
`;

const HiddenDatePicker = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  &::-webkit-calendar-picker-indicator {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
`;

const DateDisplay = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  transition: color 0.2s ease;
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;
