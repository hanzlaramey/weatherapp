import swaggerUi from "swagger-ui-express";
import yaml from "yamljs";

export const setupSwagger = (app) => {
    let swaggerJsDocs = yaml.load('api.yaml');
	app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerJsDocs));
}