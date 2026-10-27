import React, { useState, useEffect } from "react";
import {
  ModalOverlay,
  ModalBox,
  ModalHeader,
  ModalTitle,
  CloseBtn,
  ModalBody,
  InputGroup,
  Label,
  Required,
  Input,
  SelectInput,
  ModalFooter,
  CancelBtn,
  ConfirmBtn,
} from "./admin.styles";

export default function MasterModal({ modal, setModal, currentSites, onSave }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (modal.isOpen) setFormData(modal.data || {});
  }, [modal]);

  if (!modal.isOpen) return null;

  const handleChange = (key, value) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    if (modal.target === "team" && !formData.team_name)
      return alert("팀명을 입력하세요.");
    if (modal.target === "company" && !formData.company_name)
      return alert("회사명을 입력하세요.");
    if (modal.target === "site" && !formData.site_name)
      return alert("사이트명을 입력하세요.");
    if (modal.target === "equipment") {
      if (!formData.site_name) return alert("사이트를 선택하세요.");
      if (!formData.equipment_name) return alert("장비명을 입력하세요.");
    }

    onSave(modal.target, modal.mode, formData);
    setModal({ isOpen: false });
  };

  const getTitle = () => {
    const action = modal.mode === "create" ? "추가" : "수정";
    const targetMap = {
      team: "팀",
      company: "회사",
      site: "사이트",
      equipment: "보유장비",
    };
    return `${targetMap[modal.target]} ${action}`;
  };

  return (
    <ModalOverlay>
      <ModalBox>
        <ModalHeader>
          <ModalTitle>{getTitle()}</ModalTitle>
          <CloseBtn onClick={() => setModal({ isOpen: false })}>✕</CloseBtn>
        </ModalHeader>

        <ModalBody>
          {modal.target === "team" && (
            <InputGroup>
              <Label>
                팀명 <Required>*</Required>
              </Label>
              <Input
                value={formData.team_name || ""}
                onChange={(e) => handleChange("team_name", e.target.value)}
                placeholder="OASIS 등록 부서명"
              />
            </InputGroup>
          )}
          {modal.target === "company" && (
            <>
              <InputGroup>
                <Label>
                  회사명 (한글) <Required>*</Required>
                </Label>
                <Input
                  value={formData.company_name || ""}
                  onChange={(e) => handleChange("company_name", e.target.value)}
                />
              </InputGroup>
              <InputGroup>
                <Label>회사명 (영문)</Label>
                <Input
                  value={formData.company_name_en || ""}
                  onChange={(e) =>
                    handleChange("company_name_en", e.target.value)
                  }
                />
              </InputGroup>
            </>
          )}
          {modal.target === "site" && (
            <InputGroup>
              <Label>
                사이트명 <Required>*</Required>
              </Label>
              <Input
                value={formData.site_name || ""}
                onChange={(e) => handleChange("site_name", e.target.value)}
              />
            </InputGroup>
          )}
          {modal.target === "equipment" && (
            <>
              <InputGroup>
                <Label>
                  소속 사이트 <Required>*</Required>
                </Label>
                <SelectInput
                  value={formData.site_name || ""}
                  onChange={(e) => handleChange("site_name", e.target.value)}
                >
                  <option value="">-- 선택 --</option>
                  {currentSites.map((s) => (
                    <option key={s.id} value={s.site_name}>
                      {s.site_name}
                    </option>
                  ))}
                </SelectInput>
              </InputGroup>
              <InputGroup>
                <Label>
                  보유 장비명 <Required>*</Required>
                </Label>
                <Input
                  value={formData.equipment_name || ""}
                  onChange={(e) =>
                    handleChange("equipment_name", e.target.value)
                  }
                />
              </InputGroup>
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <CancelBtn onClick={() => setModal({ isOpen: false })}>
            취소
          </CancelBtn>
          <ConfirmBtn onClick={handleSubmit}>
            {modal.mode === "create" ? "저장" : "수정 완료"}
          </ConfirmBtn>
        </ModalFooter>
      </ModalBox>
    </ModalOverlay>
  );
}
