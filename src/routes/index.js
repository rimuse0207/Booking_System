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

const RouterMainPage = () => {
  const User_Info = useSelector(
    (state) => state.Login_Info_Reducer_State.Login_Info,
  );
  const [RouterInfo, setRouterInfo] = useState([
    {
      path: "/Login",
      element: <LoginPage></LoginPage>,
      withAuthorization: false,
      withAdminAuthorization: false,
    },
    {
      path: "/",
      element: <ReservationBoard></ReservationBoard>,
      withAuthorization: false,
      withAdminAuthorization: false,
    },
    {
      path: "/Today_Food",
      element: <MealPlan></MealPlan>,
      withAuthorization: false,
      withAdminAuthorization: false,
    },
    {
      path: "/FloorLayout",
      element: <FloorLayout></FloorLayout>,
      withAuthorization: true,
      withAdminAuthorization: false,
    },

    {
      path: "*",
      element: <Navigate to="/Home"></Navigate>,
      withAuthorization: true,
      withAdminAuthorization: false,
    },
  ]);

  return (
    <BrowserRouter>
      <Routes>
        {RouterInfo.map((route) => {
          return (
            <Route
              key={route.path}
              path={route.path}
              element={
                <LoginRoute
                  withAdminAuthorization={route.withAdminAuthorization}
                  withAuthorization={route.withAuthorization}
                  component={route.element}
                  authCode={route.authCode}
                  User_Info={User_Info}
                ></LoginRoute>
              }
            ></Route>
          );
        })}
      </Routes>
    </BrowserRouter>
  );
};
export default RouterMainPage;
