import express from "express";
import { login, logout } from "../controllers/auth.js";
import User from "../models/User.js";
import { jwtDecode } from "jwt-decode";

const router = express.Router();

router.post("/login", login);
router.get("/checkToken", async (req, res) => {
  if (req.cookies.token) {
    const userID = jwtDecode(req.cookies.token).id;
    const user = await User.findById(userID);

    return res.status(200).send({ token: req.cookies.token, user: user });
  }

  return res.status(200).send(false);
});

router.post("/logout", logout);
export default router;
