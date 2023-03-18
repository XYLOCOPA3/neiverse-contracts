// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

interface IPrizePoap is IERC1155 {
  struct Prize {
    string tokenURI;
    uint32 communityId;
    uint32 requiredExp;
    uint32 requiredQuestId;
    bool questRequired;
    bool closed;
  }

  event Created(
    address indexed publisher,
    string tokenURI,
    uint32 indexed communityId,
    uint32 requiredExp,
    uint32 requiredQuestId,
    bool questRequired,
    bool closed
  );

  function getBaseURI() external view returns (string memory prize);

  function getPrize(
    uint256 tokenId
  ) external view returns (IPrizePoap.Prize memory prize);

  function getPrizeList(
    uint256 page,
    uint256 pageSize
  ) external view returns (IPrizePoap.Prize[] memory, uint256);

  function getPrizeListLength() external view returns (uint256 length);

  function setCommunityPortal(address _communityPortal) external;

  function setBaseURI(string memory _baseURL) external;

  function setPrize(uint256 tokenId, Prize memory prize) external;

  function create(
    string memory _tokenURI,
    uint32 _communityId,
    uint32 _requiredExp,
    uint32 _requiredQuestId,
    bool _questRequired
  ) external;

  function mint(uint256 tokenId) external;

  function mintOnlyQuestBoard(uint256 tokenId, address to) external;

  function burn(uint256 tokenId) external;

  function checkObtainable(
    address target,
    uint256 tokenId
  ) external view returns (bool);

  function checkBatchObtainable(
    address[] memory targets,
    uint256[] memory tokenIds
  ) external view returns (bool[] memory);

  function checkObtained(
    address target,
    uint256 tokenId
  ) external view returns (bool);

  function checkBatchObtained(
    address[] memory targets,
    uint256[] memory tokenIds
  ) external view returns (bool[] memory);
}
