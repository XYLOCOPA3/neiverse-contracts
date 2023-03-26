// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/// @title IQuestPoap
/// @author keit (@keitEngineer)
/// @notice This is an interface to create QuestPoap.
interface IQuestPoap is IERC721 {
  // --------------------------------------------------------------------------------
  // Getter
  // --------------------------------------------------------------------------------

  /// @dev POAPのURIをアドレスから取得
  /// @param addr_ POAPを取得したアドレス
  /// @return uri POAPのURI
  function getTokenURIFromAddress(
    address addr_
  ) external view returns (string memory uri);

  /// @dev コントラクトURIを取得
  /// @return uri コントラクトのURI
  function contractURI() external view returns (string memory uri);

  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------

  /// @dev アドレスからトークンIDを取得
  /// @param addr_ アドレス
  /// @return value トークンID
  function hashMsgSender(address addr_) external pure returns (uint256 value);

  /// @dev ミント
  /// @param to_ ミント先アドレス
  function safeMint(address to_) external;

  /// @dev バーン
  /// @param to_ バーン先アドレス
  function burn(address to_) external;
}
