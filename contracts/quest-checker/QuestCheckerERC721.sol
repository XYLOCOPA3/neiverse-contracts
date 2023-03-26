// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {IQuestCheckerERC721} from "./IQuestCheckerERC721.sol";

/// @title QuestCheckerERC721
/// @author keit (@keitEngineer)
/// @notice This is a contract to check if the user has an ERC721 token.
contract QuestCheckerERC721 is IQuestCheckerERC721, Ownable {
  // --------------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------------

  IERC721 public erc721;

  mapping(address => bool) public questBoard;

  // --------------------------------------------------------------------------------
  // Initialize
  // --------------------------------------------------------------------------------

  /// @dev コンストラクタ
  /// @param erc721_ ERC721トークンのコントラクトアドレス
  /// @param questBoard_ クエストボードのコントラクトアドレス
  constructor(address erc721_, address questBoard_) {
    erc721 = IERC721(erc721_);
    questBoard[questBoard_] = true;
  }

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  /// @dev クエストボードの設定
  /// @param questBoard_ クエストボードのコントラクトアドレス
  /// @param newState_ 新しいクエストボードのコントラクトアドレス
  function setQuestBoard(
    address questBoard_,
    bool newState_
  ) external onlyOwner {
    questBoard[questBoard_] = newState_;
  }

  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------

  /// @dev クエストの完了チェック
  /// @param from_ チェック対象のアドレス
  /// @return completed クエストの完了状態
  function checkCompleted(
    address from_
  ) external view returns (bool completed) {
    if (!questBoard[msg.sender]) from_ = msg.sender;
    completed = erc721.balanceOf(from_) > 0;
  }
}
