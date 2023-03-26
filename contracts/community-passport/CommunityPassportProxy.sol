// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {BeaconProxy} from "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";

/// @title CommunityPassportProxy
/// @author keit (@keitEngineer)
/// @notice This is a contract to manage CommunityPassportProxy.
contract CommunityPassportProxy is BeaconProxy {
  // --------------------------------------------------------------------------------
  // Initialize
  // --------------------------------------------------------------------------------

  /// @dev コンストラクタ
  /// @param beacon コミュニティパスポートのビーコンアドレス
  /// @param data 初期化データ
  constructor(address beacon, bytes memory data) BeaconProxy(beacon, data) {}
}
