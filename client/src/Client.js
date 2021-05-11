import { useState, useEffect } from "react";
import getWeb3 from "./getWeb3";
import ProjectsContract from "./contracts/Projects.json";

function Client() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);

  const [projectName, setProjectName] = useState("");
  const [paymentEth, setPaymentEth] = useState(0);

  const [projects, setProjects] = useState(null);

  useEffect(() => {
    // Connect to the local Ethereum node
    getWeb3().then(setWeb3);
  }, []);

  async function createProject() {
    if (projectName !== "" && paymentEth !== 0) {
      console.log(projectName, paymentEth);

      console.log("Web3 object:", web3);
      web3.eth.getAccounts().then(setAccounts);

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ProjectsContract.networks[networkId];
      const instance = new web3.eth.Contract(
        ProjectsContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      let ethPayment = (paymentEth * 1000000000000000000).toString();
      console.log(ethPayment);

      await instance.methods.addProject(projectName).send({
        from: "0xC404F3c136076dEc198FF22e374AD049fD55eF3F",
        value: ethPayment,
        gas: 6721000,
      });
    }
  }

  async function showProjects() {
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
      projects.push(project);
    }

    setProjects(projects);
  }

  return (
    <>
      <h1>Hello Client</h1>
      <h2>Create new project</h2>
      <form>
        <label>
          Project Name:
          <br />
          <input
            type="text"
            name="name"
            onChange={(e) => setProjectName(e.target.value)}
          />
        </label>
        <br />
        <br />
        <br />
        <label>
          Payment(in ETH):
          <br />
          <input
            type="text"
            name="payment"
            onChange={(e) => setPaymentEth(e.target.value)}
          />
        </label>
      </form>
      <button onClick={createProject}>Create Project</button>
      <button onClick={showProjects}>Show Projects</button>

      {projects && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Programer</th>
              <th>State</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project, i) => (
              <tr key={i}>
                <td>{project.name}</td>
                <td>{project.programer}</td>
                <td>{project.state}</td>
                <td>{project.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export default Client;
