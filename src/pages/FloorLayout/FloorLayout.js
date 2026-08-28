import React from "react";
import styled from "styled-components";
import { useFloorLayout } from "../../hooks/FloorLayout/useFloorLayout";
import { TopMenu } from "../Navigation/TopNavigation";
import moment from "moment";

const STATUS_COLORS = {
  출근: "#10B981",
  외근: "#F59E0B",
  연차: "#EF4444",
  해외출장: "rgb(79, 70, 229)",
  공석: "#E2E8F0",
};

export default function FloorLayout() {
  const { state, actions } = useFloorLayout();
  const {
    boxes,
    isEditMode,
    selectedBox,
    selectedOffice,
    currentFloor,
    offices,
    availableFloors,
    currentDate,
  } = state;
  const {
    toggleEditMode,
    saveLayout,
    cancelEditMode,
    handleOfficeChange,
    setCurrentFloor,
    handleDragStart,
    handleResizeStart,
    handleMouseMove,
    handleMouseUp,
    setSelectedBox,
    addNewBox,
    updateBoxProperty,
    deleteBox,
    goPrevDay,
    goNextDay,
    changeDate,
  } = actions;

  const selectedBoxData = boxes.find((b) => b.id === selectedBox);
  const filteredBoxes = boxes.filter(
    (b) => b.office === selectedOffice && b.floor === currentFloor,
  );

  const handlePropChange = (e) => {
    if (!selectedBoxData) return;
    let { name, value, type } = e.target;
    if (type === "number") value = parseInt(value, 10) || 0;
    updateBoxProperty(selectedBox, name, value);
  };

  // 💡 선택된 공간의 식별자 분석 로직 (우측 패널용)
  const selectedIdent = selectedBoxData?.identifier?.toLowerCase() || "";
  const isSelectedDisable = selectedIdent.includes("disable");
  const isSelectedRoomOrEq =
    selectedIdent.includes("room") || selectedIdent.includes("equipment");

  return (
    <PageContainer
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <TopMenu />

      <ContentContainer>
        <Header>
          <HeaderLeft>
            <Title>자리배치도</Title>

            <DateController>
              <DateBtn onClick={goPrevDay}>&lt;</DateBtn>
              <DateWrapper>
                <DateText>{currentDate.format("YYYY. MM. DD (ddd)")}</DateText>
                <HiddenDateInput
                  type="date"
                  value={currentDate.format("YYYY-MM-DD")}
                  onChange={(e) => changeDate(e.target.value)}
                />
              </DateWrapper>
              <DateBtn onClick={goNextDay}>&gt;</DateBtn>
            </DateController>

            <OfficeSelect
              value={selectedOffice}
              onChange={(e) => handleOfficeChange(e.target.value)}
            >
              {offices.map((office) => (
                <option key={office} value={office}>
                  {office}
                </option>
              ))}
            </OfficeSelect>

            <FloorTabs>
              {availableFloors.map((f) => (
                <FloorTab
                  key={f}
                  $active={currentFloor === f}
                  onClick={() => {
                    setCurrentFloor(f);
                    setSelectedBox(null);
                  }}
                >
                  {f}층
                </FloorTab>
              ))}
            </FloorTabs>

            <StatusLegend>
              <LegendItem $color={STATUS_COLORS["출근"]}>출근</LegendItem>
              <LegendItem $color={STATUS_COLORS["외근"]}>외근</LegendItem>
              <LegendItem $color={STATUS_COLORS["연차"]}>연차</LegendItem>
              <LegendItem $color={STATUS_COLORS["해외출장"]}>
                해외출장
              </LegendItem>
            </StatusLegend>
          </HeaderLeft>

          <Controller>
            {isEditMode ? (
              <>
                <ControlBtn onClick={() => addNewBox("user")}>
                  + 사용자
                </ControlBtn>
                <ControlBtn onClick={() => addNewBox("room")}>
                  + 공간
                </ControlBtn>
                <Divider />
                <CancelBtn onClick={cancelEditMode}>취소</CancelBtn>
                <PrimaryBtn $isEditMode={true} onClick={saveLayout}>
                  💾 수정 완료
                </PrimaryBtn>
              </>
            ) : (
              <PrimaryBtn $isEditMode={false} onClick={toggleEditMode}>
                ⚙️ 배치도 편집
              </PrimaryBtn>
            )}
          </Controller>
        </Header>

        <Workspace>
          {/* 💡 1. 캔버스 영역 */}
          <CanvasArea
            onClick={() => setSelectedBox(null)}
            $isEditMode={isEditMode}
          >
            {filteredBoxes.map((box) => {
              // 사용자 공석 판단
              const isVacant =
                box.type === "user" && (!box.email || box.email.trim() === "");
              const boxColor = isVacant
                ? STATUS_COLORS["공석"]
                : STATUS_COLORS[box.status] || STATUS_COLORS["공석"];

              // 공간(Room) 식별자 판단
              const ident = box.identifier?.toLowerCase() || "";
              const isDisable = ident.includes("disable");
              const isRoomOrEq =
                ident.includes("room") || ident.includes("equipment");

              // 💡 [핵심] 실제 예약 데이터를 기반으로 '현재 사용중' 여부 실시간 판별
              let currentIsOccupied = false;
              let currentOccupant = "";
              let currentEndTime = "";

              if (
                isRoomOrEq &&
                box.reservations &&
                box.reservations.length > 0
              ) {
                const now = moment();
                // 현재 시간이 시작시간과 종료시간 사이에 있는 예약 찾기
                const activeRes = box.reservations.find((res) =>
                  moment(now).isBetween(
                    moment(res.startTime),
                    moment(res.endTime),
                    null,
                    "[)",
                  ),
                );

                if (activeRes) {
                  currentIsOccupied = true;
                  currentOccupant = activeRes.ownerName;
                  currentEndTime = moment(activeRes.endTime).format("HH:mm");
                }
              }

              // 툴팁 동적 텍스트
              let tooltipText = "";
              if (box.type === "user") {
                tooltipText = isVacant
                  ? "공석"
                  : `[${box.department || "부서미정"}] ${box.name || "이름없음"} - ${box.status || "상태미상"}`;
              } else {
                if (isDisable) {
                  tooltipText = `[${box.label}]`;
                } else if (isRoomOrEq) {
                  tooltipText = currentIsOccupied
                    ? `[${box.label}] 사용중: ${currentOccupant} (~${currentEndTime})`
                    : `[${box.label}] 이용 가능`;
                } else {
                  tooltipText = `[${box.label}]`;
                }
              }

              return (
                <BoxElement
                  key={box.id}
                  style={{
                    transform: `translate(${box.x}px, ${box.y}px)`,
                    width: box.width,
                    height: box.height,
                  }}
                  $isEditMode={isEditMode}
                  $isSelected={selectedBox === box.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBox(box.id);
                  }}
                  onMouseDown={(e) => handleDragStart(e, box)}
                  data-tooltip={tooltipText}
                >
                  {box.type === "user" ? (
                    <UserBox $color={boxColor} $isVacant={isVacant}>
                      {!isVacant && (
                        <UserInfo>
                          <UserDept>{box.department}</UserDept>
                          <UserName>{box.name}</UserName>
                        </UserInfo>
                      )}
                    </UserBox>
                  ) : (
                    // 💡 실시간 예약 상태(currentIsOccupied) 적용
                    <RoomBox $isOccupied={!isDisable && currentIsOccupied}>
                      <RoomText>{box.label}</RoomText>
                      {!isDisable && isRoomOrEq && currentIsOccupied && (
                        <UsageInfo>
                          {currentOccupant} <br /> (~{currentEndTime})
                        </UsageInfo>
                      )}
                    </RoomBox>
                  )}

                  {isEditMode && selectedBox === box.id && (
                    <ResizeHandle
                      onMouseDown={(e) => handleResizeStart(e, box)}
                    />
                  )}
                </BoxElement>
              );
            })}
          </CanvasArea>

          {/* 💡 2. 우측 고정 패널 */}
          <SidePanel>
            {!selectedBoxData ? (
              <EmptyPanel>
                <EmptyText>
                  도면에서 요소를 클릭하면
                  <br />
                  {isEditMode
                    ? "속성을 편집할 수 있습니다."
                    : "상세 정보가 표시됩니다."}
                </EmptyText>
              </EmptyPanel>
            ) : isEditMode ? (
              // [편집 모드 폼]
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
              // [일반 모드 상세 정보 렌더링]
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
                        <InfoValue>
                          {selectedBoxData.department || "-"}
                        </InfoValue>
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
                          {selectedBoxData.email
                            ? selectedBoxData.status
                            : "공석"}
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
                            <InfoValue>
                              {selectedBoxData.end_date || "-"}
                            </InfoValue>
                          </InfoRow>
                          <InfoRow>
                            <InfoLabel>고객사</InfoLabel>
                            <InfoValue>
                              {selectedBoxData.custom || "-"}
                            </InfoValue>
                          </InfoRow>
                          <InfoRow>
                            <InfoLabel>안건</InfoLabel>
                            <InfoValue>
                              {selectedBoxData.description || "-"}
                            </InfoValue>
                          </InfoRow>
                          <InfoRow>
                            <InfoLabel>동행자</InfoLabel>
                            <InfoValue>
                              {selectedBoxData.companion || "-"}
                            </InfoValue>
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
                        // 💡 상세 패널용 실시간 예약 상태 체크 로직
                        let currentIsOccupied = false;
                        let currentOccupant = "";
                        let currentEndTime = "";

                        if (
                          selectedBoxData.reservations &&
                          selectedBoxData.reservations.length > 0
                        ) {
                          const now = moment();
                          const activeRes = selectedBoxData.reservations.find(
                            (res) =>
                              moment(now).isBetween(
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
                                $color={
                                  currentIsOccupied ? "#0EA5E9" : "#10B981"
                                }
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

                            {/* 💡 필터링 및 시간순 정렬된 당일 예약 리스트 */}
                            <ReservationSection>
                              <ResTitle>오늘의 예약 일정</ResTitle>
                              {selectedBoxData.reservations &&
                              selectedBoxData.reservations.length > 0 ? (
                                <ResList>
                                  {selectedBoxData.reservations
                                    // 1. 종료 시간이 '현재 시간' 이후인 예약만 남김 (지난 일정 숨김)
                                    .filter((res) =>
                                      moment(res.endTime).isAfter(moment()),
                                    )
                                    // 2. 시작 시간 기준 오름차순(빠른 순) 정렬 (타임스탬프 계산)
                                    .sort(
                                      (a, b) =>
                                        moment(a.startTime).valueOf() -
                                        moment(b.startTime).valueOf(),
                                    )
                                    .map((res, idx) => (
                                      <ResItem key={idx}>
                                        <ResTime>
                                          {moment(res.startTime).format(
                                            "HH:mm",
                                          )}{" "}
                                          ~{" "}
                                          {moment(res.endTime).format("HH:mm")}
                                        </ResTime>
                                        <ResInfo>
                                          <ResTitleText>
                                            {res.subject}
                                          </ResTitleText>
                                          <ResUser>{res.ownerName}</ResUser>
                                        </ResInfo>
                                      </ResItem>
                                    ))}

                                  {/* 지난 일정 필터링 후 남은 예약이 없을 경우 */}
                                  {selectedBoxData.reservations.filter((res) =>
                                    moment(res.endTime).isAfter(moment()),
                                  ).length === 0 && (
                                    <ResEmpty>
                                      남은 예약 일정이 없습니다.
                                    </ResEmpty>
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
        </Workspace>
      </ContentContainer>
    </PageContainer>
  );
}

// --- Styled Components ---

const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: "Pretendard", sans-serif;
  display: flex;
  flex-direction: column;
`;
const ContentContainer = styled.div`
  padding: 24px 32px;
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  @media (max-width: 768px) {
    padding: 16px;
  }
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
`;
const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
`;
const Title = styled.h2`
  margin: 0;
  color: #0f172a;
  font-size: 1.4rem;
  font-weight: 800;
`;

const DateController = styled.div`
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  overflow: hidden;
`;
const DateBtn = styled.button`
  background: none;
  border: none;
  padding: 6px 10px;
  font-weight: bold;
  color: #475569;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background-color: #f1f5f9;
    color: #0ea5e9;
  }
`;
const DateWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover > div {
    color: #0ea5e9;
  }
`;
const DateText = styled.div`
  font-size: 0.9rem;
  font-weight: 700;
  color: #1e293b;
  padding: 0 12px;
  min-width: 120px;
  text-align: center;
  transition: color 0.2s;
`;
const HiddenDateInput = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  &::-webkit-calendar-picker-indicator {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
`;

const OfficeSelect = styled.select`
  padding: 6px 12px;
  font-size: 0.95rem;
  font-weight: 700;
  color: #0369a1;
  background-color: #e0f2fe;
  border: 1px solid #bae6fd;
  border-radius: 6px;
  outline: none;
  cursor: pointer;
`;

const FloorTabs = styled.div`
  display: flex;
  gap: 4px;
  background: #e2e8f0;
  padding: 4px;
  border-radius: 8px;
`;
const FloorTab = styled.button`
  padding: 6px 14px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.85rem;
  border: none;
  cursor: pointer;
  background: ${(props) => (props.$active ? "#FFFFFF" : "transparent")};
  color: ${(props) => (props.$active ? "#0EA5E9" : "#64748B")};
  box-shadow: ${(props) =>
    props.$active ? "0 2px 4px rgba(0,0,0,0.05)" : "none"};
  transition: all 0.2s ease;
`;

const StatusLegend = styled.div`
  display: flex;
  gap: 12px;
`;
const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #64748b;
  &::before {
    content: "";
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${(props) => props.$color};
  }
`;

const Controller = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
const Divider = styled.div`
  width: 1px;
  height: 16px;
  background-color: #cbd5e1;
  margin: 0 4px;
`;
const ControlBtn = styled.button`
  background: #ffffff;
  border: 1px solid #cbd5e1;
  padding: 6px 12px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #475569;
  cursor: pointer;
  border-radius: 6px;
  &:hover {
    background-color: #f1f5f9;
    color: #0f172a;
  }
`;
const CancelBtn = styled.button`
  background: #ffffff;
  border: 1px solid #cbd5e1;
  padding: 6px 12px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #64748b;
  cursor: pointer;
  border-radius: 6px;
  &:hover {
    background-color: #f1f5f9;
    color: #0f172a;
  }
`;
const PrimaryBtn = styled.button`
  background: ${(props) => (props.$isEditMode ? "#10B981" : "#0EA5E9")};
  color: white;
  border: none;
  padding: 6px 12px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  border-radius: 6px;
  &:hover {
    background: ${(props) => (props.$isEditMode ? "#059669" : "#0284C7")};
  }
`;

const Workspace = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  gap: 24px;
  overflow: hidden;
  min-height: 70vh;
`;

const CanvasArea = styled.div`
  flex: 1;
  position: relative;
  background-color: #ffffff;
  border: 1px solid ${(props) => (props.$isEditMode ? "#0EA5E9" : "#E2E8F0")};
  border-radius: 8px;
  overflow: auto;
  background-image:
    linear-gradient(to right, #f1f5f9 1px, transparent 1px),
    linear-gradient(to bottom, #f1f5f9 1px, transparent 1px);
  background-size: 10px 10px;
  cursor: ${(props) => (props.$isEditMode ? "crosshair" : "default")};
  width: 1550px;
`;

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

/* 예약 리스트 디자인 */
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

const BoxElement = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
  box-shadow: ${(props) =>
    props.$isSelected ? "0 0 0 2px rgba(14, 165, 233, 0.5)" : "none"};
  cursor: ${(props) => (props.$isEditMode ? "grab" : "pointer")};
  border-radius: 4px;
  z-index: ${(props) => (props.$isSelected ? 50 : 1)};

  &:active {
    cursor: ${(props) => (props.$isEditMode ? "grabbing" : "pointer")};
  }

  &:hover {
    z-index: 60;
  }

  &::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 110%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #1e293b;
    color: #fff;
    padding: 6px 10px;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: all 0.2s ease;
    z-index: 100;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  &:hover::after {
    ${(props) =>
      !props.$isEditMode &&
      props["data-tooltip"] &&
      `opacity: 1; bottom: 120%;`}
  }
`;

const UserBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.$isVacant ? "#F8FAFC" : "#ffffff")};
  border: 1px solid ${(props) => (props.$isVacant ? "#E2E8F0" : "#E2E8F0")};
  border-top: 3px solid ${(props) => props.$color};
  border-radius: 4px;
  transition: border-color 0.2s;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
`;
const UserDept = styled.div`
  font-size: 0.6rem;
  font-weight: 600;
  color: #94a3b8;
  letter-spacing: -0.5px;
`;
const UserName = styled.div`
  font-size: 0.85rem;
  font-weight: 700;
  color: #334155;
  text-align: center;
`;

const RoomBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    props.$isOccupied ? "#F0F9FF" : "rgba(241, 245, 249, 0.6)"};
  border: 1px dashed ${(props) => (props.$isOccupied ? "#7DD3FC" : "#94a3b8")};
  border-radius: 4px;
  gap: 4px;
`;
const RoomText = styled.div`
  font-size: 0.85rem;
  font-weight: 700;
  color: #475569;
  text-align: center;
`;
const UsageInfo = styled.div`
  font-size: 0.65rem;
  font-weight: 600;
  color: #0284c7;
  text-align: center;
  background: #ffffff;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid #bae6fd;
`;
const ResizeHandle = styled.div`
  position: absolute;
  right: -3px;
  bottom: -3px;
  width: 8px;
  height: 8px;
  background-color: #0ea5e9;
  border-radius: 50%;
  cursor: nwse-resize;
  z-index: 10;
`;
