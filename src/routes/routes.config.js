import React from "react";
import { Navigate } from "react-router-dom";
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
import { ExceptCE, ExceptIT } from "../configs/AccessLists";

export const ROUTES = [
  {
    path: "/Login",
    element: <LoginPage />,
    withAuthorization: false,
    withAdminAuthorization: false,
    accessCompany: ["ALL"],
    accessDepartment: ["ALL"],
  },
  {
    path: "/",
    element: <ReservationBoard />,
    withAuthorization: false,
    withAdminAuthorization: false,
    accessCompany: ["ALL"],
    accessDepartment: ["ALL"],
  },
  {
    path: "/Today_Food",
    element: <MealPlan></MealPlan>,
    withAuthorization: false,
    withAdminAuthorization: false,
    accessCompany: ["ALL"],
    accessDepartment: ["ALL"],
  },
  {
    path: "/FloorLayout",
    element: <FloorLayout />,
    withAuthorization: true,
    withAdminAuthorization: false,
    accessCompany: ["DHKS"],
    accessDepartment: ["ALL"],
  },

  {
    path: "/My_Pims",
    element: <Schedule />,
    withAuthorization: true,
    withAdminAuthorization: false,
    accessCompany: ["DHKS"],
    accessDepartment: ["ALL"],
  },
  {
    path: "/PartyPost",
    element: <PartyPost></PartyPost>,
    withAuthorization: true,
    withAdminAuthorization: false,
    accessCompany: ["ALL"],
    accessDepartment: ["ALL"],
  },
  {
    path: "/DHK/DHKUser",
    element: <UserManagement></UserManagement>,
    withAuthorization: true,
    withAdminAuthorization: false,
    accessCompany: ["ALL"],
    accessDepartment: ["ALL"],
  },
  {
    path: "/Vehicle/Portal",
    element: <VehiclePortal></VehiclePortal>,
    withAuthorization: false,
    withAdminAuthorization: false,
    accessCompany: ["ALL"],
    accessDepartment: ["ALL"],
  },
  {
    path: "/Vehicle/Contact/:car_Target_ID/:car_User_ID",
    element: <VehicleContact></VehicleContact>,
    withAuthorization: false,
    withAdminAuthorization: false,
    accessCompany: ["ALL"],
    accessDepartment: ["ALL"],
  },
  {
    path: "/Admin/BreakFast",
    element: <MealSchedule></MealSchedule>,
    withAuthorization: true,
    withAdminAuthorization: false,
    accessCompany: ["DHKS"],
    accessDepartment: ["ALL"],
  },

  {
    path: "/CallHistory",
    element: <CallHistory />,
    withAuthorization: true,
    withAdminAuthorization: false,
    accessCompany: ["DHKS"],
    accessDepartment: ExceptCE.concat(ExceptIT),
  },
  {
    path: "/Admin/CallHistory",
    element: <AdminPage />,
    withAuthorization: true,
    withAdminAuthorization: true,
    accessCompany: ["DHKS"],
    accessDepartment: ["ALL"],
  },

  {
    path: "*",
    element: <Navigate to="/" replace />,
    withAuthorization: false,
    withAdminAuthorization: false,
    accessCompany: ["ALL"],
    accessDepartment: ["ALL"],
  },
];
