import React from "react";
import styled from "styled-components";

export default function UserTable({ state, actions }) {
  const { filteredUsers } = state;
  const { handleResetPassword, openEditModal, handleDeleteUser } = actions;

  return (
    <TableWrapper>
      <Table>
        <thead>
          <tr>
            <Th style={{ width: "60px" }}>No.</Th>
            <Th>회사명</Th>
            <Th>이메일 (ID)</Th>
            <Th>이름</Th>
            <Th>팀명</Th>
            <Th style={{ textAlign: "center", width: "240px" }}>관리</Th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length === 0 ? (
            <tr>
              <Td
                colSpan="5"
                style={{
                  textAlign: "center",
                  padding: "40px 0",
                  color: "#94a3b8",
                }}
              >
                조건에 일치하는 사용자가 없습니다.
              </Td>
            </tr>
          ) : (
            filteredUsers.map((user, idx) => (
              <tr key={user.brity_works_user_info_indexs}>
                <Td>{filteredUsers.length - idx}</Td>
                <Td>DHK</Td>
                <Td style={{ fontWeight: "600", color: "#0369a1" }}>
                  {user.brity_works_user_info_id}
                </Td>

                <Td style={{ fontWeight: "800" }}>
                  {user.brity_works_user_info_name}
                </Td>
                <Td>{user.team}</Td>
                <Td style={{ textAlign: "center" }}>
                  <ActionBtnGroup>
                    <ActionBtn
                      onClick={() =>
                        handleResetPassword(
                          user.brity_works_user_info_id,
                          user.brity_works_user_info_name,
                        )
                      }
                    >
                      PW 초기화
                    </ActionBtn>

                    <ActionBtn
                      $danger
                      onClick={() =>
                        handleDeleteUser(
                          user.brity_works_user_info_id,
                          user.brity_works_user_info_name,
                        )
                      }
                    >
                      삭제
                    </ActionBtn>
                  </ActionBtnGroup>
                </Td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </TableWrapper>
  );
}

// --- Styled Components ---
const TableWrapper = styled.div`
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 700px;
`;
const Th = styled.th`
  background-color: #f8fafc;
  color: #475569;
  font-weight: 800;
  font-size: 0.85rem;
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid #cbd5e1;
`;
const Td = styled.td`
  padding: 16px;
  font-size: 0.9rem;
  color: #1e293b;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: middle;
`;
const ActionBtnGroup = styled.div`
  display: flex;
  gap: 6px;
  justify-content: center;
`;
const ActionBtn = styled.button`
  background: ${(props) => (props.$danger ? "#fef2f2" : "#f8fafc")};
  color: ${(props) => (props.$danger ? "#ef4444" : "#475569")};
  border: 1px solid ${(props) => (props.$danger ? "#fecaca" : "#e2e8f0")};
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: ${(props) => (props.$danger ? "#fee2e2" : "#e2e8f0")};
  }
`;
