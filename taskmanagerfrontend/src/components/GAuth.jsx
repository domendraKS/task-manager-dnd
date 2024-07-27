import React, { useState } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "./../Firebase";
import { Button } from "flowbite-react";
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { signInSuccess } from "../redux/user/userSlice";

const GAuth = () => {
  const auth = getAuth(app);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    const resultFromGoogle = await signInWithPopup(auth, provider);

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3201/api/auth/google",
        {
          email: resultFromGoogle.user.email,
          name: resultFromGoogle.user.displayName,
        },
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
      //   setError(error.response.data.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        className="flex items-center gap-4"
        onClick={handleGoogleLogin}
        disabled={loading}
      >
        <FcGoogle className="text-xl" />
        <spna>Continue With Google</spna>
      </Button>
    </>
  );
};

export default GAuth;
