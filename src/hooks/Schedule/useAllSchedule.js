import { useState, useMemo, useEffect } from "react";
import moment from "moment";
import { Request_Get_Axios } from "../../API";

export const FILTER_OPTIONS = {
  location: ["판교", "동탄", "아산"],
  department: ["영업", "CE"],
  team: [
    "영업 1그룹",
    "영업 2그룹",
    "영업 3그룹",
    "영업기술",
    "부품소재",
    "OEM",
    "DICER",
    "GRINDER",
    "LASER",
    "기술교육팀",
    "안전팀",
  ],
  category: ["외근", "해외출장", "연차", "출근"],
};

// 가상 전체 데이터 (테스트용)
const todayStr = moment().format("YYYY-MM-DD");
const tomorrowStr = moment().add(1, "days").format("YYYY-MM-DD");
const DUMMY_ALL_SCHEDULES = [
  {
    id: 1,
    date: todayStr,
    location: "판교",
    department: "영업",
    team: "영업 1그룹",
    name: "김철수",
    category: "외근",
    client: "삼성전자",
    agenda: "분기 실적 리뷰",
    companions: "이영희",
  },
  {
    id: 2,
    date: todayStr,
    location: "동탄",
    department: "CE",
    team: "기술교육팀",
    name: "박지민",
    category: "출근",
    client: "-",
    agenda: "-",
    companions: "-",
  },
  {
    id: 3,
    date: tomorrowStr,
    location: "아산",
    department: "영업",
    team: "부품소재",
    name: "최동훈",
    category: "해외출장",
    client: "Apple",
    agenda: "신제품 스펙 협의",
    companions: "-",
  },
  {
    id: 4,
    date: todayStr,
    location: "판교",
    department: "CE",
    team: "안전팀",
    name: "정다은",
    category: "연차",
    client: "-",
    agenda: "개인 사유",
    companions: "-",
  },
  {
    id: 5,
    date: todayStr,
    location: "판교",
    department: "영업",
    team: "OEM",
    name: "유성재",
    category: "외근",
    client: "현대자동차",
    agenda: "납품 일정 조율",
    companions: "김철수",
  },
];

export const useAllSchedule = () => {
  const [filterDate, setFilterDate] = useState(new Date());
  const [filters, setFilters] = useState({
    location: [],
    department: [],
    team: [],
    category: ["외근", "해외출장", "연차"],
  });
  const [allSchedule, setAllSchedule] = useState([]);

  useEffect(() => {
    getAllSchedules();
  }, [filterDate]);

  const getAllSchedules = async () => {
    const req = await Request_Get_Axios("/ScheduleApp/All_Pims_Data", {
      Selected_Date: filterDate,
    });
    console.log(req);
    if (req.status) {
      setAllSchedule(req.data);
    }
  };

  const toggleFilter = (type, value) => {
    setFilters((prev) => {
      const currentList = prev[type];
      if (currentList.includes(value)) {
        return {
          ...prev,
          [type]: currentList.filter((item) => item !== value),
        };
      } else {
        return { ...prev, [type]: [...currentList, value] };
      }
    });
  };

  const removeFilter = (type, value) => {
    if (type === "date") setFilterDate(null);
    else
      setFilters((prev) => ({
        ...prev,
        [type]: prev[type].filter((item) => item !== value),
      }));
  };

  const resetFilters = () => {
    setFilterDate(new Date());
    setFilters({
      location: [],
      department: [],
      team: [],
      category: ["외근", "해외출장", "연차"],
    });
  };

  const formattedFilterDate = filterDate
    ? moment(filterDate).format("YYYY-MM-DD")
    : "";

  const activeFilterChips = useMemo(
    () => [
      ...filters.location.map((v) => ({
        type: "places",
        value: v,
        label: v,
      })),
      ...filters.department.map((v) => ({
        type: "department",
        value: v,
        label: v,
      })),
      ...filters.team.map((v) => ({ type: "team", value: v, label: v })),
      ...filters.category.map((v) => ({
        type: "category",
        value: v,
        label: v,
      })),
    ],
    [filterDate, filters],
  );

  const filteredData = useMemo(() => {
    return allSchedule.filter((row) => {
      if (filters.location.length > 0 && !filters.location.includes(row.places))
        return false;
      if (
        filters.department.length > 0 &&
        !filters.department.includes(row.department)
      )
        return false;
      if (filters.team.length > 0 && !filters.team.includes(row.team))
        return false;
      if (
        filters.category.length > 0 &&
        !filters.category.includes(row.division)
      )
        return false;
      return true;
    });
  }, [formattedFilterDate, filters]);

  return {
    state: { filterDate, filters },
    actions: { setFilterDate, toggleFilter, removeFilter, resetFilters },
    computed: { activeFilterChips, filteredData },
  };
};
