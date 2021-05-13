import { useEffect, useState } from "react";

function Freelancer({ web3, projects, accountAddr, instance, parentCallback }) {
  const [balance, setBalance] = useState(0);
  useEffect(() => {
    async function getBalance() {
      setBalance(await web3.eth.getBalance(accountAddr));
    }
    getBalance();
  }, []);
  async function takeProject(nrProject) {
    if (web3) {
      let result = await instance.methods
        .takeProject(parseInt(nrProject))
        .send({ from: accountAddr.toString() });
      parentCallback();
    }
  }

  async function completeProject(nrProject) {
    if (web3) {
      await instance.methods
        .finishProject(parseInt(nrProject))
        .send({ from: accountAddr.toString() });
      parentCallback();
    }
  }

  return (
    <>
      <h1>Hello Freelancer {balance}</h1>

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
                    onClick={() => takeProject(project.id)}
                    disabled={project.state !== "0"}
                  >
                    Take
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => completeProject(project.id)}
                    disabled={project.state !== "1"}
                  >
                    Complete
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

export default Freelancer;
