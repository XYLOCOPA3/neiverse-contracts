// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ICube} from "./ICube.sol";
import {IPrizePoap} from "./Interface/IPrizePoap.sol";

contract Cube is ICube, Ownable {
  uint256 private constant MAX_POSITION = 10;
  uint256 private constant MAX_ROTATION = 360;
  IPrizePoap public prizePoap;
  mapping(address => ICube.CubeObj[MAX_POSITION][MAX_POSITION]) private _cubes;
  mapping(address => mapping(uint256 => uint256)) private _usedPrizeNum;

  constructor(address prizePoapAddress) {
    prizePoap = IPrizePoap(prizePoapAddress);
  }

  modifier checkCubeObj(ICube.CubeObj memory cubeObj) {
    require(
      cubeObj.positionX < MAX_POSITION &&
        cubeObj.positionY < MAX_POSITION &&
        cubeObj.positionZ < MAX_POSITION,
      "checkCubeObj: Out of range positionXYZ"
    );
    require(
      cubeObj.rotationX <= MAX_ROTATION &&
        cubeObj.rotationY <= MAX_ROTATION &&
        cubeObj.rotationZ <= MAX_ROTATION,
      "checkCubeObj: Out of range rotationXYZ"
    );
    _;
  }

  function getCube(
    address userAddress
  )
    external
    view
    returns (ICube.CubeObj[MAX_POSITION][MAX_POSITION] memory cubeObj)
  {
    return _cubes[userAddress];
  }

  function getCubeObj(
    address userAddress,
    uint256 x,
    uint256 z
  ) external view returns (ICube.CubeObj memory) {
    return _cubes[userAddress][z][x];
  }

  function setPrizePoap(address prizePoapAddress) external onlyOwner {
    prizePoap = IPrizePoap(prizePoapAddress);
  }

  function setCubeObj(
    ICube.CubeObj memory cubeObj
  ) public checkCubeObj(cubeObj) {
    uint256 x = cubeObj.positionX;
    uint256 z = cubeObj.positionZ;
    uint32 prizeId = cubeObj.prizeId;
    uint32 updatedPrizeId = _cubes[msg.sender][z][x].prizeId;

    // delete
    if (!cubeObj.set) {
      require(_cubes[msg.sender][z][x].set, "setCubeObj: Not yet set.");
      _usedPrizeNum[msg.sender][updatedPrizeId]--;
      delete _cubes[msg.sender][z][x];
      return;
    }

    // update
    require(
      prizePoap.balanceOf(msg.sender, prizeId) -
        _usedPrizeNum[msg.sender][prizeId] >
        0,
      "lack of prizeNum"
    );
    if (_cubes[msg.sender][z][x].set)
      _usedPrizeNum[msg.sender][updatedPrizeId]--;
    _usedPrizeNum[msg.sender][prizeId]++;
    _cubes[msg.sender][z][x] = cubeObj;
  }

  function setBatchCubeObj(ICube.CubeObj[] memory cubeObjList) external {
    for (uint256 i; i < cubeObjList.length; i++) {
      setCubeObj(cubeObjList[i]);
    }
  }
}
