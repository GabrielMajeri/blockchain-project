import { Link, BrowserRouter as Router, Route } from "react-router-dom";

import Freelancer from "./Freelancer";
import Admin from "./Admin";
import Client from "./Client";

function Routes() {
  return (
    <div>
      <Router>
        <Link to="/freelancer">Freelancer</Link>
        <br></br>
        <Link to="/admin">Admin</Link>
        <br></br>
        <Link to="/client">Client</Link>

        <Route path="/freelancer" component={Freelancer} exact />
        <Route path="/admin" component={Admin} exact />
        <Route path="/client" component={Client} exact />
      </Router>
    </div>
  );
}

export default Routes;
