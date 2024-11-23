// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StoreData {
    struct Data {
        uint256 humidity;
        uint256 temperature;
        string gps;
        uint256 timestamp;
    }

    mapping(uint256 => Data) public dataStore;
    uint256 public dataCount;

    function addData(uint256 _humidity, uint256 _temperature, string memory _gps) public {
        dataCount++;
        dataStore[dataCount] = Data({
            humidity: _humidity,
            temperature: _temperature,
            gps: _gps,
            timestamp: block.timestamp
        });
    }

    function getData(uint256 _id) public view returns (uint256, uint256, string memory, uint256) {
        require(_id > 0 && _id <= dataCount, "Data ID out of range.");
        Data memory data = dataStore[_id];
        return (data.humidity, data.temperature, data.gps, data.timestamp);
    }
}