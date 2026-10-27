import React from "react";
import styled from "styled-components";
import Select from "react-select";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import moment from "moment";

registerLocale("ko", ko);

export default function SupportForm({ state, actions }) {
  const {
    form,
    currentUser,
    isValidTeam,
    filteredCompanies,
    filteredSites,
    filteredEquipments,
  } = state;
  const { handleFormChange, handleSubmit, setModalType } = actions;

  const categoryOptions = [
    { value: "시간 외", label: "시간 외" },
    { value: "휴가", label: "휴가" },
    { value: "주말", label: "주말" },
  ];

  const hours = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0"),
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0"),
  );

  return (
    <FormCard onSubmit={handleSubmit}>
      <FormHeader>
        <FormTitle>새로운 대응 이력 등록</FormTitle>
        <Badge>CE 지원 시스템</Badge>
      </FormHeader>

      {!isValidTeam && (
        <WarningBox>
          <strong>⚠️ 해당 팀은 제공되지 않습니다.</strong>
          <br />
          소속된 팀({currentUser.team})이 마스터 데이터에 등록되어 있지 않아
          입력을 차단합니다. 관리자에게 문의하세요.
        </WarningBox>
      )}

      <FormGrid>
        <InputGroup>
          <Label>대응일</Label>
          <DatePickerWrapper>
            <DatePicker
              selected={moment(form.response_date).toDate()}
              onChange={(date) =>
                handleFormChange(
                  "response_date",
                  moment(date).format("YYYY-MM-DD"),
                )
              }
              dateFormat="yyyy년 MM월 dd일 (eee)"
              locale="ko"
              disabled={!isValidTeam}
              customInput={<StyledInput disabled={!isValidTeam} />}
            />
          </DatePickerWrapper>
        </InputGroup>

        {/* <InputGroup>
          <Label>대응자</Label>
          <StyledInput type="text" value={form.responder} disabled />
        </InputGroup> */}

        <InputGroup>
          <Label>소속 팀명 (로그인 자동)</Label>
          <StyledInput type="text" value={currentUser.team} disabled />
        </InputGroup>

        <InputGroup>
          <Label>회사명 (고객사)</Label>
          <SelectWrapper>
            <Select
              isDisabled={!isValidTeam}
              options={[
                ...filteredCompanies.map((c) => ({
                  value: c.company_name,
                  label: `${c.company_name}${c.company_name_en ? `(${c.company_name_en})` : ""}`,
                })),
                { value: "OTHER", label: "+ [기타] 직접 추가하기" },
              ]}
              value={
                filteredCompanies.find(
                  (c) => c.company_name === form.company_name,
                )
                  ? {
                      value: form.company_name,
                      label: filteredCompanies.find(
                        (c) => c.company_name === form.company_name,
                      ).company_name,
                    }
                  : null
              }
              onChange={(selected) => {
                if (selected.value === "OTHER") setModalType("company");
                else handleFormChange("company_name", selected.value);
              }}
              placeholder="회사명 선택"
            />
          </SelectWrapper>
        </InputGroup>

        <InputGroup>
          <Label>사이트 (지역)</Label>
          <SelectWrapper>
            <Select
              isDisabled={!isValidTeam || !form.company_name}
              options={[
                ...filteredSites.map((s) => ({
                  value: s.site_name,
                  label: s.site_name,
                })),
                { value: "OTHER", label: "+ [기타] 직접 추가하기" },
              ]}
              value={
                form.site_name
                  ? { value: form.site_name, label: form.site_name }
                  : null
              }
              onChange={(selected) => {
                if (selected.value === "OTHER") setModalType("site");
                else handleFormChange("site_name", selected.value);
              }}
              placeholder={
                form.company_name ? "사이트 선택" : "회사명 우선 선택"
              }
            />
          </SelectWrapper>
        </InputGroup>

        <InputGroup>
          <Label>보유 장비명</Label>
          <SelectWrapper>
            <Select
              isDisabled={!isValidTeam || !form.site_name}
              options={[
                ...filteredEquipments.map((e) => ({
                  value: e.equipment_name,
                  label: e.equipment_name,
                })),
                { value: "OTHER", label: "+ [기타] 직접 추가하기" },
              ]}
              value={
                form.equipment_name
                  ? { value: form.equipment_name, label: form.equipment_name }
                  : null
              }
              onChange={(selected) => {
                if (selected.value === "OTHER") setModalType("equipment");
                else handleFormChange("equipment_name", selected.value);
              }}
              placeholder={
                form.site_name ? "보유 장비 선택" : "사이트 우선 선택"
              }
            />
          </SelectWrapper>
        </InputGroup>

        <InputGroup>
          <Label>고객사 담당자</Label>
          <StyledInput
            type="text"
            placeholder="예: 김철수 과장"
            value={form.customer_contact}
            disabled={!isValidTeam}
            onChange={(e) =>
              handleFormChange("customer_contact", e.target.value)
            }
          />
        </InputGroup>

        <InputGroup>
          <Label>대응 시작 시간 (24h)</Label>
          <TimeRow>
            <NativeSelect
              disabled={!isValidTeam}
              value={form.start_hour}
              onChange={(e) => handleFormChange("start_hour", e.target.value)}
            >
              {hours.map((h) => (
                <option key={h} value={h}>
                  {h}시
                </option>
              ))}
            </NativeSelect>
            <NativeSelect
              disabled={!isValidTeam}
              value={form.start_min}
              onChange={(e) => handleFormChange("start_min", e.target.value)}
            >
              {minutes.map((m) => (
                <option key={m} value={m}>
                  {m}분
                </option>
              ))}
            </NativeSelect>
          </TimeRow>
        </InputGroup>

        <InputGroup>
          <Label>대응 종료 시간 (24h)</Label>
          <TimeRow>
            <NativeSelect
              disabled={!isValidTeam}
              value={form.end_hour}
              onChange={(e) => handleFormChange("end_hour", e.target.value)}
            >
              {hours.map((h) => (
                <option key={h} value={h}>
                  {h}시
                </option>
              ))}
            </NativeSelect>
            <NativeSelect
              disabled={!isValidTeam}
              value={form.end_min}
              onChange={(e) => handleFormChange("end_min", e.target.value)}
            >
              {minutes.map((m) => (
                <option key={m} value={m}>
                  {m}분
                </option>
              ))}
            </NativeSelect>
          </TimeRow>
        </InputGroup>

        <InputGroup style={{ gridColumn: "1 / -1" }}>
          <Label>구분 / 비고</Label>
          <SelectWrapper>
            <Select
              isDisabled={!isValidTeam}
              options={categoryOptions}
              value={form.category}
              onChange={(selected) => handleFormChange("category", selected)}
            />
          </SelectWrapper>
        </InputGroup>

        <InputGroup style={{ gridColumn: "1 / -1" }}>
          <Label>상세 대응 내용</Label>
          <StyledTextarea
            rows={4}
            placeholder="상세 내용을 입력하세요..."
            value={form.content}
            disabled={!isValidTeam}
            onChange={(e) => handleFormChange("content", e.target.value)}
          />
        </InputGroup>
      </FormGrid>

      <SubmitBtn type="submit" disabled={!isValidTeam}>
        {isValidTeam ? "대응 이력 등록하기" : "팀 등록이 필요합니다"}
      </SubmitBtn>
    </FormCard>
  );
}

const FormCard = styled.form`
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  padding: 28px;
  margin-bottom: 32px;
  @media (max-width: 768px) {
    padding: 20px;
  }
`;
const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;
const FormTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
`;
const Badge = styled.span`
  background-color: #e0f2fe;
  color: #0284c7;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 800;
`;
const WarningBox = styled.div`
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #ef4444;
  padding: 16px;
  border-radius: 10px;
  margin-bottom: 24px;
  font-size: 0.95rem;
  line-height: 1.5;
`;
const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;
const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 700;
  color: #475569;
`;
const StyledInput = styled.input`
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #1e293b;
  outline: none;
  width: 100%;
  box-sizing: border-box;
  &:focus {
    border-color: #0ea5e9;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
  }
  &:disabled {
    background-color: #f1f5f9;
    color: #94a3b8;
    cursor: not-allowed;
  }
`;
const NativeSelect = styled.select`
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #1e293b;
  background-color: white;
  outline: none;
  box-sizing: border-box;
  &:focus {
    border-color: #0ea5e9;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
  }
  &:disabled {
    background-color: #f1f5f9;
    color: #94a3b8;
    cursor: not-allowed;
  }
`;
const DatePickerWrapper = styled.div`
  width: 100%;
  .react-datepicker-wrapper {
    width: 100%;
  }
  .react-datepicker__day-name:nth-child(1),
  .react-datepicker__day:nth-child(1):not(.react-datepicker__day--selected) {
    color: #ef4444;
  }
  .react-datepicker__day-name:nth-child(7),
  .react-datepicker__day:nth-child(7):not(.react-datepicker__day--selected) {
    color: #3b82f6;
  }
`;
const StyledTextarea = styled.textarea`
  padding: 12px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #1e293b;
  outline: none;
  resize: vertical;
  &:focus {
    border-color: #0ea5e9;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
  }
  &:disabled {
    background-color: #f1f5f9;
    color: #94a3b8;
    cursor: not-allowed;
  }
`;
const SelectWrapper = styled.div`
  font-size: 0.95rem;
`;
const TimeRow = styled.div`
  display: flex;
  gap: 8px;
`;
const SubmitBtn = styled.button`
  width: 100%;
  margin-top: 24px;
  background-color: #0ea5e9;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 14px;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover:not(:disabled) {
    background-color: #0284c7;
  }
  &:disabled {
    background-color: #cbd5e1;
    color: #94a3b8;
    cursor: not-allowed;
  }
`;
