import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { TopMenu } from "../../Navigation/TopNavigation";
import { useAdminCallHistory } from "../../../hooks/CallHistory/useAdminCallHistory";
import {
  PageContainer,
  ContentContainer,
  HeaderBox,
  Title,
  SubText,
  ColumnsGrid,
  GlobalSearchWrapper,
  GlobalSearchInput,
  SearchResultDropdown,
  SearchResultItem,
  SearchBadge,
} from "./admin.styles";

import MasterModal from "./MasterModal";
import TeamColumn from "./Columns/TeamColumn";
import CompanyColumn from "./Columns/CompanyColumn";
import SiteColumn from "./Columns/SiteColumn";
import EquipmentColumn from "./Columns/EquipmentColumn";
import AdminLogTable from "./AdminLogTable";

export default function AdminPage() {
  const { state, actions } = useAdminCallHistory();
  const { teams, companies, sites, equipments, logs, selectedMonth } = state;
  const {
    handleMasterSave,
    handleMasterDelete,
    handlePrevMonth,
    handleNextMonth,
    handleUpdateLog,
    handleDeleteLog,
  } = actions;

  const [activeTab, setActiveTab] = useState("logs");

  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [selectedSiteName, setSelectedSiteName] = useState("");
  const [selectedEquipmentName, setSelectedEquipmentName] = useState("");

  useEffect(() => {
    if (teams.length > 0 && !selectedTeam) setSelectedTeam(teams[0].team_name);
  }, [teams]);

  const [globalSearch, setGlobalSearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);

  const getSearchResults = () => {
    const keyword = globalSearch.toLowerCase().trim();
    if (!keyword) return [];
    const results = [];
    companies.forEach((c) => {
      if (
        c.company_name.toLowerCase().includes(keyword) ||
        (c.company_name_en && c.company_name_en.toLowerCase().includes(keyword))
      ) {
        results.push({
          type: "회사",
          team: c.team_name,
          company: c.company_name,
          site: "",
          equipment: "",
          label: `${c.company_name}`,
        });
      }
    });
    sites.forEach((s) => {
      if (s.site_name.toLowerCase().includes(keyword)) {
        results.push({
          type: "사이트",
          team: s.team_name,
          company: s.company_name,
          site: s.site_name,
          equipment: "",
          label: `${s.company_name} > ${s.site_name}`,
        });
      }
    });
    equipments.forEach((e) => {
      if (e.equipment_name.toLowerCase().includes(keyword)) {
        results.push({
          type: "장비",
          team: e.team_name,
          company: e.company_name,
          site: e.site_name,
          equipment: e.equipment_name,
          label: `${e.company_name} > ${e.site_name} > ${e.equipment_name}`,
        });
      }
    });
    return results.slice(0, 20);
  };
  const globalSearchResults = getSearchResults();

  const handleGlobalSearchSelect = (item) => {
    setSelectedTeam(item.team);
    setSelectedCompanyName(item.company);
    setSelectedSiteName(item.site);
    setSelectedEquipmentName(item.equipment);
    setGlobalSearch("");
    setIsSearchOpen(false);
  };

  const [modal, setModal] = useState({
    isOpen: false,
    mode: "create",
    target: "team",
    data: {},
  });

  const currentCompanies = companies.filter(
    (c) => c.team_name === selectedTeam,
  );
  const activeCompanyName =
    selectedCompanyName ||
    (currentCompanies.length > 0 ? currentCompanies[0].company_name : "");
  const currentSites = sites.filter(
    (s) => s.team_name === selectedTeam && s.company_name === activeCompanyName,
  );
  const activeSiteName =
    selectedSiteName ||
    (currentSites.length > 0 ? currentSites[0].site_name : "");
  const currentEquipments = equipments.filter(
    (e) =>
      e.team_name === selectedTeam &&
      e.company_name === activeCompanyName &&
      e.site_name === activeSiteName,
  );
  const activeEquipmentName =
    selectedEquipmentName ||
    (currentEquipments.length > 0 ? currentEquipments[0].equipment_name : "");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target))
        setIsSearchOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openModal = (target, mode = "create", item = null) => {
    let defaultData = item ? { ...item } : {};
    if (mode === "create") {
      if (target !== "team") defaultData.team_name = selectedTeam;
      if (target === "site" || target === "equipment")
        defaultData.company_name = activeCompanyName;
      if (target === "equipment") defaultData.site_name = activeSiteName;
    }
    setModal({ isOpen: true, mode, target, data: defaultData });
  };

  const handleModalSaveAction = async (target, mode, data) => {
    const success = await handleMasterSave(target, mode, data);
    if (success && mode === "create") {
      if (target === "team") {
        setSelectedTeam(data.team_name);
        setSelectedCompanyName("");
        setSelectedSiteName("");
        setSelectedEquipmentName("");
      }
    }
  };

  const handleDeleteAction = async (target, id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    const success = await handleMasterDelete(target, id);
    if (success) {
      if (target === "team") {
        setSelectedTeam(teams.find((t) => t.id !== id)?.team_name || "");
        setSelectedCompanyName("");
        setSelectedSiteName("");
      } else if (target === "company") {
        setSelectedCompanyName("");
        setSelectedSiteName("");
      } else if (target === "site") {
        setSelectedSiteName("");
      }
    }
  };

  return (
    <PageContainer>
      <TopMenu />
      <ContentContainer>
        <TabContainer>
          <TabBtn
            $active={activeTab === "logs"}
            onClick={() => setActiveTab("logs")}
          >
            전체 사용자 대응 이력
          </TabBtn>
          <TabBtn
            $active={activeTab === "master"}
            onClick={() => setActiveTab("master")}
          >
            마스터 데이터 관리
          </TabBtn>
        </TabContainer>

        {activeTab === "logs" && (
          <AdminLogTable
            logs={logs}
            selectedMonth={selectedMonth}
            onPrev={handlePrevMonth}
            onNext={handleNextMonth}
            onUpdate={handleUpdateLog}
            onDelete={handleDeleteLog}
            masterData={{ companies, sites, equipments }}
          />
        )}

        {activeTab === "master" && (
          <ColumnsGridWrapper>
            <HeaderBox>
              <Title>마스터 데이터 통합 관리</Title>
              <SubText>
                글로벌 검색을 이용하거나, 왼쪽부터 순서대로 선택하여 하위
                데이터를 관리하세요.
              </SubText>
              <GlobalSearchWrapper ref={searchRef}>
                <GlobalSearchInput
                  placeholder="🔍 통합 검색 (회사명, 사이트명, 장비명 입력)..."
                  value={globalSearch}
                  onChange={(e) => {
                    setGlobalSearch(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                />
                {isSearchOpen && globalSearchResults.length > 0 && (
                  <SearchResultDropdown>
                    {globalSearchResults.map((res, idx) => (
                      <SearchResultItem
                        key={idx}
                        onClick={() => handleGlobalSearchSelect(res)}
                      >
                        <SearchBadge $type={res.type}>{res.type}</SearchBadge>
                        <div>
                          <span className="team-path">{res.team}</span> &gt;{" "}
                          <span className="comp-name">{res.label}</span>
                        </div>
                      </SearchResultItem>
                    ))}
                  </SearchResultDropdown>
                )}
                {isSearchOpen &&
                  globalSearch &&
                  globalSearchResults.length === 0 && (
                    <SearchResultDropdown>
                      <div
                        style={{
                          padding: "12px",
                          color: "#94a3b8",
                          fontSize: "0.9rem",
                        }}
                      >
                        검색 결과가 없습니다.
                      </div>
                    </SearchResultDropdown>
                  )}
              </GlobalSearchWrapper>
            </HeaderBox>
            <ColumnsGrid>
              <TeamColumn
                teams={teams}
                selectedTeam={selectedTeam}
                onSelectTeam={(team) => {
                  setSelectedTeam(team);
                  setSelectedCompanyName("");
                  setSelectedSiteName("");
                  setSelectedEquipmentName("");
                }}
                openModal={openModal}
                handleDelete={handleDeleteAction}
              />
              <CompanyColumn
                companies={currentCompanies}
                activeCompanyName={activeCompanyName}
                selectedTeam={selectedTeam}
                onSelectCompany={(compName) => {
                  setSelectedCompanyName(compName);
                  setSelectedSiteName("");
                  setSelectedEquipmentName("");
                }}
                openModal={openModal}
                handleDelete={handleDeleteAction}
              />
              <SiteColumn
                sites={currentSites}
                activeSiteName={activeSiteName}
                activeCompanyName={activeCompanyName}
                onSelectSite={(siteName) => {
                  setSelectedSiteName(siteName);
                  setSelectedEquipmentName("");
                }}
                openModal={openModal}
                handleDelete={handleDeleteAction}
              />
              <EquipmentColumn
                equipments={currentEquipments}
                activeEquipmentName={activeEquipmentName}
                currentSites={currentSites}
                onSelectEquipment={setSelectedEquipmentName}
                openModal={openModal}
                handleDelete={handleDeleteAction}
              />
            </ColumnsGrid>
          </ColumnsGridWrapper>
        )}
      </ContentContainer>
      <MasterModal
        modal={modal}
        setModal={setModal}
        currentSites={currentSites}
        onSave={handleModalSaveAction}
      />
    </PageContainer>
  );
}

const TabContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 16px;
`;
const TabBtn = styled.button`
  background: ${(props) => (props.$active ? "#0ea5e9" : "#f8fafc")};
  color: ${(props) => (props.$active ? "white" : "#475569")};
  border: 1px solid ${(props) => (props.$active ? "#0ea5e9" : "#cbd5e1")};
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 1.05rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background: ${(props) => (props.$active ? "#0284c7" : "#e2e8f0")};
  }
`;
const ColumnsGridWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;
