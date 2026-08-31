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
    [filterDate, filters, allSchedule],
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
  }, [formattedFilterDate, filters, allSchedule]);

  return {
    state: { filterDate, filters },
    actions: { setFilterDate, toggleFilter, removeFilter, resetFilters },
    computed: { activeFilterChips, filteredData },
  };
};
