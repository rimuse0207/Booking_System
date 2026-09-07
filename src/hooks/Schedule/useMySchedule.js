import { useState, useMemo, useEffect } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { useToast } from "../../constants/Toast/ToastContext";
import { Request_Get_Axios, Request_Post_Axios } from "../../API";

export const useMySchedule = () => {
  const LoginInfo = useSelector(
    (state) => state.Login_Info_Reducer_State.Login_Info,
  );
  const { showToast } = useToast();
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [selectedDate, setSelectedDate] = useState(moment());
  const [activeTab, setActiveTab] = useState("register");
  const [selectedDates, setSelectedDates] = useState([]);

  const [schedules, setSchedules] = useState([]);

  const [formData, setFormData] = useState({
    id: null,
    name: LoginInfo.name,
    category: "외근",
    client: "",
    agenda: "",
    companions: "",
  });

  const calendarWeeks = useMemo(() => {
    const startDay = currentMonth.clone().startOf("month").startOf("week");
    const endDay = currentMonth.clone().endOf("month").endOf("week");
    const calendar = [];
    let day = startDay.clone().subtract(1, "day");

    while (day.isBefore(endDay, "day")) {
      calendar.push(
        Array(7)
          .fill(0)
          .map(() => day.add(1, "day").clone()),
      );
    }
    return calendar;
  }, [currentMonth]);

  const prevMonth = () =>
    setCurrentMonth(currentMonth.clone().subtract(1, "month"));
  const nextMonth = () => setCurrentMonth(currentMonth.clone().add(1, "month"));
  const goToday = () => setCurrentMonth(moment());

  const handleDatePickerChange = (date) => {
    const dateStr = moment(date).format("YYYY-MM-DD");
    const isAlreadySelected = selectedDates.some(
      (d) => moment(d).format("YYYY-MM-DD") === dateStr,
    );

    if (isAlreadySelected)
      setSelectedDates(
        selectedDates.filter((d) => moment(d).format("YYYY-MM-DD") !== dateStr),
      );
    else setSelectedDates([...selectedDates, date]);
  };

  const getMyPimsData = async () => {
    const req = await Request_Get_Axios("/ScheduleApp/getUserSchedule", {
      selectDate: moment(currentMonth).format("YYYY-MM"),
    });
    if (req.status) {
      setSchedules(req.data);
    }
  };

  useEffect(() => {
    getMyPimsData();
  }, [currentMonth, activeTab]);

  const handleDateClick = (day) => {
    setSelectedDate(day);
    handleDatePickerChange(day.toDate());
    setActiveTab("register");
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedDates.length === 0)
      return showToast(
        "일정을 추가할 날짜를 캘린더에서 선택해주세요.",
        "error",
      );

    if (formData.id) {
      const updatedSchedules = selectedDates.map((date, idx) => ({
        ...formData,
        id: idx === 0 ? formData.id : Date.now() + idx,
        startDate: moment(date).format("YYYY-MM-DD"),
        endDate: moment(date).format("YYYY-MM-DD"),
      }));

      setSchedules((prev) => [
        ...prev.filter((sch) => sch.id !== formData.id),
        ...updatedSchedules,
      ]);
      showToast("일정을 수정하였습니다.", "success");
    } else {
      const newSchedules = selectedDates.map((date, idx) => ({
        ...formData,
        id: Date.now() + idx,
        startDate: moment(date).format("YYYY-MM-DD"),
        endDate: moment(date).format("YYYY-MM-DD"),
      }));
      const req = await Request_Post_Axios("/ScheduleApp/addUserSchedule", {
        newSchedules,
      });
      if (req.status) {
        setSchedules((prev) => [...prev, ...newSchedules]);
        await getMyPimsData();
        showToast(
          `${selectedDates.length}개의 일정이 등록되었습니다.`,
          "success",
        );
      }
    }

    setActiveTab("status");
    setFormData({
      id: null,
      name: LoginInfo.name,
      category: "외근",
      client: "",
      agenda: "",
      companions: "",
    });
    setSelectedDates([]);
  };

  const handleEdit = (sch) => {
    setFormData({
      id: sch.id,
      name: sch.name || "",
      category: sch.category,
      client: sch.client || "",
      agenda: sch.agenda || "",
      companions: sch.companions || "",
    });
    setSelectedDates([moment(sch.startDate).toDate()]);
    setActiveTab("register");
  };

  const handleDelete = async (id) => {
    if (window.confirm("정말로 이 일정을 삭제하시겠습니까?")) {
      const req = await Request_Post_Axios("/ScheduleApp/deleteUserSchedule", {
        id,
      });
      if (req.status) {
        setSchedules((prev) => prev.filter((sch) => sch.id !== id));
        await getMyPimsData();
        showToast(`일정을 삭제하였습니다.`, "success");
      } else {
        showToast(`일정을 삭제에 실패하였습니다.`, "error");
      }
    }
  };

  const getSchedulesForDay = (dayStr) =>
    schedules.filter((sch) =>
      moment(dayStr).isBetween(sch.startDate, sch.endDate, "day", "[]"),
    );

  return {
    state: {
      currentMonth,
      selectedDate,
      activeTab,
      selectedDates,
      schedules,
      formData,
    },
    actions: {
      setActiveTab,
      setFormData,
      prevMonth,
      nextMonth,
      goToday,
      handleDateClick,
      handleDatePickerChange,
      handleFormChange,
      handleSubmit,
      handleEdit,
      handleDelete,
    },
    computed: { calendarWeeks, getSchedulesForDay },
  };
};
