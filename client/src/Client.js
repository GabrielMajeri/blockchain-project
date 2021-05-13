import { useState } from "react";
import { useBalance } from "./hooks";

function Client({ web3, projects, accountAddr, instance, parentCallback }) {
  const [projectName, setProjectName] = useState("");
  const [paymentEth, setPaymentEth] = useState(0);
  const balance = useBalance(web3, accountAddr);

  async function createProject() {
    if (projectName !== "" && paymentEth !== 0) {
      const ethPayment = (paymentEth * 1000000000000000000).toString();

      await instance.methods.addProject(projectName).send({
        from: accountAddr.toString(),
        value: ethPayment,
        gas: 6721000,
      });
    }

    parentCallback();
  }

  return (
    <>
      <h1>Hello Client</h1>
      <p>Current balance: {balance} wei</p>
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
        <label>
          Payment (in ETH):
          <br />
          <input
            type="text"
            name="payment"
            onChange={(e) => setPaymentEth(e.target.value)}
          />
        </label>
        <br />
        <button type="button" onClick={createProject}>
          Create Project
        </button>
      </form>

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
          {projects.map((project) => (
            <tr key={project.id}>
              <td>{project.name}</td>
              <td>{project.programer}</td>
              <td>{project.state}</td>
              <td>{project.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Client;
