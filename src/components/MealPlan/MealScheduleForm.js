import React from "react";
import styled from "styled-components";

export default function MealScheduleForm({ state, actions }) {
  return (
    <FormWrapper onSubmit={actions.handleSubmit}>
      <SectionCard>
        <SectionTitle>INSERT 쿼리 직접 입력</SectionTitle>

        {/* <InfoBox>
          <InfoTitle>작성 가이드</InfoTitle>
          <InfoText>
            미리 작성된 <b>INSERT 구문</b>을 아래 텍스트 영역에 붙여넣기 하세요.
            <br />
            다중 INSERT 구문(여러 Row를 한 번에 삽입) 사용을 권장합니다.
          </InfoText>
          <ExampleCode>
            INSERT INTO meal_schedule (date, menu, type)
            <br />
            VALUES <br />
            ('2026-09-07', '백미밥, 김치찌개, 제육볶음, 계란말이, 깍두기',
            '중식'),
            <br />
            ('2026-09-08', '흑미밥, 된장국, 고등어구이, 시금치나물, 배추김치',
            '중식');
          </ExampleCode>
        </InfoBox> */}

        <FormGroup>
          <Label>SQL Query</Label>
          <CodeTextArea
            value={state.sqlQuery}
            onChange={actions.handleQueryChange}
            placeholder="여기에 데이터를 붙여넣으세요..."
            rows={15}
          />
        </FormGroup>

        <ButtonGroup>
          <CancelButton type="button" onClick={actions.handleReset}>
            초기화
          </CancelButton>
          <PrimaryBtn type="submit">쿼리 실행 및 등록</PrimaryBtn>
        </ButtonGroup>
      </SectionCard>
    </FormWrapper>
  );
}

// --- Styled Components ---
const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;
const SectionCard = styled.div`
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
`;
const SectionTitle = styled.h3`
  margin: 0 0 24px 0;
  font-size: 1.15rem;
  font-weight: 800;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
  &::before {
    content: "";
    display: block;
    width: 4px;
    height: 16px;
    background-color: #0ea5e9;
    border-radius: 2px;
  }
`;
const InfoBox = styled.div`
  background-color: #f0f9ff;
  border: 1px dashed #7dd3fc;
  border-radius: 8px;
  padding: 16px 20px;
  margin-bottom: 24px;
`;
const InfoTitle = styled.div`
  font-size: 0.95rem;
  font-weight: 800;
  color: #0369a1;
  margin-bottom: 8px;
`;
const InfoText = styled.div`
  font-size: 0.85rem;
  color: #0c4a6e;
  line-height: 1.5;
  margin-bottom: 12px;
`;
const ExampleCode = styled.div`
  background-color: #1e293b;
  color: #e2e8f0;
  padding: 12px;
  border-radius: 6px;
  font-family: "D2Coding", "Fira Code", Consolas, monospace;
  font-size: 0.85rem;
  line-height: 1.4;
  overflow-x: auto;
`;
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 700;
  color: #475569;
`;
const CodeTextArea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  padding: 16px;
  font-size: 0.95rem;
  font-family: "D2Coding", "Fira Code", Consolas, monospace;
  line-height: 1.6;
  color: #f8fafc;
  background-color: #0f172a;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  resize: vertical;
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  &::placeholder {
    color: #64748b;
  }
  &:focus {
    border-color: #0ea5e9;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.2);
  }
`;
const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;
const CancelButton = styled.button`
  background-color: #f1f5f9;
  color: #475569;
  font-size: 0.95rem;
  font-weight: 700;
  border: 1px solid #cbd5e1;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background-color: #e2e8f0;
    color: #1e293b;
  }
`;
const PrimaryBtn = styled.button`
  background-color: #0ea5e9;
  color: white;
  border: none;
  padding: 12px 32px;
  font-size: 0.95rem;
  font-weight: 700;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background-color: #0284c7;
    box-shadow: 0 4px 6px rgba(14, 165, 233, 0.2);
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0);
  }
`;
