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

export default function SiteColumn({
  sites = [],
  activeSiteName,
  activeCompanyName,
  onSelectSite,
  openModal,
  handleDelete,
}) {
  const [search, setSearch] = useState("");

  const displaySites = sites.filter((s) =>
    s.site_name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <SectionColumn>
      <SectionHeader>
        <SectionTitle>3. 사이트 관리</SectionTitle>
        <Badge>{sites.length}</Badge>
      </SectionHeader>

      <SubInfoBox>
        선택 회사: <strong>{activeCompanyName || "선택 안됨"}</strong>
      </SubInfoBox>

      <ControlRow>
        <SearchInput
          placeholder="사이트명 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <AddButton
          onClick={() => openModal("site", "create")}
          disabled={!activeCompanyName}
        >
          + 추가
        </AddButton>
      </ControlRow>

      <ItemList>
        {displaySites.length === 0 && (
          <EmptyText>검색 결과가 없습니다.</EmptyText>
        )}
        {displaySites.map((s) => (
          <ItemCard
            key={s.id}
            $selected={s.site_name === activeSiteName} // 💡 선택 시 하이라이트 반영
            onClick={() => onSelectSite(s.site_name)} // 💡 클릭 이벤트 적용
          >
            <CardTop>
              <CodeBadge>SITE</CodeBadge>
              <CardActions onClick={(e) => e.stopPropagation()}>
                <ActionBtn onClick={() => openModal("site", "edit", s)}>
                  수정
                </ActionBtn>
                <DeleteBtn onClick={() => handleDelete("site", s.id)}>
                  삭제
                </DeleteBtn>
              </CardActions>
            </CardTop>
            <CardBody>
              <InfoText $bold>{s.site_name}</InfoText>
            </CardBody>
          </ItemCard>
        ))}
      </ItemList>
    </SectionColumn>
  );
}
