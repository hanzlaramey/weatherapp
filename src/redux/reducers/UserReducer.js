import {UserActions} from "../action/UserActions";

const user = JSON.parse(localStorage.getItem("user") || "{}");

const DEFAULT_STATE = user;

export function userReducer(state = DEFAULT_STATE, action) {

	switch (action.type) {

	case UserActions.CHANGE_USER:

		localStorage.setItem("user", JSON.stringify({
			_id: action._id,
			firstName: action.firstName,
			lastName: action.lastName,
			email: action.email
		}));

		return {
			...state,
			_id: action._id,
			firstName: action.firstName,
			lastName: action.lastName,
			email: action.email
		};

	case UserActions.LOGOUT_USER:

		localStorage.removeItem("user");
		return {
			...state,
			_id: undefined,
			firstName: undefined,
			lastName: undefined,
			email: undefined
		};

	default:
		return state;

	}
}