// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {IQuestChecker} from "./IQuestChecker.sol";

/// @title IQuestCheckerERC721
/// @author keit (@keitEngineer)
/// @notice This is an interface to check if the user has an ERC721 token.
interface IQuestCheckerERC721 is IQuestChecker {
  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  /// @dev クエストボードの設定
  /// @param questBoard_ クエストボードのコントラクトアドレス
  /// @param newState_ 新しいクエストボードのコントラクトアドレス
  function setQuestBoard(address questBoard_, bool newState_) external;
}
