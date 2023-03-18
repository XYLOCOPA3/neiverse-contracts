// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ICommunityPassport} from "./Interface/ICommunityPassport.sol";
import {ICommunityPassportCreater} from "./Interface/ICommunityPassportCreater.sol";
import {ICommunityPortal} from "./ICommunityPortal.sol";

contract CommunityPortal is Ownable, ICommunityPortal {
  ICommunityPortal.Community[] private _communityList;
  ICommunityPassportCreater public passportCreater;
  address public questBoard;

  constructor(address _passportCreater, address _questBoard) {
    passportCreater = ICommunityPassportCreater(_passportCreater);
    questBoard = _questBoard;
  }

  function getCommunity(
    uint32 communityId
  )
    external
    view
    returns (string memory communityURI, address passport, bool closed)
  {
    communityURI = _communityList[communityId].communityURI;
    passport = _communityList[communityId].passport;
    closed = _communityList[communityId].closed;
  }

  function getCommunityList(
    uint256 page,
    uint256 pageSize
  ) external view returns (ICommunityPortal.Community[] memory, uint256) {
    require(pageSize > 0, "page size must be positive");
    uint256 actualSize = pageSize;
    if ((page + 1) * pageSize > _communityList.length) {
      actualSize = _communityList.length;
    }
    ICommunityPortal.Community[] memory res = new ICommunityPortal.Community[](
      actualSize
    );
    for (uint256 i = 0; i < actualSize; i++) {
      res[i] = _communityList[page * pageSize + i];
    }
    return (res, _communityList.length);
  }

  function setPassportCreater(address _passportCreater) external onlyOwner {
    address oldState = address(passportCreater);
    passportCreater = ICommunityPassportCreater(_passportCreater);
    emit SetPassportCreater(msg.sender, oldState, _passportCreater);
  }

  function setCommunityURI(
    uint32 communityId,
    string memory newCommunityURI
  ) external onlyOwner {
    string memory oldCommunityURI = _communityList[communityId].communityURI;
    _communityList[communityId].communityURI = newCommunityURI;
    emit SetCommunityURI(communityId, oldCommunityURI, newCommunityURI);
  }

  function setPassport(
    uint32 communityId,
    address _passport
  ) external onlyOwner {
    _communityList[communityId].passport = _passport;
  }

  function setClosed(uint32 communityId, bool _closed) external onlyOwner {
    _communityList[communityId].closed = _closed;
  }

  function setQuestBoard(address _questBoard) external onlyOwner {
    questBoard = _questBoard;
  }

  function createCommunity(
    string memory _communityURI,
    string memory _name,
    string memory _contructURI
  ) external onlyOwner {
    ICommunityPortal.Community memory community;
    community.passport = passportCreater.createCommunityPassport(
      _name,
      _communityURI,
      _contructURI,
      uint32(_communityList.length)
    );
    community.communityURI = _communityURI;
    _communityList.push(community);
    emit Create(
      address(this),
      uint32(_communityList.length - 1),
      community.passport,
      community.communityURI
    );
  }

  function communitySupply() external view returns (uint256) {
    return _communityList.length;
  }

  function addExp(uint32 communityId, address fan, uint32 exp) external {
    require(msg.sender == questBoard, "You cannot run addExp");
    ICommunityPassport passport = ICommunityPassport(
      _communityList[communityId].passport
    );
    passport.addExp(fan, exp);
  }
}
