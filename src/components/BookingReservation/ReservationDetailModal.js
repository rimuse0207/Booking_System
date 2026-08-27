import React from "react";
import styled from "styled-components";
import moment from "moment";

export function ReservationDetailModal({ state, actions }) {
  const { selectedReservation, rooms, LoginInfo } = state;
  const { closeDetailModal, deleteReservation, editReservation } = actions;

  if (!selectedReservation) return null;

  // 매칭되는 회의실 이름 찾기
  const roomInfo = rooms.find(
    (r) => r.brity_works_room_info_targetId === selectedReservation.roomId,
  );
  const roomName = roomInfo
    ? roomInfo.brity_works_room_info_name
    : "알 수 없는 회의실";

  const isOwner = selectedReservation.ownerEmail === LoginInfo?.id;

  const dateStr = moment(selectedReservation.startTime).format(
    "YYYY년 MM월 DD일 (ddd)",
  );
  const timeStr =
    selectedReservation.allDayYn === "Y"
      ? "종일"
      : `${moment(selectedReservation.startTime).format("HH:mm")} - ${moment(selectedReservation.endTime).format("HH:mm")}`;

  return (
    <Overlay onClick={closeDetailModal}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <Header>
          <Badge>예약 상세</Badge>
          <CloseIcon onClick={closeDetailModal}>✕</CloseIcon>
        </Header>

        <Body>
          <Subject>{selectedReservation.subject}</Subject>

          <InfoList>
            {/* 아이콘 대신 깔끔한 텍스트 라벨 사용 */}
            <InfoItem>
              <InfoLabel>일시</InfoLabel>
              <InfoText>
                <div className="main">{dateStr}</div>
                <div className="sub">{timeStr}</div>
              </InfoText>
            </InfoItem>

            <InfoItem>
              <InfoLabel>장소</InfoLabel>
              <InfoText>
                <div className="main">{roomName}</div>
              </InfoText>
            </InfoItem>

            <InfoItem>
              <InfoLabel>예약자</InfoLabel>
              <InfoText>
                <div className="main">{selectedReservation.ownerName}</div>
              </InfoText>
            </InfoItem>
          </InfoList>
        </Body>

        <Footer>
          {isOwner ? (
            <>
              <DeleteBtn onClick={() => deleteReservation(selectedReservation)}>
                예약 삭제
              </DeleteBtn>
              <RightActions>
                <Button onClick={closeDetailModal}>닫기</Button>
                <Button
                  $primary
                  onClick={() => editReservation(selectedReservation)}
                >
                  수정
                </Button>
              </RightActions>
            </>
          ) : (
            <RightActions style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button $primary onClick={closeDetailModal}>
                확인
              </Button>
            </RightActions>
          )}
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
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalBox = styled.div`
  background: #ffffff;
  width: 400px;
  border-radius: 12px; /* 라운딩을 약간 줄여 모던한 느낌 강화 */
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: scaleUp 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  @keyframes scaleUp {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px 10px 24px;
`;

const Badge = styled.div`
  background: #e0f2fe;
  color: #0284c7;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
`;

const CloseIcon = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #94a3b8;
  cursor: pointer;
  transition: color 0.2s;
  &:hover {
    color: #0f172a;
  }
`;

const Body = styled.div`
  padding: 10px 24px 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Subject = styled.h2`
  margin: 0;
  font-size: 1.3rem;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.4;
  word-break: keep-all;
`;

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
`;

/* 💡 아이콘 대신 들어가는 텍스트 라벨 스타일 */
const InfoLabel = styled.div`
  width: 50px;
  flex-shrink: 0;
  font-size: 0.85rem;
  font-weight: 700;
  color: #64748b;
  margin-top: 2px;
`;

const InfoText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  .main {
    font-size: 0.95rem;
    font-weight: 600;
    color: #1e293b;
  }
  .sub {
    font-size: 0.85rem;
    color: #475569;
  }
`;

const Footer = styled.div`
  padding: 16px 24px;
  background: #ffffff;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RightActions = styled.div`
  display: flex;
  gap: 8px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  ${(props) =>
    props.$primary
      ? `background: #0EA5E9; color: white; border: none; box-shadow: 0 1px 2px rgba(14, 165, 233, 0.2); &:hover { background: #0284C7; }`
      : `background: #FFFFFF; color: #475569; border: 1px solid #CBD5E1; &:hover { background: #F8FAFC; color: #0F172A; }`}
`;

const DeleteBtn = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  padding: 8px 0;
  transition: color 0.2s;
  &:hover {
    color: #dc2626;
    text-decoration: underline;
  }
`;
