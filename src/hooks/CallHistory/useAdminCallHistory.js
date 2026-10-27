import { useState, useEffect } from "react";
import moment from "moment";
import { Request_Get_Axios, Request_Post_Axios } from "../../API";

export function useAdminCallHistory() {
  const [teams, setTeams] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [sites, setSites] = useState([]);
  const [equipments, setEquipments] = useState([]);

  const [logs, setLogs] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(
    moment().format("YYYY. MM"),
  );

  useEffect(() => {
    loadMasterData();
  }, []);
  useEffect(() => {
    loadSupportLogs();
  }, [selectedMonth]);

  const loadMasterData = async () => {
    try {
      const resTeams = await Request_Get_Axios("/CallHistory/getTeams");
      const resComps = await Request_Get_Axios("/CallHistory/getCompanies");
      const resSites = await Request_Get_Axios("/CallHistory/getSites");
      const resEqs = await Request_Get_Axios("/CallHistory/getEquipments");
      if (resTeams.status) setTeams(resTeams.data);
      if (resComps.status) setCompanies(resComps.data);
      if (resSites.status) setSites(resSites.data);
      if (resEqs.status) setEquipments(resEqs.data);
    } catch (error) {
      console.error("마스터 로드 실패", error);
    }
  };

  const loadSupportLogs = async () => {
    try {
      const res = await Request_Get_Axios("/CallHistory/getSupportLogs", {
        month: selectedMonth,
      });
      if (res.status) setLogs(res.data);
    } catch (error) {
      console.error("전체 이력 로드 실패", error);
    }
  };

  const handlePrevMonth = () =>
    setSelectedMonth(
      moment(selectedMonth + ".01", "YYYY. MM.DD")
        .subtract(1, "month")
        .format("YYYY. MM"),
    );
  const handleNextMonth = () =>
    setSelectedMonth(
      moment(selectedMonth + ".01", "YYYY. MM.DD")
        .add(1, "month")
        .format("YYYY. MM"),
    );

  const handleMasterSave = async (target, mode, data) => {
    try {
      const action = mode === "create" ? "create" : "update";
      const endpoint = `/CallHistory/${action}${target.charAt(0).toUpperCase() + target.slice(1)}`;
      const res = await Request_Post_Axios(endpoint, data);

      if (res.status) {
        await loadMasterData();
        return true;
      }
      if (res.message === "DUPLICATE") {
        alert("이미 등록된 데이터입니다. (중복 방지)");
        return false;
      }
      return false;
    } catch (error) {
      alert("데이터 저장에 실패했습니다.");
      return false;
    }
  };

  const handleMasterDelete = async (target, id) => {
    try {
      const endpoint = `/CallHistory/delete${target.charAt(0).toUpperCase() + target.slice(1)}`;
      const res = await Request_Post_Axios(endpoint, { id });

      if (res.status) {
        await loadMasterData();
        return true;
      }
      return false;
    } catch (error) {
      alert("데이터 삭제에 실패했습니다.");
      return false;
    }
  };

  const handleUpdateLog = async (updatedData) => {
    try {
      const res = await Request_Post_Axios(
        "/CallHistory/updateSupportLog",
        updatedData,
      );
      if (res.status) {
        alert("성공적으로 수정되었습니다.");
        loadSupportLogs(); // 목록 새로고침
        return true;
      }
    } catch (error) {
      alert("수정에 실패했습니다.");
    }
    return false;
  };

  // 💡 대응 이력 삭제 API 연결
  const handleDeleteLog = async (id) => {
    if (!window.confirm("정말 이 이력을 삭제하시겠습니까?")) return;
    try {
      const res = await Request_Post_Axios("/CallHistory/deleteSupportLog", {
        id,
      });
      if (res.status) {
        alert("삭제되었습니다.");
        loadSupportLogs(); // 목록 새로고침
      }
    } catch (error) {
      alert("삭제에 실패했습니다.");
    }
  };

  return {
    state: { teams, companies, sites, equipments, logs, selectedMonth },
    actions: {
      handleMasterSave,
      handleMasterDelete,
      handlePrevMonth,
      handleNextMonth,
      handleUpdateLog, // 💡 추가됨
      handleDeleteLog,
    },
  };
}
