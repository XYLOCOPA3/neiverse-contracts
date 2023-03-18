// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {ERC1155Supply, ERC1155} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IPrizePoap} from "./IPrizePoap.sol";
import {ICommunityPassport} from "./Interface/ICommunityPassport.sol";
import {ICommunityPortal} from "./Interface/ICommunityPortal.sol";
import {IQuestBoard} from "./Interface/IQuestBoard.sol";

contract PrizePoap is IPrizePoap, Ownable, ERC1155Supply {
  ICommunityPortal public communityPortal;
  IQuestBoard public questBoard;
  string private _baseURI;
  IPrizePoap.Prize[] private _prizeList;

  constructor(
    address _communityPortal,
    address _questBoard,
    string memory _initBaseURI
  ) ERC1155("") {
    communityPortal = ICommunityPortal(_communityPortal);
    questBoard = IQuestBoard(_questBoard);
    _baseURI = _initBaseURI;
  }

  modifier obtainable(uint256 tokenId, address to) {
    require(checkObtainable(to, tokenId), "Lack of requirement");
    require(!checkObtained(to, tokenId), "Already obtained");
    _;
  }

  function getBaseURI() external view returns (string memory prize) {
    return _baseURI;
  }

  function getPrize(
    uint256 tokenId
  ) external view returns (IPrizePoap.Prize memory prize) {
    prize.tokenURI = _prizeList[tokenId].tokenURI;
    prize.communityId = _prizeList[tokenId].communityId;
    prize.requiredExp = _prizeList[tokenId].requiredExp;
    prize.requiredQuestId = _prizeList[tokenId].requiredQuestId;
    prize.questRequired = _prizeList[tokenId].questRequired;
    prize.closed = _prizeList[tokenId].closed;
  }

  function getPrizeList(
    uint256 page,
    uint256 pageSize
  ) external view returns (IPrizePoap.Prize[] memory, uint256) {
    require(pageSize > 0, "page size must be positive");
    uint256 actualSize = pageSize;
    if ((page + 1) * pageSize > _prizeList.length) {
      actualSize = _prizeList.length;
    }
    IPrizePoap.Prize[] memory res = new IPrizePoap.Prize[](actualSize);
    for (uint256 i = 0; i < actualSize; i++) {
      res[i] = _prizeList[page * pageSize + i];
    }
    return (res, _prizeList.length);
  }

  function getPrizeListLength() external view returns (uint256 length) {
    length = _prizeList.length;
  }

  function uri(uint256 tokenId) public view override returns (string memory) {
    require(exists(tokenId), "Invalid token ID");
    return
      bytes(_baseURI).length > 0
        ? string.concat(_baseURI, _prizeList[tokenId].tokenURI)
        : "";
  }

  function setCommunityPortal(address _communityPortal) external onlyOwner {
    communityPortal = ICommunityPortal(_communityPortal);
  }

  function setQuestBoard(address _questBoard) external onlyOwner {
    questBoard = IQuestBoard(_questBoard);
  }

  function setBaseURI(string memory _newBaseURL) external onlyOwner {
    _baseURI = _newBaseURL;
  }

  function setPrize(
    uint256 tokenId,
    IPrizePoap.Prize memory prize
  ) external onlyOwner {
    _prizeList[tokenId] = prize;
  }

  function create(
    string memory _tokenURI,
    uint32 _communityId,
    uint32 _requiredExp,
    uint32 _requiredQuestId,
    bool _questRequired
  ) external onlyOwner {
    bool closed;
    (, , closed) = communityPortal.getCommunity(_communityId);
    require(!closed, "This community is not opend");

    IPrizePoap.Prize memory prize;
    prize.tokenURI = _tokenURI;
    prize.communityId = _communityId;
    prize.requiredExp = _requiredExp;
    prize.requiredQuestId = _requiredQuestId;
    prize.questRequired = _questRequired;
    _prizeList.push(prize);

    emit Created(
      msg.sender,
      prize.tokenURI,
      prize.communityId,
      prize.requiredExp,
      prize.requiredQuestId,
      prize.questRequired,
      prize.closed
    );
  }

  function mint(uint256 tokenId) external obtainable(tokenId, msg.sender) {
    _mint(msg.sender, tokenId, 1, "0x00");
  }

  function mintOnlyQuestBoard(
    uint256 tokenId,
    address to
  ) external obtainable(tokenId, to) {
    require(msg.sender == address(questBoard), "Only questBoard");
    _mint(to, tokenId, 1, "0x00");
  }

  function burn(uint256 tokenId) external {
    _burn(msg.sender, tokenId, 1);
  }

  function checkObtainable(
    address target,
    uint256 tokenId
  ) public view returns (bool) {
    IPrizePoap.Prize memory prize = _prizeList[tokenId];
    if (prize.questRequired) {
      return questBoard.balanceOf(target, prize.requiredQuestId) > 0;
    }
    uint32 communityId = prize.communityId;
    address passportAddr;
    (, passportAddr, ) = communityPortal.getCommunity(communityId);
    ICommunityPassport passportContract = ICommunityPassport(passportAddr);
    ICommunityPassport.Passport memory passport = passportContract.getPassport(
      target
    );
    return passport.exp >= prize.requiredExp;
  }

  function checkBatchObtainable(
    address[] memory targets,
    uint256[] memory tokenIds
  ) external view returns (bool[] memory) {
    require(
      targets.length == tokenIds.length,
      "targets and tokenIds length mismatch"
    );
    bool[] memory obtainableList = new bool[](tokenIds.length);
    for (uint256 i; i < tokenIds.length; i++) {
      obtainableList[i] = checkObtainable(targets[i], tokenIds[i]);
    }
    return obtainableList;
  }

  function checkObtained(
    address target,
    uint256 tokenId
  ) public view returns (bool) {
    return balanceOf(target, tokenId) > 0;
  }

  function checkBatchObtained(
    address[] memory targets,
    uint256[] memory tokenIds
  ) external view returns (bool[] memory) {
    require(
      targets.length == tokenIds.length,
      "targets and tokenIds length mismatch"
    );
    bool[] memory obtainedList = new bool[](tokenIds.length);
    for (uint256 i; i < tokenIds.length; i++) {
      obtainedList[i] = checkObtained(targets[i], tokenIds[i]);
    }
    return obtainedList;
  }

  function _beforeTokenTransfer(
    address operator,
    address from,
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
  ) internal override {
    require(
      from == address(0) || to == address(0),
      "Cannot transfer to others"
    );
    super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
  }
}
