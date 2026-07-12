import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/shared/Navbar";

const CustomerLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default CustomerLayout;
