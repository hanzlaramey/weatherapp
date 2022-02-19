import Mongoose from "mongoose";
import bcrypt from "bcrypt";

const SALT_WORK_FACTOR = 10;

const userSchema = new Mongoose.Schema({

	firstName: {
		type: String,
		required: true,
		validate: {
			validator: function (value) {
				return value.length > 2 && /^[a-z ,.'-]+$/i.test(value);
			},
			message: "First name must have more than two characters and may only contain alphabets"
		}
	},

	lastName: {
		type: String,
		required: true,
		validate: {
			validator: function (value) {
				return value.length > 2 && /^[a-z ,.'-]+$/i.test(value);
			},
			message: "Last name must have more than two characters and may only contain alphabets"
		}
	},

	email: {
		type: String,
		required: true,
		unique: true,
		validate: {
			validator: function (value) {
				return value.length > 0 && value.includes("@");
			},
			message: "Email is not valid"
		}
	},

	password: {
		type: String,
		required: true,
		select: false,
		validate: {
			validator: function (value) {
				return value.length >= 6;
			},
			message: "Password is not valid"
		}
	},

	password_reset_created: {
		type: Date,
	},

	password_reset_code: {
		type: String,
	},

}, { timestamps: true });

userSchema.virtual("fullName").get(function () {
	return this.firstName + " " + this.lastName;
}).set(function (fullName) {
	const [firstName, lastName] = fullName.split(" ");
	this.firstName = firstName;
	this.lastName = lastName;
});

userSchema.pre("save", function(next) {
	const user = this;
	
	// only hash the password if it has been modified (or is new)
	if (!user.isModified("password")) return next();
	
	// generate a salt
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) return next(err);
	
		// hash the password using our new salt
		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) return next(err);
	
			// override the cleartext password with the hashed one
			user.password = hash;
			next();
		});
	});
});

userSchema.methods.checkPassword = function(passwordProvided, cb) {
	bcrypt.compare(passwordProvided, this.password, function(err, isMatch) {
		if (err) return cb(err);
		cb(null, isMatch);
	});
};

export default Mongoose.model("users", userSchema);
