import "./App.css";
import React, { useState, useEffect } from "react";
import Home from "./components/Home";
import Navbar from "./components/NavBar";
import SignUp from "./components/SignUp";
import LogIn from "./components/Login";
import Cart from "./components/Cart";
import ProfilePage from './components/ProfilePage';
import KidsTheater from "./components/KidTheater";
import Comedy from "./components/Comedy";
import Festivals from "./components/Festivals";
import StudentActivities from "./components/ActivStudents";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import AboutUs from "./components/AboutUs";
import { useAppContext } from "./context/Context";

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
 const { isLoggedIn, logout } = useAppContext();

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleLogout = () => {
  logout(); // folosește logout din context
};


  return (
      <BrowserRouter>
        <Navbar 
          onSelectCategory={handleCategorySelect} 
        />
        <Routes>
          <Route
            path="/"
            element={<Home selectedCategory={selectedCategory} />}
          />
          <Route path="/signup" element={<SignUp />} />
         <Route path="/profile" element={<ProfilePage />} />
          <Route path="/cart" element={<Cart />}/>
          <Route path="/teatru-copii" element={<KidsTheater />} />
        <Route path="/comedii" element={<Comedy />} />
        <Route path="/festivale" element={<Festivals />} />
        <Route path="/activitati-studenti" element={<StudentActivities />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/login" element={<LogIn />} />
        </Routes>
      </BrowserRouter> 
  );
};

export default App;
