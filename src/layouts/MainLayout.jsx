import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import ChatWidget from "../components/ChatWidget";

export default function MainLayout({ children }) {
  const userData = JSON.parse(localStorage.getItem("user"));
  const role = userData?.roleEnum || "BARBER"; // fallback nếu null

  return (
    <div>
      <Navbar role={role} />
      <div className="">{children}</div>
      <ChatWidget />
    </div>
  );
}
