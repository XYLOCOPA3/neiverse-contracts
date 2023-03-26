// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

import {ICommunityPortal} from "./ICommunityPortal.sol";
import {ICommunityPassport} from "../community-passport/ICommunityPassport.sol";
import {ICommunityPassportCreater} from "../community-passport-creater/ICommunityPassportCreater.sol";

/// @title CommunityPortal
/// @author keit (@keitEngineer)
/// @notice This is a contract to manage Community.
contract CommunityPortal is
  ICommunityPortal,
  Initializable,
  OwnableUpgradeable,
  UUPSUpgradeable,
  ReentrancyGuardUpgradeable
{
  // --------------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------------

  ICommunityPortal.Community[] private _communityList;

  ICommunityPassportCreater public passportCreater;

  address public questBoard;

  // --------------------------------------------------------------------------------
  // Initialize
  // --------------------------------------------------------------------------------

  /// @dev コンストラクタ
  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  /// @dev 初期化
  /// @param passportCreater_ コミュニティパスポートの生成コントラクトアドレス
  /// @param questBoard_ クエストボードのアドレス
  function initialize(
    address passportCreater_,
    address questBoard_
  ) public initializer {
    __Ownable_init();
    __UUPSUpgradeable_init();
    __ReentrancyGuard_init();
    passportCreater = ICommunityPassportCreater(passportCreater_);
    questBoard = questBoard_;
  }

  // --------------------------------------------------------------------------------
  // Getter
  // --------------------------------------------------------------------------------

  /// @dev コミュニティ情報の取得
  /// @param communityId_ コミュニティID
  /// @return community コミュニティ情報
  function getCommunity(
    uint32 communityId_
  ) external view returns (ICommunityPortal.Community memory community) {
    community.communityURI = _communityList[communityId_].communityURI;
    community.passport = _communityList[communityId_].passport;
    community.closed = _communityList[communityId_].closed;
  }

  /// @dev コミュニティリストの取得
  /// @param page_ ページ番号
  /// @param pageSize_ 1ページあたりのサイズ
  /// @return list コミュニティリスト
  /// @return length リスト長さ
  function getCommunityList(
    uint256 page_,
    uint256 pageSize_
  )
    external
    view
    returns (ICommunityPortal.Community[] memory list, uint256 length)
  {
    require(pageSize_ > 0, "page size must be positive");
    length = _communityList.length;
    uint256 actualSize = pageSize_;
    if ((page_ + 1) * pageSize_ > length) {
      actualSize = length;
    }
    list = new ICommunityPortal.Community[](actualSize);
    for (uint256 i = 0; i < actualSize; i++) {
      list[i] = _communityList[page_ * pageSize_ + i];
    }
  }

  /// @dev コミュニティの総数を取得
  /// @return length コミュニティの総数
  function communitySupply() external view returns (uint256 length) {
    length = _communityList.length;
  }

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  /// @dev コミュニティパスポート生成コントラクトアドレスの設定
  /// @param newState_ コミュニティパスポート生成コントラクトアドレス
  function setPassportCreater(address newState_) external onlyOwner {
    address oldState = address(passportCreater);
    passportCreater = ICommunityPassportCreater(newState_);
    emit SetPassportCreater(msg.sender, oldState, newState_);
  }

  /// @dev コミュニティURIの設定
  /// @param communityId_ コミュニティID
  /// @param newState_ コミュニティURI
  function setCommunityURI(
    uint32 communityId_,
    string memory newState_
  ) external onlyOwner {
    string memory oldCommunityURI = _communityList[communityId_].communityURI;
    _communityList[communityId_].communityURI = newState_;
    emit SetCommunityURI(communityId_, oldCommunityURI, newState_);
  }

  /// @dev コミュニティパスポートの設定
  /// @param communityId_ コミュニティID
  /// @param newState_ コミュニティパスポート
  function setPassport(
    uint32 communityId_,
    address newState_
  ) external onlyOwner {
    _communityList[communityId_].passport = newState_;
  }

  /// @dev コミュニティのクローズ状態の設定
  /// @param communityId_ コミュニティID
  /// @param newState_ クローズ状態
  function setClosed(uint32 communityId_, bool newState_) external onlyOwner {
    _communityList[communityId_].closed = newState_;
  }

  /// @dev クエストボードの設定
  /// @param newState_ クエストボードのアドレス
  function setQuestBoard(address newState_) external onlyOwner {
    questBoard = newState_;
  }

  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------

  /// @dev コミュニティの作成
  /// @param name_ トークン名
  /// @param baseURI_ ベースURL
  /// @param firstURI_ firstURL
  /// @param contractURI_ コントラクトURL
  /// @param adminList_ 管理者リスト
  /// @param communityURI_ コミュニティURI
  function createCommunity(
    string memory name_,
    string memory baseURI_,
    string memory firstURI_,
    string memory contractURI_,
    address[] memory adminList_,
    string memory communityURI_
  ) external onlyOwner {
    string memory name = string.concat(name_, " Passport");
    string memory symbol = "CPASS";
    uint32 communityId = uint32(_communityList.length);
    ICommunityPortal.Community memory community;
    community.passport = passportCreater.createCommunityPassport(
      name,
      symbol,
      baseURI_,
      firstURI_,
      contractURI_,
      communityId,
      adminList_
    );
    community.communityURI = communityURI_;
    _communityList.push(community);
    emit CreatedCommunity(
      address(this),
      communityId,
      community.passport,
      community.communityURI
    );
  }

  /// @dev 経験値取得
  /// @param communityId_ コミュニティID
  /// @param user_ ユーザーアドレス
  /// @param exp_ 取得経験値
  function addExp(uint32 communityId_, address user_, uint32 exp_) external {
    require(msg.sender == questBoard, "You cannot run addExp");
    ICommunityPassport passport = ICommunityPassport(
      _communityList[communityId_].passport
    );
    passport.addExp(user_, exp_);
  }

  // --------------------------------------------------------------------------------
  // Internal
  // --------------------------------------------------------------------------------

  /// @dev アップグレードの許可
  /// @param newImplementation 新しい実装アドレス
  function _authorizeUpgrade(
    address newImplementation
  ) internal override onlyOwner {}
}
