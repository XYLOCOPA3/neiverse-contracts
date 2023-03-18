// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC1155Supply, ERC1155} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import {IQuestBoard} from "./IQuestBoard.sol";
import {IQuestChecker} from "./Interface/IQuestChecker.sol";
import {ICommunityPortal} from "./Interface/ICommunityPortal.sol";
import {IQuestCheckerCreater} from "./Interface/IQuestCheckerCreater.sol";
import {IPrizePoap} from "./Interface/IPrizePoap.sol";

contract QuestBoard is IQuestBoard, Ownable, ERC1155Supply {
  ICommunityPortal public communityPortal;
  IQuestCheckerCreater public questCheckerCreater;
  IPrizePoap public prizePoap;
  IQuestBoard.Quest[] public questBoard;
  mapping(address => mapping(uint256 => bool)) public obtained;

  constructor(
    address _communityPortal,
    address _questCheckerCreater,
    address _prizePoap
  ) ERC1155("") {
    communityPortal = ICommunityPortal(_communityPortal);
    questCheckerCreater = IQuestCheckerCreater(_questCheckerCreater);
    prizePoap = IPrizePoap(_prizePoap);
  }

  function getQuest(
    uint256 page,
    uint256 pageSize
  ) external view returns (IQuestBoard.Quest[] memory, uint256) {
    require(pageSize > 0, "page size must be positive");
    uint256 actualSize = pageSize;
    if ((page + 1) * pageSize > questBoard.length) {
      actualSize = questBoard.length;
    }
    IQuestBoard.Quest[] memory res = new Quest[](actualSize);
    for (uint256 i = 0; i < actualSize; i++) {
      res[i] = questBoard[page * pageSize + i];
    }
    return (res, questBoard.length);
  }

  function uri(uint256 tokenId) public view override returns (string memory) {
    return questBoard[tokenId].questURI;
  }

  function setQuest(
    uint256 tokenId,
    IQuestBoard.Quest memory quest
  ) external onlyOwner {
    questBoard[tokenId] = quest;
  }

  function setCommunityPortal(
    address communityPortalAddress
  ) external onlyOwner {
    communityPortal = ICommunityPortal(communityPortalAddress);
  }

  function setQuestCheckerCreater(
    address questCheckerCreaterAddress
  ) external onlyOwner {
    questCheckerCreater = IQuestCheckerCreater(questCheckerCreaterAddress);
  }

  function setPrizePoap(address prizePoapAddress) external onlyOwner {
    prizePoap = IPrizePoap(prizePoapAddress);
  }

  function createQuest(
    string memory _title,
    string memory _questURI,
    uint32 _communityId,
    uint32 _obtainableExp,
    uint32 _obtainablePrizeId,
    bool _prizeObtainable,
    bytes4 _interfaceId,
    address _target
  ) external onlyOwner {
    require(_obtainableExp > 0, "Not enough obtainableExp");

    bool closed;
    (, , closed) = communityPortal.getCommunity(_communityId);
    require(!closed, "This community is not opend");

    IQuestBoard.Quest memory quest;
    quest.title = _title;
    quest.questURI = _questURI;
    address questCheckerAddress = questCheckerCreater.createQuestChecker(
      _interfaceId,
      _target
    );
    quest.questCheckerAddress = questCheckerAddress;
    quest.communityId = _communityId;
    quest.obtainableExp = _obtainableExp;
    quest.obtainablePrizeId = _obtainablePrizeId;
    quest.prizeObtainable = _prizeObtainable;
    questBoard.push(quest);

    emit Create(
      uint32(questBoard.length - 1),
      quest.title,
      quest.questURI,
      quest.questCheckerAddress,
      quest.communityId,
      quest.obtainableExp,
      quest.obtainablePrizeId,
      quest.prizeObtainable,
      _target
    );
  }

  function claim(uint32 questId) external {
    require(balanceOf(msg.sender, questId) == 0, "You have already minted");
    IQuestChecker questChecker = IQuestChecker(
      questBoard[questId].questCheckerAddress
    );
    require(
      questChecker.checkCompleted(msg.sender),
      "You have not completed this quest yet."
    );
    _mint(msg.sender, questId, 1, "0x00");
    if (!obtained[msg.sender][questId]) {
      obtained[msg.sender][questId] = true;
      communityPortal.addExp(
        questBoard[questId].communityId,
        msg.sender,
        questBoard[questId].obtainableExp
      );
      if (questBoard[questId].prizeObtainable) {
        prizePoap.mintOnlyQuestBoard(
          questBoard[questId].obtainablePrizeId,
          msg.sender
        );
      }
    }
    emit Claim(questId, msg.sender);
  }

  function burn(uint32 questId) external {
    _burn(msg.sender, questId, 1);
    emit Burn(questId, msg.sender);
  }

  function questSupply() external view returns (uint256) {
    return questBoard.length;
  }

  function checkBatchCompleted(
    uint256[] memory questIds,
    address[] memory fanList
  ) external view returns (bool[] memory) {
    require(
      questIds.length == fanList.length,
      "questIds and fanList length mismatch"
    );
    bool[] memory completedList = new bool[](questIds.length);
    for (uint256 i; i < questIds.length; i++) {
      IQuestChecker questChecker = IQuestChecker(
        questBoard[questIds[i]].questCheckerAddress
      );
      completedList[i] = questChecker.checkCompleted(fanList[i]);
    }
    return completedList;
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
