import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { COMPANY_NAME } from "../../constants/index";
import { Logout_Inistate_State_Func } from "../../models/LoginInfoReducer/LoginInfoReduce";

export function TopMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const LoginInfo = useSelector(
    (state) => state.Login_Info_Reducer_State.Login_Info,
  );

  const MENUS = [
    { name: "회의실 예약", path: "/" },
    { name: "식단표", path: "/Today_Food" },
    { name: "자리배치도", path: "/FloorLayout" },
  ];

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      dispatch(Logout_Inistate_State_Func());
      localStorage.clear();
      alert("로그아웃 되었습니다.");
      navigate("/Login");
    }
  };

  return (
    <Nav>
      <Logo onClick={() => navigate("/")}>{COMPANY_NAME}</Logo>

      <NavLinks>
        {MENUS.map((menu) => {
          // 💡 핵심 수정: 메인 경로("/")는 정확히 일치할 때만 활성화하고, 나머지는 하위 경로까지 포함하여 활성화
          const isActive =
            menu.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(menu.path);

          return (
            <NavLink
              key={menu.path}
              $active={isActive}
              onClick={() => navigate(menu.path)}
            >
              {menu.name}
            </NavLink>
          );
        })}
      </NavLinks>

      <RightSection>
        {LoginInfo && LoginInfo.name ? (
          <UserProfile>
            <Avatar>{LoginInfo.company}</Avatar>
            <UserInfo>
              <UserName>{LoginInfo.name} 님</UserName>
              <LogoutBtn onClick={handleLogout}>로그아웃</LogoutBtn>
            </UserInfo>
          </UserProfile>
        ) : (
          <LoginPrompt onClick={() => navigate("/login")}>
            로그인이 필요합니다
          </LoginPrompt>
        )}
      </RightSection>
    </Nav>
  );
}

// --- Styled Components ---

const Nav = styled.nav`
  width: 100%;
  height: 60px;
  background-color: #ffffff;
  border-bottom: 1px solid #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  box-sizing: border-box;
  position: sticky;
  top: 0px;
  z-index: 100;
  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const Logo = styled.div`
  font-size: 1.25rem;
  font-weight: 800;
  color: #0369a1;
  letter-spacing: -0.5px;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.8;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 32px;
  height: 100%;
  flex: 1;
  margin-left: 48px;
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.div`
  display: flex;
  align-items: center;
  font-weight: ${(props) => (props.$active ? "700" : "500")};
  color: ${(props) => (props.$active ? "#0369A1" : "#64748B")};
  border-bottom: ${(props) =>
    props.$active ? "3px solid #0EA5E9" : "3px solid transparent"};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #0369a1;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #e0f2fe;
  color: #0284c7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.9rem;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  @media (max-width: 768px) {
    display: none;
  }
`;

const UserName = styled.span`
  font-size: 0.9rem;
  font-weight: 700;
  color: #1e293b;
`;

const LogoutBtn = styled.button`
  background: none;
  border: none;
  padding: 0;
  font-size: 0.75rem;
  font-weight: 600;
  color: #94a3b8;
  cursor: pointer;
  text-align: left;
  transition: color 0.2s ease;

  &:hover {
    color: #ef4444;
    text-decoration: underline;
  }
`;

const LoginPrompt = styled.button`
  background-color: #f1f5f9;
  color: #475569;
  font-size: 0.9rem;
  font-weight: 700;
  border: 1px solid #cbd5e1;
  border-radius: 20px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #0ea5e9;
    color: #ffffff;
    border-color: #0ea5e9;
  }
`;
