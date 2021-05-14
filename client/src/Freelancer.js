import { useBalance } from "./hooks";

function Freelancer({ web3, projects, accountAddr, instance }) {
  const balance = useBalance(web3, accountAddr);

  async function takeProject(nrProject) {
    await instance.methods
      .takeProject(parseInt(nrProject))
      .send({ from: accountAddr.toString() });
  }

  async function completeProject(nrProject) {
    await instance.methods
      .finishProject(parseInt(nrProject))
      .send({ from: accountAddr.toString() });
  }

  return (
    <>
      <h1>Hello Freelancer</h1>
      <p>Balance: {balance} wei</p>
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
    </>
  );
}

export default Freelancer;
