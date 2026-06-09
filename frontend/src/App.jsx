import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import TaskList from "./components/TaskList"
import Profile from "./pages/Profile";
const App = () => {

  return (
    <>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<TaskList filter="all" />} />

        <Route path="/tasks/pending" element={<TaskList filter="pending" />} />

        <Route path="/tasks/completed" element={<TaskList filter="completed" />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};
export default App;
