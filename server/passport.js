import passport from "passport";
import LocalStrategy from "passport-local";

import User from "./models/user.model.js";

passport.serializeUser(function(user, done) {
	user.password = undefined;
	done(null, user._id);
});
  
passport.deserializeUser(async (user_id, done) => {
	const user = await User.findOne({ _id: user_id });

	if (!user) done("unable to deserialize user");
	
	done(null, user);
});

passport.use(new LocalStrategy(
	{
		usernameField: "email",
	},
	async function(email, password, done) {
		try {
			let user = await User.findOne({ email }).select("+password");
			if (!user)
				return done(null, false, { status: false, error: "User doesn't exist" });

			user.checkPassword(password, async (err, isCorrect) => {
				if (err) return done(err);

				if (!isCorrect) {
					return done(null, false, { status: false, error: "Incorrect password" });
				}

				user = user.toJSON();

				done(null, user);
			});

		} catch (error) {
			done(error);
		}
	}
));

passport.tryLogin = function (req, res, next) {
	passport.authenticate("local", function(err, user, info) {
		if (err) {
			return res.status(401).send({ status: false, error: "Unexpected Error" });
		}

		if (!user) {
			return res.status(401).send(info);
		}

		// login successfull
		req.login(user, function(err) {
			if (err) { return next(err); }
			next();
		});

	})(req, res, next);
};

export default passport;