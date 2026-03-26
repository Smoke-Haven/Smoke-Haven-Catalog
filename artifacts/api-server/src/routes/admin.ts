import { Router, type IRouter } from "express";

const router: IRouter = Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin1234";

router.post("/verify", (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

export default router;
