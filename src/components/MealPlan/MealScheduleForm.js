import React from "react";
import styled from "styled-components";

export default function MealScheduleForm({ state, actions }) {
  return (
    <>
      <FormWrapper onSubmit={actions.handleSubmitClick}>
        <SectionCard>
          <SectionTitle>INSERT 쿼리 직접 입력</SectionTitle>
          <FormGroup>
            <Label>SQL Query</Label>
            <CodeTextArea
              value={state.sqlQuery}
              onChange={actions.handleQueryChange}
              placeholder="여기에 데이터를 붙여넣으세요..."
              rows={15}
            />
          </FormGroup>
          <ButtonGroup>
            <CancelButton type="button" onClick={actions.handleReset}>
              초기화
            </CancelButton>
            <PrimaryBtn type="submit">쿼리 실행 및 등록</PrimaryBtn>
          </ButtonGroup>
        </SectionCard>
      </FormWrapper>

      {/* --- 이메일 인증 모달 --- */}
      {state.isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>관리자 인증</ModalTitle>
            <ModalDesc>보안을 위해 사내 이메일 인증을 진행해주세요.</ModalDesc>

            <FormGroup style={{ marginBottom: "16px" }}>
              <Label>이메일 아이디</Label>
              <InputRow>
                <EmailInputWrapper>
                  <Input
                    type="text"
                    value={state.emailId}
                    onChange={actions.handleEmailChange}
                    placeholder="이메일 아이디"
                    disabled={state.isCodeSent}
                  />
                  <DomainText>{state.DOMAIN}</DomainText>
                </EmailInputWrapper>
                <AuthBtn
                  type="button"
                  onClick={actions.handleSendCode}
                  disabled={state.isCodeSent && state.timeLeft !== "00:00"}
                >
                  {state.isCodeSent ? "재발송" : "코드 발송"}
                </AuthBtn>
              </InputRow>
            </FormGroup>

            {state.isCodeSent && (
              <FormGroup>
                <Label>인증 번호 (6자리)</Label>
                <InputRow>
                  <CodeInputWrapper>
                    <Input
                      type="text"
                      maxLength={6}
                      value={state.authCode}
                      onChange={actions.handleCodeChange}
                      placeholder="000000"
                    />
                    <TimerText isDanger={state.timeLeft === "00:00"}>
                      {state.timeLeft}
                    </TimerText>
                  </CodeInputWrapper>
                </InputRow>
              </FormGroup>
            )}

            <ButtonGroup style={{ marginTop: "32px" }}>
              <CancelButton type="button" onClick={actions.closeModal}>
                취소
              </CancelButton>
              <PrimaryBtn
                type="button"
                onClick={actions.handleVerifyAndSubmit}
                disabled={!state.isCodeSent}
              >
                인증 및 전송
              </PrimaryBtn>
            </ButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
}

// --- 기존 Styled Components (생략: 위에서 제공하신 코드 유지) ---
const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;
const SectionCard = styled.div`
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
`;
const SectionTitle = styled.h3`
  margin: 0 0 24px 0;
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
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 700;
  color: #475569;
`;
const CodeTextArea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  padding: 16px;
  font-size: 0.95rem;
  font-family: "D2Coding", "Fira Code", Consolas, monospace;
  line-height: 1.6;
  color: #f8fafc;
  background-color: #0f172a;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  resize: vertical;
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  &::placeholder {
    color: #64748b;
  }
  &:focus {
    border-color: #0ea5e9;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.2);
  }
`;
const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;
const CancelButton = styled.button`
  background-color: #f1f5f9;
  color: #475569;
  font-size: 0.95rem;
  font-weight: 700;
  border: 1px solid #cbd5e1;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background-color: #e2e8f0;
    color: #1e293b;
  }
`;
const PrimaryBtn = styled.button`
  background-color: #0ea5e9;
  color: white;
  border: none;
  padding: 12px 32px;
  font-size: 0.95rem;
  font-weight: 700;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background-color: #0284c7;
    box-shadow: 0 4px 6px rgba(14, 165, 233, 0.2);
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0);
  }
  &:disabled {
    background-color: #94a3b8;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
`;

// --- 모달 전용 Styled Components 추가 ---
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;
const ModalContent = styled.div`
  background-color: white;
  padding: 32px;
  border-radius: 12px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;
const ModalTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
`;
const ModalDesc = styled.p`
  margin: 0 0 24px 0;
  font-size: 0.9rem;
  color: #64748b;
`;
const InputRow = styled.div`
  display: flex;
  gap: 8px;
`;
const Input = styled.input`
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.95rem;
  outline: none;
  &:focus {
    border-color: #0ea5e9;
  }
  &:disabled {
    background-color: #f1f5f9;
    color: #94a3b8;
  }
`;
const EmailInputWrapper = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  overflow: hidden;
  &:focus-within {
    border-color: #0ea5e9;
  }
  ${Input} {
    border: none;
    border-radius: 0;
  }
`;
const DomainText = styled.span`
  background-color: #f8fafc;
  padding: 0 12px;
  color: #64748b;
  font-size: 0.9rem;
  height: 100%;
  display: flex;
  align-items: center;
  border-left: 1px solid #cbd5e1;
`;
const CodeInputWrapper = styled.div`
  position: relative;
  width: 100%;
`;
const TimerText = styled.span`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.9rem;
  font-weight: 700;
  color: ${(props) => (props.isDanger ? "#ef4444" : "#0ea5e9")};
`;
const AuthBtn = styled.button`
  background-color: #f8fafc;
  color: #0f172a;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 0 16px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  white-space: nowrap;
  &:hover:not(:disabled) {
    background-color: #e2e8f0;
  }
  &:disabled {
    color: #94a3b8;
    cursor: not-allowed;
  }
`;
