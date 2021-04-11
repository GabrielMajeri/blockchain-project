import { Link, BrowserRouter as Router, Route } from "react-router-dom";

import Home from "./Home";
import Client from "./Client";
import Admin from "./Admin";
import Firma from "./Firma";

function Routes() {
  return (
    <div>
      <Router>
        <Link to="/">Home</Link>
        <br></br>
        <Link to="/client">Client</Link>
        <br></br>
        <Link to="/admin">Admin</Link>
        <br></br>
        <Link to="/firma">Firma</Link>

        <Route path="/" component={Home} exact />
        <Route path="/client" component={Client} exact />
        <Route path="/admin" component={Admin} exact />
        <Route path="/firma" component={Firma} exact />
      </Router>
    </div>
  );
}

export default Routes;
