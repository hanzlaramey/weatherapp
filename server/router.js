import Router from "express";
import passport from "./passport.js";
import {authRoute} from "./middlewares/auth.middleware.js";
import {saveRequest} from "./middlewares/recordRequest.middleware.js";
// import S3Uploader from "./middlewares/S3FileUploader";
// import { clientOnlyRoute, adminOnlyRoute, checkModuleAccess } from "./middlewares/RoleBasedAccess";

// import all the controllers here
import * as AuthController from "./services/auth.controller.js";
import * as WeatherController from "./services/weather.controller.js";

const comment = "/** * @swagger * get: * description: use to request all customers */"
// api prefix of app. it can be used as /api/v1/ etc.
const API_PREFIX = "/api/";

// All the public routes of app
const public_routes = {
	"POST /register": [ AuthController.registration ],
	"POST /login": [ passport.tryLogin, AuthController.loginSuccess ],
};

// Prefix /client/ before all route in new routes
const client_routes = {
	"GET /logout": [ AuthController.logoutUser ],
	"GET /user/location": [ WeatherController.getIpLocationWeather ],
	"POST /search/city": [ WeatherController.searchCities ],
	"POST /user/weather": [ WeatherController.getWeatherFromCoordinates ],
};

export default (app) => {
	const router = Router();

	for (const route in public_routes) {
		const [ method, url ] = route.split(" ");
		router.route(url)[method.toLowerCase()](public_routes[route]);
	}

	for (const route in client_routes) {
		const [ method, url ] = route.split(" ");
		router.route(url)[method.toLowerCase()]([
			authRoute,
			saveRequest,
			...client_routes[route]
		]);
	}

	app.use(API_PREFIX, router);
};