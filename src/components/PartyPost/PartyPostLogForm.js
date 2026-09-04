import React from "react";
import styled from "styled-components";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale/ko";
import Select from "react-select";

registerLocale("ko", ko);

const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    padding: "2px 4px",
    fontSize: "0.95rem",
    backgroundColor: "#ffffff",
    borderColor: state.isFocused ? "#0ea5e9" : "#cbd5e1",
    borderRadius: "8px",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(14, 165, 233, 0.1)" : "none",
    "&:hover": { borderColor: state.isFocused ? "#0ea5e9" : "#94a3b8" },
  }),
  option: (provided, state) => ({
    ...provided,
    fontSize: "0.9rem",
    cursor: "pointer",
    backgroundColor: state.isSelected
      ? "#0ea5e9"
      : state.isFocused
        ? "#f0f9ff"
        : "#ffffff",
    color: state.isSelected ? "#ffffff" : "#1e293b",
    "&:active": { backgroundColor: "#bae6fd" },
  }),
};

export default function PartyPostLogForm({ state, actions }) {
  const { formData, userListOptions, selectUser } = state;
  const {
    handleBasicChange,
    handleSelectChange,
    handlePatrolChange,
    handleSubmit,
    setSelectUser,
  } = actions;

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <SectionCard>
        <SectionTitle>기본 정보</SectionTitle>
        <FormRow>
          <FormGroup>
            <Label>당직 일자</Label>
            <DatePickerWrapper>
              <DatePicker
                selected={formData.dutyDate}
                onChange={(date) =>
                  handleBasicChange({
                    target: { name: "dutyDate", value: date },
                  })
                }
                dateFormat="yyyy년 MM월 dd일"
                locale="ko"
              />
            </DatePickerWrapper>
          </FormGroup>
          <FormGroup>
            <Label>당직자</Label>
            <Select
              options={userListOptions}
              value={selectUser}
              onChange={(e) => setSelectUser(e)}
              styles={customSelectStyles}
              placeholder="당직자를 선택하세요"
              isSearchable
              isClearable
            />
          </FormGroup>
        </FormRow>
      </SectionCard>

      <SectionCard>
        <SectionTitle>순찰 사항</SectionTitle>
        <PatrolGrid>
          {formData.patrols.map((patrol, index) => (
            <PatrolBox key={patrol.id}>
              <PatrolHeader>
                <PatrolBadge>{index + 1}차 순찰</PatrolBadge>
                <DatePickerWrapper $isTime>
                  <DatePicker
                    selected={patrol.time}
                    onChange={(date) => handlePatrolChange(index, "time", date)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={30}
                    timeCaption="시간"
                    dateFormat="aa hh:mm"
                    locale="ko"
                  />
                </DatePickerWrapper>
              </PatrolHeader>
              <TextArea
                value={patrol.content}
                onChange={(e) =>
                  handlePatrolChange(index, "content", e.target.value)
                }
                placeholder="순찰 내역을 입력하세요."
                rows={4}
              />
            </PatrolBox>
          ))}
        </PatrolGrid>
      </SectionCard>

      <SectionCard>
        <SectionTitle>점검 및 순찰 내역</SectionTitle>
        <FormGroup>
          <TextArea
            style={{ minHeight: "200px" }}
            name="inspectionDetails"
            value={formData.inspectionDetails}
            onChange={handleBasicChange}
            placeholder="건물 출입 인원 등 점검 및 순찰 내역을 입력하세요. (예: 6층: 15명 (최종퇴실자:  )"
            rows={3}
          />
        </FormGroup>
      </SectionCard>

      <SectionCard>
        <SectionTitle>특이사항</SectionTitle>
        <FormGroup>
          <TextArea
            name="specialNotes"
            value={formData.specialNotes}
            onChange={handleBasicChange}
            placeholder="특이사항을 입력하세요."
            rows={3}
          />
        </FormGroup>
      </SectionCard>

      <ButtonGroup>
        <SubmitButton type="submit">메일 & 문자 발송</SubmitButton>
      </ButtonGroup>
    </FormWrapper>
  );
}

// --- Styled Components ---
const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  box-sizing: border-box;
`;
const SectionCard = styled.div`
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 28px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  width: 100%;
  box-sizing: border-box;
`;
const SectionTitle = styled.h3`
  margin: 0 0 20px 0;
  font-size: 1.15rem;
  font-weight: 800;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
  &::before {
    content: "";
    display: block;
    width: 4px;
    height: 16px;
    background-color: #0ea5e9;
    border-radius: 2px;
  }
`;
const FormRow = styled.div`
  display: flex;
  gap: 24px;
  width: 100%;
  box-sizing: border-box;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
  > * {
    flex: 1;
    min-width: 0;
  }
`;
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  box-sizing: border-box;
`;
const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 700;
  color: #475569;
`;
const TextArea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  font-size: 0.95rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  resize: vertical;
  outline: none;
  font-family: inherit;
  line-height: 1.5;
  color: #1e293b;
  transition: border-color 0.2s;
  &:focus {
    border-color: #0ea5e9;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
  }
`;
const PatrolGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
  box-sizing: border-box;
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;
const PatrolBox = styled.div`
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  box-sizing: border-box;
`;
const PatrolHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const PatrolBadge = styled.div`
  background-color: #e0f2fe;
  color: #0369a1;
  font-size: 0.85rem;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 12px;
`;
const DatePickerWrapper = styled.div`
  width: ${(props) => (props.$isTime ? "110px" : "100%")};
  box-sizing: border-box;
  .react-datepicker-wrapper {
    width: 100%;
    box-sizing: border-box;
  }
  .react-datepicker__input-container input {
    width: 100%;
    box-sizing: border-box;
    padding: ${(props) => (props.$isTime ? "6px 10px" : "10px 14px")};
    font-size: ${(props) => (props.$isTime ? "0.85rem" : "0.95rem")};
    font-weight: ${(props) => (props.$isTime ? "700" : "500")};
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    outline: none;
    color: ${(props) => (props.$isTime ? "#0284c7" : "#1e293b")};
    background-color: #ffffff;
    cursor: pointer;
    font-family: inherit;
    text-align: ${(props) => (props.$isTime ? "center" : "left")};
    transition: all 0.2s;
    &:focus {
      border-color: #0ea5e9;
      box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
    }
  }
`;
const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
`;
const CancelButton = styled.button`
  background-color: #f1f5f9;
  color: #475569;
  font-size: 1rem;
  font-weight: 700;
  border: 1px solid #cbd5e1;
  padding: 14px 24px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background-color: #e2e8f0;
    color: #1e293b;
  }
`;
const SubmitButton = styled.button`
  background-color: #0ea5e9;
  color: white;
  font-size: 1rem;
  font-weight: 700;
  border: none;
  padding: 14px 32px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background-color: #0284c7;
  }
`;
