import React, { useState } from "react";
import {
  SectionColumn,
  SectionHeader,
  SectionTitle,
  Badge,
  ControlRow,
  SearchInput,
  AddButton,
  ItemList,
  EmptyText,
  ItemCard,
  CardTop,
  TeamBadge,
  CardActions,
  ActionBtn,
  DeleteBtn,
  CardBody,
  InfoText,
} from "../admin.styles";

export default function TeamColumn({
  teams,
  selectedTeam,
  onSelectTeam,
  openModal,
  handleDelete,
}) {
  const [search, setSearch] = useState("");

  const displayTeams = teams?.filter((t) =>
    t?.team_name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <SectionColumn>
      <SectionHeader>
        <SectionTitle>1. 팀명 선택</SectionTitle>
        <Badge>{teams.length}</Badge>
      </SectionHeader>

      <ControlRow>
        <SearchInput
          placeholder="팀명 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <AddButton onClick={() => openModal("team", "create")}>
          + 추가
        </AddButton>
      </ControlRow>

      <ItemList>
        {displayTeams.length === 0 && (
          <EmptyText>검색 결과가 없습니다.</EmptyText>
        )}
        {displayTeams.map((t) => (
          <ItemCard
            key={t.id}
            $selected={t.team_name === selectedTeam}
            onClick={() => onSelectTeam(t.team_name)}
          >
            <CardTop>
              <TeamBadge>TEAM</TeamBadge>
              <CardActions onClick={(e) => e.stopPropagation()}>
                <ActionBtn onClick={() => openModal("team", "edit", t)}>
                  수정
                </ActionBtn>
                <DeleteBtn onClick={() => handleDelete("team", t.id)}>
                  삭제
                </DeleteBtn>
              </CardActions>
            </CardTop>
            <CardBody>
              <InfoText $bold $large>
                {t.team_name}
              </InfoText>
            </CardBody>
          </ItemCard>
        ))}
      </ItemList>
    </SectionColumn>
  );
}
