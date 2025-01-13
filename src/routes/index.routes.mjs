import { Router } from "express";

import usersRouter from "./users.routes.mjs";
import productsRouter from "./products.routes.mjs";

const router = Router();

router.use(usersRouter);
router.use(productsRouter);

export default router;
