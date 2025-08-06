import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../asset/logo.png";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const navigate = useNavigate();
  
  const handleLinkClick = () => setIsOpen(false);

  const token = localStorage.getItem("token");
  const user = token ? JSON.parse(localStorage.getItem("user")) : null;
  const userName = user?.name || "User";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleAuthToggle = () => {
    setShowLogin((prev) => !prev);
  };

  return (
    <nav className="bg-purple-300 fixed shadow-md z-50 w-full px-5 py-0.5">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="QuizzyBee Logo" className="h-14  w-36 mr-2" />
            {/* <span className="text-2xl font-bold text-black mr-4">
              QuizzyBee
            </span> */}
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link to="/" className="text-gray-700 hover:text-green-600">
              Home
            </Link>
            <Link to="/quizs" className="text-gray-700 hover:text-green-600">
              Quizzes
            </Link>
            {token && (
              <>
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-green-600"
                >
                  Profile
                </Link>
                <Link
                  to="/QuizsHistory"
                  className="text-gray-700 hover:text-green-600"
                >
                  My Results
                </Link>
                <Link
                  to="/myquizzes"
                  className="text-gray-700 hover:text-green-600"
                >
                  My Quizzes
                </Link>
              </>
            )}
            <Link to="/about" className="text-gray-700 hover:text-green-600">
              About Us
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700 focus:outline-none text-2xl"
          >
            ☰
          </button>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {token ? (
            <>
              <span
                onClick={() => {
                  navigate("/profile");
                }}
                className="text-black font-medium text-xl"
              >
                Hi! {userName}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to={showLogin ? "/Login" : "/Signup"}
              onClick={handleAuthToggle}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            >
              {showLogin ? "Login" : "Signup"}
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden mt-2 space-y-2">
          <Link
            to="/"
            onClick={handleLinkClick}
            className="block text-gray-700 hover:text-green-600"
          >
            Home
          </Link>
          <Link
            to="/quizs"
            onClick={handleLinkClick}
            className="block text-gray-700 hover:text-green-600"
          >
            Quizzes
          </Link>
          {token && (
            <>
              <Link
                to="/profile"
                onClick={handleLinkClick}
                className="block text-gray-700 hover:text-green-600"
              >
                Profile
              </Link>
              <Link
                to="/QuizsHistory"
                onClick={handleLinkClick}
                className="block text-gray-700 hover:text-green-600"
              >
                My Results
              </Link>
              <Link
                to="/myquizzes"
                onClick={handleLinkClick}
                className="block text-gray-700 hover:text-green-600"
              >
                My Quizzes
              </Link>
            </>
          )}
          <Link
            to="/about"
            onClick={handleLinkClick}
            className="block text-gray-700 hover:text-green-600"
          >
            About Us
          </Link>

          {token ? (
            <button
              onClick={() => {
                handleLogout();
                handleLinkClick();
              }}
              className="w-full text-center px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
            >
              Logout
            </button>
          ) : (
            <Link
              to={showLogin ? "/Login" : "/Signup"}
              onClick={() => {
                handleLinkClick();
                handleAuthToggle();
              }}
              className="w-full text-center px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 block"
            >
              {showLogin ? "Login" : "Signup"}
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
