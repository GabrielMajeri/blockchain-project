import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

import {
  useAccounts,
  useProjectsContractInstance,
  useProjectsList,
  useWeb3,
} from "./hooks";

import Freelancer from "./Freelancer";
import Admin from "./Admin";
import Client from "./Client";
import { useEffect, useState } from "react";

function App() {
  const web3 = useWeb3();
  console.log(web3);
  const accounts = useAccounts(web3);
  const instance = useProjectsContractInstance(web3);
  const [projects, refreshProjectsList] = useProjectsList(instance);

  const [ownerAddress, setOwnerAddress] = useState();

  useEffect(() => {
    if (!instance) {
      return;
    }

    instance.methods.owner().call().then(setOwnerAddress);
  }, [instance]);

  if (!web3 || !accounts || !instance) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Router>
        <Link to="/freelancer">Freelancer</Link>
        <br></br>
        <Link to="/admin">Admin</Link>
        <br></br>
        <Link to="/client">Client</Link>

        <Switch>
          <Route
            path="/freelancer"
            render={() => (
              <Freelancer
                web3={web3}
                projects={projects}
                accountAddr={accounts[2]}
                instance={instance}
                parentCallback={refreshProjectsList}
              />
            )}
            exact
          />
          <Route
            path="/admin"
            render={() => (
              <Admin
                web3={web3}
                projects={projects}
                accountAddr={ownerAddress}
                instance={instance}
                parentCallback={refreshProjectsList}
              />
            )}
            exact
          />
          <Route
            path="/client"
            render={() => (
              <Client
                web3={web3}
                projects={projects}
                accountAddr={accounts[0]}
                instance={instance}
                parentCallback={refreshProjectsList}
              />
            )}
            exact
          />
          <Route path="/" render={() => <Redirect to="/client" />} exact />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
