// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {ICommunityPassportCreater} from "./ICommunityPassportCreater.sol";
import {CommunityPassportProxy} from "../community-passport/CommunityPassportProxy.sol";
import {ICommunityPassport} from "../community-passport/ICommunityPassport.sol";

/// @title CommunityPassportCreater
/// @author keit (@keitEngineer)
/// @notice This is a contract to create CommunityPassport.
contract CommunityPassportCreater is ICommunityPassportCreater, Ownable {
  // --------------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------------

  address public communityPassportBeacon;

  // --------------------------------------------------------------------------------
  // Initialize
  // --------------------------------------------------------------------------------

  /// @dev コンストラクタ
  /// @param communityPassportBeacon_ コミュニティパスポートのビーコンアドレス
  constructor(address communityPassportBeacon_) {
    communityPassportBeacon = communityPassportBeacon_;
  }

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  /// @dev コミュニティパスポートのビーコンアドレスを設定する
  /// @param newState_ 新しいビーコンアドレス
  function setCommunityPassportBeacon(address newState_) external onlyOwner {
    address oldState = communityPassportBeacon;
    communityPassportBeacon = newState_;
    emit SetCommunityPassportBeacon(_msgSender(), oldState, newState_);
  }

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
  ) external returns (address passportAddr) {
    bytes memory data = abi.encodeWithSelector(
      ICommunityPassport.initialize.selector,
      name_,
      symbol_,
      baseURI_,
      firstURI_,
      contractURI_,
      communityId_,
      adminList_
    );
    CommunityPassportProxy proxy = new CommunityPassportProxy(
      communityPassportBeacon,
      data
    );
    passportAddr = address(proxy);
    ICommunityPassport passport = ICommunityPassport(passportAddr);
    address msgSender = _msgSender();
    passport.transferOwner(msgSender);
    emit CreatedPassport(
      msgSender,
      communityPassportBeacon,
      data,
      passportAddr
    );
  }
}
