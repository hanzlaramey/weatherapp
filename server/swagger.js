import "dotenv/config";
import swaggerUi from "swagger-ui-express";
import yaml from "yamljs";
import {resolve} from "path";

export const setupSwagger = (app) => {
    let swaggerJsDocs = yaml.load(resolve(process.env.NODE_ENV === "development" ? "./server" : "./", "api.yaml"));
	app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerJsDocs));
}