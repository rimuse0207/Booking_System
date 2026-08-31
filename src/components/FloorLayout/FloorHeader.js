import React from "react";
import styled from "styled-components";
import moment from "moment";
import "moment/locale/ko";
import { STATUS_COLORS } from "../../constants/FloorLayout/FloorLayout";
import { useSelector } from "react-redux";

export default function FloorHeader({ state, actions }) {
  const LoginInfo = useSelector(
    (state) => state.Login_Info_Reducer_State.Login_Info,
  );
  const {
    isEditMode,
    selectedOffice,
    currentFloor,
    offices,
    availableFloors,
    currentDate,
  } = state;
  const {
    goPrevDay,
    goNextDay,
    changeDate,
    handleOfficeChange,
    setCurrentFloor,
    setSelectedBox,
    addNewBox,
    cancelEditMode,
    saveLayout,
    toggleEditMode,
  } = actions;

  return (
    <Header>
      <HeaderLeft>
        <Title>자리배치도</Title>

        <DateController>
          <DateBtn onClick={goPrevDay}>&lt;</DateBtn>
          <DateWrapper>
            <DateText>
              {moment(currentDate).locale("ko").format("YYYY. MM. DD (ddd)")}
            </DateText>
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
          <LegendItem $color={STATUS_COLORS["해외출장"]}>해외출장</LegendItem>
        </StatusLegend>
      </HeaderLeft>

      {LoginInfo?.company === "DHKS" && LoginInfo?.admin_access ? (
        <Controller>
          {isEditMode ? (
            <>
              <ControlBtn onClick={() => addNewBox("user")}>
                + 사용자
              </ControlBtn>
              <ControlBtn onClick={() => addNewBox("room")}>+ 공간</ControlBtn>
              <Divider />
              <CancelBtn onClick={cancelEditMode}>취소</CancelBtn>
              <PrimaryBtn $isEditMode={true} onClick={saveLayout}>
                수정 완료
              </PrimaryBtn>
            </>
          ) : (
            <PrimaryBtn $isEditMode={false} onClick={toggleEditMode}>
              배치도 편집
            </PrimaryBtn>
          )}
        </Controller>
      ) : (
        <></>
      )}
    </Header>
  );
}

// --- Styled Components ---
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
