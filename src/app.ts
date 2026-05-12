import express from 'express';

import authRoutes from "./routes/auth.route"

import userRoutes from "./routes/user.route"

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);

app.get('/' , (req, res) =>{

    res.send("Auth is Running");
});

app.use('/user', userRoutes);

export default app;