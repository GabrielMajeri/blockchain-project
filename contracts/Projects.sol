pragma solidity >=0.5.0 <0.9.0;

contract Projects {
    uint256 public projectCount = 0;
    mapping(uint256 => Project) public project;

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

    event AddProject(address _client, string _name);

    function addProject(string memory _name) public payable {
        // amount must be al least 1000 wei (200 euro as of 5/11/2021)
        require(msg.value > 1000, "The amount of wei is insufficient");

        project[projectCount] = Project(
            projectCount,
            msg.value,
            _name,
            0,
            address(0),
            msg.sender
        ); // initialise the project
        incrementCount(); // increment the number of projects

        emit AddProject(msg.sender, _name);
    }

    event TakeProject(address _programmer, uint256 _id);

    function takeProject(uint256 _id) public {
        // method should be called when a programmer decides to work on the project given as parameter

        require(project[_id].state != 1, "The project is already taken");
        project[_id].programer = msg.sender;
        project[_id].state = 1;

        emit TakeProject(msg.sender, _id);
    }

    event FinishProject(uint256 _id);

    function finishProject(uint256 _id) public {
        // method should be  called when the project is considered finished and it sets it's state to finished
        require(
            project[_id].programer == msg.sender,
            "Only assigned programmer may finish project"
        );
        require(project[_id].state != 0, "The project is not taken");
        require(project[_id].state != 2, "The project is already finished");
        project[_id].state = 2;

        emit FinishProject(_id);
    }

    event CancelProject(uint256 _id);

    function cancelProject(uint256 _id) public onlyOwner {
        require(project[_id].state != 3, "The project is validated");
        require(project[_id].state != 4, "The project is cancelled");

        address payable payee = project[_id].client;
        uint256 payment = project[_id].value;
        payee.transfer(payment);
        project[_id].state = 4;

        emit CancelProject(_id);
    }

    event ValidateProject(uint256 _id);

    function validateProject(uint256 _id) public onlyOwner {
        require(project[_id].state != 0, "The project is not taken");
        require(project[_id].state != 1, "The project is taken");
        require(project[_id].state != 3, "The project is validated");
        require(project[_id].state != 4, "The project is cancelled");

        address payable payee = project[_id].programer;
        uint256 payment = project[_id].value;
        payee.transfer(payment);
        project[_id].state = 3;

        emit ValidateProject(_id);
    }
}
