import express from "express";
import {
  acceptFriendRequest,
  getMyFriends,
  getMyNotifications,
  getMyProfile,
  login,
  logout,
  newUser,
  searchUser,
  sendFriendRequest,
  putMyColors,
  getMyColors,
  getMyInfo,
  changeMyBio,
  changeMyGender,
  changeMyUsername,
  changeMyEmail,
  changeCustomedMyAvatar,
  changeMyGeneratedAvatar,
  getMyOTP,
  validateMyOtp,
  getIsOnline,
} from "../controllers/user.js";
import {
  acceptRequestValidator,
  loginValidator,
  registerValidator,
  sendRequestValidator,
  validateHandler,
} from "../lib/validators.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { singleAvatar } from "../middlewares/multer.js";

const app = express.Router();

app.post("/new", singleAvatar, registerValidator(), validateHandler, newUser);
app.post("/login", loginValidator(), validateHandler, login);

// After here user must be logged in to access the routes

app.use(isAuthenticated);

app.get("/me", getMyProfile);

app.get("/logout", logout);

app.get("/search", searchUser);

app.put(
  "/sendrequest",
  sendRequestValidator(),
  validateHandler,
  sendFriendRequest
);

app.put(
  "/acceptrequest",
  acceptRequestValidator(),
  validateHandler,
  acceptFriendRequest
);

app.get("/notifications", getMyNotifications);

app.get("/getcolor",getMyColors);

app.get('/getotp',getMyOTP);

app.get("/getmyinfo",getMyInfo);

app.put("/putcolor",putMyColors);

app.put("/changebio",changeMyBio);

app.put("/changegender",changeMyGender);

app.put("/changeemail",changeMyEmail);

app.put("/changeavatar",singleAvatar,changeCustomedMyAvatar);

app.put("/changegavatar",changeMyGeneratedAvatar);

app.post("/validateotp",validateMyOtp);

app.put("/changeusername",changeMyUsername);

app.get("/friends", getMyFriends);

app.get("/isonline",getIsOnline);






export default app;