// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

contract SimpleStorage {
    
    string public storedData;
    
    event myEventTest(string eventOutput);
    
    function set(string memory myText) public {
        storedData = myText;
        emit myEventTest(myText);
    }
    
    function get() public view returns (string memory) {
        return storedData;
    }
    
}