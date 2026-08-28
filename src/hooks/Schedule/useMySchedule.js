import { useState, useMemo } from "react";
import moment from "moment";

export const useMySchedule = () => {
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [selectedDate, setSelectedDate] = useState(moment());
  const [activeTab, setActiveTab] = useState("register");
  const [selectedDates, setSelectedDates] = useState([]);

  const [schedules, setSchedules] = useState([
    {
      id: 1,
      category: "외근",
      startDate: moment().format("YYYY-MM-DD"),
      endDate: moment().format("YYYY-MM-DD"),
      client: "삼성전자 서초사옥",
      agenda: "신규 프로젝트 킥오프 미팅",
      companions: "이영희 책임",
    },
  ]);

  const [formData, setFormData] = useState({
    id: null,
    name: "유성재",
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

  const handleDateClick = (day) => {
    setSelectedDate(day);
    handleDatePickerChange(day.toDate());
    setActiveTab("register");
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedDates.length === 0)
      return alert("일정을 추가할 날짜를 캘린더에서 선택해주세요.");

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
      alert("일정이 수정(및 추가)되었습니다.");
    } else {
      const newSchedules = selectedDates.map((date, idx) => ({
        ...formData,
        id: Date.now() + idx,
        startDate: moment(date).format("YYYY-MM-DD"),
        endDate: moment(date).format("YYYY-MM-DD"),
      }));
      setSchedules((prev) => [...prev, ...newSchedules]);
      alert(`${selectedDates.length}개의 일정이 등록되었습니다.`);
    }

    setActiveTab("status");
    setFormData({
      id: null,
      name: "유성재",
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
      name: sch.name || "유성재",
      category: sch.category,
      client: sch.client || "",
      agenda: sch.agenda || "",
      companions: sch.companions || "",
    });
    setSelectedDates([moment(sch.startDate).toDate()]);
    setActiveTab("register");
  };

  const handleDelete = (id) => {
    if (window.confirm("정말로 이 일정을 삭제하시겠습니까?")) {
      setSchedules((prev) => prev.filter((sch) => sch.id !== id));
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
