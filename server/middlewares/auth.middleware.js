export const authRoute = (req, res, next) => {
	if (req.user) return next();
	return res.status(401).send({ status: false, error: "unautorized route" });
};