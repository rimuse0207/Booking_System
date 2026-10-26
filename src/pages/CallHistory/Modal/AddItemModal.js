import React from "react";
import styled from "styled-components";

export function AddItemModal({ state, actions }) {
  const { modalType, modalInput } = state;
  const { setModalType, setModalInput, handleAddMasterItem } = actions;

  if (!modalType) return null;

  return (
    <ModalOverlay>
      <ModalBox>
        <ModalTitle>
          {modalType === "company" && "새로운 회사명 추가"}
          {modalType === "site" && "새로운 사이트명 추가"}
          {modalType === "equipment" && "새로운 장비 모델명 추가"}
        </ModalTitle>

        {modalType === "company" && (
          <>
            <InputGroup>
              <Label>
                회사명 (한글) <Required>*</Required>
              </Label>
              <Input
                placeholder="예: 삼성전자"
                value={modalInput.ko || ""}
                onChange={(e) =>
                  setModalInput({ ...modalInput, ko: e.target.value })
                }
              />
            </InputGroup>
            <InputGroup>
              <Label>회사명 (영문)</Label>
              <Input
                placeholder="예: Samsung Electronics"
                value={modalInput.en || ""}
                onChange={(e) =>
                  setModalInput({ ...modalInput, en: e.target.value })
                }
              />
            </InputGroup>
          </>
        )}

        {modalType !== "company" && (
          <InputGroup>
            <Label>
              {modalType === "site" ? "사이트명" : "장비 모델명"}{" "}
              <Required>*</Required>
            </Label>
            <Input
              placeholder="항목 이름을 입력하세요"
              value={modalInput.name || ""}
              onChange={(e) =>
                setModalInput({ ...modalInput, name: e.target.value })
              }
            />
          </InputGroup>
        )}

        <BtnRow>
          <CancelBtn
            type="button"
            onClick={() => {
              setModalType(null);
              setModalInput({ ko: "", en: "", name: "" });
            }}
          >
            취소
          </CancelBtn>
          <ConfirmBtn type="button" onClick={handleAddMasterItem}>
            추가하기
          </ConfirmBtn>
        </BtnRow>
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
  background-color: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 16px;
`;
const ModalBox = styled.div`
  background: white;
  padding: 24px;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;
const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 800;
  color: #0f172a;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 12px;
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
const Required = styled.span`
  color: #ef4444;
`;
const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
  &:focus {
    border-color: #0ea5e9;
    outline: none;
  }
`;
const BtnRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
`;
const CancelBtn = styled.button`
  background: #f1f5f9;
  color: #475569;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  &:hover {
    background: #e2e8f0;
  }
`;
const ConfirmBtn = styled.button`
  background: #0ea5e9;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  &:hover {
    background: #0284c7;
  }
`;
