import React from "react";
import styled from "styled-components";
import { useFloorLayout } from "../../hooks/FloorLayout/useFloorLayout";
import { TopMenu } from "../Navigation/TopNavigation";
import FloorHeader from "../../components/FloorLayout/FloorHeader";
import FloorCanvas from "../../components/FloorLayout/FloorCanvas";
import FloorSidePanel from "../../components/FloorLayout/FloorSidePanel";

export default function FloorLayout() {
  const { state, actions } = useFloorLayout();

  // 파생 데이터 (Derived State)
  const selectedBoxData = state.boxes.find((b) => b.id === state.selectedBox);
  const filteredBoxes = state.boxes.filter(
    (b) => b.office === state.selectedOffice && b.floor === state.currentFloor,
  );

  return (
    <PageContainer
      onMouseMove={actions.handleMouseMove}
      onMouseUp={actions.handleMouseUp}
      onMouseLeave={actions.handleMouseUp}
    >
      <TopMenu />

      <ContentContainer>
        {/* 💡 1. 상단 컨트롤 헤더 */}
        <FloorHeader state={state} actions={actions} />

        <Workspace>
          {/* 💡 2. 도면 캔버스 영역 */}
          <FloorCanvas
            filteredBoxes={filteredBoxes}
            isEditMode={state.isEditMode}
            selectedBox={state.selectedBox}
            actions={actions}
          />

          {/* 💡 3. 우측 속성/정보 패널 */}
          <FloorSidePanel
            selectedBoxData={selectedBoxData}
            isEditMode={state.isEditMode}
            selectedOffice={state.selectedOffice}
            actions={actions}
          />
        </Workspace>
      </ContentContainer>
    </PageContainer>
  );
}

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

const Workspace = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  gap: 24px;
  overflow: hidden;
  min-height: 70vh;
`;
