import { useState, useEffect, useMemo } from "react";
import moment from "moment";
import { Request_Get_Axios, Request_Post_Axios } from "../../API";
import { useSelector } from "react-redux";

export function useUserCallHistory() {
  const LoginInfo = useSelector(
    (state) => state.Login_Info_Reducer_State.Login_Info,
  );
  const [currentUser, setCurrentUser] = useState({
    name: "",
    role: "",
    team: "",
    isAdmin: false,
  });

  const [teams, setTeams] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [sites, setSites] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [logs, setLogs] = useState([]);

  const [selectedMonth, setSelectedMonth] = useState(
    moment().format("YYYY. MM"),
  );

  const initialFormState = {
    response_date: moment().format("YYYY-MM-DD"),
    team_name: "",
    company_name: "",
    site_name: "",
    equipment_name: "",
    responder: `${LoginInfo.name}`,
    customer_contact: "",
    start_hour: "18",
    start_min: "00",
    end_hour: "18",
    end_min: "00",
    category: { value: "시간 외", label: "시간 외" },
    content: "",
  };

  const [form, setForm] = useState(initialFormState);
  const [modalType, setModalType] = useState(null);
  const [modalInput, setModalInput] = useState({ ko: "", en: "", name: "" });

  useEffect(() => {
    getUserInfoData();
    loadMasterData();
  }, []);

  useEffect(() => {
    loadSupportLogs();
  }, [selectedMonth]);

  const getUserInfoData = async () => {
    const getUserInfo = await Request_Get_Axios("/CallHistory/getMyInfos");
    if (getUserInfo.status) {
      const cleanedTeamName = (getUserInfo.data.departmentName || "")
        .replace(/동탄|아산/g, "")
        .replace(/\s+/g, " ")
        .trim();
      setCurrentUser({
        ...currentUser,
        name: getUserInfo.data.fullName,
        team: cleanedTeamName,
        isAdmin: !!getUserInfo.data.admin_role,
      });
      setForm((prev) => ({ ...prev, team_name: cleanedTeamName }));
    }
  };

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
      console.error("이력 로드 실패", error);
    }
  };

  const isValidTeam = useMemo(() => {
    if (teams.length === 0 || !currentUser.team) return true;
    return teams.some((t) => t.team_name === currentUser.team);
  }, [teams, currentUser.team]);

  const handleFormChange = (key, value) => {
    if (!isValidTeam) return alert("해당 팀은 제공되지 않습니다.");
    setForm((prev) => {
      const updated = { ...prev, [key]: value };
      if (key === "team_name") {
        updated.company_name = "";
        updated.site_name = "";
        updated.equipment_name = "";
      }
      if (key === "company_name") {
        updated.site_name = "";
        updated.equipment_name = "";
      }
      if (key === "site_name") {
        updated.equipment_name = "";
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidTeam) return alert("해당 팀은 제공되지 않습니다.");
    if (!form.company_name || !form.site_name || !form.equipment_name)
      return alert("회사, 사이트, 장비를 모두 선택해주세요.");
    if (!form.content.trim()) return alert("상세 대응 내용을 작성해주세요.");

    const payload = {
      ...form,
      start_time: `${form.start_hour}:${form.start_min}`,
      end_time: `${form.end_hour}:${form.end_min}`,
      response_date: moment(form.response_date).format("YYYY. MM. DD"),
      category: form.category?.value || "시간 외",
    };

    try {
      const res = await Request_Post_Axios(
        "/CallHistory/createSupportLog",
        payload,
      );
      if (res.status) {
        alert("이력이 성공적으로 등록되었습니다.");
        const targetMonth = moment(form.response_date).format("YYYY. MM");
        if (selectedMonth === targetMonth) loadSupportLogs();
        else setSelectedMonth(targetMonth);

        setForm({
          ...initialFormState,
          team_name: currentUser.team,
          responder: currentUser.name,
        });
      }
    } catch (error) {
      alert("등록에 실패했습니다.");
    }
  };

  const handleAddMasterItem = async () => {
    try {
      let endpoint = "",
        payload = {};
      if (modalType === "company") {
        if (!modalInput.ko) return alert("회사명을 입력하세요.");
        endpoint = "/CallHistory/createCompany";
        payload = {
          team_name: form.team_name,
          company_name: modalInput.ko,
          company_name_en: modalInput.en,
        };
      } else if (modalType === "site") {
        if (!modalInput.name) return alert("사이트명을 입력하세요.");
        endpoint = "/CallHistory/createSite";
        payload = {
          team_name: form.team_name,
          company_name: form.company_name,
          site_name: modalInput.name,
        };
      } else if (modalType === "equipment") {
        if (!modalInput.name) return alert("장비명을 입력하세요.");
        endpoint = "/CallHistory/createEquipment";
        payload = {
          team_name: form.team_name,
          company_name: form.company_name,
          site_name: form.site_name,
          equipment_name: modalInput.name,
        };
      }

      const res = await Request_Post_Axios(endpoint, payload);
      if (res.status) {
        await loadMasterData();
        if (modalType === "company")
          handleFormChange("company_name", modalInput.ko);
        if (modalType === "site")
          handleFormChange("site_name", modalInput.name);
        if (modalType === "equipment")
          handleFormChange("equipment_name", modalInput.name);
        setModalType(null);
        setModalInput({ ko: "", en: "", name: "" });
      } else if (res.message === "DUPLICATE") {
        alert("이미 등록된 데이터입니다. (중복 방지)");
      }
    } catch (error) {
      alert("저장에 실패했습니다.");
    }
  };

  const handleCopyLog = (log) => {
    if (!isValidTeam) return alert("해당 팀은 제공되지 않습니다.");
    const [startH, startM] = log.start_time.split(":");
    const [endH, endM] = log.end_time.split(":");
    setForm((prev) => ({
      ...prev,
      team_name: log.team_name,
      company_name: log.company_name,
      site_name: log.site_name,
      equipment_name: log.equipment_name,
      customer_contact: log.customer_contact,
      start_hour: startH || "09",
      start_min: startM || "00",
      end_hour: endH || "18",
      end_min: endM || "00",
      category: { value: log.category, label: log.category },
      content: log.content,
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
    alert("이력 내용이 폼에 복사되었습니다.");
  };

  const myLogs = useMemo(() => {
    return logs.filter((log) => log.responderName.includes(currentUser.name));
  }, [logs, currentUser.name]);

  return {
    state: {
      currentUser,
      isValidTeam,
      teams,
      companies,
      sites,
      equipments,
      logs: myLogs,
      selectedMonth,
      form,
      filteredCompanies: companies.filter(
        (c) => c.team_name === form.team_name,
      ),
      filteredSites: sites.filter(
        (s) =>
          s.team_name === form.team_name &&
          s.company_name === form.company_name,
      ),
      filteredEquipments: equipments.filter(
        (e) =>
          e.team_name === form.team_name &&
          e.company_name === form.company_name &&
          e.site_name === form.site_name,
      ),
      modalType,
      modalInput,
    },
    actions: {
      setSelectedMonth,
      handleFormChange,
      handleCopyLog,
      handleSubmit,
      setModalType,
      setModalInput,
      handleAddMasterItem,
    },
  };
}
