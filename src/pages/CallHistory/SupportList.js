import React from "react";
import styled from "styled-components";
import moment from "moment";

export default function SupportList({ state, actions }) {
  const { logs, selectedMonth, isValidTeam } = state;
  const { setSelectedMonth, handleCopyLog } = actions;

  const handlePrevMonth = () => {
    const prev = moment(selectedMonth + ".01", "YYYY. MM.DD")
      .subtract(1, "month")
      .format("YYYY. MM");
    setSelectedMonth(prev);
  };

  const handleNextMonth = () => {
    const next = moment(selectedMonth + ".01", "YYYY. MM.DD")
      .add(1, "month")
      .format("YYYY. MM");
    setSelectedMonth(next);
  };

  return (
    <Container>
      <ListHeader>
        <ListTitle>내 대응 이력 목록</ListTitle>

        {isValidTeam && (
          <MonthNavigator>
            <NavBtn onClick={handlePrevMonth}>&lt;</NavBtn>
            <CurrentMonth>{selectedMonth}</CurrentMonth>
            <NavBtn onClick={handleNextMonth}>&gt;</NavBtn>
          </MonthNavigator>
        )}
      </ListHeader>

      {!isValidTeam ? (
        <WarningWrapper>
          <WarningTitle>⚠️ 팀 미등록 상태</WarningTitle>
          <WarningSub>
            관리자 페이지에서 팀 등록을 먼저 완료해주세요.
          </WarningSub>
        </WarningWrapper>
      ) : logs.length === 0 ? (
        <EmptyWrapper>
          <EmptyTitle>
            {selectedMonth}에 등록된 내 대응 이력이 없습니다.
          </EmptyTitle>
          <EmptySub>상단 폼을 통해 새로운 이력을 기록하세요.</EmptySub>
        </EmptyWrapper>
      ) : (
        <GridContainer>
          {logs.map((log) => (
            <LogCard key={log.id}>
              <CategoryBadge>{log.category}</CategoryBadge>

              <CardHeader>
                <CompanyText>{log.company_name}</CompanyText>
                <DateText>{log.response_date}</DateText>
              </CardHeader>

              <CardBody>
                <InfoRow>
                  <InfoLabel>사이트</InfoLabel>
                  <InfoValue>{log.site_name}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>장비 모델</InfoLabel>
                  <InfoValue $bold>{log.equipment_name}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>고객사 담당자</InfoLabel>
                  <InfoValue>{log.customer_contact}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>지원 시간</InfoLabel>
                  <InfoValue>
                    {log.start_time} ~ {log.end_time} (24h)
                  </InfoValue>
                </InfoRow>
                <Divider />
                <ContentBox>{log.content}</ContentBox>
              </CardBody>

              <CardFooter>
                <ResponderText>대응자: {log.responder}</ResponderText>
                <CopyBtn onClick={() => handleCopyLog(log)}>
                  📋 내용 복사
                </CopyBtn>
              </CardFooter>
            </LogCard>
          ))}
        </GridContainer>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const ListHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
`;
const ListTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
`;
const MonthNavigator = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  background: #f8fafc;
  padding: 6px 16px;
  border-radius: 30px;
  border: 1px solid #e2e8f0;
`;
const CurrentMonth = styled.div`
  font-size: 1rem;
  font-weight: 800;
  color: #0f172a;
  min-width: 80px;
  text-align: center;
`;
const NavBtn = styled.button`
  background: white;
  border: 1px solid #cbd5e1;
  color: #475569;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: 800;
  font-size: 1rem;
  transition: all 0.2s ease;
  &:hover {
    background: #e0f2fe;
    color: #0284c7;
    border-color: #bae6fd;
  }
`;
const WarningWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  min-height: 250px;
  gap: 12px;
  text-align: center;
`;
const WarningTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 800;
  color: #ef4444;
`;
const WarningSub = styled.div`
  font-size: 0.9rem;
  color: #991b1b;
  line-height: 1.5;
`;
const EmptyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  min-height: 250px;
  gap: 8px;
`;
const EmptyTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #475569;
`;
const EmptySub = styled.div`
  font-size: 0.9rem;
  color: #94a3b8;
`;
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
const LogCard = styled.div`
  position: relative;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08);
  }
`;
const CategoryBadge = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background-color: #0ea5e9;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 800;
  padding: 6px 14px;
  border-bottom-left-radius: 12px;
`;
const CardHeader = styled.div`
  padding: 24px 20px 12px 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const CompanyText = styled.div`
  font-size: 1.35rem;
  font-weight: 800;
  color: #0f172a;
`;
const DateText = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
`;
const CardBody = styled.div`
  padding: 0 20px 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
`;
const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
`;
const InfoLabel = styled.span`
  color: #94a3b8;
  font-weight: 600;
`;
const InfoValue = styled.span`
  color: #1e293b;
  font-weight: ${(props) => (props.$bold ? "700" : "500")};
`;
const Divider = styled.hr`
  border: none;
  border-top: 1px solid #f1f5f9;
  margin: 6px 0;
`;
const ContentBox = styled.div`
  background-color: #f8fafc;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #334155;
  line-height: 1.4;
`;
const CardFooter = styled.div`
  padding: 12px 20px;
  background-color: #f8fafc;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const ResponderText = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: #64748b;
`;
const CopyBtn = styled.button`
  background: #e0f2fe;
  color: #0284c7;
  border: none;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  &:hover {
    background: #bae6fd;
  }
`;
