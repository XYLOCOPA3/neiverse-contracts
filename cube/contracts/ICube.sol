// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface ICube {
  struct CubeObj {
    uint32 prizeId;
    uint16 positionX;
    uint16 positionY;
    uint16 positionZ;
    uint16 rotationX;
    uint16 rotationY;
    uint16 rotationZ;
    bool set;
  }

  function getCube(
    address userAddress
  ) external view returns (CubeObj[10][10] memory cubeObj);

  function getCubeObj(
    address userAddress,
    uint256 x,
    uint256 z
  ) external view returns (CubeObj memory);

  function setPrizePoap(address prizePoapAddress) external;

  function setCubeObj(CubeObj memory cubeObj) external;

  function setBatchCubeObj(ICube.CubeObj[] memory cubeObjList) external;
}
