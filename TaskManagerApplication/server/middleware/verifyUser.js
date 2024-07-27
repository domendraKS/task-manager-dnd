import jwt from "jsonwebtoken";
import errorHandler from "./errorHandler.js";

const verifyUser = (req, res, next) => {
  const allCookies = req.headers.cookie;
  if (!allCookies) {
    return next(errorHandler(401, "Unauthorized"));
  }

  const cookies = allCookies.split(";").reduce((cookiesObj, cookie) => {
    const [name, value] = cookie.trim().split("=");
    cookiesObj[name] = value;
    return cookiesObj;
  }, {});

  const token = cookies.userTokenTask;
  if (!token) {
    return next(errorHandler(401, "Unauthorized"));
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
