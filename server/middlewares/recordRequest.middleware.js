import RequestModel from "../models/requests.model.js";

export async function saveRequest(req, res, next){

	try{
		const saveRequest = new RequestModel({
			userId: req.user._id,
			type: req.method,
			action: findAction(req.url),
			path: req.url,
			requestSource: "web"
		});
		saveRequest.save();
	}
	catch(e){
		console.log("Error in logging request: ", e);
	}
	return next();

}

const findAction = (url) => {
	let action = null;
	switch (url) {
		case "/user/location":
			action = "gettingWeatherAccordingToUserIpAddress";
			break;
		case "/user/search/city":
			action = "searchingForCities";
			break;
		case "/user/weather":
			action = "fetchingWeather";
			break;
		default:
			action = "unknown";
			break;
	}
	return action;
}