import { useState, useEffect } from "react";
import getWeb3 from "./getWeb3";
import ProjectsContract from "./contracts/Projects.json";

import Routes from "./Routes";

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    // Connect to the local Ethereum node
    getWeb3().then(setWeb3);
  }, []);

  useEffect(() => {
    if (web3) {
      async function asyncUseEffect() {
        // See https://web3js.readthedocs.io/en/v1.3.4/ for API docs
        console.log("Web3 object:", web3);
        web3.eth.getAccounts().then(setAccounts);

        const networkId = await web3.eth.net.getId();
        const deployedNetwork = ProjectsContract.networks[networkId];
        const instance = new web3.eth.Contract(
          ProjectsContract.abi,
          deployedNetwork && deployedNetwork.address
        );

        // const result = await instance.methods.addProject(1, "Project 1").send({
        //   from: "0xC404F3c136076dEc198FF22e374AD049fD55eF3F",
        //   value: "1000000000000000000",
        //   gas: 6721974,
        // });
        //console.log(await instance.methods.projectCount().call());
        // console.log(result);
      }
      asyncUseEffect();
    }
  }, [web3]);

  return (
    <div>
      <Routes />
      {/* <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      {web3 && <AccountsList web3={web3} />} */}
    </div>
  );
}

function AccountsList({ web3 }) {
  const [accountList, setAccountList] = useState([]);

  useEffect(() => {
    web3.eth.getAccounts().then(setAccountList);
  }, [web3]);

  return (
    <>
      <h2>Ethereum accounts</h2>
      <ul>
        {accountList.map((account) => (
          <li key={account}>{account}</li>
        ))}
      </ul>
    </>
  );
}

export default App;
