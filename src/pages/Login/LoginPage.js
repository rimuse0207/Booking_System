import React from "react";
import styled from "styled-components";
import { useLogin } from "../../hooks/Login/useLogin"; // 훅 경로에 맞게 수정해주세요.
import { COMPANY_NAME } from "../../constants";

export default function LoginPage() {
  const { state, actions } = useLogin();
  const { step, form, errorMsg, isLoading } = state;
  const { handleChange, handleLogin, handleChangePassword } = actions;

  return (
    <Container>
      <LoginCard>
        <Header>
          <Badge>{COMPANY_NAME}</Badge>
          <Title>
            {step === 1 ? "회의실 예약 로그인" : "비밀번호 변경 안내"}
          </Title>
          <Subtitle>
            {step === 1
              ? "회의실 예약 및 기타 사용을 위해서는 로그인이 필수 입니다."
              : "초기 비밀번호를 사용 중입니다. 안전한 사용을 위해 새 비밀번호를 설정해 주세요."}
          </Subtitle>
        </Header>

        <Form onSubmit={step === 1 ? handleLogin : handleChangePassword}>
          {step === 1 && (
            <>
              <FormGroup>
                <Label>이메일</Label>
                <Input
                  type="text"
                  name="userId"
                  value={form.userId}
                  onChange={handleChange}
                  placeholder="이메일을 입력하세요"
                  autoFocus
                />
              </FormGroup>
              <FormGroup>
                <Label>비밀번호</Label>
                <Input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="비밀번호를 입력하세요"
                />
              </FormGroup>
            </>
          )}

          {step === 2 && (
            <>
              <FormGroup>
                <Label>새 비밀번호</Label>
                <Input
                  type="password"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder="새 비밀번호 (8자리 이상)"
                  autoFocus
                />
              </FormGroup>
              <FormGroup>
                <Label>새 비밀번호 확인</Label>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="새 비밀번호를 다시 입력하세요"
                />
              </FormGroup>
            </>
          )}

          {errorMsg && <ErrorMessage>{errorMsg}</ErrorMessage>}

          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? "처리 중..."
              : step === 1
                ? "로그인"
                : "비밀번호 변경 및 로그인"}
          </Button>
        </Form>
      </LoginCard>
    </Container>
  );
}

// --- Styled Components ---

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f1f5f9;
  font-family: "Pretendard", sans-serif;
`;

const LoginCard = styled.div`
  width: 100%;
  max-width: 440px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 8px 10px -6px rgba(0, 0, 0, 0.1);
  padding: 48px 40px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    max-width: 90%;
    padding: 32px 24px;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 32px;
`;

const Badge = styled.div`
  background: #e0f2fe;
  color: #0369a1;
  font-size: 0.8rem;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 6px;
  margin-bottom: 16px;
  letter-spacing: 0.5px;
`;

const Title = styled.h1`
  margin: 0 0 8px 0;
  font-size: 1.75rem;
  font-weight: 800;
  color: #0f172a;
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.5;
  word-break: keep-all;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 700;
  color: #334155;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  font-size: 1rem;
  color: #1e293b;
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  box-sizing: border-box;
  transition: all 0.2s ease;
  font-family: inherit;

  &::placeholder {
    color: #94a3b8;
  }

  &:focus {
    outline: none;
    border-color: #0ea5e9;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.85rem;
  font-weight: 600;
  margin-top: -4px;
`;

/* 💡 개선된 스카이블루 테마 버튼 */
const Button = styled.button`
  width: 100%;
  padding: 14px;
  margin-top: 12px;
  background-color: #0ea5e9;
  color: #ffffff;
  font-size: 1.05rem;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow:
    0 4px 6px -1px rgba(14, 165, 233, 0.2),
    0 2px 4px -1px rgba(14, 165, 233, 0.1);
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #0284c7;
    box-shadow:
      0 6px 10px -1px rgba(14, 165, 233, 0.3),
      0 3px 6px -1px rgba(14, 165, 233, 0.2);
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
    box-shadow: 0 2px 4px -1px rgba(14, 165, 233, 0.2);
  }

  &:disabled {
    background-color: #94a3b8;
    box-shadow: none;
    transform: none;
    cursor: not-allowed;
  }
`;
