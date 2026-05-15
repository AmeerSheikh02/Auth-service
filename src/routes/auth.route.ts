import { Router } from 'express'

import { register } from "../controllers/auth.controller";

import { login } from "../controllers/auth.controller";

import { refreshAccessToken } from "../controllers/auth.controller"

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.post("/refresh", refreshAccessToken);

export default router;