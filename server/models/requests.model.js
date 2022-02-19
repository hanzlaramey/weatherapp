import Mongoose from "mongoose";


const userSchema = new Mongoose.Schema({

	userId: {
		type: String,
		required: true,
	},

	type: {
		type: String,
	},

	action: {
		type: String,
	},

	path: {
		type: String,
	},

	requestSource: {
		type: String,
	},

}, { timestamps: true });


export default Mongoose.model("requests", userSchema);
