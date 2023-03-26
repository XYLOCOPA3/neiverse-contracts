// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/// @title IQuestCheckerCreater
/// @author keit (@keitEngineer)
/// @notice This is an interface of QuestCheckerCreater.
interface IQuestCheckerCreater {
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
  ) external returns (address questCheckerAddr);
}
