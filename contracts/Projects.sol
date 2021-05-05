pragma solidity ^0.5.0;

contract Projects {
    
    uint256 public projectCount = 0;
    mapping(uint => Project) public project;
    
    address payable owner;
    
     constructor () public {
        owner = msg.sender;
    }
    
    modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }
    
    function getBalance() public view returns (uint){
        return owner.balance;
    }
    
    function incrementCount() internal {
        projectCount += 1;
    }
    
    struct Project {
        uint id;
        uint value; //amount of ether it pays
        string name;
        uint state; //0 is untaken, 1 is taken
        address programer; // the person working on the project
    }
    
    function addProject(uint _value, string memory _name) payable public {
        incrementCount();
        project[projectCount] = Project(projectCount,_value,_name,0,address(0));
        
        uint amount = _value * (1 ether);
        require(amount==msg.value,"The amount of ether is insufficient");
        owner.transfer(msg.value);
        
    }
 
    function takeProject(uint _id) public {
        
        require(project[_id].state != 1,"The project is already taken");
        project[_id].programer = msg.sender;
        project[_id].state = 1;
        
    } 
        
    
}