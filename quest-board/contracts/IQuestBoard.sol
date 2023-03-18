// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

interface IQuestBoard is IERC1155 {
  struct Quest {
    string title;
    string questURI;
    address questCheckerAddress;
    uint32 communityId;
    uint32 obtainableExp;
    uint32 obtainablePrizeId;
    bool prizeObtainable;
    bool closed;
  }

  event Create(
    uint32 questId,
    string title,
    string questURI,
    address questCheckerAddress,
    uint32 indexed communityId,
    uint32 obtainableExp,
    uint32 obtainablePrizeId,
    bool prizeObtainable,
    address indexed target
  );
  event Claim(uint32 indexed questId, address indexed fan);
  event Burn(uint32 indexed questId, address indexed fan);

  function getQuest(
    uint256 page,
    uint256 pageSize
  ) external view returns (Quest[] memory, uint256);

  function setQuest(uint256 tokenId, Quest memory quest) external;

  function setCommunityPortal(address communityPortalAddress) external;

  function setPrizePoap(address prizePoapAddress) external;

  function createQuest(
    string memory _title,
    string memory _questURI,
    uint32 _communityId,
    uint32 _obtainableExp,
    uint32 _obtainablePrizeId,
    bool _prizeObtainable,
    bytes4 _interfaceId,
    address _target
  ) external;

  function claim(uint32 questId) external;

  function burn(uint32 questId) external;

  function questSupply() external view returns (uint256);

  function checkBatchCompleted(
    uint256[] memory questIds,
    address[] memory fanList
  ) external view returns (bool[] memory);
}
