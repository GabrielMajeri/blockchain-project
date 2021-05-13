const Projects = artifacts.require("./Projects.sol");

contract("Projects", (accounts) => {
  it("should add project", async () => {
    const projectsInstance = await Projects.deployed();

    // Create project
    await projectsInstance.addProject("Test project", {
      from: accounts[0],
      value: web3.utils.toWei("3"),
    });

    // Get number of projects
    const projectsCount = await projectsInstance.projectCount.call();

    assert.equal(1, projectsCount, "Project was not created.");
  });
});
