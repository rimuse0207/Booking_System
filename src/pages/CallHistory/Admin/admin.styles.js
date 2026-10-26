import styled from "styled-components";

export const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: "Pretendard", sans-serif;
  display: flex;
  flex-direction: column;
`;
export const ContentContainer = styled.div`
  padding: 32px;
  max-width: 1700px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 24px;
  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;
export const HeaderBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
export const Title = styled.h2`
  margin: 0;
  color: #0f172a;
  font-size: 1.5rem;
  font-weight: 800;
`;
export const SubText = styled.div`
  color: #64748b;
  font-size: 0.9rem;
`;

export const ColumnsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  align-items: start;
  @media (max-width: 1400px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const SectionColumn = styled.div`
  background: white;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  height: 750px;
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #f1f5f9;
  padding-bottom: 10px;
  flex-shrink: 0;
`;
export const SectionTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
  color: #1e293b;
`;
export const Badge = styled.span`
  background-color: #f1f5f9;
  color: #475569;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
`;
export const SubInfoBox = styled.div`
  font-size: 0.8rem;
  color: #475569;
  background: #f8fafc;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px dashed #cbd5e1;
  flex-shrink: 0;
  margin-bottom: 4px;
`;

export const ControlRow = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;
`;
export const SearchInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.85rem;
  background: #f8fafc;
  outline: none;
  &:focus {
    border-color: #0ea5e9;
    background: white;
  }
`;
export const AddButton = styled.button`
  background: #0ea5e9;
  color: white;
  border: none;
  padding: 0 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  &:hover:not(:disabled) {
    background: #0284c7;
  }
  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
  }
`;

export const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-right: 4px;
  flex: 1;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
`;
export const EmptyText = styled.div`
  font-size: 0.85rem;
  color: #94a3b8;
  text-align: center;
  padding: 40px 0;
`;

export const ItemCard = styled.div`
  background: #ffffff;
  border: 1px solid ${(props) => (props.$selected ? "#0ea5e9" : "#e2e8f0")};
  border-radius: 10px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-shrink: 0;
  box-shadow: ${(props) =>
    props.$selected
      ? "0 0 0 2px rgba(14, 165, 233, 0.2)"
      : "0 1px 2px rgba(0,0,0,0.02)"};
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    border-color: #0ea5e9;
  }
`;
export const CardTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
export const CodeBadge = styled.span`
  background-color: #f1f5f9;
  color: #475569;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
`;
export const TeamBadge = styled(CodeBadge)`
  background-color: #e0f2fe;
  color: #0284c7;
`;
export const CardActions = styled.div`
  display: flex;
  gap: 4px;
`;
export const ActionBtn = styled.button`
  background: #f8fafc;
  color: #475569;
  border: 1px solid #e2e8f0;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 700;
  cursor: pointer;
  &:hover {
    background: #f1f5f9;
    color: #0f172a;
  }
`;
export const DeleteBtn = styled(ActionBtn)`
  color: #ef4444;
  &:hover {
    background: #fef2f2;
    color: #dc2626;
    border-color: #fecaca;
  }
`;
export const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;
export const InfoText = styled.div`
  font-size: ${(props) => (props.$large ? "1rem" : "0.9rem")};
  color: ${(props) => (props.$bold ? "#0f172a" : "#64748b")};
  font-weight: ${(props) => (props.$bold ? "700" : "500")};
`;

// --- 모달 전용 스타일 ---
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
`;
export const ModalBox = styled.div`
  background: white;
  width: 100%;
  max-width: 400px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;
export const ModalHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
export const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 800;
  color: #0f172a;
`;
export const CloseBtn = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #64748b;
  cursor: pointer;
  padding: 0;
  &:hover {
    color: #0f172a;
  }
`;
export const ModalBody = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;
export const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 700;
  color: #475569;
`;
export const Required = styled.span`
  color: #ef4444;
`;
export const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;
  &:focus {
    border-color: #0ea5e9;
  }
`;
export const SelectInput = styled.select`
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;
  background: white;
`;
export const ModalFooter = styled.div`
  padding: 16px 24px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;
export const CancelBtn = styled.button`
  background: white;
  border: 1px solid #cbd5e1;
  color: #475569;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  &:hover {
    background: #f1f5f9;
  }
`;
export const ConfirmBtn = styled.button`
  background: #0ea5e9;
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  &:hover {
    background: #0284c7;
  }
`;

// ... 기존 코드 아래에 추가 ...

export const GlobalSearchWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
  margin-top: 16px;
`;

export const GlobalSearchInput = styled.input`
  width: 100%;
  padding: 14px 20px;
  font-size: 1rem;
  border: 2px solid #cbd5e1;
  border-radius: 12px;
  background: #ffffff;
  outline: none;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  transition: border-color 0.2s;
  box-sizing: border-box;
  &:focus {
    border-color: #0ea5e9;
  }
`;

export const SearchResultDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  margin-top: 8px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  max-height: 250px;
  overflow-y: auto;
  z-index: 100;
  display: flex;
  flex-direction: column;
`;

export const SearchBadge = styled.span`
  background-color: ${(props) =>
    props.$type === "회사"
      ? "#e0f2fe"
      : props.$type === "사이트"
        ? "#dcfce7"
        : "#f3e8ff"};
  color: ${(props) =>
    props.$type === "회사"
      ? "#0284c7"
      : props.$type === "사이트"
        ? "#15803d"
        : "#7e22ce"};
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 800;
  white-space: nowrap;
`;

export const SearchResultItem = styled.div`
  padding: 12px 16px;
  font-size: 0.95rem;
  cursor: pointer;
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 12px;
  &:hover {
    background-color: #f8fafc;
  }
  .team-path {
    color: #64748b;
    font-size: 0.85rem;
    font-weight: 600;
  }
  .comp-name {
    color: #0f172a;
    font-weight: 800;
  }
  &:last-child {
    border-bottom: none;
  }
`;
