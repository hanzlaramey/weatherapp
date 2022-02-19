import React from "react";

import { Spinner } from "reactstrap";

const Loading = ({ className = "text-center mt-2", ...rest }) => {
	
	return (
		<div className={className}>
			<Spinner color="primary" {...rest} />
		</div>
	);
};

export default Loading;
