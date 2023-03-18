// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface ICommunityPassport is IERC721 {
  struct Passport {
    string passportURI;
    address user;
    uint32 exp;
  }

  event AddExp(
    address indexed publisher,
    address indexed user,
    uint256 passportId,
    uint32 oldExp,
    uint32 newExp
  );

  event SetBaseURI(address indexed publisher, string oldValue, string newValue);

  event SetContractURI(
    address indexed publisher,
    string oldValue,
    string newValue
  );

  function getPassport(address user) external view returns (Passport memory);

  function getFanList(
    uint256 page,
    uint256 pageSize
  ) external view returns (address[] memory, uint256);

  function getPassportList(
    uint256 page,
    uint256 pageSize
  ) external view returns (ICommunityPassport.Passport[] memory, uint256);

  function getTokenURIFromAddress(
    address user
  ) external view returns (string memory);

  function setBaseURI(string memory newBaseTokenURI) external;

  function setContractURI(string memory newContractURI) external;

  function hashMsgSender(address addr) external pure returns (uint256);

  function safeMint() external;

  function burn() external;

  function contractURI() external view returns (string memory);

  function checkBatchFan(
    address[] memory userList
  ) external view returns (bool[] memory);

  function totalSupply() external view returns (uint256);

  function addExp(address user, uint32 exp) external;
}
