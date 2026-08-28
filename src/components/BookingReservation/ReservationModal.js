import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { minsToTime } from "../../constants/BookingReservation/reservation";

export function ReservationModal({ state, actions }) {
  // 💡 기존 state에서 rooms 도 구조분해 할당으로 가져옵니다.
  const { draft, modalForm, currentDate, reservations, rooms } = state;
  const { setIsModalOpen, setModalForm, submitReservation } = actions;

  const localDateString = `${currentDate.getFullYear()}-${String(
    currentDate.getMonth() + 1,
  ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;

  const formattedDate = `${currentDate.getFullYear()}. ${String(
    currentDate.getMonth() + 1,
  ).padStart(2, "0")}. ${String(currentDate.getDate()).padStart(2, "0")}`;

  // 💡 [핵심 수정 1] 실제 데이터의 roomId를 추출하여 해당 회의실 예약 유무를 검사합니다.
  const targetRoomId = rooms[draft.roomIndex]?.brity_works_room_info_targetId;
  const isRoomOccupied = reservations.some((r) => r.roomId === targetRoomId);

  // 💡 [핵심 수정 2] 상수(ROOMS) 대신 실제 서버에서 받아온 회의실 이름을 렌더링합니다.
  const roomName = rooms[draft.roomIndex]?.brity_works_room_info_name;

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setModalForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const subjectInputRef = useRef(null);

  // 2. 컴포넌트 마운트 시 포커스 및 텍스트 전체 선택
  useEffect(() => {
    if (subjectInputRef.current) {
      subjectInputRef.current.select();
    }
  }, []);

  return (
    <ModalOverlay onClick={() => setIsModalOpen(false)}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>회의실 예약 세부 설정</ModalTitle>
          <CloseBtn onClick={() => setIsModalOpen(false)}>✕</CloseBtn>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <Label>회의 제목</Label>
            <Input
              ref={subjectInputRef}
              type="text"
              name="subject"
              placeholder="예: 주간 회의"
              value={modalForm.subject || ""}
              onChange={handleFormChange}
              autoFocus
            />
          </FormGroup>

          <FormGroup>
            <Label>선택된 회의실 및 시간</Label>
            <TimeInfoBox>
              <RoomTag>{roomName}</RoomTag>

              {modalForm.isAllDay ? (
                <DateRangeWrapper>
                  <TimeText>{formattedDate}</TimeText>
                  <span className="tilde">~</span>
                  <DateInput
                    type="date"
                    name="endDate"
                    min={localDateString}
                    value={modalForm.endDate || localDateString}
                    onChange={handleFormChange}
                  />
                  <Badge>종일</Badge>
                </DateRangeWrapper>
              ) : (
                <TimeText>
                  {formattedDate} {minsToTime(draft.startMin)} ~{" "}
                  {minsToTime(draft.endMin)}
                </TimeText>
              )}
            </TimeInfoBox>
          </FormGroup>

          <ToggleGroup>
            {/* 💡 isRoomOccupied 상태에 따라 비활성화 처리됨 */}
            <CheckboxLabel $disabled={isRoomOccupied}>
              <input
                type="checkbox"
                name="isAllDay"
                checked={modalForm.isAllDay || false}
                disabled={isRoomOccupied}
                onChange={handleFormChange}
              />
              <span>종일 모드로 예약 (00:00 - 24:00)</span>
              {isRoomOccupied && (
                <WarningText>
                  해당 일자에 이미 다른 예약이 있어 종일 예약이 불가합니다.
                </WarningText>
              )}
            </CheckboxLabel>

            {/* <CheckboxLabel>
              <input
                type="checkbox"
                name="sendEmail"
                checked={modalForm.sendEmail || false}
                onChange={handleFormChange}
              />
              <span>참석자 및 관련자에게 메일 발송</span>
            </CheckboxLabel> */}
          </ToggleGroup>

          {modalForm.sendEmail && (
            <EmailExpandSection>
              <FormGroup>
                <Label>참석자 이메일</Label>
                <Input
                  type="text"
                  name="attendees"
                  placeholder="이메일 주소를 쉼표(,)로 구분하여 입력하세요"
                  value={modalForm.attendees || ""}
                  onChange={handleFormChange}
                />
              </FormGroup>
              <FormGroup>
                <Label>메일 내용 (Editor)</Label>
                <EditorPlaceholder>
                  <div className="toolbar">
                    <span>B</span> <span>I</span> <span>U</span> |{" "}
                    <span>🔗</span> <span>📷</span>
                  </div>
                  <textarea
                    name="emailContent"
                    placeholder="회의 안건 및 상세 내용을 입력하세요..."
                    value={modalForm.emailContent || ""}
                    onChange={handleFormChange}
                  />
                </EditorPlaceholder>
              </FormGroup>
            </EmailExpandSection>
          )}
        </ModalBody>

        <ModalFooter>
          <Button onClick={() => setIsModalOpen(false)}>취소</Button>
          <Button $primary onClick={submitReservation}>
            예약 확정
          </Button>
        </ModalFooter>
      </ModalContainer>
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
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  animation: fadeIn 0.2s ease;
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContainer = styled.div`
  background: #ffffff;
  width: 480px;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-height: 90vh;
  animation: slideUp 0.2s ease;
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ModalHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
`;
const CloseBtn = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #94a3b8;
  cursor: pointer;
  &:hover {
    color: #0f172a;
  }
`;

const ModalBody = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
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
  color: #334155;
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 1rem;
  color: #1e293b;
  outline: none;
  transition: border-color 0.2s;
  &:focus {
    border-color: #0ea5e9;
    box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.15);
  }
  &::placeholder {
    color: #94a3b8;
  }
`;

const TimeInfoBox = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
`;
const RoomTag = styled.span`
  background: #e0f2fe;
  color: #0369a1;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 700;
`;
const TimeText = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: #1e293b;
`;

const DateRangeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  .tilde {
    color: #64748b;
    font-weight: bold;
  }
`;

const DateInput = styled.input`
  padding: 4px 8px;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #1e293b;
  outline: none;
  cursor: pointer;
  &:focus {
    border-color: #0ea5e9;
  }
`;

const Badge = styled.span`
  background: #0ea5e9;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
`;

const ToggleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 4px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  font-size: 0.95rem;
  color: ${(props) => (props.$disabled ? "#94a3b8" : "#334155")};
  flex-wrap: wrap;
  input {
    width: 18px;
    height: 18px;
    accent-color: #0ea5e9;
    cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  }
`;

const WarningText = styled.div`
  width: 100%;
  font-size: 0.8rem;
  color: #ef4444;
  margin-left: 28px;
  margin-top: -4px;
`;

const EmailExpandSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 8px;
  padding-top: 20px;
  border-top: 1px dashed #e2e8f0;
  animation: expandDown 0.3s ease;
  @keyframes expandDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const EditorPlaceholder = styled.div`
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .toolbar {
    background: #f1f5f9;
    padding: 8px 12px;
    border-bottom: 1px solid #cbd5e1;
    display: flex;
    gap: 12px;
    color: #475569;
    font-weight: bold;
    font-size: 0.9rem;
    cursor: pointer;
    span:hover {
      color: #0ea5e9;
    }
  }
  textarea {
    width: 100%;
    height: 120px;
    padding: 12px;
    border: none;
    outline: none;
    font-size: 0.95rem;
    font-family: inherit;
    color: #1e293b;
    resize: none;
    box-sizing: border-box;
    &::placeholder {
      color: #94a3b8;
    }
  }
`;

const ModalFooter = styled.div`
  padding: 16px 24px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;
const Button = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  ${(props) =>
    props.$primary
      ? `background: #0EA5E9; color: white; border: none; &:hover { background: #0284C7; }`
      : `background: #FFFFFF; color: #475569; border: 1px solid #CBD5E1; &:hover { background: #F1F5F9; color: #0F172A; }`}
`;
