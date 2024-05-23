import express from "express";
import {
  login,
  signup,
  forgetpass,
  resetpassword,
  forgetpassphone,
} from "../controllers/auth.js";
import { getAllUsers, updateProfile } from "../controllers/users.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgetpass);
router.post("/reset-password/:id/:token", resetpassword);
router.post("/forgot-password-phone", forgetpassphone);

router.get("/getAllUsers", getAllUsers);
router.patch("/update/:id", auth, updateProfile);

export default router;
