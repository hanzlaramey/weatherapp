import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const AppRoute = ({
	component: Component,
	isAuthProtected,
	...rest
}) => {
	const user = useSelector(state => state.userReducer);
	return (
		<Route
			{...rest}
			render={props => {
				if (isAuthProtected && !user.email) {
					return (
						<Redirect to={{ pathname: "/login", state: { from: props.location } }} />
					);
				}

				return (
					<Component {...props} />
				);
			}}
		/>
	);
};

export default AppRoute;