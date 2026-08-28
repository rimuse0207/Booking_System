import React from "react";
import styled from "styled-components";
import moment from "moment";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// 💡 여기도 언어팩 필수 추가!
import { ko } from "date-fns/locale";
import { useMySchedule } from "../../hooks/Schedule/useMySchedule";

registerLocale("ko", ko); // 💡 한국어 등록

const CATEGORY_COLORS = {
  외근: "#F59E0B",
  연차: "#EF4444",
  해외출장: "#4F46E5",
  출근: "#10B981",
};

export function MyScheduleView() {
  const { state, actions, computed } = useMySchedule();

  return (
    <LayoutWrapper>
      <LeftPanel>
        <CalendarHeader>
          <CurrentMonthArea>
            <MonthTitle>{state.currentMonth.format("YYYY. MM")}</MonthTitle>
            <TodayBtn onClick={actions.goToday}>오늘</TodayBtn>
          </CurrentMonthArea>
          <MonthControls>
            <CalBtn onClick={actions.prevMonth}>&lt;</CalBtn>
            <CalBtn onClick={actions.nextMonth}>&gt;</CalBtn>
          </MonthControls>
        </CalendarHeader>

        <CalendarGrid>
          <DaysRow>
            {["일", "월", "화", "수", "목", "금", "토"].map((day, idx) => (
              <DayName key={idx} $dayIdx={idx}>
                {day}
              </DayName>
            ))}
          </DaysRow>

          <DatesBody>
            {computed.calendarWeeks.map((week, wIdx) => (
              <WeekRow key={wIdx}>
                {week.map((day, dIdx) => {
                  const dayStr = day.format("YYYY-MM-DD");
                  const isSelected = state.selectedDates.some((d) =>
                    moment(d).isSame(day, "day"),
                  );
                  return (
                    <DateCell
                      key={dIdx}
                      $isCurrentMonth={
                        day.month() === state.currentMonth.month()
                      }
                      $isSelected={isSelected}
                      onClick={() => actions.handleDateClick(day)}
                    >
                      <DateCellHeader>
                        <DateNumber
                          $isSelected={isSelected}
                          $isToday={day.isSame(moment(), "day")}
                          $dayIdx={dIdx}
                        >
                          {day.format("D")}
                        </DateNumber>
                      </DateCellHeader>

                      <ScheduleArea>
                        {computed.getSchedulesForDay(dayStr).map((sch, i) => (
                          <ScheduleBadge
                            key={i}
                            $bg={CATEGORY_COLORS[sch.category]}
                          >
                            {sch.category === "연차"
                              ? "[연차]"
                              : `[${sch.category}] ${sch.client || sch.agenda}`}
                          </ScheduleBadge>
                        ))}
                      </ScheduleArea>
                    </DateCell>
                  );
                })}
              </WeekRow>
            ))}
          </DatesBody>
        </CalendarGrid>
      </LeftPanel>

      <RightPanel>
        <Tabs>
          <Tab
            $active={state.activeTab === "register"}
            onClick={() => actions.setActiveTab("register")}
          >
            일정 {state.formData.id ? "수정" : "등록"}
          </Tab>
          <Tab
            $active={state.activeTab === "status"}
            onClick={() => actions.setActiveTab("status")}
          >
            등록 현황
          </Tab>
        </Tabs>

        <PanelContent>
          {state.activeTab === "register" ? (
            <Form onSubmit={actions.handleSubmit}>
              <FormRow>
                <FormGroup>
                  <Label>이름</Label>
                  <Input
                    type="text"
                    name="name"
                    value={state.formData.name}
                    readOnly
                    $disabled
                  />
                </FormGroup>
                <FormGroup>
                  <Label>구분</Label>
                  <Select
                    name="category"
                    value={state.formData.category}
                    onChange={actions.handleFormChange}
                  >
                    <option value="외근">외근</option>
                    <option value="해외출장">해외출장</option>
                    <option value="연차">연차</option>
                  </Select>
                </FormGroup>
              </FormRow>

              <FormGroup style={{ alignItems: "center" }}>
                <Label style={{ width: "100%", marginBottom: "4px" }}>
                  일정 선택 (다중 선택 가능)
                </Label>
                <DatePickerWrapper>
                  <DatePicker
                    inline
                    onChange={actions.handleDatePickerChange}
                    dayClassName={(date) =>
                      state.selectedDates.some((d) =>
                        moment(d).isSame(date, "day"),
                      )
                        ? "custom-selected"
                        : undefined
                    }
                    locale="ko" // 💡 언어 설정 적용 확인
                    formatWeekDay={(n) => n.substring(0, 1)}
                  />
                </DatePickerWrapper>
                {state.selectedDates.length > 0 && (
                  <SelectedDatesContainer>
                    {state.selectedDates
                      .slice()
                      .sort((a, b) => a - b)
                      .map((date, idx) => (
                        <DateChip key={idx}>
                          {moment(date).format("MM.DD")}
                          <ChipClose
                            type="button"
                            onClick={() => actions.handleDatePickerChange(date)}
                          >
                            ✕
                          </ChipClose>
                        </DateChip>
                      ))}
                  </SelectedDatesContainer>
                )}
              </FormGroup>

              {state.formData.category !== "연차" && (
                <>
                  <FormGroup>
                    <Label>고객사</Label>
                    <Input
                      type="text"
                      name="client"
                      value={state.formData.client}
                      onChange={actions.handleFormChange}
                      placeholder="고객사 명"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>동행자</Label>
                    <Input
                      type="text"
                      name="companions"
                      value={state.formData.companions}
                      onChange={actions.handleFormChange}
                      placeholder="예: 김철수 선임"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>안건</Label>
                    <TextArea
                      name="agenda"
                      value={state.formData.agenda}
                      onChange={actions.handleFormChange}
                      placeholder="안건 상세 내용"
                    />
                  </FormGroup>
                </>
              )}

              <SubmitButton type="submit">
                {state.formData.id
                  ? "일정 수정 완료"
                  : `선택한 ${state.selectedDates.length}일 일정 등록`}
              </SubmitButton>
              {state.formData.id && (
                <CancelButton
                  type="button"
                  onClick={() => actions.setActiveTab("status")}
                >
                  수정 취소
                </CancelButton>
              )}
            </Form>
          ) : (
            <StatusList>
              {state.schedules.length === 0 ? (
                <EmptyMsg>등록된 일정이 없습니다.</EmptyMsg>
              ) : (
                state.schedules
                  .sort(
                    (a, b) =>
                      moment(b.startDate).valueOf() -
                      moment(a.startDate).valueOf(),
                  )
                  .map((sch) => (
                    <ScheduleCard key={sch.id}>
                      <CardHeader>
                        <CardTitleGroup>
                          <CardBadge $color={CATEGORY_COLORS[sch.category]}>
                            {sch.category}
                          </CardBadge>
                          <CardDate>{sch.startDate}</CardDate>
                        </CardTitleGroup>
                      </CardHeader>
                      {sch.category !== "연차" && (
                        <CardBody>
                          {sch.client && (
                            <CardRow>
                              <strong>고객사:</strong> {sch.client}
                            </CardRow>
                          )}
                          <CardRow>
                            <strong>안건:</strong> {sch.agenda || "-"}
                          </CardRow>
                          {sch.companions && (
                            <CardRow>
                              <strong>동행자:</strong> {sch.companions}
                            </CardRow>
                          )}
                        </CardBody>
                      )}
                      <CardActions>
                        <ActionBtn onClick={() => actions.handleEdit(sch)}>
                          수정
                        </ActionBtn>
                        <ActionBtn
                          $danger
                          onClick={() => actions.handleDelete(sch.id)}
                        >
                          삭제
                        </ActionBtn>
                      </CardActions>
                    </ScheduleCard>
                  ))
              )}
            </StatusList>
          )}
        </PanelContent>
      </RightPanel>
    </LayoutWrapper>
  );
}

// Styled Components
const LayoutWrapper = styled.div`
  display: flex;
  gap: 32px;
  align-items: flex-start;
  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;
const LeftPanel = styled.div`
  flex: 1.5;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 28px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  border: 1px solid #e2e8f0;
  @media (max-width: 1024px) {
    width: 100%;
    box-sizing: border-box;
    order: 2;
  }
`;
const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;
const CurrentMonthArea = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;
const MonthTitle = styled.div`
  font-size: 1.6rem;
  font-weight: 800;
  color: #0f172a;
`;
const TodayBtn = styled.button`
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #475569;
  cursor: pointer;
  &:hover {
    background: #e2e8f0;
    color: #0f172a;
  }
`;
const MonthControls = styled.div`
  display: flex;
  gap: 8px;
`;
const CalBtn = styled.button`
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: #475569;
  cursor: pointer;
  &:hover {
    background: #f8fafc;
    border-color: #94a3b8;
  }
`;
const CalendarGrid = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  box-sizing: border-box;
`;
const DaysRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
`;
const DayName = styled.div`
  text-align: center;
  font-weight: 700;
  font-size: 0.85rem;
  color: ${(props) =>
    props.$dayIdx === 0
      ? "#ef4444"
      : props.$dayIdx === 6
        ? "#3b82f6"
        : "#475569"};
  padding: 12px 0;
  border-right: 1px solid #e2e8f0;
  &:last-child {
    border-right: none;
  }
`;
const DatesBody = styled.div`
  display: flex;
  flex-direction: column;
`;
const WeekRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-bottom: 1px solid #e2e8f0;
  &:last-child {
    border-bottom: none;
  }
`;
const DateCell = styled.div`
  min-height: 110px;
  display: flex;
  flex-direction: column;
  padding: 6px;
  cursor: pointer;
  border-right: 1px solid #e2e8f0;
  box-sizing: border-box;
  background-color: ${(props) =>
    props.$isSelected ? "#f0f9ff" : "transparent"};
  opacity: ${(props) => (props.$isCurrentMonth ? 1 : 0.4)};
  overflow: hidden;
  &:last-child {
    border-right: none;
  }
  &:hover {
    background-color: #f8fafc;
  }
  @media (max-width: 768px) {
    min-height: 80px;
    padding: 4px;
  }
`;
const DateCellHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 4px;
`;
const DateNumber = styled.div`
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 0.85rem;
  font-weight: ${(props) => (props.$isToday ? "800" : "600")};
  color: ${(props) =>
    props.$isToday
      ? "#ffffff"
      : props.$dayIdx === 0
        ? "#ef4444"
        : props.$dayIdx === 6
          ? "#3b82f6"
          : "#334155"};
  background-color: ${(props) => (props.$isToday ? "#0ea5e9" : "transparent")};
`;
const ScheduleArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;
const ScheduleBadge = styled.div`
  background-color: ${(props) => props.$bg};
  color: #ffffff;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 4px 6px;
  border-radius: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  box-sizing: border-box;
  display: block;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;
const RightPanel = styled.div`
  flex: 1;
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: sticky;
  top: 24px;
  @media (max-width: 1024px) {
    width: 100%;
    position: static;
    order: 1;
  }
`;
const Tabs = styled.div`
  display: flex;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
`;
const Tab = styled.button`
  flex: 1;
  padding: 16px 0;
  font-size: 1rem;
  font-weight: 800;
  border: none;
  background: ${(props) => (props.$active ? "#ffffff" : "transparent")};
  color: ${(props) => (props.$active ? "#0ea5e9" : "#64748b")};
  border-bottom: 3px solid
    ${(props) => (props.$active ? "#0ea5e9" : "transparent")};
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    color: ${(props) => (props.$active ? "#0ea5e9" : "#334155")};
  }
`;
const PanelContent = styled.div`
  padding: 28px;
  flex: 1;
  @media (max-width: 768px) {
    padding: 20px;
  }
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const FormRow = styled.div`
  display: flex;
  gap: 16px;
  > * {
    flex: 1;
  }
`;
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 700;
  color: #475569;
`;
const Input = styled.input`
  padding: 10px 14px;
  font-size: 0.95rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background-color: ${(props) => (props.$disabled ? "#f8fafc" : "#ffffff")};
  color: ${(props) => (props.$disabled ? "#94a3b8" : "#1e293b")};
  outline: none;
  transition: border-color 0.2s;
  &:focus {
    border-color: #0ea5e9;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
  }
`;
const Select = styled.select`
  padding: 10px 14px;
  font-size: 0.95rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  outline: none;
  font-weight: 600;
  color: #1e293b;
  cursor: pointer;
  &:focus {
    border-color: #0ea5e9;
  }
`;
const DatePickerWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  .react-datepicker {
    width: 100%;
    border: 1px solid #cbd5e1;
    border-radius: 12px;
    font-family: inherit;
    background-color: #ffffff;
    overflow: hidden;
  }
  .react-datepicker__month-container {
    width: 100%;
    float: none;
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
    height: 36px;
  }
  .react-datepicker__day:hover {
    background-color: #f1f5f9;
  }
  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected {
    background-color: transparent !important;
    color: inherit !important;
  }
  .react-datepicker__day.custom-selected {
    background-color: #0ea5e9 !important;
    color: white !important;
    font-weight: 800;
    box-shadow: 0 2px 4px rgba(14, 165, 233, 0.3);
  }
  .react-datepicker__day.custom-selected:hover {
    background-color: #0284c7 !important;
  }
  .react-datepicker__day-name:nth-child(1),
  .react-datepicker__day:nth-child(1):not(.custom-selected) {
    color: #ef4444;
  }
  .react-datepicker__day-name:nth-child(7),
  .react-datepicker__day:nth-child(7):not(.custom-selected) {
    color: #3b82f6;
  }
  .react-datepicker__day--outside-month {
    color: #cbd5e1 !important;
    opacity: 0.5;
  }
  .react-datepicker__navigation {
    top: 14px;
  }
`;
const SelectedDatesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px dashed #cbd5e1;
  width: 100%;
  box-sizing: border-box;
`;
const DateChip = styled.div`
  background: #e0f2fe;
  color: #0369a1;
  padding: 6px 10px;
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
const TextArea = styled.textarea`
  padding: 12px 14px;
  font-size: 0.95rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  min-height: 100px;
  resize: vertical;
  outline: none;
  &:focus {
    border-color: #0ea5e9;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
  }
`;
const SubmitButton = styled.button`
  margin-top: 12px;
  background-color: #0ea5e9;
  color: white;
  font-size: 1rem;
  font-weight: 700;
  border: none;
  padding: 14px;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    background-color: #0284c7;
  }
`;
const CancelButton = styled.button`
  background-color: #f1f5f9;
  color: #475569;
  font-size: 1rem;
  font-weight: 700;
  border: 1px solid #cbd5e1;
  padding: 14px;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    background-color: #e2e8f0;
  }
`;
const StatusList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const EmptyMsg = styled.div`
  text-align: center;
  padding: 40px 0;
  color: #94a3b8;
  font-weight: 600;
`;
const ScheduleCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 16px;
  background-color: #f8fafc;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
    background-color: #ffffff;
  }
`;
const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  border-bottom: 1px dashed #cbd5e1;
  padding-bottom: 12px;
`;
const CardTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const CardBadge = styled.span`
  background-color: ${(props) => props.$color};
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 800;
`;
const CardDate = styled.div`
  font-size: 0.9rem;
  font-weight: 800;
  color: #334155;
`;
const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const CardRow = styled.div`
  font-size: 0.9rem;
  color: #1e293b;
  line-height: 1.4;
  strong {
    color: #64748b;
    margin-right: 6px;
    font-weight: 700;
  }
`;
const CardActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
`;
const ActionBtn = styled.button`
  background: ${(props) => (props.$danger ? "#fef2f2" : "#f1f5f9")};
  color: ${(props) => (props.$danger ? "#ef4444" : "#475569")};
  border: 1px solid ${(props) => (props.$danger ? "#fecaca" : "#e2e8f0")};
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  &:hover {
    background: ${(props) => (props.$danger ? "#fee2e2" : "#e2e8f0")};
  }
`;
