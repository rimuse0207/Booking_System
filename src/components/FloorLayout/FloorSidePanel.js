import React from "react";
import styled from "styled-components";
import moment from "moment";
import { STATUS_COLORS } from "../../constants/FloorLayout/FloorLayout";

export default function FloorSidePanel({
  selectedBoxData,
  isEditMode,
  selectedOffice,
  actions,
}) {
  const { updateBoxProperty, deleteBox } = actions;

  const handlePropChange = (e) => {
    if (!selectedBoxData) return;
    let { name, value, type } = e.target;
    if (type === "number") value = parseInt(value, 10) || 0;
    updateBoxProperty(selectedBoxData.id, name, value);
  };

  if (!selectedBoxData) {
    return (
      <SidePanel>
        <EmptyPanel>
          <EmptyText>
            도면에서 요소를 클릭하면
            <br />
            {isEditMode
              ? "속성을 편집할 수 있습니다."
              : "상세 정보가 표시됩니다."}
          </EmptyText>
        </EmptyPanel>
      </SidePanel>
    );
  }

  const selectedIdent = selectedBoxData.identifier?.toLowerCase() || "";
  const isSelectedDisable = selectedIdent.includes("disable");
  const isSelectedRoomOrEq =
    selectedIdent.includes("room") || selectedIdent.includes("equipment");

  return (
    <SidePanel>
      {isEditMode ? (
        // 💡 [편집 모드 폼]
        <>
          <PanelTitle>
            속성 편집 ({selectedOffice} {selectedBoxData.floor}층)
          </PanelTitle>
          <PropGrid>
            <PropLabel>너비 (W)</PropLabel>
            <PropInput
              type="number"
              name="width"
              value={selectedBoxData.width}
              onChange={handlePropChange}
              step="10"
            />
            <PropLabel>높이 (H)</PropLabel>
            <PropInput
              type="number"
              name="height"
              value={selectedBoxData.height}
              onChange={handlePropChange}
              step="10"
            />
          </PropGrid>
          <PanelDivider />

          {selectedBoxData.type === "user" ? (
            <>
              <NoticeText>
                ※ 이메일을 비워두면 '공석'으로 처리됩니다.
              </NoticeText>
              <PropGroup>
                <PropLabel>이메일 (Key 식별자)</PropLabel>
                <PropInput
                  type="email"
                  name="email"
                  value={selectedBoxData.email}
                  onChange={handlePropChange}
                  placeholder="user@dhk.co.kr"
                />
              </PropGroup>
              <PropGroup>
                <PropLabel>이름 (선택)</PropLabel>
                <PropInput
                  type="text"
                  name="name"
                  value={selectedBoxData.name}
                  onChange={handlePropChange}
                />
              </PropGroup>
              <PropGroup>
                <PropLabel>부서 (선택)</PropLabel>
                <PropInput
                  type="text"
                  name="department"
                  value={selectedBoxData.department}
                  onChange={handlePropChange}
                />
              </PropGroup>
            </>
          ) : (
            <>
              <NoticeText>
                ※ identifier에 disable, room, equipment를 포함하여 기능을
                설정하세요.
              </NoticeText>
              <PropGroup>
                <PropLabel>공간 이름 (표시용)</PropLabel>
                <PropInput
                  type="text"
                  name="label"
                  value={selectedBoxData.label}
                  onChange={handlePropChange}
                />
              </PropGroup>
              <PropGroup>
                <PropLabel>식별자 ID</PropLabel>
                <PropInput
                  type="text"
                  name="identifier"
                  value={selectedBoxData.identifier}
                  onChange={handlePropChange}
                />
              </PropGroup>
            </>
          )}
          <DeleteBtn onClick={() => deleteBox(selectedBoxData.id)}>
            이 요소 삭제하기
          </DeleteBtn>
        </>
      ) : (
        // 💡 [일반 모드 정보 뷰]
        <>
          <PanelTitle>상세 정보</PanelTitle>
          <PanelDivider />
          {selectedBoxData.type === "user" ? (
            <ViewInfoWrapper>
              <ProfileAvatar>
                {selectedBoxData.name ? "DHKS" : ""}
              </ProfileAvatar>
              <ViewName>{selectedBoxData.name || "공석"}</ViewName>
              <ViewEmail>
                {selectedBoxData.email || "이메일 정보 없음"}
              </ViewEmail>
              <InfoTable>
                <InfoRow>
                  <InfoLabel>부서</InfoLabel>
                  <InfoValue>{selectedBoxData.department || "-"}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>현재 상태</InfoLabel>
                  <StatusBadge
                    $color={
                      selectedBoxData.email
                        ? STATUS_COLORS[selectedBoxData.status] ||
                          STATUS_COLORS["공석"]
                        : STATUS_COLORS["공석"]
                    }
                  >
                    {selectedBoxData.email ? selectedBoxData.status : "공석"}
                  </StatusBadge>
                </InfoRow>

                {selectedBoxData.status === "연차" && (
                  <InfoRow>
                    <InfoLabel>연차 기간</InfoLabel>
                    <InfoValue>
                      {selectedBoxData.start_date || "-"} ~<br />
                      {selectedBoxData.end_date || "-"}
                    </InfoValue>
                  </InfoRow>
                )}
                {(selectedBoxData.status === "외근" ||
                  selectedBoxData.status === "해외출장") && (
                  <>
                    <InfoRow>
                      <InfoLabel>복귀 예정</InfoLabel>
                      <InfoValue>{selectedBoxData.end_date || "-"}</InfoValue>
                    </InfoRow>
                    <InfoRow>
                      <InfoLabel>고객사</InfoLabel>
                      <InfoValue>{selectedBoxData.custom || "-"}</InfoValue>
                    </InfoRow>
                    <InfoRow>
                      <InfoLabel>안건</InfoLabel>
                      <InfoValue>
                        {selectedBoxData.description || "-"}
                      </InfoValue>
                    </InfoRow>
                    <InfoRow>
                      <InfoLabel>동행자</InfoLabel>
                      <InfoValue>{selectedBoxData.companion || "-"}</InfoValue>
                    </InfoRow>
                  </>
                )}
              </InfoTable>
            </ViewInfoWrapper>
          ) : (
            <ViewInfoWrapper>
              <ViewName>{selectedBoxData.label}</ViewName>
              <ViewEmail>{selectedBoxData.identifier}</ViewEmail>
              {!isSelectedDisable &&
                isSelectedRoomOrEq &&
                (() => {
                  let currentIsOccupied = false;
                  let currentOccupant = "";
                  let currentEndTime = "";
                  if (selectedBoxData.reservations?.length > 0) {
                    const activeRes = selectedBoxData.reservations.find((res) =>
                      moment().isBetween(
                        moment(res.startTime),
                        moment(res.endTime),
                        null,
                        "[)",
                      ),
                    );
                    if (activeRes) {
                      currentIsOccupied = true;
                      currentOccupant = activeRes.ownerName;
                      currentEndTime = moment(activeRes.endTime).format(
                        "HH:mm",
                      );
                    }
                  }
                  return (
                    <InfoTable>
                      <InfoRow>
                        <InfoLabel>사용 여부</InfoLabel>
                        <StatusBadge
                          $color={currentIsOccupied ? "#0EA5E9" : "#10B981"}
                        >
                          {currentIsOccupied ? "사용중" : "이용 가능"}
                        </StatusBadge>
                      </InfoRow>
                      {currentIsOccupied && (
                        <>
                          <InfoRow>
                            <InfoLabel>사용자</InfoLabel>
                            <InfoValue>{currentOccupant}</InfoValue>
                          </InfoRow>
                          <InfoRow>
                            <InfoLabel>종료 시간</InfoLabel>
                            <InfoValue>{currentEndTime}</InfoValue>
                          </InfoRow>
                        </>
                      )}
                      <ReservationSection>
                        <ResTitle>오늘의 예약 일정</ResTitle>
                        {selectedBoxData.reservations?.length > 0 ? (
                          <ResList>
                            {selectedBoxData.reservations
                              .filter((res) =>
                                moment(res.endTime).isAfter(moment()),
                              )
                              .sort(
                                (a, b) =>
                                  moment(a.startTime).valueOf() -
                                  moment(b.startTime).valueOf(),
                              )
                              .map((res, idx) => (
                                <ResItem key={idx}>
                                  <ResTime>
                                    {moment(res.startTime).format("HH:mm")} ~{" "}
                                    {moment(res.endTime).format("HH:mm")}
                                  </ResTime>
                                  <ResInfo>
                                    <ResTitleText>{res.subject}</ResTitleText>
                                    <ResUser>{res.ownerName}</ResUser>
                                  </ResInfo>
                                </ResItem>
                              ))}
                            {selectedBoxData.reservations.filter((res) =>
                              moment(res.endTime).isAfter(moment()),
                            ).length === 0 && (
                              <ResEmpty>남은 예약 일정이 없습니다.</ResEmpty>
                            )}
                          </ResList>
                        ) : (
                          <ResEmpty>예약된 일정이 없습니다.</ResEmpty>
                        )}
                      </ReservationSection>
                    </InfoTable>
                  );
                })()}
            </ViewInfoWrapper>
          )}
        </>
      )}
    </SidePanel>
  );
}

// --- Styled Components ---
const SidePanel = styled.div`
  width: 280px;
  flex-shrink: 0;
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 24px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  overflow-y: auto;
`;
const EmptyPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  opacity: 0.6;
`;
const EmptyText = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
  text-align: center;
  line-height: 1.5;
`;
const PanelTitle = styled.div`
  font-size: 0.95rem;
  font-weight: 800;
  color: #0f172a;
`;
const PanelDivider = styled.div`
  height: 1px;
  background-color: #e2e8f0;
`;
const NoticeText = styled.div`
  font-size: 0.75rem;
  color: #0ea5e9;
  font-weight: 600;
  line-height: 1.3;
  word-break: keep-all;
`;
const PropGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  align-items: center;
`;
const PropGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;
const PropLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
`;
const PropInput = styled.input`
  padding: 8px 10px;
  font-size: 0.85rem;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  outline: none;
  &:focus {
    border-color: #0ea5e9;
  }
`;
const DeleteBtn = styled.button`
  margin-top: auto;
  padding: 10px;
  background-color: #fef2f2;
  color: #ef4444;
  border: 1px solid #fecaca;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
`;
const ViewInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
`;
const ProfileAvatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #e0f2fe;
  color: #0284c7;
  font-size: 1.5rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
`;
const ViewName = styled.div`
  font-size: 1.2rem;
  font-weight: 800;
  color: #0f172a;
`;
const ViewEmail = styled.div`
  font-size: 0.8rem;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 16px;
`;
const InfoTable = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
`;
const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 8px;
  border-bottom: 1px solid #f1f5f9;
`;
const InfoLabel = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  color: #64748b;
  min-width: 65px;
  padding-top: 2px;
`;
const InfoValue = styled.div`
  font-size: 0.85rem;
  font-weight: 700;
  color: #1e293b;
  text-align: right;
  word-break: keep-all;
  line-height: 1.4;
  max-width: 160px;
`;
const StatusBadge = styled.div`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 800;
  color: #ffffff;
  background-color: ${(props) => props.$color};
`;
const ReservationSection = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const ResTitle = styled.div`
  font-size: 0.85rem;
  font-weight: 800;
  color: #475569;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 6px;
`;
const ResList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const ResItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px;
  background-color: #f8fafc;
  border-left: 3px solid #0ea5e9;
  border-radius: 4px;
`;
const ResTime = styled.div`
  font-size: 0.75rem;
  font-weight: 800;
  color: #0284c7;
`;
const ResInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;
const ResTitleText = styled.div`
  font-size: 0.85rem;
  font-weight: 700;
  color: #1e293b;
`;
const ResUser = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  color: #64748b;
`;
const ResEmpty = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: #94a3b8;
  text-align: center;
  padding: 16px 0;
`;
