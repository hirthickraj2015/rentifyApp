import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Home from "./components/Home";
import Search from "./components/Search";
import Accounts from "./components/Accounts";
import Interest from "./components/Interest";
import Upload from "./components/Upload"; 
import Login from "./components/Login";
import Register from "./components/Register";
import { AuthProvider, useAuth } from "./components/AuthContext";

const App = () => {
  const [open, setOpen] = useState(true);

  const checkScreenSize = () => {
    if (window.innerWidth < 768) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  useEffect(() => {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const SidebarMenu = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoggedIn, logout } = useAuth();

    const Menus = [
      { title: "Home", src: "Chart_fill", path: "/" },
      { title: "Search", src: "Search", path: "/search" },
      { title: "Accounts", src: "User", path: "/accounts" },
      { title: "Interest", src: "Chart", path: "/interest" },
      { title: "Upload", src: "Folder", path: "/upload" },
      { title: isLoggedIn ? "Log Out" : "Log In", src: "Setting", path: isLoggedIn ? "/logout" : "/login", gap: true }
    ];

    const handleMenuClick = (path) => {
      if (path === "/logout") {
        logout();
        navigate("/"); // Redirect to home after logout
      } else {
        navigate(path);
      }
    };

    return (
      <ul className="pt-6">
        {Menus.map((Menu, index) => (
          <li
            key={index}
            className={`flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 ${
              Menu.gap ? "mt-9" : "mt-2"} ${
              location.pathname === Menu.path && "bg-light-white"}`}
            onClick={() => handleMenuClick(Menu.path)}
          >
            <img src={require(`./assets/${Menu.src}.png`)} alt={`${Menu.title} icon`} />
            <span className={`${!open && "hidden"} origin-left duration-200`}>
              {Menu.title}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <AuthProvider>
      <Router>
        <div className="flex">
          <div
            className={`${
              open ? "w-72" : "w-20 "
            } bg-dark-purple min-h-screen p-5 pt-8 relative duration-300`}
          >
            <img
              src={require('./assets/control.png')}
              alt="Control button"
              className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple border-2 rounded-full ${!open && "rotate-180"}`}
              style={{zIndex:1}}
              onClick={() => setOpen(!open)}
            />
            <div className="flex gap-x-4 items-center">
              <img
                src={require('./assets/logo.png')}
                alt="Logo"
                className={`cursor-pointer duration-500 ${open && "rotate-[360deg]"}`}
              />
              <h1
                className={`text-white origin-left font-medium text-xl duration-200 ${!open && "scale-0"}`}
              >
                Rentify
              </h1>
            </div>
            <SidebarMenu />
          </div>
          <div className="h-screen flex-1 p-0">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/accounts" element={<Accounts />} />
              <Route path="/interest" element={<Interest />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/login" element={<Login />} /> 
              <Route path='/register' element={<Register />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
