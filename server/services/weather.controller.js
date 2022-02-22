import "dotenv/config";
import axios from "axios";
import http from "http";
import https from "https";
import { IPinfoWrapper } from 'node-ipinfo';

export async function searchCities(req, res){
	let {city} = req.body;
	city = city.trim();
	if(!city || city.length < 1) return res.status(401).send({status: false, error: "City is required!", data: null});
	let matchedCities = await getLonLat(city);
	if(matchedCities.length > 0) {
		matchedCities = convertCountryCode(matchedCities);
		return res.status(200).send({status: true, data: matchedCities});
	}
	else return res.status(500).send({status: false, error: "Internal Server Error"});
}

export async function getWeatherFromCoordinates(req, res){
	let {lat,long} = req.body;
	if(!lat || lat.length < 1 || !long || long.length < 1) return res.status(401).send({status: false, error: "Longitude and Latitude are required!", data: null});
	const response = await getWeather([lat, long]);
	if(response) return res.status(200).send({status: true, data: response});
	else return res.status(500).send({status: false, error: "Internal Server Error"});
}

export async function getIpLocationWeather(req, res){
	let lonLat = ["37.3229978", "-122.0321823"]; //if user address is not found then set it up to Cupertino as default
	let ipAddressInfo = {city: "Cupertino", region: "California", timezone: "Pacific Standard Time"}; //if user address is not found then set it up to Cupertino as default
	if(checkIfValidIP(req.ip)){
		let ipinfo = new IPinfoWrapper(process.env.IPINFOKEY);
		ipAddressInfo = await ipinfo.lookupIp(req.ip);
		lonLat = ipAddressInfo.loc.split(",");
	}
	const weather = await getWeather(lonLat);
	if(weather) return res.status(200).send({status: true, data: {weather, ipAddressInfo}});
	else return res.status(500).send({status: false, data: null, error: "error fetching weather, please try again later!"});
}

async function getWeather(lonLat){
	try{
		const httpAgent = new http.Agent({ keepAlive: true });
		const httpsAgent = new https.Agent({ keepAlive: true });
		const response = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lonLat[0]}&lon=${lonLat[1]}&exclude=minutely&units=imperial&appid=${process.env.OPENWEATHERKEY}`, {httpAgent, httpsAgent});
		response.data.hourly = response.data.hourly.slice(0, 8);
		return response.data;
	}
	catch(e){
		return e;
	}
}

async function getLonLat(city){
	try{
		const httpAgent = new http.Agent({ keepAlive: true });
		const httpsAgent = new https.Agent({ keepAlive: true });
		const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${process.env.OPENWEATHERKEY}`, {httpAgent, httpsAgent});
		return response.data;
	}
	catch(e){
		return e;
	}
}

function checkIfValidIP(str) {
	const regexExp = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;
	return regexExp.test(str);
}

function convertCountryCode(list){
	const countryListAlpha2 = {
		"AF": "Afghanistan",
		"AL": "Albania",
		"DZ": "Algeria",
		"AS": "American Samoa",
		"AD": "Andorra",
		"AO": "Angola",
		"AI": "Anguilla",
		"AQ": "Antarctica",
		"AG": "Antigua and Barbuda",
		"AR": "Argentina",
		"AM": "Armenia",
		"AW": "Aruba",
		"AU": "Australia",
		"AT": "Austria",
		"AZ": "Azerbaijan",
		"BS": "Bahamas (the)",
		"BH": "Bahrain",
		"BD": "Bangladesh",
		"BB": "Barbados",
		"BY": "Belarus",
		"BE": "Belgium",
		"BZ": "Belize",
		"BJ": "Benin",
		"BM": "Bermuda",
		"BT": "Bhutan",
		"BO": "Bolivia (Plurinational State of)",
		"BQ": "Bonaire, Sint Eustatius and Saba",
		"BA": "Bosnia and Herzegovina",
		"BW": "Botswana",
		"BV": "Bouvet Island",
		"BR": "Brazil",
		"IO": "British Indian Ocean Territory (the)",
		"BN": "Brunei Darussalam",
		"BG": "Bulgaria",
		"BF": "Burkina Faso",
		"BI": "Burundi",
		"CV": "Cabo Verde",
		"KH": "Cambodia",
		"CM": "Cameroon",
		"CA": "Canada",
		"KY": "Cayman Islands (the)",
		"CF": "Central African Republic (the)",
		"TD": "Chad",
		"CL": "Chile",
		"CN": "China",
		"CX": "Christmas Island",
		"CC": "Cocos (Keeling) Islands (the)",
		"CO": "Colombia",
		"KM": "Comoros (the)",
		"CD": "Congo (the Democratic Republic of the)",
		"CG": "Congo (the)",
		"CK": "Cook Islands (the)",
		"CR": "Costa Rica",
		"HR": "Croatia",
		"CU": "Cuba",
		"CW": "Curaçao",
		"CY": "Cyprus",
		"CZ": "Czechia",
		"CI": "Côte d'Ivoire",
		"DK": "Denmark",
		"DJ": "Djibouti",
		"DM": "Dominica",
		"DO": "Dominican Republic (the)",
		"EC": "Ecuador",
		"EG": "Egypt",
		"SV": "El Salvador",
		"GQ": "Equatorial Guinea",
		"ER": "Eritrea",
		"EE": "Estonia",
		"SZ": "Eswatini",
		"ET": "Ethiopia",
		"FK": "Falkland Islands (the) [Malvinas]",
		"FO": "Faroe Islands (the)",
		"FJ": "Fiji",
		"FI": "Finland",
		"FR": "France",
		"GF": "French Guiana",
		"PF": "French Polynesia",
		"TF": "French Southern Territories (the)",
		"GA": "Gabon",
		"GM": "Gambia (the)",
		"GE": "Georgia",
		"DE": "Germany",
		"GH": "Ghana",
		"GI": "Gibraltar",
		"GR": "Greece",
		"GL": "Greenland",
		"GD": "Grenada",
		"GP": "Guadeloupe",
		"GU": "Guam",
		"GT": "Guatemala",
		"GG": "Guernsey",
		"GN": "Guinea",
		"GW": "Guinea-Bissau",
		"GY": "Guyana",
		"HT": "Haiti",
		"HM": "Heard Island and McDonald Islands",
		"VA": "Holy See (the)",
		"HN": "Honduras",
		"HK": "Hong Kong",
		"HU": "Hungary",
		"IS": "Iceland",
		"IN": "India",
		"ID": "Indonesia",
		"IR": "Iran (Islamic Republic of)",
		"IQ": "Iraq",
		"IE": "Ireland",
		"IM": "Isle of Man",
		"IL": "Israel",
		"IT": "Italy",
		"JM": "Jamaica",
		"JP": "Japan",
		"JE": "Jersey",
		"JO": "Jordan",
		"KZ": "Kazakhstan",
		"KE": "Kenya",
		"KI": "Kiribati",
		"KP": "Korea (the Democratic People's Republic of)",
		"KR": "Korea (the Republic of)",
		"KW": "Kuwait",
		"KG": "Kyrgyzstan",
		"LA": "Lao People's Democratic Republic (the)",
		"LV": "Latvia",
		"LB": "Lebanon",
		"LS": "Lesotho",
		"LR": "Liberia",
		"LY": "Libya",
		"LI": "Liechtenstein",
		"LT": "Lithuania",
		"LU": "Luxembourg",
		"MO": "Macao",
		"MG": "Madagascar",
		"MW": "Malawi",
		"MY": "Malaysia",
		"MV": "Maldives",
		"ML": "Mali",
		"MT": "Malta",
		"MH": "Marshall Islands (the)",
		"MQ": "Martinique",
		"MR": "Mauritania",
		"MU": "Mauritius",
		"YT": "Mayotte",
		"MX": "Mexico",
		"FM": "Micronesia (Federated States of)",
		"MD": "Moldova (the Republic of)",
		"MC": "Monaco",
		"MN": "Mongolia",
		"ME": "Montenegro",
		"MS": "Montserrat",
		"MA": "Morocco",
		"MZ": "Mozambique",
		"MM": "Myanmar",
		"NA": "Namibia",
		"NR": "Nauru",
		"NP": "Nepal",
		"NL": "Netherlands (the)",
		"NC": "New Caledonia",
		"NZ": "New Zealand",
		"NI": "Nicaragua",
		"NE": "Niger (the)",
		"NG": "Nigeria",
		"NU": "Niue",
		"NF": "Norfolk Island",
		"MP": "Northern Mariana Islands (the)",
		"NO": "Norway",
		"OM": "Oman",
		"PK": "Pakistan",
		"PW": "Palau",
		"PS": "Palestine, State of",
		"PA": "Panama",
		"PG": "Papua New Guinea",
		"PY": "Paraguay",
		"PE": "Peru",
		"PH": "Philippines (the)",
		"PN": "Pitcairn",
		"PL": "Poland",
		"PT": "Portugal",
		"PR": "Puerto Rico",
		"QA": "Qatar",
		"MK": "Republic of North Macedonia",
		"RO": "Romania",
		"RU": "Russian Federation (the)",
		"RW": "Rwanda",
		"RE": "Réunion",
		"BL": "Saint Barthélemy",
		"SH": "Saint Helena, Ascension and Tristan da Cunha",
		"KN": "Saint Kitts and Nevis",
		"LC": "Saint Lucia",
		"MF": "Saint Martin (French part)",
		"PM": "Saint Pierre and Miquelon",
		"VC": "Saint Vincent and the Grenadines",
		"WS": "Samoa",
		"SM": "San Marino",
		"ST": "Sao Tome and Principe",
		"SA": "Saudi Arabia",
		"SN": "Senegal",
		"RS": "Serbia",
		"SC": "Seychelles",
		"SL": "Sierra Leone",
		"SG": "Singapore",
		"SX": "Sint Maarten (Dutch part)",
		"SK": "Slovakia",
		"SI": "Slovenia",
		"SB": "Solomon Islands",
		"SO": "Somalia",
		"ZA": "South Africa",
		"GS": "South Georgia and the South Sandwich Islands",
		"SS": "South Sudan",
		"ES": "Spain",
		"LK": "Sri Lanka",
		"SD": "Sudan (the)",
		"SR": "Suriname",
		"SJ": "Svalbard and Jan Mayen",
		"SE": "Sweden",
		"CH": "Switzerland",
		"SY": "Syrian Arab Republic",
		"TW": "Taiwan",
		"TJ": "Tajikistan",
		"TZ": "Tanzania, United Republic of",
		"TH": "Thailand",
		"TL": "Timor-Leste",
		"TG": "Togo",
		"TK": "Tokelau",
		"TO": "Tonga",
		"TT": "Trinidad and Tobago",
		"TN": "Tunisia",
		"TR": "Turkey",
		"TM": "Turkmenistan",
		"TC": "Turks and Caicos Islands (the)",
		"TV": "Tuvalu",
		"UG": "Uganda",
		"UA": "Ukraine",
		"AE": "United Arab Emirates (the)",
		"GB": "United Kingdom of Great Britain and Northern Ireland (the)",
		"UM": "United States Minor Outlying Islands (the)",
		"US": "United States of America (the)",
		"UY": "Uruguay",
		"UZ": "Uzbekistan",
		"VU": "Vanuatu",
		"VE": "Venezuela (Bolivarian Republic of)",
		"VN": "Viet Nam",
		"VG": "Virgin Islands (British)",
		"VI": "Virgin Islands (U.S.)",
		"WF": "Wallis and Futuna",
		"EH": "Western Sahara",
		"YE": "Yemen",
		"ZM": "Zambia",
		"ZW": "Zimbabwe",
		"AX": "Åland Islands"
	};
	
	const response = list.map(elem => {
		elem.country = countryListAlpha2[elem.country];
		return elem;
	})
	return response;
}