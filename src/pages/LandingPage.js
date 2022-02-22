import React from "react";
import { Button, Container, Col, Row } from 'react-bootstrap';
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

export const LandingPage = () => {

	return(
		<Container className="bg-dark min-vh-100 d-flex align-items-center text-center" fluid>
			<Container>
				<Row>
					<Col md="12">
						<img src={logo} alt="logo" width="400px" />
					</Col>
					<Col md="12">
						<h3 className="text-light display-4 pt-4">Weather App</h3>
					</Col>
					<Col md="12">
						<Link to="/login">
							<Button variant="outline-light" className="m-2 mt-5 px-5 rounded-pill">Login</Button>
						</Link>
						<Link to="/register">
							<Button variant="outline-light" className="m-2 mt-5 px-5  rounded-pill">Register</Button>
						</Link>
						<a target="_blank" href="/api/docs">
							<Button variant="outline-light" className="m-2 mt-5 px-5  rounded-pill">Swagger Documentation</Button>
						</a>
					</Col>
				</Row>
			</Container>
		</Container>
	);

};

export default LandingPage;
