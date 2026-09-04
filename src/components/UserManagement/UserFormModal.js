import React from "react";
import styled from "styled-components";

export default function UserFormModal({ state, actions }) {
  if (!state.isModalOpen) return null;

  const { modalMode, formData } = state;
  const { closeModal, handleFormChange, handleSaveUser } = actions;

  return (
    <ModalOverlay>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {modalMode === "add" ? "신규 사용자 등록" : "사용자 정보 수정"}
          </ModalTitle>
          <CloseBtn onClick={closeModal}>✕</CloseBtn>
        </ModalHeader>
        <form onSubmit={handleSaveUser}>
          <ModalBody>
            <FormGroup>
              <Label>이메일 (로그인 ID)</Label>
              <Input
                type="email"
                name="brity_works_user_info_id"
                value={formData.brity_works_user_info_id}
                onChange={handleFormChange}
                placeholder="user@disco.co.jp"
                required
                disabled={modalMode === "edit"}
              />
              {modalMode === "add" && (
                <HelpText>
                  ※ 등록 후 초기 비밀번호는 '1234' 로 설정됩니다.
                </HelpText>
              )}
            </FormGroup>

            <FormGroup>
              <Label>이름</Label>
              <Input
                type="text"
                name="brity_works_user_info_name"
                value={formData.brity_works_user_info_name}
                onChange={handleFormChange}
                placeholder="홍길동"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>팀명</Label>
              <Input
                type="text"
                name="brity_works_user_info_token"
                value={formData.brity_works_user_info_token}
                onChange={handleFormChange}
                placeholder="예: 영업 1팀"
                required
              />
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <CancelBtn type="button" onClick={closeModal}>
              취소
            </CancelBtn>
            <PrimaryBtn type="submit">
              {modalMode === "add" ? "등록 완료" : "수정 완료"}
            </PrimaryBtn>
          </ModalFooter>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
}

// --- Styled Components ---
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
`;
const ModalContent = styled.div`
  background: #ffffff;
  width: 100%;
  max-width: 400px;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;
const ModalHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8fafc;
`;
const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 800;
  color: #0f172a;
`;
const CloseBtn = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #64748b;
  cursor: pointer;
`;
const ModalBody = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;
const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 700;
  color: #334155;
`;
const Input = styled.input`
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  outline: none;
  font-family: inherit;
  font-size: 0.95rem;
  background-color: ${(props) => (props.disabled ? "#f1f5f9" : "#ffffff")};
  &:focus {
    border-color: ${(props) => (props.disabled ? "#cbd5e1" : "#0ea5e9")};
    box-shadow: ${(props) =>
      props.disabled ? "none" : "0 0 0 3px rgba(14,165,233,0.1)"};
  }
`;
const HelpText = styled.div`
  font-size: 0.75rem;
  color: #0ea5e9;
  font-weight: 600;
  margin-top: 2px;
`;
const ModalFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
  background-color: #f8fafc;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;
const CancelBtn = styled.button`
  background: #ffffff;
  border: 1px solid #cbd5e1;
  padding: 10px 20px;
  font-weight: 700;
  color: #475569;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: #f1f5f9;
  }
`;
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
  }
`;
