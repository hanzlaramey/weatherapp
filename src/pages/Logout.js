import React, { useState } from "react";
import {Redirect} from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/action/UserActions";

const Component = () => {
	const dispatch = useDispatch();
	const [redirect, setRedirect] = useState(false);

	if(redirect){
		return <Redirect to='/login' />;
	} else {
		fetch("/api/logout", {
			method: "GET",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
		}).then(response => {
			if (response.status === 200) {
				dispatch(logoutUser());
			}
			setRedirect(true);
		});
	}

	return <></>;
};

export default Component;