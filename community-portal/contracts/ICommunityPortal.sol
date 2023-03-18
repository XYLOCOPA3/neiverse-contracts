// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface ICommunityPortal {
  struct Community {
    string communityURI;
    address passport;
    bool closed;
  }

  event SetPassportCreater(
    address indexed publisher,
    address oldState,
    address newState
  );

  event SetCommunityURI(
    uint32 indexed communityId,
    string oldState,
    string newState
  );

  event Create(
    address indexed publisher,
    uint32 communityId,
    address communityPassport,
    string communityURI
  );

  function getCommunity(
    uint32 communityId
  )
    external
    view
    returns (
      string memory communityURI,
      address communityPassport,
      bool closed
    );

  function getCommunityList(
    uint256 page,
    uint256 pageSize
  ) external view returns (Community[] memory, uint256);

  function setPassportCreater(address _passportCreater) external;

  function setCommunityURI(
    uint32 communityId,
    string memory newCommunityURI
  ) external;

  function setPassport(uint32 communityId, address _passport) external;

  function setClosed(uint32 communityId, bool _closed) external;

  function setQuestBoard(address _questBoard) external;

  function createCommunity(
    string memory _communityURI,
    string memory _name,
    string memory _contructURI
  ) external;

  function communitySupply() external view returns (uint256);

  function addExp(uint32 communityId, address fan, uint32 exp) external;
}
