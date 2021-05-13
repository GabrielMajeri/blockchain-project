import { useState, useEffect, useCallback } from "react";
import getWeb3 from "./getWeb3";
import ProjectsContract from "./contracts/Projects.json";

/// Hook which provides access to the web3.js context object
// See https://web3js.readthedocs.io/en/v1.3.4/ for API docs
export const useWeb3 = () => {
  const [web3, setWeb3] = useState();

  useEffect(() => {
    // Connect to the local Ethereum node
    getWeb3().then(setWeb3);
  }, []);

  return web3;
};

export const useBalance = (web3, address) => {
  const [balance, setBalance] = useState();

  useEffect(() => {
    if (!web3) {
      return;
    }

    web3.eth.getBalance(address).then(setBalance);
  }, [web3, address]);

  return balance;
};

async function getAccounts(web3) {
  return await web3.eth.getAccounts();
}

export const useAccounts = (web3) => {
  const [accounts, setAccounts] = useState();

  useEffect(() => {
    if (!web3) {
      return;
    }

    getAccounts(web3).then(setAccounts);
  }, [web3]);

  return accounts;
};

async function getProjectsContractInstance(web3) {
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = ProjectsContract.networks[networkId];
  const instance = new web3.eth.Contract(
    ProjectsContract.abi,
    deployedNetwork && deployedNetwork.address
  );
  return instance;
}

export const useProjectsContractInstance = (web3) => {
  const [instance, setInstance] = useState();

  useEffect(() => {
    if (!web3) {
      return;
    }

    getProjectsContractInstance(web3).then(setInstance);
  }, [web3]);

  return instance;
};

async function getProjectsList(instance) {
  const projectNumber = await instance.methods.projectCount().call();

  const projects = [];

  for (let i = 0; i < projectNumber; i++) {
    const project = await instance.methods.project(i).call();
    if (parseInt(project.state) !== 4) {
      projects.push(project);
    }
  }

  return projects;
}

export const useProjectsList = (instance) => {
  const [projects, setProjects] = useState([]);

  const refreshProjectsList = useCallback(
    () => getProjectsList(instance).then(setProjects),
    [instance]
  );

  useEffect(() => {
    if (!instance) {
      return;
    }

    refreshProjectsList();
  }, [instance, refreshProjectsList]);

  return [projects, refreshProjectsList];
};
