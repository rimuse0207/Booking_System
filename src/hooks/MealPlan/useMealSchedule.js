import { useState, useEffect, useRef } from "react";
import { Request_Post_Axios } from "../../API";

export const useMealSchedule = () => {
  const [sqlQuery, setSqlQuery] = useState("");

  // --- 이메일 인증 관련 상태 ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailId, setEmailId] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3분 = 180초
  const [myUuid, setMyUuid] = useState(null);
  const timerRef = useRef(null);
  const DOMAIN = "@dhk.co.kr";

  // 타이머 로직
  useEffect(() => {
    if (isCodeSent && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isCodeSent, timeLeft]);

  // 남은 시간을 MM:SS 형식으로 변환
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleQueryChange = (e) => setSqlQuery(e.target.value);
  const handleEmailChange = (e) => {
    const filteredValue = e.target.value.replace(/@/g, "");
    setEmailId(filteredValue);
  };
  const handleCodeChange = (e) => setAuthCode(e.target.value);

  const handleReset = () => setSqlQuery("");

  // 모달 닫기 및 인증 초기화
  const closeModal = () => {
    setIsModalOpen(false);
    setEmailId("");
    setAuthCode("");
    setIsCodeSent(false);
    setTimeLeft(180);
    clearInterval(timerRef.current);
  };

  // 1. 등록 버튼 클릭 시 (유효성 검사 후 모달 오픈)
  const handleSubmitClick = (e) => {
    e.preventDefault();
    if (!sqlQuery.trim()) {
      alert("INSERT 쿼리문을 입력해 주세요.");
      return;
    }
    if (!sqlQuery.toUpperCase().includes("INSERT INTO")) {
      alert("유효한 INSERT 구문이 포함되어 있지 않습니다.");
      return;
    }
    setIsModalOpen(true); // 검증 통과 시 모달 열기
  };

  // 2. 인증 코드 발송
  const handleSendCode = async () => {
    if (!emailId) {
      alert("이메일 아이디를 입력해주세요.");
      return;
    }

    try {
      const fullEmail = `${emailId}${DOMAIN}`;
      const req = await Request_Post_Axios("/FoodApp/sendEmailCode", {
        email: fullEmail,
      });
      if (req.status) {
        setMyUuid(req.data);
        alert(`${fullEmail}로 인증 코드가 발송되었습니다.`);
        setIsCodeSent(true);
        setTimeLeft(180); // 타이머 리셋
      } else {
        throw new Error();
      }
    } catch (error) {
      alert("코드 발송에 실패했습니다.");
    }
  };

  // 3. 코드 인증 및 최종 쿼리 전송
  const handleVerifyAndSubmit = async () => {
    if (!authCode || authCode.length !== 6) {
      alert("6자리 인증 코드를 정확히 입력해주세요.");
      return;
    }
    if (timeLeft === 0) {
      alert("인증 시간이 만료되었습니다. 다시 발송해주세요.");
      return;
    }

    try {
      const authReq = await Request_Post_Axios("/FoodApp/verifyCode", {
        email: `${emailId}${DOMAIN}`,
        code: authCode,
        uuid: myUuid,
      });
      if (!authReq.status) return alert("인증 번호가 일치하지 않습니다.");

      const req = await Request_Post_Axios("/FoodApp/handleClicksFoodData", {
        FoodTextArea: sqlQuery,
      });

      if (req.status) {
        alert("식단표 등록이 완료되었습니다.");
        setSqlQuery("");
        closeModal();
      } else {
        alert("데이터 등록 실패");
      }
    } catch (error) {
      alert("서버 오류가 발생했습니다.");
    }
  };

  return {
    state: {
      sqlQuery,
      isModalOpen,
      emailId,
      authCode,
      isCodeSent,
      timeLeft: formatTime(timeLeft),
      DOMAIN,
    },
    actions: {
      handleQueryChange,
      handleReset,
      handleSubmitClick,
      handleEmailChange,
      handleCodeChange,
      handleSendCode,
      handleVerifyAndSubmit,
      closeModal,
    },
  };
};
