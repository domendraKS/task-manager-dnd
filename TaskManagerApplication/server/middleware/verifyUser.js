import errorHandler from "./errorHandler.js";
import jwt from "jsonwebtoken";

export const verifyUser = async (req, res, next) => {
  let token;

  let checkToken = req.headers.authorization;
  // console.log(checkToken);

  if (checkToken && checkToken.startsWith("Bearer")) {
    token = checkToken.split(" ")[1];
  }

  if (!token) {
    next(errorHandler(401, "You are not Authenticated!"));
  }

  jwt.verify(token, process.env.COOKIE_SECRET_KEY, (err, user) => {
    if (err) {
      return next(errorHandler(401, "Unauthorized"));
    }
    req.user = user;
    next();
  });
};

export default verifyUser;
