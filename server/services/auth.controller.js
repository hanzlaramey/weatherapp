import "dotenv/config";
import Validator from "validatorjs";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export async function registration(req,res) {
	const validation = addUserValidator(req.body);
	if (validation.fails()){
		return res.status(422).send({ status: false, errors: validation.errors.all() });
	}
	const {email, password, firstName, lastName} = req.body;

	const user_exist = await User.findOne({ email });
	if (user_exist){
		return res.status(422).send({ status: false, error: "email already exists"});
	}
	
	const user = await new User({ email, password, firstName, lastName });
	await user.save();
	
	req.login(user, async err => {
		if (err) {
			return res.status(500).send({ status: false, error: "error in login after user checkout"});
		}
		return res.send({ status: true, user: req.user});
	});
};

export async function loginSuccess(req, res){
	return res.send({status: true, user: req.user});
}

export async function logoutUser(req, res){
	req.logout();
	res.clearCookie("connect.sid");
	return res.send({ status: true, message: "user logged out successfuly" });
}

function addUserValidator(data) {
	return new Validator(data, {
		firstName: "required|alpha|min:3|max:255",
		lastName: "required|alpha|min:3|max:255",
		email: "required|email|max:255",
		password: "required|string|min:6|max:255",
	});
}