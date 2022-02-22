import React from "react";
import { Navbar, Nav, Container} from 'react-bootstrap';
import logo from "../assets/logo.png"

export const NavBar = () => {
	console.log("process.env.REACT_APP_BACKEND_PORT", process.env.REACT_APP_BACKEND_PORT);
	return(
		<Navbar bg="light" variant="light">
			<Container>
				<Navbar.Brand href="#home"><img src={logo} width="50px" alt="logo" /></Navbar.Brand>
				<Nav className="ms-auto">
					<Nav.Link href="/logout">Logout</Nav.Link>
				</Nav>
			</Container>
		</Navbar>
	);

};