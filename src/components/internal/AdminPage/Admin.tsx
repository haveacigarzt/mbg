import React from "react";
import Navbar from "../Navbar";

const Admin = () => {
  return (
    <div className="flex">
      <Navbar role_id={1} />
      <div className="flex flex-col gap-3 p-3 w-[85%] bg-red-200">
        <div className="w-full flex gap-3">
          <div className="flex-1 bg-blue-200">
            <b>Akun SPPG</b>
          </div>
          <div className="flex-1 bg-blue-200">
            <b>Akun Stakeholder</b>
          </div>
          <div className="flex-1 bg-blue-200">
            <b>Data 3</b>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
