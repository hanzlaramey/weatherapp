import React, {useState, useEffect} from "react";
import { Button, Container, Col, Row, Form, Alert } from 'react-bootstrap';
import { NavBar } from "../components/NavBar.js";
import Loading from "../components/Loading.js";


export const HomePage = () => {

	const [searchValue, setSearchValue] = useState(null);
	const [searchError, setSearchError] = useState(false);
	const [cities, setCities] = useState([]);
	const [ipData, setIpData] = useState({});
	const [weatherData, setWeatherData] = useState({});
	const [loading, setLoading] = useState(false);
	const [city, setCity] = useState(false);
	const [stateOrRegion, setStateOrRegion] = useState(false);
	const [country, setCountry] = useState(false);
	const [timeZoneOffset, setTimeZoneOffset] = useState(false);
	
	const fetchWeatherWithIp = async (archived) => {
		setLoading(true);
		const url = `/api/user/location`;

		const response = await fetch(url, {
			method: "GET",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
		});
		const data = await response.json();
		if (data.status) {
			setIpData(data.data.ipAddressInfo)
			setWeatherData(data.data.weather)
			setLoading(false);
			console.log("Data Loading", data.data);
		}
	};

	useEffect(() => {
		fetchWeatherWithIp();
	}, []);

	const fetchWeatherOfCity = async (lat, lon, updatedCity, updatedStateOrRegion, updatedCountry) => {
		setLoading(true);
		const response = await fetch("/api/user/weather", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({ lat, long:lon })
		});

		const data = await response.json();

		if(data.status){
			setWeatherData(data.data);
			setCity(updatedCity);
			setStateOrRegion(updatedStateOrRegion);
			setCountry(updatedCountry);
			setTimeZoneOffset(data.data.timezone_offset);
			setLoading(false);
		}
		else{
			return setSearchError(data.error);
		}

	};

	const searchCity = async () => {
		if(!searchValue) return setSearchError(true);
		
		setLoading(true);
		const response = await fetch("/api/search/city", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({ city: searchValue })
		});

		const data = await response.json();

		if(data.status){
			setCities(data.data);
			setLoading(false);

		}
		else{
			setLoading(false);
			return setSearchError(data.error);
		}
	};

	const convertUnixIntoDay = (UnixTime) => {
		const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		const date = new Date(UnixTime * 1000);
		return(days[date.getDay()].substring(0,3));
	}
	
	const convertUnixIntoTime = (UnixTime) => {
		const date = new Date((UnixTime) * 1000);
		const hours = (date.getHours() % 12) || 12;
		return(`${hours} ${date.getHours() > 12 ?  'pm' : 'am' }`);
	}

	return(
		<Container className="bg-dark min-vh-100 pb-5" fluid>
			<NavBar />
			<Container className="mt-5">
				<Row>
					<Col md="12">
						{searchError && 
							<Alert variant="danger" className="rounded-pill">
								Search Cannot be empty!
							</Alert>
						}
					</Col>
					<Col md="12">
						<Form>
							<Row className="justify-content-md-center mt-4">
								<Col md="8">
									<Form.Control
										className="mb-2 rounded-pill"
										id="inlineFormInput"
										placeholder="New York"
										onChange={(e) => {setSearchError(false); setSearchValue(e.target.value)}}
									/>
								</Col>
								<Col md="2">
									<Button className="mb-2 rounded-pill px-5" variant="outline-light" onClick={() => searchCity()}>
										Submit
									</Button>
								</Col>
							</Row>
						</Form>
					</Col>
					<Col md="12" className="my-5">
						<Row className="justify-content-around">
							{cities.length > 0 && 
								cities.map((value) => {
									console.log(value);
									return (
										<Col md="3" className="m-2">
											<Button variant="outline-light" size="lg" type="submit" className="rounded-pill px-4" onClick={() => fetchWeatherOfCity(value.lat, value.lon, value.name, value.state ? value.state : (value.region ? value.region : ""), value.country)}>
												{value.name}, {value.state ? value.state : ""} {value.region ? value.region : ""} {value.country}
											</Button>
										</Col>	
									);
								})
							}
						</Row>
					</Col>
					{loading &&
						<Loading />
					}
					{Object.keys(weatherData).length > 0 && 
						<Col md="12">
							<Row>
								<Col md="12" className="mt-4 bg-secondary bg-gradient">

								</Col>
								<Col md="1" className="mt-3">
									<img src={`https://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`} alt="weather"/>
								</Col>
								<Col md="2" className="mt-3">
									<h4 className="text-light display-1">
										{weatherData.current.temp}&#176;
									</h4>
								</Col>
								<Col md="2" className="mt-3 text-right">
									<p className="text-light text-right">Feels Like: {weatherData.current.feels_like}&#176; <br /> Humidity: {weatherData.current.humidity}% </p>
								</Col>
								<Col md="3" className="mt-3 text-right">
								</Col>
								<Col md="4" className="mt-3">
									<h4 className="text-light" stye={{textAlign:"left !important"}}>
										{city ? city : ipData.city}, {stateOrRegion ? stateOrRegion : (ipData.region ? ipData.region : (ipData.state ? ipData.state : ""))}
									</h4>
									<h6 className="text-light display-8">
										{country ? country : ipData.timezone}
									</h6>
								</Col>
							</Row>
							
							<Row className="mt-5 justify-content-around">
								{weatherData.hourly.map((hourlyWeather, key) => {
									return (
										<Col md="1" className="border border-white py-2 px-1 rounded" key={key}>
											<h6 className="text-light text-center">{convertUnixIntoTime(hourlyWeather.dt)}</h6>
											<h6 className="text-light text-center"><img src={`https://openweathermap.org/img/wn/${hourlyWeather.weather[0].icon}.png`} alt="weather"/></h6>
											<p className="text-light text-center">{hourlyWeather.temp}&#176;</p>
										</Col>
									);
								})}
							</Row>

							<Row className="mt-5 justify-content-around">
								{weatherData.daily.map((dailyWeather, key) => {
									return (
										<Col md="1" className="border border-white py-2 px-1 rounded" key={key}>
											<h6 className="text-light text-center">{convertUnixIntoDay(dailyWeather.dt)}</h6>
											<h6 className="text-light text-center"><img src={`https://openweathermap.org/img/wn/${dailyWeather.weather[0].icon}.png`} alt="weather"/></h6>
											<p className="text-light text-center">{dailyWeather.temp.max}&#176;/{dailyWeather.temp.min}&#176;</p>
										</Col>
									);
								})}
							</Row>

						</Col>
					}
					
				</Row>
			</Container>
		</Container>
	);

};

export default HomePage;
