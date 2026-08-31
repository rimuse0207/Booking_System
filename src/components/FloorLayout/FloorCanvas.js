import React from "react";
import styled from "styled-components";
import moment from "moment";
import { STATUS_COLORS } from "../../constants/FloorLayout/FloorLayout";

export default function FloorCanvas({
  filteredBoxes,
  isEditMode,
  selectedBox,
  actions,
}) {
  const { setSelectedBox, handleDragStart, handleResizeStart } = actions;

  return (
    <CanvasArea onClick={() => setSelectedBox(null)} $isEditMode={isEditMode}>
      {filteredBoxes.map((box) => {
        const isVacant =
          box.type === "user" && (!box.email || box.email.trim() === "");
        const boxColor = isVacant
          ? STATUS_COLORS["공석"]
          : STATUS_COLORS[box.status] || STATUS_COLORS["공석"];

        const ident = box.identifier?.toLowerCase() || "";
        const isDisable = ident.includes("disable");
        const isRoomOrEq =
          ident.includes("room") || ident.includes("equipment");

        let currentIsOccupied = false;
        let currentOccupant = "";
        let currentEndTime = "";

        if (isRoomOrEq && box.reservations?.length > 0) {
          const now = moment();
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

        let tooltipText = "";
        if (box.type === "user") {
          tooltipText = isVacant
            ? "공석"
            : `[${box.department || "부서미정"}] ${box.name || "이름없음"} - ${box.status || "상태미상"}`;
        } else {
          if (isDisable) tooltipText = `[${box.label}]`;
          else if (isRoomOrEq)
            tooltipText = currentIsOccupied
              ? `[${box.label}] 사용중: ${currentOccupant} (~${currentEndTime})`
              : `[${box.label}] 이용 가능`;
          else tooltipText = `[${box.label}]`;
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
              <ResizeHandle onMouseDown={(e) => handleResizeStart(e, box)} />
            )}
          </BoxElement>
        );
      })}
    </CanvasArea>
  );
}

// --- Styled Components ---
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
