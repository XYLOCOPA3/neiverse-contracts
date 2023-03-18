// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC5192} from "erc5192/src/ERC5192.sol";
import {ICommunityPassport} from "./ICommunityPassport.sol";

contract CommunityPassport is Ownable, ERC5192, ICommunityPassport {
  mapping(uint256 => ICommunityPassport.Passport) private _passport;
  address[] private _userList;
  mapping(address => uint256) private _userListIndex;
  string public baseURI;
  string private _contractURI;
  uint32 public immutable communityId;

  constructor(
    string memory _name,
    string memory _symbol,
    string memory _baseURI,
    string memory _initialContractURI,
    uint32 _communityId
  ) ERC5192(_name, _symbol, true) {
    baseURI = _baseURI;
    _contractURI = _initialContractURI;
    communityId = _communityId;
  }

  function getPassport(
    address user
  ) external view returns (ICommunityPassport.Passport memory) {
    uint256 passportId = hashMsgSender(user);
    return _passport[passportId];
  }

  function getPassportList(
    uint256 page,
    uint256 pageSize
  ) external view returns (ICommunityPassport.Passport[] memory, uint256) {
    require(pageSize > 0, "page size must be positive");
    uint256 actualSize = pageSize;
    if ((page + 1) * pageSize > _userList.length) {
      actualSize = _userList.length;
    }
    ICommunityPassport.Passport[]
      memory res = new ICommunityPassport.Passport[](actualSize);
    for (uint256 i = 0; i < actualSize; i++) {
      uint256 passportId = hashMsgSender(_userList[page * pageSize + i]);
      res[i] = _passport[passportId];
    }
    return (res, _userList.length);
  }

  function getFanList(
    uint256 page,
    uint256 pageSize
  ) external view returns (address[] memory, uint256) {
    require(pageSize > 0, "page size must be positive");
    uint256 actualSize = pageSize;
    if ((page + 1) * pageSize > _userList.length) {
      actualSize = _userList.length;
    }
    address[] memory res = new address[](actualSize);
    for (uint256 i = 0; i < actualSize; i++) {
      res[i] = _userList[page * pageSize + i];
    }
    return (res, _userList.length);
  }

  function getTokenURIFromAddress(
    address user
  ) external view returns (string memory) {
    return tokenURI(hashMsgSender(user));
  }

  function tokenURI(
    uint256 passportId
  ) public view override returns (string memory) {
    _requireMinted(passportId);
    return
      bytes(_passport[passportId].passportURI).length > 0
        ? _passport[passportId].passportURI
        : "";
  }

  function setBaseURI(string memory newBaseTokenURI) external onlyOwner {
    string memory oldBaseURI = baseURI;
    baseURI = newBaseTokenURI;
    emit SetBaseURI(msg.sender, oldBaseURI, baseURI);
  }

  function setContractURI(string memory newContractURI) external onlyOwner {
    string memory oldContractURI = _contractURI;
    _contractURI = newContractURI;
    emit SetContractURI(msg.sender, oldContractURI, newContractURI);
  }

  function hashMsgSender(address addr) public pure returns (uint256) {
    return uint256(keccak256(abi.encodePacked(addr)));
  }

  function safeMint() external {
    if (_passport[hashMsgSender(msg.sender)].user == address(0)) {
      ICommunityPassport.Passport memory passport;
      passport.passportURI = baseURI;
      passport.user = msg.sender;
      _passport[hashMsgSender(msg.sender)] = passport;
    }
    _safeMint(msg.sender, hashMsgSender(msg.sender));
    _addFan(msg.sender);
  }

  function burn() external {
    _burn(hashMsgSender(msg.sender));
    _deleteFan(msg.sender);
  }

  function contractURI() external view returns (string memory) {
    return _contractURI;
  }

  function checkBatchFan(
    address[] memory userList
  ) external view returns (bool[] memory) {
    bool[] memory isFanList = new bool[](userList.length);
    for (uint256 i; i < userList.length; i++) {
      isFanList[i] = balanceOf(userList[i]) > 0;
    }
    return isFanList;
  }

  function totalSupply() external view returns (uint256) {
    return _userList.length;
  }

  function addExp(address user, uint32 exp) external onlyOwner {
    uint256 passportId = hashMsgSender(user);
    require(_exists(passportId), "This token doesn't exist");
    uint32 oldExp = _passport[passportId].exp;
    _passport[passportId].exp = _passport[passportId].exp + exp;
    emit AddExp(
      msg.sender,
      user,
      passportId,
      oldExp,
      _passport[passportId].exp
    );
  }

  function _addFan(address user) private {
    _userListIndex[user] = _userList.length;
    _userList.push(msg.sender);
  }

  function _deleteFan(address user) private {
    uint256 index = _userListIndex[user];
    address lastFan = _userList[_userList.length - 1];
    _userList[index] = lastFan;
    _userListIndex[lastFan] = index;
    _userList.pop();
    delete _userListIndex[user];
  }
}
