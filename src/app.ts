import express from 'express';

import authRoutes from "./routes/auth.route"

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);

app.get('/' , (req, res) =>{

    res.send("Auth is Running");
})

export default app;