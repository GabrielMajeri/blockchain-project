import { useState, useEffect } from "react";
import getWeb3 from "./getWeb3";

function App() {
  const [web3, setWeb3] = useState(null);

  useEffect(() => {
    // Connect to the local Ethereum node
    getWeb3().then(setWeb3);
  }, []);

  useEffect(() => {
    if (web3) {
      // See https://web3js.readthedocs.io/en/v1.3.4/ for API docs
      console.log("Web3 object:", web3);
      web3.eth.getAccounts().then(console.log);
    }
  }, [web3]);

  return (
    <div>
      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      {web3 && <AccountsList web3={web3} />}
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
