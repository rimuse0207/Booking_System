import React, { useState } from "react";
import {
  SectionColumn,
  SectionHeader,
  SectionTitle,
  Badge,
  SubInfoBox,
  ControlRow,
  SearchInput,
  AddButton,
  ItemList,
  EmptyText,
  ItemCard,
  CardTop,
  CodeBadge,
  CardActions,
  ActionBtn,
  DeleteBtn,
  CardBody,
  InfoText,
} from "../admin.styles";

export default function CompanyColumn({
  companies = [], // 💡 빈 배열을 기본값으로 주어 filter 에러 완벽 차단!
  activeCompanyName,
  selectedTeam,
  onSelectCompany,
  openModal,
  handleDelete,
}) {
  const [search, setSearch] = useState("");

  const displayCompanies = companies.filter(
    (c) =>
      c.company_name.toLowerCase().includes(search.toLowerCase()) ||
      (c.company_name_en &&
        c.company_name_en.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <SectionColumn>
      <SectionHeader>
        <SectionTitle>2. 회사명 관리</SectionTitle>
        <Badge>{companies.length}</Badge>
      </SectionHeader>

      <SubInfoBox>
        현재 선택 팀: <strong>{selectedTeam || "선택 안됨"}</strong>
      </SubInfoBox>

      <ControlRow>
        <SearchInput
          placeholder="회사명 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <AddButton
          onClick={() => openModal("company", "create")}
          disabled={!selectedTeam}
        >
          + 추가
        </AddButton>
      </ControlRow>

      <ItemList>
        {displayCompanies.length === 0 && (
          <EmptyText>검색 결과가 없습니다.</EmptyText>
        )}
        {displayCompanies.map((c) => (
          <ItemCard
            key={c.id}
            $selected={c.company_name === activeCompanyName}
            onClick={() => onSelectCompany(c.company_name)}
          >
            <CardTop>
              <CodeBadge>COMPANY</CodeBadge>
              <CardActions onClick={(e) => e.stopPropagation()}>
                <ActionBtn onClick={() => openModal("company", "edit", c)}>
                  수정
                </ActionBtn>
                <DeleteBtn onClick={() => handleDelete("company", c.id)}>
                  삭제
                </DeleteBtn>
              </CardActions>
            </CardTop>
            <CardBody>
              <InfoText $bold>{c.company_name}</InfoText>
              {c.company_name_en && (
                <InfoText $sub>{c.company_name_en}</InfoText>
              )}
            </CardBody>
          </ItemCard>
        ))}
      </ItemList>
    </SectionColumn>
  );
}
