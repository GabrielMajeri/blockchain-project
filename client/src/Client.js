import { useState, useEffect } from "react";

function Client({ web3, projects, accountAddr, instance, parentCallback }) {
  const [projectName, setProjectName] = useState("");
  const [paymentEth, setPaymentEth] = useState(0);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    async function getBalance() {
      setBalance(await web3.eth.getBalance(accountAddr));
    }
    getBalance();
  }, []);

  async function createProject() {
    if (projectName !== "" && paymentEth !== 0) {
      console.log(projectName, paymentEth);

      let ethPayment = (paymentEth * 1000000000000000000).toString();
      console.log(ethPayment);

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
      <h1>Hello Client {balance}</h1>
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
      )}
    </>
  );
}

export default Client;
