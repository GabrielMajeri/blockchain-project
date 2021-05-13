pragma solidity >=0.5.0 <0.9.0;

contract Projects {
    uint256 public projectCount = 0;
    mapping(uint256 => Project) public project;
    mapping(address => uint256) public deposits;

    address public owner;

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        // only the owner of the contract can call those methods
        require(msg.sender == owner);
        _;
    }

    function incrementCount() internal {
        projectCount += 1;
    }

    struct Project {
        uint256 id;
        uint256 value; //amount of wei it pays
        string name;
        uint256 state; // 0 is untaken, 1 is taken, 2 is finished, 3 is validated, 4 is canceled
        address payable programer; // the person working on the project
        address payable client; // the one who added the project
    }

    function addProject(string memory _name) public payable {
        project[projectCount] = Project(
            projectCount,
            msg.value,
            _name,
            0,
            address(0),
            msg.sender
        ); // initialise the project
        require(msg.value > 1000, "The amount of wei is insufficient"); // amount must be al least 1000 wei (200 euro as of 5/11/2021)
        incrementCount(); // increment the number of projects
    }

    function takeProject(uint256 _id) public {
        // method should be called when a programmer decides to work on the project given as parameter

        require(project[_id].state != 1, "The project is already taken");
        project[_id].programer = msg.sender;
        project[_id].state = 1;
    }

    function finishProject(uint256 _id) public {
        // method should be  called when the project is considered finished and it sets it's state to finished
        require(project[_id].state != 0, "The project is not taken");
        require(project[_id].state != 2, "The project is already finished");
        project[_id].state = 2;
    }

    function cancelProject(uint256 _id) public onlyOwner {
        require(project[_id].state != 3, "The project is validated");
        require(project[_id].state != 4, "The project is cancelled");

        address payable payee = project[_id].client;
        uint256 payment = project[_id].value;
        payee.transfer(payment);
        project[_id].state = 4;
    }

    function validateProject(uint256 _id) public onlyOwner {
        require(project[_id].state != 0, "The project is not taken");
        require(project[_id].state != 1, "The project is taken");
        require(project[_id].state != 3, "The project is validated");
        require(project[_id].state != 4, "The project is cancelled");

        address payable payee = project[_id].programer;
        uint256 payment = project[_id].value;
        payee.transfer(payment);
        project[_id].state = 3;
    }
}
