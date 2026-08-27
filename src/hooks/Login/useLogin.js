import { useState } from "react";
import { Request_Post_Axios } from "../../API";
import { useDispatch } from "react-redux";
import { Login_Info_Apply_State_Func } from "../../models/LoginInfoReducer/LoginInfoReduce";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../constants/Toast/ToastContext";
// import { Request_Post_Axios } from "../../API/index"; // 실제 연동 시 사용

export const useLogin = () => {
  const dispatch = useDispatch();
  const Navigation = useNavigate();
  const { showToast } = useToast();
  // 1: 일반 로그인 화면, 2: 비밀번호 변경 화면
  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    userId: "",
    password: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrorMsg(""); // 타이핑 시 에러 메시지 초기화
  };

  // [Step 1] 로그인 로직
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.userId || !form.password) {
      setErrorMsg("아이디와 비밀번호를 모두 입력해 주세요.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await Request_Post_Axios("/Login/LoginChecking", {
        LoginInfoData: {
          ID: form.userId,
          PW: form.password,
        },
      });

      console.log(res);
      if (!res.data.dataSuccess) {
        setForm({ ...form, password: "" });
        // alert("PW를 다시 확인 해주세요.");
        showToast("아이디 또는 비밀번호를 다시 확인 해 주세요.", "error");
        setIsLoading(false);
        return;
      }

      if (res.data.PasswordChange) {
        setStep(2);
        setForm({ ...form, password: "" });
        alert("초기 비밀번호입니다. 비밀번호 변경 이후 사용 가능합니다.");
        setIsLoading(false);
        return;
      }

      if (res.data.dataSuccess) {
        localStorage.setItem("Token", res.data.token);
        localStorage.setItem(
          "userId",
          res.data.result.brity_works_user_info_id,
        );
        dispatch(
          Login_Info_Apply_State_Func({
            id: res.data.result.brity_works_user_info_id,
            name: res.data.result.brity_works_user_info_name,
            company: res.data.result.brity_works_user_info_company,
            admin_access:
              res.data.result.brity_works_user_info_amdin_access === 1,
          }),
        );
        setIsLoading(false);
        Navigation("/");
      }
    } catch (error) {
      setErrorMsg("아이디 또는 비밀번호가 올바르지 않습니다.");
      setIsLoading(false);
    }
  };

  // [Step 2] 비밀번호 변경 로직
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (form.newPassword.length < 8) {
      setErrorMsg("비밀번호는 8자리 이상이어야 합니다.");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setErrorMsg("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await Request_Post_Axios("/Login/User_Password_Change", {
        PasswordChangeData: {
          ID: form.userId,
          New_PW: form.confirmPassword,
        },
      });
      if (res.data.dataSuccess) {
        showToast("비밀번호가 변경되었습니다.", "success");
      } else {
        showToast(
          "비밀번호 변경에 실패하였습니다. IT팀으로 문의 바랍니다.",
          "error",
        );
        return;
      }
      setStep(1);
      setIsLoading(false);
    } catch (error) {
      setErrorMsg("비밀번호 변경에 실패했습니다. 다시 시도해 주세요.");
      setIsLoading(false);
    }
  };

  // 컴포넌트에서 쓸 수 있도록 상태(state)와 함수(actions)를 구조화하여 반환
  return {
    state: { step, form, errorMsg, isLoading },
    actions: { handleChange, handleLogin, handleChangePassword },
  };
};
