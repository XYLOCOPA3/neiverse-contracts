// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {IQuestChecker} from "./IQuestChecker.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract QuestCheckerERC721 is IQuestChecker, Ownable {
  IERC721 public erc721;
  mapping(address => bool) public questBoard;

  constructor(address _erc721, address _questBoard) {
    erc721 = IERC721(_erc721);
    questBoard[_questBoard] = true;
  }

  function setQuestBoard(
    address _questBoard,
    bool newState
  ) external onlyOwner {
    questBoard[_questBoard] = newState;
  }

  function checkCompleted(address from) external view returns (bool) {
    if (!questBoard[msg.sender]) from = msg.sender;
    return erc721.balanceOf(from) > 0;
  }
}
