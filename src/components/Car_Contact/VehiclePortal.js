import React, { useState } from "react";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

export default function VehiclePortal() {
  const [activeStep, setActiveStep] = useState(1);
  const [checklist, setChecklist] = useState({
    step1: false,
    step2: false,
    step3: false,
    step4: false,
  });

  // 고정 연락처 정보 (회사의 실제 정보에 맞게 번호만 수정하세요)
  const info = {
    companyInsurance: "SK 렌터카", // 예: 삼성화재, 현대해상 등 회사 계약 보험사명
    insurancePhone: "1599-9111",
    companyManagerPhone: "+82-31-639-9031", // 사내 차량 관리자
  };

  const handleCall = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const toggleCheck = (key) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Wrapper>
      <Container>
        {/* 상단 타이틀 섹션 */}
        <HeaderSection>
          {/* <EmergencyBadge>법인차량 사고대응 매뉴얼</EmergencyBadge> */}
          <MainTitle>법인차량 사고대응 매뉴얼</MainTitle>
          <SubTitle>
            가장 먼저 비상등을 켜고, 안내에 따라 차분히 진행해 주세요.
          </SubTitle>
        </HeaderSection>

        {/* 1. 최우선 긴급 전화 (119 / 사내 담당자) */}
        <SectionTitle>🚨 긴급 연락망</SectionTitle>
        <HotlineGrid>
          <HotlineCard
            className="company"
            onClick={() => handleCall(info.companyManagerPhone)}
          >
            <span className="label">사내 차량 담당자</span>
            <span className="target font-small">사내 담당자 연결</span>
          </HotlineCard>
          <HotlineCard className="emergency" onClick={() => handleCall("119")}>
            <span className="label">인명 구조 및 긴급 신고 발생 시</span>
            <span className="target">119 구급대</span>
          </HotlineCard>
        </HotlineGrid>

        {/* 2. 회사 지정 계약 보험사 원터치 접수 */}
        <SectionTitle style={{ marginTop: "24px" }}>
          📞 회사 지정 렌터카 콜센터
        </SectionTitle>
        <InsuranceCard onClick={() => handleCall(info.insurancePhone)}>
          <InsuranceInfo>
            <div className="badge">렌터카 콜센터</div>
            <div className="name">{info.companyInsurance}</div>
          </InsuranceInfo>
          <DialAction>
            <span className="num">{info.insurancePhone}</span>
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
          </DialAction>
        </InsuranceCard>
        <NoticeGuideText>
          💡 콜센터 연결 후 <strong>ARS 1번(사고 접수)</strong>을 누르시면
          사고/고장 접수로 연결됩니다.
        </NoticeGuideText>

        {/* 3. 정밀 단계별 행동 요령 */}
        <SectionTitle style={{ marginTop: "32px" }}>
          💡 현장 대처 방법
        </SectionTitle>

        <StepDisplayCard>
          {activeStep === 1 && (
            <>
              {/* <StepNumberBadge>STEP 01</StepNumberBadge> */}
              <StepContentTitle>사고 접수 및 회사 보고</StepContentTitle>
              <StepDescription>
                <div>
                  위 상단의 <strong>[법인 차량 지정 콜센터]</strong> 버튼을
                  터치하여 실시간 사고 접수 및 현장 출동을 요청하세요.
                </div>{" "}
                사고 발생 일시, 장소, 경위를 설명한 뒤 출동 직원을 기다립니다.
                보험 접수가 완료되면 즉시{" "}
                <strong>[사내 차량 총괄] 담당자에게 유선 보고</strong>를 하고,
                현장 상황(견인 필요 여부 등)에 따른 지시를 받으세요.
              </StepDescription>
            </>
          )}
        </StepDisplayCard>

        {/* 4. 필수 증거 채증 체크리스트 */}
        <SectionTitle style={{ marginTop: "32px" }}>
          📸 사고 시, 현장 체크리스트
        </SectionTitle>
        <CheckListWrapper>
          <CheckRow
            isChecked={checklist.step1}
            onClick={() => toggleCheck("step1")}
          >
            <CustomBox isChecked={checklist.step1} />
            <CheckText>
              내 차량 및 상대 차량의 파손 부위 정밀 확대 촬영
            </CheckText>
          </CheckRow>
          <CheckRow
            isChecked={checklist.step2}
            onClick={() => toggleCheck("step2")}
          >
            <CustomBox isChecked={checklist.step2} />
            <CheckText>
              양측 차량 바퀴 조향(꺾인) 방향과 타이어 흔적 촬영
            </CheckText>
          </CheckRow>
          <CheckRow
            isChecked={checklist.step3}
            onClick={() => toggleCheck("step3")}
          >
            <CustomBox isChecked={checklist.step3} />
            <CheckText>
              도로 차선, 신호등, 주차선이 함께 보이도록 멀리서 촬영
            </CheckText>
          </CheckRow>
        </CheckListWrapper>
      </Container>
    </Wrapper>
  );
}

// --- Styled Components ---

const Wrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  background-color: #f8fafc;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  box-sizing: border-box;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

const Container = styled.div`
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  border-radius: 24px;
  padding: 32px 24px;
  box-sizing: border-box;
  box-shadow: 0 10px 25px rgba(148, 163, 184, 0.06);
  border: 1px solid #e2e8f0;
  animation: ${fadeIn} 0.4s ease-out;
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const EmergencyBadge = styled.span`
  background: #fee2e2;
  color: #ef4444;
  font-size: 11px;
  font-weight: 800;
  padding: 5px 12px;
  border-radius: 6px;
  letter-spacing: 0.5px;
  display: inline-block;
  margin-bottom: 10px;
`;

const MainTitle = styled.h1`
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 6px 0;
  letter-spacing: -0.5px;
`;

const SubTitle = styled.p`
  font-size: 13px;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
  word-break: keep-all;
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: #334155;
  margin: 24px 0 12px 0;
  letter-spacing: -0.2px;
`;

const HotlineGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const HotlineCard = styled.div`
  padding: 16px 14px;
  border-radius: 14px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: transform 0.1s;

  &:active {
    transform: scale(0.97);
  }

  .label {
    font-size: 11px;
    font-weight: 600;
    opacity: 0.8;
  }
  .target {
    font-size: 16px;
    font-weight: 700;
  }
  .font-small {
    font-size: 14.5px;
  }

  &.emergency {
    background: #fef2f2;
    color: #b91c1c;
    border: 1px solid #fecaca;
  }

  &.company {
    background: #eff6ff;
    color: #1d4ed8;
    border: 1px solid #bfdbfe;
  }
`;

const InsuranceCard = styled.div`
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  color: #ffffff;
  border-radius: 16px;
  padding: 18px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
  transition: transform 0.15s ease;

  &:active {
    transform: scale(0.98);
  }
`;

const InsuranceInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  .badge {
    font-size: 10px;
    background: rgba(255, 255, 255, 0.15);
    color: #94a3b8;
    padding: 2px 6px;
    border-radius: 4px;
    width: fit-content;
    font-weight: 600;
  }
  .name {
    font-size: 18px;
    font-weight: 800;
    letter-spacing: -0.3px;
  }
`;

const DialAction = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #3b82f6;
  padding: 10px 14px;
  border-radius: 12px;

  .num {
    font-size: 14px;
    font-weight: 700;
  }
`;

const StepBar = styled.div`
  display: flex;
  background: #cbd5e1;
  padding: 3px;
  border-radius: 10px;
  margin-bottom: 12px;
`;

const StepTab = styled.button`
  flex: 1;
  padding: 10px 0;
  font-size: 13px;
  font-weight: 700;
  border: none;
  border-radius: 7px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${(props) => (props.isActive ? "#ffffff" : "transparent")};
  color: ${(props) => (props.isActive ? "#0f172a" : "#475569")};
  box-shadow: ${(props) =>
    props.isActive ? "0 2px 4px rgba(0,0,0,0.06)" : "none"};
`;

const StepDisplayCard = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 20px;
  min-height: 160px;
`;

const StepNumberBadge = styled.span`
  font-size: 9px;
  font-weight: 800;
  color: #1d4ed8;
  background: #dbeafe;
  padding: 3px 8px;
  border-radius: 4px;
  letter-spacing: 0.5px;
`;

const StepContentTitle = styled.h4`
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 10px 0 8px 0;
  letter-spacing: -0.3px;
`;

const StepDescription = styled.p`
  font-size: 13px;
  color: #334155;
  line-height: 1.6;
  margin: 0;
  word-break: keep-all;

  strong {
    color: #ef4444;
    font-weight: 700;
  }
  em {
    font-style: normal;
    color: #475569;
    font-size: 12px;
    display: block;
    margin-top: 6px;
  }
`;

const CheckListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CheckRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: #ffffff;
  border: 1px solid ${(props) => (props.isChecked ? "#e2e8f0" : "#cbd5e1")};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #f8fafc;
  }
`;

const CustomBox = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 2px solid ${(props) => (props.isChecked ? "#22c55e" : "#cbd5e1")};
  background: ${(props) => (props.isChecked ? "#22c55e" : "#ffffff")};
  position: relative;
  flex-shrink: 0;

  &::after {
    content: "";
    position: absolute;
    display: ${(props) => (props.isChecked ? "block" : "none")};
    left: 4px;
    top: 1px;
    width: 4px;
    height: 7px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
`;

const CheckText = styled.span`
  font-size: 12.5px;
  color: #334155;
  line-height: 1.4;
`;

const Footer = styled.p`
  font-size: 11px;
  color: #94a3b8;
  text-align: center;
  margin: 28px 0 0 0;
`;
const ARSHint = styled.span`
  font-size: 11px;
  background-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  padding: 3px 8px;
  border-radius: 6px;
  font-weight: 600;
  margin-right: 4px;
  letter-spacing: -0.3px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const NoticeGuideText = styled.p`
  font-size: 12.5px;
  color: #475569;
  background-color: #f1f5f9;
  padding: 12px 16px;
  border-radius: 10px;
  margin: 10px 0 0 0;
  line-height: 1.5;
  word-break: keep-all;

  strong {
    color: #2563eb;
    font-weight: 700;
  }
`;
