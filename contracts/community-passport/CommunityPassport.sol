// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {ERC721Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

import {ICommunityPassport} from "./ICommunityPassport.sol";

/// @title CommunityPassport
/// @author keit (@keitEngineer)
/// @notice This is passport for Community. If you want to join the community, you need to get a passport.
contract CommunityPassport is
  Initializable,
  ICommunityPassport,
  ERC721Upgradeable,
  OwnableUpgradeable,
  UUPSUpgradeable,
  ReentrancyGuardUpgradeable
{
  // --------------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------------

  mapping(uint256 => ICommunityPassport.Passport) private _passport;

  address[] private _userList;

  mapping(address => uint256) private _userListIndex;

  mapping(address => bool) public isAdmin;

  string private _contractURI;

  string public baseURI;

  string public firstURI;

  uint32 public communityId;

  // --------------------------------------------------------------------------------
  // Modifier
  // --------------------------------------------------------------------------------

  modifier onlyOwnerOrAdmin() {
    address msgSender = _msgSender();
    require(
      owner() == msgSender || isAdmin[msgSender],
      "Caller is not the owner or admin"
    );
    _;
  }

  // --------------------------------------------------------------------------------
  // Initialize
  // --------------------------------------------------------------------------------

  /// @dev コンストラクタ
  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

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
  ) public initializer {
    __ERC721_init(name_, symbol_);
    __Ownable_init();
    __UUPSUpgradeable_init();
    __ReentrancyGuard_init();
    baseURI = baseURI_;
    firstURI = firstURI_;
    _contractURI = contractURI_;
    communityId = communityId_;
    for (uint256 i; i < adminList_.length; i++) {
      isAdmin[adminList_[i]] = true;
    }
  }

  // --------------------------------------------------------------------------------
  // Getter
  // --------------------------------------------------------------------------------

  /// @dev パスポートの取得
  /// @param user_ ユーザーアドレス
  /// @return passport パスポート
  function getPassport(
    address user_
  ) external view returns (ICommunityPassport.Passport memory passport) {
    uint256 passportId = hashAddress(user_);
    passport = _passport[passportId];
  }

  /// @dev パスポートリストの取得
  /// @param page_ ページ番号
  /// @param pageSize_ 1ページあたりのサイズ
  /// @return passportList パスポートリスト
  function getPassportList(
    uint256 page_,
    uint256 pageSize_
  )
    external
    view
    returns (ICommunityPassport.Passport[] memory passportList)
  {
    require(pageSize_ > 0, "page size must be positive");
    uint256 length = _userList.length;
    uint256 actualSize = pageSize_;
    if ((page_ + 1) * pageSize_ > length) {
      actualSize = length;
    }
    passportList = new ICommunityPassport.Passport[](actualSize);
    for (uint256 i; i < actualSize; i++) {
      uint256 passportId = hashAddress(_userList[page_ * pageSize_ + i]);
      passportList[i] = _passport[passportId];
    }
  }

  /// @dev パスポート所有者リストの取得
  /// @param page_ ページ番号
  /// @param pageSize_ 1ページあたりのサイズ
  /// @return userList パスポート所有者リスト
  function getUserList(
    uint256 page_,
    uint256 pageSize_
  ) external view returns (address[] memory userList) {
    require(pageSize_ > 0, "page size must be positive");
    uint256 length = _userList.length;
    uint256 actualSize = pageSize_;
    if ((page_ + 1) * pageSize_ > length) {
      actualSize = length;
    }
    userList = new address[](actualSize);
    for (uint256 i; i < actualSize; i++) {
      userList[i] = _userList[page_ * pageSize_ + i];
    }
  }

  /// @dev アドレスからパスポートURIを取得
  /// @param user_ ユーザーアドレス
  /// @return uri パスポートURI
  function getPassportURIFromAddress(
    address user_
  ) external view returns (string memory uri) {
    uri = tokenURI(hashAddress(user_));
  }

  /// @dev アドレスからパスポートURIを取得
  /// @param passportId_ パスポートID
  /// @return uri パスポートURI
  function tokenURI(
    uint256 passportId_
  ) public view override returns (string memory uri) {
    uri = bytes(_passport[passportId_].passportURI).length > 0
      ? string.concat(baseURI, _passport[passportId_].passportURI)
      : "";
  }

  /// @dev アドレスからパスポートURIを取得
  /// @return uri コントラクトURI
  function contractURI() external view returns (string memory uri) {
    uri = _contractURI;
  }

  /// @dev パスポートの総数を取得
  /// @return length パスポートの総数
  function totalSupply() external view returns (uint256 length) {
    length = _userList.length;
  }

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  /// @dev ベースURIをセット
  /// @param newState_ 新しいベースURI
  function setBaseURI(string memory newState_) external onlyOwnerOrAdmin {
    string memory oldState = baseURI;
    baseURI = newState_;
    emit SetBaseURI(_msgSender(), oldState, newState_);
  }

  /// @dev firstURIをセット
  /// @param newState_ 新しいfirstURI
  function setPassportURI(string memory newState_) external onlyOwnerOrAdmin {
    string memory oldState = firstURI;
    firstURI = newState_;
    emit SetFirstURI(_msgSender(), oldState, newState_);
  }

  /// @dev パスポートURIを一括セット
  /// @param userList_ ユーザーアドレスリスト
  /// @param newStateList_ 新しいパスポートURIリスト
  function setBatchPassportURI(
    address[] memory userList_,
    string[] memory newStateList_
  ) external onlyOwnerOrAdmin {
    require(userList_.length == newStateList_.length, "length mismatch");
    for (uint256 i; i < userList_.length; i++) {
      uint256 passportId = hashAddress(userList_[i]);
      _passport[passportId].passportURI = newStateList_[i];
    }
  }

  /// @dev コントラクトURIをセット
  /// @param newState_ 新しいコントラクトURI
  function setContractURI(string memory newState_) external onlyOwnerOrAdmin {
    string memory oldState = _contractURI;
    _contractURI = newState_;
    emit SetContractURI(_msgSender(), oldState, newState_);
  }

  /// @dev 経験値をセット
  /// @param user_ ユーザーアドレス
  /// @param newState_ 経験値
  function setExp(address user_, uint32 newState_) external onlyOwnerOrAdmin {
    uint256 passportId = hashAddress(user_);
    require(_exists(passportId), "This token doesn't exist");
    uint32 oldState = _passport[passportId].exp;
    _passport[passportId].exp = newState_;
    emit SetExp(_msgSender(), user_, passportId, oldState, newState_);
  }

  /// @dev 管理者かどうかを一括セット
  /// @param userList_ ユーザーアドレスリスト
  /// @param newStateList_ 管理者かどうかのリスト
  function setBatchAdmin(
    address[] memory userList_,
    bool[] memory newStateList_
  ) external onlyOwnerOrAdmin {
    uint256 length = userList_.length;
    require(length == newStateList_.length, "length mismatch");
    for (uint256 i; i < length; i++) {
      isAdmin[userList_[i]] = newStateList_[i];
    }
  }

  /// @dev 所有者を変更
  /// @param newOwner_ 新しい所有者
  function transferOwner(address newOwner_) external onlyOwner {
    transferOwnership(newOwner_);
  }

  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------

  /// @dev アドレスのハッシュ化
  /// @param addr_ アドレス
  /// @return value アドレスのハッシュ値
  function hashAddress(address addr_) public pure returns (uint256 value) {
    value = uint256(keccak256(abi.encodePacked(addr_)));
  }

  /// @dev ミント
  function mint() external nonReentrant {
    if (_passport[hashAddress(_msgSender())].user == address(0)) {
      ICommunityPassport.Passport memory passport;
      passport.passportURI = string.concat(baseURI, firstURI);
      passport.user = _msgSender();
      _passport[hashAddress(_msgSender())] = passport;
    }
    _safeMint(_msgSender(), hashAddress(_msgSender()));
    _addUser(_msgSender());
  }

  /// @dev バーン
  function burn() external nonReentrant {
    _burn(hashAddress(_msgSender()));
    _deleteUser(_msgSender());
  }

  /// @dev 経験値の追加
  /// @param user_ ユーザーアドレス
  /// @param exp_ 経験値
  function addExp(address user_, uint32 exp_) external onlyOwnerOrAdmin {
    uint256 passportId = hashAddress(user_);
    require(_exists(passportId), "This token doesn't exist");
    uint32 oldExp = _passport[passportId].exp;
    _passport[passportId].exp = _passport[passportId].exp + exp_;
    emit AddExp(
      _msgSender(),
      user_,
      passportId,
      oldExp,
      _passport[passportId].exp
    );
  }

  // --------------------------------------------------------------------------------
  // Internal
  // --------------------------------------------------------------------------------

  /// @dev ユーザーをリストに追加
  /// @param user_ ユーザーアドレス
  function _addUser(address user_) private {
    _userListIndex[user_] = _userList.length;
    _userList.push(_msgSender());
  }

  /// @dev ユーザーをリストから削除
  /// @param user_ ユーザーアドレス
  function _deleteUser(address user_) private {
    uint256 index = _userListIndex[user_];
    address lastFan = _userList[_userList.length - 1];
    _userList[index] = lastFan;
    _userListIndex[lastFan] = index;
    _userList.pop();
    delete _userListIndex[user_];
  }

  /// @dev トークンの送受信前に呼ばれる
  /// @param from 送信元
  /// @param to 受信先
  /// @param tokenId トークンID
  /// @param batchSize 一括送信数
  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId,
    uint256 batchSize
  ) internal override {
    require(
      from == address(0) || to == address(0),
      "Cannot transfer to others"
    );
    super._beforeTokenTransfer(from, to, tokenId, batchSize);
  }

  /// @dev アップグレードの許可
  /// @param newImplementation 新しい実装アドレス
  function _authorizeUpgrade(
    address newImplementation
  ) internal override onlyOwner {}
}
