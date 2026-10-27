import React, { useState } from "react";
import {
  Route,
  Routes,
  Router,
  BrowserRouter,
  Navigate,
} from "react-router-dom";

import { useSelector } from "react-redux";
import LoginRoute from "./LoginRoute/LoginRouteMainPage";
import LoginPage from "../pages/Login/LoginPage";
import ReservationBoard from "../pages/BookingReservation/ReservationBoard";
import MealPlan from "../pages/MealPlan/MealPlan";
import FloorLayout from "../pages/FloorLayout/FloorLayout";
import Schedule from "../pages/Schedule/Schedule";
import PartyPost from "../pages/PartyPost/PartyPost";
import UserManagement from "../pages/UserManagement.js/UserManagement";
import VehiclePortal from "../components/Car_Contact/VehiclePortal";
import VehicleContact from "../components/Car_Contact/VehicleContact";
import MealSchedule from "../pages/MealPlan/MealSchedule";
import CallHistory from "../pages/CallHistory/CallHistory";
import AdminPage from "../pages/CallHistory/Admin/AdminPage";
import { ROUTES } from "./routes.config";

const RouterMainPage = () => {
  const User_Info = useSelector(
    (state) => state.Login_Info_Reducer_State.Login_Info,
  );

  // const [RouterInfo, setRouterInfo] = useState([
  //   {
  //     path: "/Login",
  //     element: <LoginPage></LoginPage>,
  //     withAuthorization: false,
  //     withAdminAuthorization: false,
  //     accessCompany: ["ALL"],
  //   },
  //   {
  //     path: "/",
  //     element: <ReservationBoard></ReservationBoard>,
  //     withAuthorization: false,
  //     withAdminAuthorization: false,
  //     accessCompany: ["ALL"],
  //   },
  //   {
  //     path: "/Today_Food",
  //     element: <MealPlan></MealPlan>,
  //     withAuthorization: false,
  //     withAdminAuthorization: false,
  //     accessCompany: ["ALL"],
  //   },
  //   {
  //     path: "/FloorLayout",
  //     element: <FloorLayout></FloorLayout>,
  //     withAuthorization: true,
  //     withAdminAuthorization: false,
  //     accessCompany: ["DHKS"],
  //   },
  //   {
  //     path: "/My_Pims",
  //     element: <Schedule></Schedule>,
  //     withAuthorization: true,
  //     withAdminAuthorization: false,
  //     accessCompany: ["DHKS"],
  //   },
  //   {
  //     path: "/CallHistory",
  //     element: <CallHistory></CallHistory>,
  //     withAuthorization: true,
  //     withAdminAuthorization: false,
  //     accessCompany: ["DHKS"],
  //   },
  //   {
  //     path: "/Admin/CallHistory",
  //     element: <AdminPage></AdminPage>,
  //     withAuthorization: true,
  //     withAdminAuthorization: false,
  //     accessCompany: ["DHKS"],
  //   },

  //   {
  //     path: "/PartyPost",
  //     element: <PartyPost></PartyPost>,
  //     withAuthorization: false,
  //     withAdminAuthorization: false,
  //     accessCompany: ["ALL"],
  //   },
  //   {
  //     path: "/DHK/DHKUser",
  //     element: <UserManagement></UserManagement>,
  //     withAuthorization: false,
  //     withAdminAuthorization: false,
  //     accessCompany: ["ALL"],
  //   },
  //   {
  //     path: "/Vehicle/Portal",
  //     element: <VehiclePortal></VehiclePortal>,
  //     withAuthorization: false,
  //     withAdminAuthorization: false,
  //     accessCompany: ["ALL"],
  //   },
  //   {
  //     path: "/Vehicle/Contact/:car_Target_ID/:car_User_ID",
  //     element: <VehicleContact></VehicleContact>,
  //     withAuthorization: false,
  //     withAdminAuthorization: false,
  //     accessCompany: ["ALL"],
  //   },
  //   {
  //     path: "/Admin/BreakFast",
  //     element: <MealSchedule></MealSchedule>,
  //     withAuthorization: true,
  //     withAdminAuthorization: false,
  //     accessCompany: ["DHKS"],
  //   },

  //   {
  //     path: "*",
  //     element: <Navigate to="/"></Navigate>,
  //     withAuthorization: true,
  //     withAdminAuthorization: false,
  //     accessCompany: ["ALL"],
  //   },
  // ]);

  return (
    <BrowserRouter>
      <Routes>
        {ROUTES.map((route) => {
          // 1. 회사 권한 체크
          const isCompanyAllowed =
            route.accessCompany.includes("ALL") ||
            route.accessCompany.includes(User_Info?.company);

          // 2. 부서 권한 체크 (추가)
          const isDepartmentAllowed =
            !route.accessDepartment ||
            route.accessDepartment.includes("ALL") ||
            route.accessDepartment.includes(User_Info?.team);

          // 3. 최종 권한 허용 여부
          const isAllowed = isCompanyAllowed && isDepartmentAllowed;

          return (
            <Route
              key={route.path}
              path={route.path}
              element={
                isAllowed ? (
                  <LoginRoute
                    withAdminAuthorization={route.withAdminAuthorization}
                    withAuthorization={route.withAuthorization}
                    component={route.element}
                    authCode={route.authCode}
                    User_Info={User_Info}
                  />
                ) : (
                  // 권한이 없을 때 접근을 차단하고 튕겨냅니다.
                  <Navigate to="/" replace />
                )
              }
            />
          );
        })}
      </Routes>
    </BrowserRouter>
  );
};
export default RouterMainPage;
