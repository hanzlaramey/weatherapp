export const UserActions = {
	CHANGE_USER: "CHANGE_USER",
	LOGOUT_USER: "LOGOUT_USER",
};

export function changeUser(_id, firstName, lastName, email ) {

	return {

		type: UserActions.CHANGE_USER,
		_id,
		firstName,
		lastName,
		email,
	};

}

export function logoutUser() {

	return {

		type: UserActions.LOGOUT_USER

	};

}