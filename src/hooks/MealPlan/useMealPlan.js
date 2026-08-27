import { useState, useEffect, useCallback } from "react";
import moment from "moment";
import { Request_Get_Axios } from "../../API/index"; // API 모듈 경로에 맞게 수정

export const useMealPlan = () => {
  const [baseDate, setBaseDate] = useState(moment());
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 월요일 ~ 금요일 날짜 계산
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

  // 💡 한글 요일 구하기 헬퍼 함수
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
  // 💡 API 데이터 패칭
  useEffect(() => {
    const fetchMeals = async () => {
      setIsLoading(true);
      try {
        /* 
        // 💡 [실제 연동 시 아래 주석 해제 및 API 주소 변경]
        const response = await Request_Get_Axios("/FoodApp/meals", {
          startDate: startOfWeek.format("YYYY-MM-DD"),
          endDate: endOfWeek.format("YYYY-MM-DD"),
        });
        
        if (response.data) {
          setMeals(response.data);
        }
        */

        const response = await Request_Get_Axios(
          "/FoodApp/RenewalWeekFoodMenu",
          {
            startDate: startOfWeek.format("YYYY-MM-DD"),
            endDate: endOfWeek.format("YYYY-MM-DD"),
          },
        );
        if (response.status) {
          const formattedMeals = response.data
            // 1. 날짜가 뒤섞여 있으므로 먼저 과거 -> 미래 순으로 정렬합니다.
            .sort(
              (a, b) =>
                new Date(a.food_week_menu_dates) -
                new Date(b.food_week_menu_dates),
            )
            // 2. 컴포넌트가 쓰기 편하게 객체 키(Key)를 예쁘게 바꿔줍니다.
            .map((item) => ({
              id: item.food_week_menu_indexs,
              date: moment(item.food_week_menu_dates).format("YYYY. MM. DD"), // 화면 표시용 (예: 2025. 12. 08)
              day: getKoreanDay(item.food_week_menu_dates), // 요일 추출
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
  }, [baseDate]); // baseDate(기준 날짜)가 바뀔 때마다 다시 API 호출

  return {
    state: { meals, weekLabel, dateRange, isLoading },
    actions: { goPrevWeek, goNextWeek },
  };
};
