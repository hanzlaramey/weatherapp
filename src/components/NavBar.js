import React from "react";
import { Navbar, Nav, Container} from 'react-bootstrap';
import logo from "../assets/logo.png"
import { Link } from "react-router-dom";

export const NavBar = () => {

	return(
		<Navbar bg="light" variant="light">
			<Container>
				<Navbar.Brand href="#home"><img src={logo} width="50px" alt="logo" /></Navbar.Brand>
				<Nav className="ms-auto">
					<Link to="/logout" className="link-secondary bg-white" style={{textDecoration:"none"}}>Logout</Link>
				</Nav>
			</Container>
		</Navbar>
	);

};