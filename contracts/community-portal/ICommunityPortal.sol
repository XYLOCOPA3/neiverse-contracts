// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/// @title ICommunityPortal
/// @author keit (@keitEngineer)
/// @notice This is an interface for managing communities.
interface ICommunityPortal {
  // --------------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------------

  struct Community {
    string communityURI;
    address passport;
    bool closed;
  }

  // --------------------------------------------------------------------------------
  // Event
  // --------------------------------------------------------------------------------

  event SetPassportCreater(
    address indexed publisher,
    address oldState,
    address newState
  );

  event SetCommunityURI(
    uint32 indexed communityId,
    string oldState,
    string newState
  );

  event CreatedCommunity(
    address indexed publisher,
    uint32 communityId,
    address communityPassport,
    string communityURI
  );

  // --------------------------------------------------------------------------------
  // Initialize
  // --------------------------------------------------------------------------------

  /// @dev 初期化
  /// @param passportCreater_ コミュニティパスポートの生成コントラクトアドレス
  /// @param questBoard_ クエストボードのアドレス
  function initialize(address passportCreater_, address questBoard_) external;

  // --------------------------------------------------------------------------------
  // Getter
  // --------------------------------------------------------------------------------

  /// @dev コミュニティ情報の取得
  /// @param communityId_ コミュニティID
  /// @return community コミュニティ情報
  function getCommunity(
    uint32 communityId_
  ) external view returns (Community memory community);

  /// @dev コミュニティリストの取得
  /// @param page_ ページ番号
  /// @param pageSize_ 1ページあたりのサイズ
  /// @return list コミュニティリスト
  function getCommunityList(
    uint256 page_,
    uint256 pageSize_
  ) external view returns (Community[] memory list);

  /// @dev コミュニティの総数を取得
  /// @return length コミュニティの総数
  function communitySupply() external view returns (uint256 length);

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  /// @dev コミュニティパスポート生成コントラクトアドレスの設定
  /// @param newState_ コミュニティパスポート生成コントラクトアドレス
  function setPassportCreater(address newState_) external;

  /// @dev コミュニティURIの設定
  /// @param communityId_ コミュニティID
  /// @param newState_ コミュニティURI
  function setCommunityURI(
    uint32 communityId_,
    string memory newState_
  ) external;

  /// @dev コミュニティパスポートの設定
  /// @param communityId_ コミュニティID
  /// @param newState_ コミュニティパスポート
  function setPassport(uint32 communityId_, address newState_) external;

  /// @dev コミュニティのクローズ状態の設定
  /// @param communityId_ コミュニティID
  /// @param newState_ クローズ状態
  function setClosed(uint32 communityId_, bool newState_) external;

  /// @dev クエストボードの設定
  /// @param newState_ クエストボードのアドレス
  function setQuestBoard(address newState_) external;

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
  ) external;

  /// @dev 経験値取得
  /// @param communityId_ コミュニティID
  /// @param user_ ユーザーアドレス
  /// @param exp_ 取得経験値
  function addExp(uint32 communityId_, address user_, uint32 exp_) external;
}
