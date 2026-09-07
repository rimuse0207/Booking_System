import { useState, useEffect, useCallback } from "react";
import moment from "moment";
import { Request_Get_Axios } from "../../API/index";

export const useMealPlan = () => {
  const [baseDate, setBaseDate] = useState(moment());
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const startOfWeek = moment(baseDate).startOf("isoWeek");
  const endOfWeek = moment(baseDate).startOf("isoWeek").add(4, "days");

  const getWeekOfMonth = (date) => {
    const clonedDate = moment(date);
    const month = clonedDate.month() + 1;
    const week = Math.ceil(clonedDate.date() / 7);
    return `${month}월 ${week}주차 식단표`;
  };

  const weekLabel = getWeekOfMonth(baseDate);
  const dateRange = `${startOfWeek.format("MM. DD")} ~ ${endOfWeek.format("MM. DD")}`;

  const goPrevWeek = useCallback(() => {
    setBaseDate((prev) => moment(prev).subtract(1, "weeks"));
  }, []);

  const goNextWeek = useCallback(() => {
    setBaseDate((prev) => moment(prev).add(1, "weeks"));
  }, []);

  const getKoreanDay = (dateString) => {
    const days = [
      "일요일",
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일",
    ];
    return days[moment(dateString).day()];
  };

  useEffect(() => {
    const fetchMeals = async () => {
      setIsLoading(true);
      try {
        const response = await Request_Get_Axios(
          "/FoodApp/RenewalWeekFoodMenu",
          {
            startDate: startOfWeek.format("YYYY-MM-DD"),
            endDate: endOfWeek.format("YYYY-MM-DD"),
          },
        );
        if (response.status) {
          const formattedMeals = response.data

            .sort(
              (a, b) =>
                new Date(a.food_week_menu_dates) -
                new Date(b.food_week_menu_dates),
            )

            .map((item) => ({
              id: item.food_week_menu_indexs,
              date: moment(item.food_week_menu_dates).format("YYYY. MM. DD"),
              day: getKoreanDay(item.food_week_menu_dates),
              rice: item.food_week_menu_menu1,
              soup: item.food_week_menu_menu2,
              side1: item.food_week_menu_menu3,
              side2: item.food_week_menu_menu4,
              side3: item.food_week_menu_menu5,
              side4: item.food_week_menu_menu6,
              side5: item.food_week_menu_menu7,
            }));
          setMeals(formattedMeals);
        }
      } catch (error) {
        console.error("식단 데이터를 불러오는데 실패했습니다:", error);
      } finally {
        setTimeout(() => setIsLoading(false), 300);
      }
    };

    fetchMeals();
  }, [baseDate]);

  return {
    state: { meals, weekLabel, dateRange, isLoading },
    actions: { goPrevWeek, goNextWeek },
  };
};
