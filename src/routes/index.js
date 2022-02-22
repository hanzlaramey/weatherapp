import React from "react";
import { Redirect } from "react-router-dom";

// Authentication related pages
import LoginForm from "../pages/Login";
import RegisterForm from "../pages/Register";
import LandingPage from "../pages/LandingPage";
import HomePage from "../pages/HomePage";
import LogOut from "../pages/Logout";

export const publicRoutes = [

	{ path: "/register", component: RegisterForm },
	{ path: "/login", component: LoginForm },
	{ path: "/", exact: true, component: LandingPage }
];

export const userRoutes = [

	{ path: "/home", component: HomePage },
	{ path: "/logout", component: LogOut },
	{ path: "/", exact: true, component: () => <Redirect to="/home" /> }
];

