import React, {useState} from "react";
import { Button, Container, Col, Row, Form, Alert } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from "react-router-dom";
import { changeUser } from "../redux/action/UserActions";

export const RegisterForm = () => {
	
	const user = useSelector(state => state.userReducer);
	const dispatch = useDispatch();
	const [firstName, setFirstName] = useState(null);
	const [lastName, setLastName] = useState(null);
	const [email, setEmail] = useState(null);
	const [password, setPassword] = useState(null);
	const [confirmPassword, setConfirmPassword] = useState(null);
	const [error, setError] = useState(false);
	const [redirect, setRedirect] = useState(false);

	if(redirect || user?.email?.trim()){
		return <Redirect to='/home' />;
	}

	const formHandler = async () => {

		if(!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) return setError("All Fields are Required!");
		if(password !== confirmPassword) return setError("Both passwords are not matching!");
		
		const response = await fetch("/api/register", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({ email, password, firstName, lastName })
		});
		const data = await response.json();

		if (data.status === true) {
			const {_id, firstName, lastName, email} = data.user;
			dispatch(changeUser(_id, firstName, lastName, email));
			setRedirect(true);
		} else {
			setError(data.error || data.errors);
		}
	}

	return(
		<Container className="bg-dark min-vh-100 d-flex" fluid>
			<Container className=" my-auto">
				<Row className="justify-content-md-center">
					<Col md="10">
						<h3 className="text-light display-4 pt-4 mb-4 text-center">Register</h3>
						<Form>
							<Row>
								<Col md="12">
									{error &&
										<>
											{error instanceof Object ? 
											<>
												{Object.keys(error).map(e => {
													return (
														<Alert variant="danger" className="rounded-pill my-3" key={e}>
															{error[e]}
														</Alert>
													);
												})}
											</> 
											:
												<Alert variant="danger" className="rounded-pill my-3">
													{error}
												</Alert>
											}

										</>
									}
								</Col>
								<Col md="6">
									<Form.Group className="mb-3 rounded-pill" controlId="formBasicEmail">
										<Form.Control className="rounded-pill" type="email" placeholder="First Name"  required  onChange={(e) => {setFirstName(e.target.value); setError(false);}}/>
									</Form.Group>
								</Col>
								<Col md="6">
									<Form.Group className="mb-3 rounded-pill" controlId="formBasicEmail">
										<Form.Control className="rounded-pill" type="email" placeholder="Last Name"  required onChange={(e) => {setLastName(e.target.value); setError(false);}}/>
									</Form.Group>
								</Col>
								<Col md="12">
									<Form.Group className="mb-3 rounded-pill" controlId="formBasicEmail">
										<Form.Control className="rounded-pill" type="email" placeholder="Email address"  required onChange={(e) => {setEmail(e.target.value); setError(false);}}/>
									</Form.Group>
								</Col> 
								<Col md="6">
									<Form.Group className="mb-3 rounded-pill" controlId="formBasicPassword">
										<Form.Control className="rounded-pill" type="password" placeholder="Password" required  onChange={(e) => {setPassword(e.target.value); setError(false);}}/>
									</Form.Group>
								</Col>
								<Col md="6">
									<Form.Group className="mb-3 rounded-pill" controlId="formBasicPassword">
										<Form.Control className="rounded-pill" type="password" placeholder="Confirm Password"  required onChange={(e) => {setConfirmPassword(e.target.value); setError(false);}}/>
									</Form.Group>
								</Col>
								<Col md="12">
									<div className="d-grid gap-2 mt-3">
										<Button variant="outline-light" size="lg" className="rounded-pill" onClick={() => formHandler()}>
											Submit
										</Button>
									</div>
								</Col>
							</Row>
						</Form>
					</Col>
				</Row>
			</Container>
		</Container>
	);

};

export default RegisterForm;
