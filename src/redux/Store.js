import { combineReducers, createStore } from "redux";
import { userReducer } from "./reducers/UserReducer";

const rootReducer = combineReducers({
	userReducer
});
export default createStore(rootReducer);