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

export default function EquipmentColumn({
  equipments = [],
  currentSites = [],
  activeEquipmentName,
  onSelectEquipment,
  openModal,
  handleDelete,
}) {
  const [search, setSearch] = useState("");

  const displayEquipments = equipments.filter((eq) =>
    eq.equipment_name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <SectionColumn>
      <SectionHeader>
        <SectionTitle>4. 보유장비 관리</SectionTitle>
        <Badge>{equipments.length}</Badge>
      </SectionHeader>

      <SubInfoBox>현재 사이트 소속 장비</SubInfoBox>

      <ControlRow>
        <SearchInput
          placeholder="장비명 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <AddButton
          onClick={() => openModal("equipment", "create")}
          disabled={currentSites.length === 0}
        >
          + 추가
        </AddButton>
      </ControlRow>

      <ItemList>
        {displayEquipments.length === 0 && (
          <EmptyText>검색 결과가 없습니다.</EmptyText>
        )}
        {displayEquipments.map((eq) => (
          <ItemCard
            key={eq.id}
            $selected={eq.equipment_name === activeEquipmentName} // 💡 선택 시 하이라이트 반영
            onClick={() => onSelectEquipment(eq.equipment_name)} // 💡 클릭 이벤트 적용
          >
            <CardTop>
              <CodeBadge>{eq.site_name}</CodeBadge>
              <CardActions onClick={(e) => e.stopPropagation()}>
                <ActionBtn onClick={() => openModal("equipment", "edit", eq)}>
                  수정
                </ActionBtn>
                <DeleteBtn onClick={() => handleDelete("equipment", eq.id)}>
                  삭제
                </DeleteBtn>
              </CardActions>
            </CardTop>
            <CardBody>
              <InfoText $bold>{eq.equipment_name}</InfoText>
            </CardBody>
          </ItemCard>
        ))}
      </ItemList>
    </SectionColumn>
  );
}
