import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Request_Get_Axios } from "../../API";

const RestrictRoute = ({ component, User_Info, authCode }) => {
  const Navigate = useNavigate();
  const [withAdminAuthorization, setwithAdminAuthorization] = useState(false);
  const Alert_Go_To_Main_Home = () => {
    // toast.show({
    //   title: `관리자 권한이 없습니다.`,
    //   successCheck: false,
    //   duration: 6000,
    // });
    return Navigate("/");
  };
  const Checking_withAdminAuthorizaion = async () => {
    const Checking_withAdminAuthorizaion_Axios = await Request_Get_Axios(
      "/Login/Checking_withAdminAuthorizaion",
      {
        authCode,
      },
    );

    if (Checking_withAdminAuthorizaion_Axios.status) {
      setwithAdminAuthorization(true);
    } else {
      setwithAdminAuthorization(false);
      Alert_Go_To_Main_Home();
    }
  };
  useEffect(() => {
    Checking_withAdminAuthorizaion();
  }, []);

  return withAdminAuthorization ? component : "";
};

export default RestrictRoute;
