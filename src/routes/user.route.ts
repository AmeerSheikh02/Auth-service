import { Router } from "express";

import { authMiddleware } from "../middleware/auth.middleware"

const router = Router();

router.get('/profile', authMiddleware, (req, res) =>{
    res.json({
        message : "Protected data access granted",
        user : (req as any).user,
    });
});

export default router;