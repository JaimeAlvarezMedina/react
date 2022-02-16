import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chat from "./App";
import Login from "./login";


export default function App_Final() {
    return (
      <BrowserRouter>
        <Routes>
            <Route path="chat" element={<Chat />} />
            <Route path="login" element={<Login />} />
            <Route index element={<Login />} />
            <Route path="/" element={<Login />} >
          </Route>
        </Routes>
      </BrowserRouter>
    );
  }