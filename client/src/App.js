import { useState, useEffect } from "react";
import getWeb3 from "./getWeb3";
import ProjectsContract from "./contracts/Projects.json";

import { Link, BrowserRouter as Router, Route } from "react-router-dom";

import Freelancer from "./Freelancer";
import Admin from "./Admin";
import Client from "./Client";

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [projects, setProjects] = useState(null);
  const [instance, setInstance] = useState(null);

  useEffect(() => {
    // Connect to the local Ethereum node
    getWeb3().then(setWeb3);
  }, []);

  useEffect(() => {
    if (web3) {
      async function getAccounts() {
        // See https://web3js.readthedocs.io/en/v1.3.4/ for API docs
        console.log("Web3 object:", web3);
        web3.eth.getAccounts().then(setAccounts);

        const networkId = await web3.eth.net.getId();
        const deployedNetwork = ProjectsContract.networks[networkId];
        setInstance(
          new web3.eth.Contract(
            ProjectsContract.abi,
            deployedNetwork && deployedNetwork.address
          )
        );
      }
      getAccounts();
      getProjects();
    }
  }, [web3]);

  async function getProjects() {
    if (web3) {
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ProjectsContract.networks[networkId];
      const instance = new web3.eth.Contract(
        ProjectsContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      let projectNumber = await instance.methods.projectCount().call();

      let projects = [];

      for (let i = 0; i < projectNumber; i++) {
        let project = await instance.methods.project(i).call();
        if (parseInt(project.state) !== 4) {
          projects.push(project);
        }
      }

      setProjects(projects);
    }
  }

  return (
    <div>
      {instance && (
        <Router>
          <Link to="/freelancer">Freelancer</Link>
          <br></br>
          <Link to="/admin">Admin</Link>
          <br></br>
          <Link to="/client">Client</Link>

          <Route
            path="/freelancer"
            render={() => (
              <Freelancer
                web3={web3}
                projects={projects}
                accountAddr={accounts[2]}
                instance={instance}
                parentCallback={getProjects}
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
                accountAddr={"0x8F5A6fAe267412c4b218e154816f2566b429C17b"}
                instance={instance}
                parentCallback={getProjects}
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
                parentCallback={getProjects}
              />
            )}
            exact
          />
        </Router>
      )}
    </div>
  );
}

export default App;
