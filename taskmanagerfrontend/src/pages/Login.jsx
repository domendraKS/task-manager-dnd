import React, { useState } from "react";
import { Button, HR, Label, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import GAuth from "../components/GAuth";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "https://task-manager-dnd-1.onrender.com/api/auth/signin",
        { email: formData.email, password: formData.password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        dispatch(signInSuccess(response.data.user));
        navigate("/");
        return;
      }
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-lg mx-auto shadow-xl py-3 pt-5 rounded-lg mt-16 bg-slate-100">
        <h3 className="text-2xl font-bold text-center">Login</h3>
        <HR className="my-2" />
        <form className="flex flex-col gap-4 p-5" onSubmit={handleSubmit}>
          <div className="mb-2 block">
            <Label htmlFor="email" value="Your Email" />
            <TextInput
              id="email"
              type="email"
              placeholder="Email"
              required
              onChange={handleChange}
            />
          </div>

          <div className="mb-2 block">
            <Label htmlFor="password" value="Your password" />
            <TextInput
              id="password"
              type="password"
              placeholder="******"
              required
              onChange={handleChange}
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
          <GAuth />
        </form>
        <p className="px-5">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500">
            Sign-Up
          </Link>
        </p>
      </div>
    </>
  );
};

export default Login;
