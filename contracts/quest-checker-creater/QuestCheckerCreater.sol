// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {IQuestCheckerCreater} from "./IQuestCheckerCreater.sol";
import {IQuestChecker} from "../quest-checker/IQuestChecker.sol";
import {QuestCheckerERC721} from "../quest-checker/QuestCheckerERC721.sol";

/// @title QuestCheckerCreater
/// @author keit (@keitEngineer)
/// @notice This is a contract to create QuestChecker.
contract QuestCheckerCreater is IQuestCheckerCreater {
  // --------------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------------

  bytes4 private constant _INTERFACE_ID_ERC721 = 0x80ac58cd;

  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------

  /// @dev QuestCheckerの作成
  /// @param interfaceId_ インターフェースID
  /// @param target_ QuestCheckerの対象となるコントラクトアドレス
  /// @return questCheckerAddr QuestCheckerのコントラクトアドレス
  function createQuestChecker(
    bytes4 interfaceId_,
    address target_
  ) external returns (address questCheckerAddr) {
    require(target_ != address(0), "zero address");
    IQuestChecker questChecker;
    if (interfaceId_ == _INTERFACE_ID_ERC721) {
      questChecker = new QuestCheckerERC721(target_, msg.sender);
    } else {
      revert("no match interface");
    }
    questCheckerAddr = address(questChecker);
  }
}
