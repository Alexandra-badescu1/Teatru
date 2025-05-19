import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axios";
import { useAppContext } from "../context/Context";

interface SearchResult {
  id: number;
  name: string;
}

interface NavbarProps {
  onSelectCategory: (category: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSelectCategory }) => {
  const { isLoggedIn, logout } = useAppContext();

  const getInitialTheme = (): string => localStorage.getItem("theme") || "light-theme";
  const [theme, setTheme] = useState<string>(getInitialTheme());
  const [input, setInput] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const fetchData = async (value: string) => {
    try {
      const response = await api.get<SearchResult[]>(`/get/search?keyword=${value}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleChange = (value: string) => {
    setInput(value);
    if (value.trim().length > 0) {
      fetchData(value);
    }
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark-theme" ? "light-theme" : "dark-theme"));
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <Link to="/" className="navbar-brand me-3">
            <img src="src/assets/TeatruLogo.jpg" alt="Logo" style={{ height: "40px" }} />
          </Link>

          <input
            className="form-control w-50"
            type="search"
            placeholder="Search"
            value={input}
            onChange={(e) => handleChange(e.target.value)}
          />

          <div className="d-flex align-items-center">
            <button className="btn btn-outline-secondary mx-2" onClick={toggleTheme}>
              <i className={`bi ${theme === "dark-theme" ? "bi-moon-fill" : "bi bi-sun"}`}></i>
            </button>

            {isLoggedIn ? (
              <>
                <Link to="/profile" className="btn btn-info mx-2">Profile</Link>
                <button className="btn btn-danger mx-2" onClick={logout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary mx-2">Login</Link>
                <Link to="/signup" className="btn btn-secondary mx-2">Sign Up</Link>
              </>
            )}
          </div>
        </div>

        <Link to="/cart" className="btn btn-outline-dark mx-2">
          <i className="bi bi-cart"></i>
        </Link>
      </nav>

      <div className="down-nav">
        <div className="down-nav-links">
          <Link to="/about-us">About Us</Link>
          <Link to="/teatru-copii">Teatrul De Copii</Link>
          <Link to="/comedii">Comedii</Link>
          <Link to="/festivale">Festival</Link>
          <Link to="/activitati-studenti">Activități Studenți</Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
