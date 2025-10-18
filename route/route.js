import express from "express"
import { AdminSignup, getMe, Login, Logout, Signup } from "../controller/Auth.controller.js";
import { deleteComment, getNestedComments } from "../controller/Comment.Controller.js";
import { isLogin } from "../middleware/auth.middleware.js";
const appRouter=express.Router()

// Auth Routes
appRouter.post('/signup', Signup);
appRouter.post('/login', Login);
appRouter.delete("/delete/comment/:commentId", deleteComment);
appRouter.post('/admin-signup', AdminSignup);
appRouter.get('/me',isLogin, getMe);
appRouter.post('/logout',isLogin, Logout);
appRouter.get('/getAllComments',isLogin, getNestedComments);
export default appRouter