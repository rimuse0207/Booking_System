import React, { useEffect, useState } from "react";

import RestrictRoute from "../RestrictRoute/RestrictRoute";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Request_Get_Axios } from "../../API";

const LoginRoute = ({
  withAdminAuthorization,
  withAuthorization,
  component,
  User_Info,
  authCode,
}) => {
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const [BlockContent, setBlockContent] = useState(false);
  const Alert_Go_To_Main_Home = () => {
    // toast.show({
    //   title: `로그인 이후에 접속이 가능합니다.`,
    //   successCheck: false,
    //   duration: 6000,
    // });
    // dispatch(Now_Path_Insert_Reducer_State_Func(pathname));
    return Navigate("/Login");
  };

  useEffect(() => {
    //전에 로그인 했는지 확인 있으면 Home으로 이동
    if (withAuthorization) before_Login_Checkig();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setBlockContent(true);
    }, 1000);
  }, [BlockContent]);

  const before_Login_Checkig = async () => {
    try {
      const Login_Checking = await Request_Get_Axios(
        "/Login/Login_Token_Check",
      );

      if (Login_Checking.status) {
        setBlockContent(true);
      } else {
        Alert_Go_To_Main_Home();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return withAuthorization ? (
    withAdminAuthorization ? (
      <RestrictRoute
        component={component}
        User_Info={User_Info}
        authCode={authCode}
      >
        {BlockContent ? component : ""}
      </RestrictRoute>
    ) : (
      <div>{BlockContent ? component : ""}</div>
    )
  ) : (
    <div>{component}</div>
  );
};

export default LoginRoute;
