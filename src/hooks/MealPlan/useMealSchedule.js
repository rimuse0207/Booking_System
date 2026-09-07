import { useState } from "react";
import { Request_Post_Axios } from "../../API";

export const useMealSchedule = () => {
  const [sqlQuery, setSqlQuery] = useState("");

  const handleQueryChange = (e) => {
    setSqlQuery(e.target.value);
  };

  const handleReset = () => {
    setSqlQuery("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sqlQuery.trim()) {
      alert("INSERT 쿼리문을 입력해 주세요.");
      return;
    }

    if (!sqlQuery.toUpperCase().includes("INSERT INTO")) {
      alert("유효한 INSERT 구문이 포함되어 있지 않습니다.");
      return;
    }

    if (window.confirm("입력한 쿼리문을 실행하여 식단표를 등록하시겠습니까?")) {
      const req = await Request_Post_Axios("/FoodApp/handleClicksFoodData", {
        FoodTextArea: sqlQuery,
      });

      if (req.status) {
        alert("식단표 등록이 완료되었습니다.");
        setSqlQuery(""); // 입력창 초기화
      } else {
        alert("실패");
      }
    }
  };

  return {
    state: { sqlQuery },
    actions: { handleQueryChange, handleReset, handleSubmit },
  };
};
