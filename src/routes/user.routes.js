import { Router } from "express";
import {loginuser,signup,logoutuser, changepassword} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();


router.post("/signup", signup);
router.post("/login", loginuser);
router.post("/logout", verifyJWT,logoutuser);
router.post("/changepassword",verifyJWT, changepassword);
router.get("/auth", verifyJWT, (req, res) => {
  res.status(200).json({ message: "You are authorized" });
});

export default router;
