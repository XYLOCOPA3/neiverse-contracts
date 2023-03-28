// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {IERC721Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";

/// @title ICommunityPassport
/// @author keit (@keitEngineer)
/// @notice This is an interface of CommunityPassport.
interface ICommunityPassport is IERC721Upgradeable {
  // --------------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------------

  struct Passport {
    string passportURI;
    address user;
    uint32 exp;
  }

  // --------------------------------------------------------------------------------
  // Event
  // --------------------------------------------------------------------------------

  event AddExp(
    address indexed publisher,
    address indexed user,
    uint256 passportId,
    uint32 oldExp,
    uint32 newExp
  );

  event SetBaseURI(address indexed publisher, string oldValue, string newValue);

  event SetFirstURI(
    address indexed publisher,
    string oldValue,
    string newValue
  );

  event SetExp(
    address indexed publisher,
    address indexed user,
    uint256 passportId,
    uint32 oldExp,
    uint32 newExp
  );

  event SetContractURI(
    address indexed publisher,
    string oldValue,
    string newValue
  );

  // --------------------------------------------------------------------------------
  // Initialize
  // --------------------------------------------------------------------------------

  /// @dev 初期化
  /// @param name_ トークン名
  /// @param symbol_ トークンシンボル
  /// @param baseURI_ ベースURL
  /// @param firstURI_ トークンURL
  /// @param contractURI_ コントラクトURL
  /// @param communityId_ コミュニティID
  /// @param adminList_ 管理者リスト
  function initialize(
    string memory name_,
    string memory symbol_,
    string memory baseURI_,
    string memory firstURI_,
    string memory contractURI_,
    uint32 communityId_,
    address[] memory adminList_
  ) external;

  // --------------------------------------------------------------------------------
  // Getter
  // --------------------------------------------------------------------------------

  /// @dev パスポートの取得
  /// @param user_ ユーザーアドレス
  /// @return passport パスポート
  function getPassport(
    address user_
  ) external view returns (ICommunityPassport.Passport memory passport);

  /// @dev パスポートリストの取得
  /// @param page_ ページ番号
  /// @param pageSize_ 1ページあたりのサイズ
  /// @return passportList パスポートリスト
  function getPassportList(
    uint256 page_,
    uint256 pageSize_
  ) external view returns (ICommunityPassport.Passport[] memory passportList);

  /// @dev パスポート所有者リストの取得
  /// @param page_ ページ番号
  /// @param pageSize_ 1ページあたりのサイズ
  /// @return userList パスポート所有者リスト
  function getUserList(
    uint256 page_,
    uint256 pageSize_
  ) external view returns (address[] memory userList);

  /// @dev アドレスからパスポートURIを取得
  /// @param user_ ユーザーアドレス
  /// @return uri パスポートURI
  function getPassportURIFromAddress(
    address user_
  ) external view returns (string memory uri);

  /// @dev アドレスからパスポートURIを取得
  /// @return uri コントラクトURI
  function contractURI() external view returns (string memory uri);

  /// @dev パスポートの総数を取得
  /// @return length パスポートの総数
  function totalSupply() external view returns (uint256 length);

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  /// @dev ベースURIをセット
  /// @param newState_ 新しいベースURI
  function setBaseURI(string memory newState_) external;

  /// @dev firstURIをセット
  /// @param newState_ 新しいfirstURI
  function setFirstURI(string memory newState_) external;

  /// @dev パスポートURIを一括セット
  /// @param userList_ ユーザーアドレスリスト
  /// @param newStateList_ 新しいパスポートURIリスト
  function setBatchPassportURI(
    address[] memory userList_,
    string[] memory newStateList_
  ) external;

  /// @dev コントラクトURIをセット
  /// @param newState_ 新しいコントラクトURI
  function setContractURI(string memory newState_) external;

  /// @dev 経験値をセット
  /// @param user_ ユーザーアドレス
  /// @param newState_ 経験値
  function setExp(address user_, uint32 newState_) external;

  /// @dev 管理者かどうかを一括セット
  /// @param userList_ ユーザーアドレスリスト
  /// @param newStateList_ 管理者かどうかのリスト
  function setBatchAdmin(
    address[] memory userList_,
    bool[] memory newStateList_
  ) external;

  /// @dev 所有者を変更
  /// @param newOwner_ 新しい所有者
  function transferOwner(address newOwner_) external;

  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------

  /// @dev アドレスのハッシュ化
  /// @param addr_ アドレス
  /// @return value アドレスのハッシュ値
  function hashAddress(address addr_) external pure returns (uint256 value);

  /// @dev ミント
  function mint() external;

  /// @dev バーン
  function burn() external;

  /// @dev 経験値の追加
  /// @param user_ ユーザーアドレス
  /// @param exp_ 経験値
  function addExp(address user_, uint32 exp_) external;
}
