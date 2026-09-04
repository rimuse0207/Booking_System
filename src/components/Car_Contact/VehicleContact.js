import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { Request_Get_Axios } from "../../API/index";
import { useParams } from "react-router-dom";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export default function VehicleContact() {
  const { car_User_ID, car_Target_ID } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [etcPhoneNumber, setetcPhoneNumber] = useState("+82-31-639-9031");
  const [NowUserPhoneNumber, setNowUserPhoneNumber] =
    useState("+82-31-639-9031");
  const handleCall = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleSMS = (phoneNumber) => {
    const message = `[차량 연락] ${vehicle.plateNumber} 차량 관련으로 연락드립니다.`;
    window.location.href = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
  };

  useEffect(() => {
    Contact_Reservation_Axios();
  }, []);

  const Contact_Reservation_Axios = async () => {
    const result = await Request_Get_Axios("/CarInfo/Contact_Reservation", {
      car_Target_ID,
      car_User_ID,
    });

    if (result.status) {
      setVehicle(result.data.carInfos);
      if (result.data.gettingSuccess) {
        setNowUserPhoneNumber(result.data.result);
      } else {
        return;
      }
      return;
    }
  };

  return (
    <Wrapper>
      <Container>
        {/* 차량 정보 상단 카드 */}
        <VehicleHeader>
          <PlateNumber>{vehicle?.plateNumber}</PlateNumber>
          <ModelName>{vehicle?.modelName}</ModelName>
        </VehicleHeader>

        {/* 정중한 사과/양해 문구 (사과문 플러그) */}
        <ApologyCard>
          <ApologyTitle>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#E53E3E"
              strokeWidth="2.5"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            불편을 드려 죄송합니다
          </ApologyTitle>
          <ApologyText>
            아래 연락처로 연락해 주시면 신속하게 조치하겠습니다.
          </ApologyText>
        </ApologyCard>

        {/* 연락처 섹션 1: 현재 운전자 */}
        <ContactSection>
          <SectionLabel>1차 연락처 (현재 운전자)</SectionLabel>
          <ActionGroup>
            <CallButton onClick={() => handleCall(NowUserPhoneNumber)}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              전화 연결
            </CallButton>
            <SMSButton onClick={() => handleSMS(NowUserPhoneNumber)}>
              문자 발송
            </SMSButton>
          </ActionGroup>
        </ContactSection>

        {/* 연락처 섹션 2: 비상 연락망 */}
        <ContactSection>
          <SectionLabel className="manager">
            2차 비상 연락망 (차량 관리자)
          </SectionLabel>
          <DescriptionText>
            운전자와 연락이 닿지 않는 경우 아래 담당자에게 연락해 주세요.
          </DescriptionText>
          <ActionGroup>
            <CallButton
              className="secondary"
              onClick={() => handleCall(etcPhoneNumber)}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              담당자 전화 연결
            </CallButton>
          </ActionGroup>
        </ContactSection>

        <FooterText></FooterText>
      </Container>
    </Wrapper>
  );
}

// --- Styled Components ---

const Wrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  background-color: #f8f9fa;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

const Container = styled.div`
  width: 100%;
  max-width: 400px;
  background: #ffffff;
  border-radius: 28px;
  padding: 32px 24px;
  box-sizing: border-box;
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.04),
    0 1px 2px rgba(0, 0, 0, 0.02);
  border: 1px solid #edf2f7;
  animation: ${fadeIn} 0.4s ease-out;
`;

const VehicleHeader = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const PlateNumber = styled.h1`
  font-size: 32px;
  font-weight: 800;
  color: #1a202c;
  margin: 0 0 4px 0;
  letter-spacing: -0.5px;
`;

const ModelName = styled.p`
  font-size: 14px;
  color: #718096;
  font-weight: 500;
  margin: 0;
`;

const ApologyCard = styled.div`
  background: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 16px;
  padding: 18px;
  margin-bottom: 28px;
`;

const ApologyTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  color: #c53030;
  margin: 0 0 8px 0;
`;

const ApologyText = styled.p`
  font-size: 13px;
  color: #742a2a;
  line-height: 1.5;
  margin: 0;
  word-break: keep-all;
`;

const ContactSection = styled.div`
  margin-bottom: 24px;

  &:last-of-type {
    margin-bottom: 32px;
  }
`;

const SectionLabel = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: #4a5568;
  margin-bottom: 12px;
  letter-spacing: -0.2px;

  &.manager {
    color: #2b6cb0; /* 비상 연락망 차별화 컬러 */
  }
`;

const DescriptionText = styled.p`
  font-size: 12px;
  color: #718096;
  margin: -6px 0 12px 0;
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
`;

const CallButton = styled.button`
  flex: 2;
  height: 54px;
  border-radius: 14px;
  background-color: #1a202c;
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2d3748;
  }

  &.secondary {
    background-color: #ebf8ff;
    color: #2b6cb0;
    border: 1px solid #bee3f8;

    &:hover {
      background-color: #e6fffa;
      background-color: #e2e8f0;
      background-color: #bee3f8;
    }
  }
`;

const SMSButton = styled.button`
  flex: 1;
  height: 54px;
  border-radius: 14px;
  background-color: #ffffff;
  color: #4a5568;
  font-size: 15px;
  font-weight: 600;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f7fafc;
    border-color: #cbd5e0;
  }
`;

const FooterText = styled.p`
  font-size: 11px;
  color: #a0aec0;
  text-align: center;
  margin: 0;
  letter-spacing: -0.3px;
`;
