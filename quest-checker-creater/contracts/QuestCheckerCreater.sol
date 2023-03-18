// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {IQuestChecker} from "./QuestChecker/IQuestChecker.sol";
import {QuestCheckerERC721} from "./QuestChecker/QuestCheckerERC721.sol";
import {IQuestCheckerCreater} from "./IQuestCheckerCreater.sol";

contract QuestCheckerCreater is IQuestCheckerCreater {
  bytes4 private constant _INTERFACE_ID_ERC721 = 0x80ac58cd;

  function createQuestChecker(
    bytes4 interfaceId,
    address target
  ) external returns (address) {
    require(target != address(0), "zero address");
    IQuestChecker questChecker;
    if (interfaceId == _INTERFACE_ID_ERC721) {
      questChecker = new QuestCheckerERC721(target, msg.sender);
    } else {
      revert InvalidInterfaceId();
    }
    return address(questChecker);
  }
}
