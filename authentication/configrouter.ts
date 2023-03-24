//get an instance of app and configure the router
import { authRouter } from "./routes/auth.route";
import { Express } from "express";

export function configServerRouter(app:Express){
    app.use('/auth',authRouter);
}

