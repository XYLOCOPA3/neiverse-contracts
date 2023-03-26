// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/// @title ICommunityPassportCreater
/// @author keit (@keitEngineer)
/// @notice This is an interface to create CommunityPassport.
interface ICommunityPassportCreater {
  // --------------------------------------------------------------------------------
  // Event
  // --------------------------------------------------------------------------------

  event CreatedPassport(
    address indexed publisher,
    address indexed beacon,
    bytes data,
    address indexed passportAddr
  );

  event SetCommunityPassportBeacon(
    address indexed publisher,
    address oldValue,
    address newValue
  );

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  /// @dev コミュニティパスポートのビーコンアドレスを設定する
  /// @param newState_ 新しいビーコンアドレス
  function setCommunityPassportBeacon(address newState_) external;

  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------

  /// @dev コミュニティパスポートを作成する
  /// @param name_ トークン名
  /// @param symbol_ トークンシンボル
  /// @param baseURI_ ベースURL
  /// @param firstURI_ firstURL
  /// @param contractURI_ コントラクトURL
  /// @param communityId_ コミュニティID
  /// @param adminList_ 管理者リスト
  /// @return passportAddr コミュニティパスポートのアドレス
  function createCommunityPassport(
    string memory name_,
    string memory symbol_,
    string memory baseURI_,
    string memory firstURI_,
    string memory contractURI_,
    uint32 communityId_,
    address[] memory adminList_
  ) external returns (address passportAddr);
}
