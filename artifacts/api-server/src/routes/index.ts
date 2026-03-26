import { Router, type IRouter } from "express";
import healthRouter from "./health";
import menuRouter from "./menu";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/menu", menuRouter);
router.use("/admin", adminRouter);

export default router;
