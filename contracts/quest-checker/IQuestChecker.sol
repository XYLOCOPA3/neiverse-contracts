// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/// @title IQuestChecker
/// @author keit (@keitEngineer)
/// @notice This is an interface to check if the user has a token.
interface IQuestChecker {
  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------

  /// @dev クエストの完了チェック
  /// @param from_ チェック対象のアドレス
  /// @return completed クエストの完了状態
  function checkCompleted(address from_) external view returns (bool completed);
}
