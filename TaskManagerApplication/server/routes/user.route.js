import express from "express";
import {
  google,
  signin,
  signout,
  signup,
} from "../controllers/user.controller.js";

const authRoute = express.Router();

authRoute.post("/signup", signup);
authRoute.post("/signin", signin);
authRoute.post("/signout", signout);
authRoute.post("/google", google);

export default authRoute;
