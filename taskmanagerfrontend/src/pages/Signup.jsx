import React, { useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import GAuth from "./../components/GAuth";
import api from "../components/axiosBase";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/api/auth/signup", {
        name: `${formData.firstName + " " + formData.lastName}`,
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        navigate("/signin");
        return;
      }
    } catch (error) {
      // console.error("Error signing up:", error);
      setError("Failed to sign up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto shadow-xl py-3 pt-2 rounded-lg mt-8 bg-slate-100 ">
      <h3 className="text-2xl font-bold text-center">Sign-Up</h3>
      <hr className="my-2" />
      <form className="flex flex-col gap-4 p-5" onSubmit={handleSubmit}>
        <div className="mb-2 block">
          <Label htmlFor="firstName" value="First Name" />
          <TextInput
            id="firstName"
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-2 block">
          <Label htmlFor="lastName" value="Last Name" />
          <TextInput
            id="lastName"
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-2 block">
          <Label htmlFor="email" value="Email" />
          <TextInput
            id="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-2 block">
          <Label htmlFor="password" value="Password" />
          <TextInput
            id="password"
            type="password"
            placeholder="******"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-2 block">
          <Label htmlFor="confirmPassword" value="Confirm Password" />
          <TextInput
            id="confirmPassword"
            type="password"
            placeholder="******"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <Button type="submit" disabled={loading}>
          {loading ? "Signing Up..." : "Signup"}
        </Button>
        <GAuth />
      </form>
      <p className="px-5">
        Already have an account?{" "}
        <Link to="/signin" className="text-blue-500">
          Sign-In
        </Link>
      </p>
    </div>
  );
};

export default Signup;
