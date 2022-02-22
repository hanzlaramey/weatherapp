import "dotenv/config";
import Validator from "validatorjs";
import User from "../models/user.model.js";

export async function registration(req,res) {
	console.log("req.body ++++", req.body);
	const validation = addUserValidator(req.body);
	if (validation.fails()){
		return res.status(422).send({ status: false, errors: validation.errors.all() });
	}
	const {email, password, firstName, lastName} = req.body;

	const user_exist = await User.findOne({ email });
	if (user_exist){
		return res.status(422).send({ status: false, error: "email already exists"});
	}
	
	try{
		const user = await new User({ email, password, firstName, lastName });
		await user.save();
		
		req.login(user, async err => {
			if (err) {
				return res.status(500).send({ status: false, error: "error in login after user checkout"});
			}
			return res.status(200).send({ status: true, user: req.user});
		});
	}
	catch(e){
		console.log(e);
		return res.status(500).send({ status: false, error: "e"});
	}

};

export async function loginSuccess(req, res){
	return res.status(200).send({status: true, user: req.user});
}

export async function logoutUser(req, res){
	try{
		req.logout();
		res.clearCookie("connect.sid");
		return res.status(200).send({ status: true, message: "user logged out successfully" });
	}
	catch(e){
		return res.status(500).send({ status: true, message: "Internal Server Error!" });
	}
}

function addUserValidator(data) {
	return new Validator(data, {
		firstName: "required|string|min:3|max:255",
		lastName: "required|string|min:3|max:255",
		email: "required|email|max:255",
		password: "required|string|min:6|max:255",
	});
}