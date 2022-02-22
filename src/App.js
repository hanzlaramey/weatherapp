import './App.css';
import { Switch, BrowserRouter as Router } from "react-router-dom";
import AppRoute from "./routes/route";
import { userRoutes, publicRoutes } from "./routes/index";

function App() {
	return (

		<Router>
			<Switch>
				{publicRoutes.map((route, idx) => (
					<AppRoute
						path={route.path}
						component={route.component}
						key={idx}
						isAuthProtected={false}
						exact
					/>
				))}

				{userRoutes.map((route, idx) => (
					<AppRoute
						path={route.path}
						component={route.component}
						key={idx}
						isAuthProtected={true}
						exact
					/>
				))}
			</Switch>
		</Router>

	);
}

export default App;
