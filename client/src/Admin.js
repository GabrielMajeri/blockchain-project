import { useEffect, useState } from "react";

function Admin({ web3, projects, accountAddr, instance, parentCallback }) {
  const [balance, setBalance] = useState(0);
  useEffect(() => {
    async function getBalance() {
      setBalance(await web3.eth.getBalance(accountAddr));
    }
    getBalance();
  }, []);
  async function cancelProject(nrProject) {
    await instance.methods
      .cancelProject(parseInt(nrProject))
      .send({ from: accountAddr.toString() });
    parentCallback();
  }

  async function okProject(nrProject) {
    await instance.methods.validateProject(parseInt(nrProject)).send({
      from: accountAddr.toString(),
    });
    parentCallback();
  }

  return (
    <>
      <h1>Hello Admin {balance}</h1>

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
                <td>
                  <button
                    onClick={() => okProject(project.id)}
                    disabled={project.state !== "2"}
                  >
                    Ok
                  </button>
                </td>
                <td>
                  <button onClick={() => cancelProject(project.id)}>
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export default Admin;
