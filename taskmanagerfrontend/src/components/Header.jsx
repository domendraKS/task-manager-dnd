import React, { useState } from "react";
import { Button, Navbar } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "../redux/user/userSlice";
import { FaUser } from "react-icons/fa";
import api from "./axiosBase";

const Header = () => {
  const dispatch = useDispatch();
  const { userTask } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await api.post("/api/auth/signout", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (response.data.success) {
        dispatch(signOut());
        navigate("/signin");
        return;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Navbar fluid rounded className="bg-slate-100">
      <div className="flex items-center justify-between w-full max-w-screen-xl mx-auto">
        <Link to="/">
          <span className="px-2 py-1 bg-gradient-to-r from-sky-300 via-sky-500 to-sky-700 rounded-xl shadow-lg text-white">
            Task
          </span>
        </Link>

        {userTask ? (
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 px-2 border border-teal-500 rounded-lg">
              <FaUser className="text-slate-600" />
              {userTask.name}
            </span>
            <Button
              onClick={handleLogout}
              disabled={loading}
              className="bg-red-400"
              size="sm"
            >
              {loading ? "Logging out..." : "Logout"}
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link to="/signin">
              <Button size="sm" disabled={location.pathname === "/signin"}>
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" disabled={location.pathname === "/signup"}>
                Signup
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Navbar>
  );
};

export default Header;
