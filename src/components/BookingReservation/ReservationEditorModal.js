import React, { useState } from "react";
import styled from "styled-components";
import moment from "moment";
import { useToast } from "../../constants/Toast/ToastContext";

export function ReservationEditModal({ state, actions }) {
  const { showToast } = useToast();
  const { selectedReservation, rooms } = state;
  const { closeEditModal, submitEditReservation } = actions;

  const [form, setForm] = useState({
    subject: selectedReservation?.subject || "",
  });

  if (!selectedReservation) return null;

  const roomInfo = rooms.find(
    (r) => r.brity_works_room_info_targetId === selectedReservation.roomId,
  );
  const roomName = roomInfo
    ? roomInfo.brity_works_room_info_name
    : "알 수 없는 회의실";

  const displayDate = moment(selectedReservation.startTime).format(
    "YYYY. MM. DD. (ddd)",
  );
  const displayTime = `${moment(selectedReservation.startTime).format("HH:mm")} ~ ${moment(selectedReservation.endTime).format("HH:mm")}`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (!form.subject.trim()) {
      showToast("회의 제목을 입력해 주세요.", "error");
      return;
    }

    const updatedData = {
      ...selectedReservation,
      subject: form.subject,
    };

    submitEditReservation(updatedData);
  };

  return (
    <Overlay>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>예약 수정</Title>
          <CloseTextBtn onClick={closeEditModal}>✕ 닫기</CloseTextBtn>
        </Header>

        <Body>
          <FormGrid>
            <GridRow>
              <Label>회의실</Label>
              <ValueText>{roomName}</ValueText>
            </GridRow>

            <GridRow>
              <Label>회의 제목</Label>
              <Input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="회의 제목을 입력하세요"
                autoFocus
              />
            </GridRow>

            <GridRow>
              <Label>시간 설정</Label>
              {/* 💡 입력(Input) 대신 고정된 텍스트(ValueText)로 렌더링 */}
              <TimeValueText>
                <span className="date-part">{displayDate}</span>
                <span className="time-part">{displayTime}</span>
              </TimeValueText>
            </GridRow>

            {/* 💡 종일 모드 체크박스 레이아웃 완전히 제거 */}
          </FormGrid>
        </Body>

        <Footer>
          <Button onClick={closeEditModal}>취소</Button>
          <Button $primary onClick={handleSave}>
            수정 완료
          </Button>
        </Footer>
      </ModalBox>
    </Overlay>
  );
}

// --- Styled Components ---

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
  box-sizing: border-box;
`;

const ModalBox = styled.div`
  background: #ffffff;
  width: 100%;
  max-width: 500px;
  border-radius: 12px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
`;

const CloseTextBtn = styled.button`
  background: none;
  border: none;
  font-size: 0.9rem;
  font-weight: 700;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s;
  &:hover {
    color: #0f172a;
  }
`;

const Body = styled.div`
  padding: 24px;
  background: #f8fafc;
`;

const FormGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const GridRow = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 8px;
    align-items: flex-start;
  }
`;

const Label = styled.div`
  font-size: 0.9rem;
  font-weight: 700;
  color: #475569;
  text-align: left;
`;

const ValueText = styled.div`
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e293b;
  background: #ffffff;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
`;

/* 💡 시간 고정 표시용 스타일 추가 */
const TimeValueText = styled(ValueText)`
  display: flex;
  gap: 12px;
  background: #f1f5f9; /* 수정 불가함을 직관적으로 보여주기 위해 회색빛 배경 적용 */
  color: #334155;
  border-color: #cbd5e1;

  .date-part {
    font-weight: 700;
  }
  .time-part {
    color: #0ea5e9; /* 시간 부분만 스카이블루로 강조 */
    font-weight: 800;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 4px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.95rem;
  color: #1e293b;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
  font-family: inherit;

  &:focus {
    border-color: #0ea5e9;
    box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.15);
  }
  &::placeholder {
    color: #94a3b8;
  }
`;

const Footer = styled.div`
  padding: 16px 24px;
  background: #ffffff;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;

  ${(props) =>
    props.$primary
      ? `background: #0EA5E9; color: white; border: none; box-shadow: 0 2px 4px rgba(14, 165, 233, 0.2); &:hover { background: #0284C7; }`
      : `background: #FFFFFF; color: #475569; border: 1px solid #CBD5E1; &:hover { background: #F1F5F9; color: #0F172A; }`}
`;
