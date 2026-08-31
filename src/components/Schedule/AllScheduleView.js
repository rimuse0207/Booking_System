import React from "react";
import styled from "styled-components";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// 💡 한국어 달력 언어팩 임포트
import { ko } from "date-fns/locale";
import "moment/locale/ko";
import {
  useAllSchedule,
  FILTER_OPTIONS,
} from "../../hooks/Schedule/useAllSchedule";

registerLocale("ko", ko); // 💡 한국어 등록

const CATEGORY_COLORS = {
  외근: "#F59E0B",
  연차: "#EF4444",
  해외출장: "#4F46E5",
  출근: "#10B981",
};

export function AllScheduleView() {
  const { state, actions, computed } = useAllSchedule();

  const handlePrevDay = () => {
    const current = state.filterDate || new Date();
    const prevDate = new Date(current);
    prevDate.setDate(prevDate.getDate() - 1);
    actions.setFilterDate(prevDate);
  };

  const handleNextDay = () => {
    const current = state.filterDate || new Date();
    const nextDate = new Date(current);
    nextDate.setDate(nextDate.getDate() + 1);
    actions.setFilterDate(nextDate);
  };

  return (
    <AllScheduleContainer>
      <FilterBox>
        <FilterRow>
          <FilterLabel>일시</FilterLabel>
          <DateControlWrapper>
            <DateNavBtn onClick={handlePrevDay} title="이전 날짜">
              &lt;
            </DateNavBtn>
            <FilterDatePickerWrapper>
              <DatePicker
                selected={state.filterDate}
                onChange={actions.setFilterDate}
                dateFormat="yyyy년 MM월 dd일 (eee)"
                locale="ko"
                placeholderText="전체 일자"
              />
            </FilterDatePickerWrapper>
            <DateNavBtn onClick={handleNextDay} title="다음 날짜">
              &gt;
            </DateNavBtn>
          </DateControlWrapper>
        </FilterRow>

        {Object.entries({
          장소: "location",
          부서: "department",
          팀명: "team",
          구분: "category",
        }).map(([label, key]) => (
          <FilterRow key={key}>
            <FilterLabel>{label}</FilterLabel>
            <FilterBtnGroup>
              {FILTER_OPTIONS[key].map((item) => (
                <FilterTag
                  key={item}
                  $active={state.filters[key].includes(item)}
                  onClick={() => actions.toggleFilter(key, item)}
                >
                  {item}
                </FilterTag>
              ))}
            </FilterBtnGroup>
          </FilterRow>
        ))}
      </FilterBox>

      <ActiveFiltersArea>
        <ActiveTitle>선택된 필터:</ActiveTitle>
        {computed.activeFilterChips.length === 0 ? (
          <EmptyFilterText>
            선택된 필터가 없습니다. (전체 목록 표시)
          </EmptyFilterText>
        ) : (
          <SelectedChips>
            {computed.activeFilterChips.map((chip, idx) => (
              <Chip key={idx}>
                {chip.label}
                <ChipClose
                  onClick={() => actions.removeFilter(chip.type, chip.value)}
                >
                  ✕
                </ChipClose>
              </Chip>
            ))}
          </SelectedChips>
        )}
        <ResetBtn onClick={actions.resetFilters}>초기화 ↺</ResetBtn>
      </ActiveFiltersArea>

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <Th style={{ width: "25px" }}>장소</Th>
              <Th style={{ width: "25px" }}>부서</Th>
              <Th style={{ width: "65px" }}>팀명</Th>
              <Th style={{ width: "40px" }}>이름</Th>
              <Th style={{ width: "40px" }}>구분</Th>
              <Th>고객사</Th>
              <Th>안건</Th>
              <Th>동행자</Th>
            </tr>
          </thead>
          <tbody>
            {computed.filteredData.length === 0 ? (
              <tr>
                <Td
                  colSpan="9"
                  style={{
                    textAlign: "center",
                    padding: "40px 0",
                    color: "#94a3b8",
                  }}
                >
                  일정이 없습니다.
                </Td>
              </tr>
            ) : (
              computed.filteredData.map((row) => (
                <tr key={row.id}>
                  <Td>{row.places}</Td>
                  <Td>{row.department}</Td>
                  <Td>{row.team}</Td>
                  <Td style={{ fontWeight: "700" }}>{row.name}</Td>
                  <Td>
                    <TableBadge
                      $color={CATEGORY_COLORS[row.division] || "#64748B"}
                    >
                      {row.division}
                    </TableBadge>
                  </Td>
                  <Td>{row.custom}</Td>
                  <Td>{row.description}</Td>
                  <Td>{row.companion}</Td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </TableWrapper>
    </AllScheduleContainer>
  );
}

// Styled Components
const AllScheduleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const FilterBox = styled.div`
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const FilterRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 24px;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
  }
`;
const FilterLabel = styled.div`
  width: 60px;
  font-size: 0.95rem;
  font-weight: 800;
  color: #475569;
  margin-top: 6px;
`;

// 💡 날짜 선택기와 화살표 버튼을 묶어주는 컨테이너
const DateControlWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

// 💡 날짜 양옆 이동 화살표 버튼 스타일
const DateNavBtn = styled.button`
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: bold;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: #f8fafc;
    border-color: #0ea5e9;
    color: #0ea5e9;
  }
`;

const FilterBtnGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  flex: 1;
`;
const FilterTag = styled.button`
  background-color: ${(props) => (props.$active ? "#0ea5e9" : "#f1f5f9")};
  color: ${(props) => (props.$active ? "#ffffff" : "#475569")};
  border: 1px solid ${(props) => (props.$active ? "#0ea5e9" : "#e2e8f0")};
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background-color: ${(props) => (props.$active ? "#0284c7" : "#e2e8f0")};
  }
`;

/* 팝업 캘린더 전용 스타일 */
const FilterDatePickerWrapper = styled.div`
  .react-datepicker-wrapper {
    width: 200px;
    @media (max-width: 768px) {
      width: 100%;
    }
  }
  .react-datepicker__input-container input {
    width: 100%;
    /* 높이를 화살표 버튼(38px)과 동일하게 맞춤 */
    height: 38px;
    padding: 0 12px;
    font-size: 0.95rem;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    outline: none;
    color: #1e293b;
    cursor: pointer;
    font-family: inherit;
    box-sizing: border-box;
    text-align: center;
    &:focus {
      border-color: #0ea5e9;
      box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
    }
  }

  .react-datepicker-popper {
    z-index: 100;
  }
  .react-datepicker {
    font-family: inherit;
    border: 1px solid #cbd5e1;
    border-radius: 12px;
    background-color: #ffffff;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  .react-datepicker__header {
    background-color: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
    padding: 16px 0 8px 0;
  }
  .react-datepicker__current-month {
    font-size: 1.1rem;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 12px;
  }
  .react-datepicker__day-names,
  .react-datepicker__week {
    display: flex;
    justify-content: space-between;
    padding: 0 8px;
    box-sizing: border-box;
  }
  .react-datepicker__day-name,
  .react-datepicker__day {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 2px;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    color: #334155;
    width: 32px;
    height: 32px;
  }
  .react-datepicker__day:hover {
    background-color: #f1f5f9;
  }
  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected {
    background-color: #0ea5e9 !important;
    color: white !important;
    font-weight: 800;
  }
  .react-datepicker__day-name:nth-child(1),
  .react-datepicker__day:nth-child(1):not(.react-datepicker__day--selected) {
    color: #ef4444;
  }
  .react-datepicker__day-name:nth-child(7),
  .react-datepicker__day:nth-child(7):not(.react-datepicker__day--selected) {
    color: #3b82f6;
  }
  .react-datepicker__day--outside-month {
    color: #cbd5e1 !important;
    opacity: 0.5;
  }
`;

const ActiveFiltersArea = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  background-color: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  border: 1px dashed #cbd5e1;
`;
const ActiveTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 700;
  color: #64748b;
`;
const EmptyFilterText = styled.div`
  font-size: 0.9rem;
  color: #94a3b8;
`;
const SelectedChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  flex: 1;
`;
const Chip = styled.div`
  background: #e0f2fe;
  color: #0369a1;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1px solid #bae6fd;
`;
const ChipClose = styled.button`
  background: transparent;
  border: none;
  color: #0284c7;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: bold;
  padding: 0;
  &:hover {
    color: #0c4a6e;
  }
`;
const ResetBtn = styled.button`
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #475569;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  margin-left: auto;
  &:hover {
    background: #f1f5f9;
    color: #0f172a;
  }
`;
const TableWrapper = styled.div`
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
`;
const Th = styled.th`
  background-color: #f8fafc;
  color: #475569;
  font-weight: 800;
  font-size: 0.85rem;
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid #cbd5e1;
`;
const Td = styled.td`
  padding: 16px;
  font-size: 0.9rem;
  color: #1e293b;
  border-bottom: 1px solid #e2e8f0;
`;
const TableBadge = styled.span`
  background-color: ${(props) => props.$color};
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 12px;
`;
