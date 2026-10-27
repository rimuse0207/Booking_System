import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Select from "react-select";

export default function EditLogModal({
  isOpen,
  onClose,
  logData,
  onSave,
  masterData,
}) {
  const [form, setForm] = useState(null);

  // 시간 선택용 배열 생성
  const hours = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0"),
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0"),
  );

  const categoryOptions = [
    { value: "시간 외", label: "시간 외" },
    { value: "휴가", label: "휴가" },
    { value: "주말", label: "주말" },
  ];

  // 모달이 열릴 때 선택된 데이터로 폼 초기화
  useEffect(() => {
    if (isOpen && logData) {
      const [start_hour, start_min] = (logData.start_time || "09:00").split(
        ":",
      );
      const [end_hour, end_min] = (logData.end_time || "18:00").split(":");

      setForm({
        ...logData,
        response_date: logData.response_date.replace(/\. /g, "-"), // "YYYY. MM. DD" -> "YYYY-MM-DD"
        start_hour,
        start_min,
        end_hour,
        end_min,
        category: { value: logData.category, label: logData.category },
      });
    }
  }, [isOpen, logData]);

  if (!isOpen || !form) return null;

  const { companies, sites, equipments } = masterData;

  const filteredCompanies = companies.filter(
    (c) => c.team_name === form.team_name,
  );
  const filteredSites = sites.filter(
    (s) =>
      s.team_name === form.team_name && s.company_name === form.company_name,
  );
  const filteredEquipments = equipments.filter(
    (e) =>
      e.team_name === form.team_name &&
      e.company_name === form.company_name &&
      e.site_name === form.site_name,
  );

  const handleFormChange = (key, value) => {
    setForm((prev) => {
      const updated = { ...prev, [key]: value };
      if (key === "company_name") {
        updated.site_name = "";
        updated.equipment_name = "";
      }
      if (key === "site_name") {
        updated.equipment_name = "";
      }
      return updated;
    });
  };

  const handleSubmit = () => {
    if (
      !form.company_name ||
      !form.site_name ||
      !form.equipment_name ||
      !form.content.trim()
    ) {
      return alert("필수 항목과 상세 내용을 모두 입력해주세요.");
    }

    // DB 포맷에 맞게 데이터 재조립 후 부모 컴포넌트로 전달
    const payload = {
      ...form,
      start_time: `${form.start_hour}:${form.start_min}`,
      end_time: `${form.end_hour}:${form.end_min}`,
      response_date: form.response_date.replace(/-/g, ". "), // "YYYY-MM-DD" -> "YYYY. MM. DD"
      category: form.category.value || form.category, // react-select 객체 대비 방어코드
    };
    onSave(payload);
  };

  return (
    <ModalOverlay>
      <ModalBox>
        <ModalHeader>
          <ModalTitle>대응 이력 수정</ModalTitle>
          <CloseBtn onClick={onClose}>✕</CloseBtn>
        </ModalHeader>

        <ModalBody>
          <FormGrid>
            <InputGroup>
              <Label>대응일</Label>
              <Input
                type="date"
                value={form.response_date}
                onChange={(e) =>
                  handleFormChange("response_date", e.target.value)
                }
              />
            </InputGroup>

            <InputGroup>
              <Label>구분</Label>
              <SelectWrapper>
                <Select
                  options={categoryOptions}
                  value={form.category}
                  onChange={(s) => handleFormChange("category", s)}
                />
              </SelectWrapper>
            </InputGroup>

            <InputGroup>
              <Label>회사명 (고객사)</Label>
              <SelectWrapper>
                <Select
                  options={filteredCompanies.map((c) => ({
                    value: c.company_name,
                    label: c.company_name,
                  }))}
                  value={
                    form.company_name
                      ? { value: form.company_name, label: form.company_name }
                      : null
                  }
                  onChange={(s) => handleFormChange("company_name", s.value)}
                />
              </SelectWrapper>
            </InputGroup>

            <InputGroup>
              <Label>사이트</Label>
              <SelectWrapper>
                <Select
                  options={filteredSites.map((s) => ({
                    value: s.site_name,
                    label: s.site_name,
                  }))}
                  value={
                    form.site_name
                      ? { value: form.site_name, label: form.site_name }
                      : null
                  }
                  onChange={(s) => handleFormChange("site_name", s.value)}
                />
              </SelectWrapper>
            </InputGroup>

            <InputGroup>
              <Label>장비 모델</Label>
              <SelectWrapper>
                <Select
                  options={filteredEquipments.map((e) => ({
                    value: e.equipment_name,
                    label: e.equipment_name,
                  }))}
                  value={
                    form.equipment_name
                      ? {
                          value: form.equipment_name,
                          label: form.equipment_name,
                        }
                      : null
                  }
                  onChange={(s) => handleFormChange("equipment_name", s.value)}
                />
              </SelectWrapper>
            </InputGroup>

            <InputGroup>
              <Label>고객 담당자</Label>
              <Input
                type="text"
                value={form.customer_contact || ""}
                onChange={(e) =>
                  handleFormChange("customer_contact", e.target.value)
                }
              />
            </InputGroup>

            {/* 💡 누락되었던 시작/종료 시간 입력란 추가 */}
            <InputGroup>
              <Label>시작 시간</Label>
              <TimeRow>
                <NativeSelect
                  value={form.start_hour}
                  onChange={(e) =>
                    handleFormChange("start_hour", e.target.value)
                  }
                >
                  {hours.map((h) => (
                    <option key={h} value={h}>
                      {h}시
                    </option>
                  ))}
                </NativeSelect>
                <NativeSelect
                  value={form.start_min}
                  onChange={(e) =>
                    handleFormChange("start_min", e.target.value)
                  }
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
              <Label>종료 시간</Label>
              <TimeRow>
                <NativeSelect
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
              <Label>상세 대응 내용</Label>
              <Textarea
                rows={4}
                value={form.content}
                onChange={(e) => handleFormChange("content", e.target.value)}
              />
            </InputGroup>
          </FormGrid>
        </ModalBody>

        <ModalFooter>
          <CancelBtn onClick={onClose}>취소</CancelBtn>
          <ConfirmBtn onClick={handleSubmit}>수정 완료</ConfirmBtn>
        </ModalFooter>
      </ModalBox>
    </ModalOverlay>
  );
}

// --- Styled Components ---
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
`;
const ModalBox = styled.div`
  background: white;
  width: 100%;
  max-width: 600px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;
const ModalHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
`;
const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 800;
  color: #0f172a;
`;
const CloseBtn = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #64748b;
`;
const ModalBody = styled.div`
  padding: 24px;
  max-height: 70vh;
  overflow-y: auto;
`;

// 💡 입력 요소 정렬을 위한 스타일 조정
const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;
const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;
const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 700;
  color: #475569;
`;
const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;
  &:focus {
    border-color: #0ea5e9;
  }
`;
const Textarea = styled.textarea`
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  resize: vertical;
  outline: none;
  font-size: 0.95rem;
  &:focus {
    border-color: #0ea5e9;
  }
`;
const SelectWrapper = styled.div`
  font-size: 0.95rem;
`;

// 💡 시간 선택 스타일 추가
const TimeRow = styled.div`
  display: flex;
  gap: 8px;
`;
const NativeSelect = styled.select`
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #1e293b;
  background-color: white;
  outline: none;
  box-sizing: border-box;
  &:focus {
    border-color: #0ea5e9;
  }
`;

const ModalFooter = styled.div`
  padding: 16px 24px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;
const CancelBtn = styled.button`
  background: white;
  border: 1px solid #cbd5e1;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  color: #475569;
  &:hover {
    background: #f1f5f9;
  }
`;
const ConfirmBtn = styled.button`
  background: #0ea5e9;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  &:hover {
    background: #0284c7;
  }
`;
