import React, { useState } from "react";
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

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const MENUS = [
    { name: "회의실 예약", path: "/", accessCompany: ["ALL"] },
    { name: "식단표", path: "/Today_Food", accessCompany: ["ALL"] },
    { name: "자리배치도", path: "/FloorLayout", accessCompany: ["DHKS"] },
    {
      name: "일정 조회 및 등록",
      path: "/My_Pims",
      accessCompany: ["DHKS"],
    },
  ];

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      dispatch(Logout_Inistate_State_Func());
      localStorage.clear();
      alert("로그아웃 되었습니다.");
      navigate("/Login");
    }
  };

  // 💡 권한에 맞는 메뉴만 필터링 (데스크탑, 모바일 공통 사용)
  const visibleMenus = MENUS.filter(
    (item) =>
      item.accessCompany.includes("ALL") ||
      item.accessCompany.includes(LoginInfo?.company),
  );

  // 💡 모바일 메뉴 클릭 시 페이지 이동 및 메뉴 닫기
  const handleMobileNavClick = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <Nav>
        <Logo onClick={() => navigate("/")}>{COMPANY_NAME}</Logo>

        {/* 💡 데스크탑 전용 메뉴 */}
        <NavLinks>
          {visibleMenus.map((menu) => {
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

          {/* 💡 모바일 햄버거 버튼 */}
          <HamburgerBtn onClick={() => setIsMobileMenuOpen(true)}>
            <span />
            <span />
            <span />
          </HamburgerBtn>
        </RightSection>
      </Nav>

      {/* 💡 모바일 사이드 메뉴 영역 */}
      <MobileOverlay
        $isOpen={isMobileMenuOpen}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      <MobileMenuPanel $isOpen={isMobileMenuOpen}>
        <MobileMenuHeader>
          <MobileTitle>메뉴</MobileTitle>
          <CloseBtn onClick={() => setIsMobileMenuOpen(false)}>✕</CloseBtn>
        </MobileMenuHeader>

        <MobileNavLinks>
          {visibleMenus.map((menu) => {
            const isActive =
              menu.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(menu.path);

            return (
              <MobileNavLink
                key={menu.path}
                $active={isActive}
                onClick={() => handleMobileNavClick(menu.path)}
              >
                {menu.name}
              </MobileNavLink>
            );
          })}
        </MobileNavLinks>

        {/* 모바일 화면에서는 사용자 정보 하단에 배치 */}
        {LoginInfo && LoginInfo.name && (
          <MobileUserSection>
            <MobileUserName>{LoginInfo.name} 님</MobileUserName>
            <MobileLogoutBtn onClick={handleLogout}>로그아웃</MobileLogoutBtn>
          </MobileUserSection>
        )}
      </MobileMenuPanel>
    </>
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
  gap: 16px;
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

// 💡 햄버거 아이콘 스타일 (모바일에서만 보임)
const HamburgerBtn = styled.button`
  display: none;
  background: transparent;
  border: none;
  cursor: pointer;
  flex-direction: column;
  justify-content: space-around;
  width: 24px;
  height: 20px;
  padding: 0;

  @media (max-width: 768px) {
    display: flex;
  }

  span {
    width: 24px;
    height: 3px;
    background-color: #334155;
    border-radius: 4px;
    transition: all 0.3s linear;
  }
`;

// 💡 모바일 메뉴 오버레이 (반투명 검정 배경)
const MobileOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  visibility: ${(props) => (props.$isOpen ? "visible" : "hidden")};
  transition: all 0.3s ease-in-out;
`;

// 💡 모바일 슬라이드 패널
const MobileMenuPanel = styled.div`
  position: fixed;
  top: 0;
  right: ${(props) => (props.$isOpen ? "0" : "-280px")};
  width: 280px;
  height: 100vh;
  background-color: #ffffff;
  z-index: 1001;
  box-shadow: -4px 0 15px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
`;

const MobileMenuHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
`;

const MobileTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 800;
  color: #0f172a;
`;

const CloseBtn = styled.button`
  background: transparent;
  border: none;
  font-size: 1.2rem;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
`;

const MobileNavLinks = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 0;
  flex: 1;
`;

const MobileNavLink = styled.div`
  padding: 16px 24px;
  font-size: 1rem;
  font-weight: ${(props) => (props.$active ? "800" : "600")};
  color: ${(props) => (props.$active ? "#0ea5e9" : "#334155")};
  background-color: ${(props) => (props.$active ? "#f0f9ff" : "transparent")};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8fafc;
  }
`;

const MobileUserSection = styled.div`
  padding: 24px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MobileUserName = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
`;

const MobileLogoutBtn = styled.button`
  background-color: #fef2f2;
  color: #ef4444;
  border: 1px solid #fecaca;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
`;
