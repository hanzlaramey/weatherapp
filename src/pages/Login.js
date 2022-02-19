import React, {useState} from "react";
import { Button, Container, Col, Row, Form, Alert } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from "react-router-dom";
import { changeUser } from "../redux/action/UserActions";

export const LoginForm = () => {
	
	const user = useSelector(state => state.userReducer);
	const dispatch = useDispatch();
	const [email, setEmail] = useState(null);
	const [password, setPassword] = useState(null);
	const [error, setError] = useState(false);
	const [redirect, setRedirect] = useState(false);

	if(redirect || user?.email?.trim()){
		return <Redirect to='/home' />;
	}

	const formHandler = async () => {
		if(!email.trim() || !password.trim()) return setError("Both Fields are Required!");
		
		const response = await fetch("/api/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({ email, password })
		});

		const data = await response.json();

		if(data.status){
			const {_id, firstName, lastName, email} = data.user;
			dispatch(changeUser(_id, firstName, lastName, email));
			return setRedirect(true);
		}
		else{
			return setError(data.error);
		}
	}

	return(
		<Container className="bg-dark min-vh-100 d-flex" fluid>
			<Container className=" my-auto">
				<Row className="justify-content-md-center">
					<Col md="6">
						<h3 className="text-light display-4 pt-4 text-center">Login</h3>
						{error &&
							<Alert variant="danger" className="rounded-pill my-3">
								{error}
							</Alert>
						}
						<Form>
							<Form.Group className="rounded-pill" controlId="formBasicEmail">
								<Form.Label>Email address</Form.Label>
								<Form.Control className="rounded-pill" type="email" placeholder="Enter email" required onChange={(e) => setEmail(e.target.value)}/>
							</Form.Group>

							<Form.Group className="mb-3 " controlId="formBasicPassword">
								<Form.Label>Password</Form.Label>
								<Form.Control className="rounded-pill" type="password" placeholder="Password"  required onChange={(e) => setPassword(e.target.value)}/>
							</Form.Group>
							<div className="d-grid gap-2 mt-3">
								<Button variant="outline-light" size="lg" className="rounded-pill" onClick={() => formHandler()}>
									Submit
								</Button>
							</div>
						</Form>
					</Col>
				</Row>
			</Container>
		</Container>
	);

};

export default LoginForm;