import React, { createContext, useContext, useState, useCallback } from "react";
import styled, { keyframes } from "styled-components";

const ToastContext = createContext();

let toastIdCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // 토스트 추가 함수 (type: 'success' | 'error')
  const showToast = useCallback((message, type = "success") => {
    const id = toastIdCounter++;
    setToasts((prev) => [...prev, { id, message, type }]);

    // 3초 후 자동으로 사라짐
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 6000);
  }, []);

  // 클릭 시 즉시 닫기
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer>
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            $type={toast.type}
            onClick={() => removeToast(toast.id)}
          >
            {toast.message}
          </ToastItem>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}

// 💡 전역에서 쉽게 토스트를 호출하기 위한 커스텀 훅
export const useToast = () => useContext(ToastContext);

// --- Styled Components ---

const slideDown = keyframes`
  0% { opacity: 0; transform: translateY(-30px) scale(0.95); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: 32px; /* 상단에서 약간 떨어진 위치 */
  left: 50%;
  transform: translateX(-50%); /* 정확히 중앙 정렬 */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  z-index: 9999;
  pointer-events: none; /* 토스트 밖의 화면은 클릭 가능하게 설정 */
`;

/* 💡 아이콘 없이 색상과 선 굵기로만 승부하는 엔터프라이즈 디자인 */
const ToastItem = styled.div`
  pointer-events: auto; /* 토스트 자체는 클릭 가능 */
  min-width: 320px;
  text-align: center;
  padding: 16px 24px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  animation: ${slideDown} 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  transition: all 0.2s ease;

  /* 타입에 따른 색상 변경 로직 */
  ${(props) =>
    props.$type === "success"
      ? `
        background-color: #F0FDF4; /* 아주 연한 에메랄드(성공) 배경 */
        color: #15803D; /* 짙은 에메랄드 텍스트 */
        border: 1px solid #BBF7D0;
        border-left: 6px solid #10B981; /* 시선을 끄는 포인트 라인 */
      `
      : `
        background-color: #FEF2F2; /* 아주 연한 빨강(실패/에러) 배경 */
        color: #B91C1C; /* 짙은 빨강 텍스트 */
        border: 1px solid #FECACA;
        border-left: 6px solid #EF4444; 
      `}

  &:hover {
    transform: scale(1.02);
  }
`;
