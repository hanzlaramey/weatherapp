import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import app_router from "./router.js";
import bodyParser from "body-parser";
import passport from "./passport.js";
import session from "express-session";
import { v4 as uuidv4 } from 'uuid';
import http from "http";
import {setupSwagger} from "./swagger.js";

const app = express();
const port = process.env.port || 3600;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: true
  }));

async function initServer(){
	// connect to MongoDB
	console.log("Connecting with MongoDB");
	try{
		await mongoose.connect(process.env.MongoDbURI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});
		console.log("Connected with MongoDB");
	}
	catch(e){
		console.log(`ERROR IN CONNECTING MONGODB: ${e}`)
	}



	// Setup session middleware
	const sessionConfig = {
		store: MongoStore.create({ mongoUrl: process.env.MongoDbURI }),
		genid: () => uuidv4(),
		secret: "2321321321",
		resave: false,
		saveUninitialized: false,
		cookie:{maxAge:3600000*24}
	};

	app.use(session(sessionConfig));

	// Setup auth middlewares
	app.use(passport.initialize());
	app.use(passport.session());
	
	// Configure app routes
	app_router(app);

	// Declare the path to frontend's static assets
	app.use(express.static("../build"));

	setupSwagger(app);

	//create http server
	const httpServer = http.createServer(app);
	
	httpServer.listen(port, () => {
		console.log(`App listening on port ${port}...`);
	});
}
initServer();
