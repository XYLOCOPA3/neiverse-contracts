// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {ERC1155Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import {ERC1155SupplyUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155SupplyUpgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import {IPrizePoap} from "./IPrizePoap.sol";
import {ICommunityPassport} from "../community-passport/ICommunityPassport.sol";
import {ICommunityPortal} from "../community-portal/ICommunityPortal.sol";
import {IQuestBoard} from "../quest-board/IQuestBoard.sol";

/// @title PrizePoap
/// @author keit (@keitEngineer)
/// @notice This is a contract to manage Prize POAP.
contract PrizePoap is
  Initializable,
  IPrizePoap,
  ERC1155Upgradeable,
  ERC1155SupplyUpgradeable,
  OwnableUpgradeable,
  UUPSUpgradeable
{
  // --------------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------------

  ICommunityPortal public communityPortal;

  IQuestBoard public questBoard;

  string public baseURI;

  IPrizePoap.Prize[] private _prizeList;

  // --------------------------------------------------------------------------------
  // Modifier
  // --------------------------------------------------------------------------------

  modifier obtainable(uint256 tokenId, address to) {
    require(checkObtainable(to, tokenId), "Lack of requirement");
    require(!checkObtained(to, tokenId), "Already obtained");
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
  /// @param communityPortal_ コミュニティポータルアドレス
  /// @param questBoard_ クエストボードアドレス
  /// @param baseURI_ ベースURI
  function initialize(
    address communityPortal_,
    address questBoard_,
    string memory baseURI_
  ) public initializer {
    __ERC1155_init("");
    __ERC1155Supply_init();
    __Ownable_init();
    __UUPSUpgradeable_init();
    communityPortal = ICommunityPortal(communityPortal_);
    questBoard = IQuestBoard(questBoard_);
    baseURI = baseURI_;
  }

  // --------------------------------------------------------------------------------
  // Getter
  // --------------------------------------------------------------------------------

  /// @dev プライズ情報を取得
  /// @param tokenId_ プライズトークンID
  /// @return prize プライズ情報
  function getPrize(
    uint256 tokenId_
  ) external view returns (IPrizePoap.Prize memory prize) {
    prize.tokenURI = _prizeList[tokenId_].tokenURI;
    prize.communityId = _prizeList[tokenId_].communityId;
    prize.requiredExp = _prizeList[tokenId_].requiredExp;
    prize.requiredQuestId = _prizeList[tokenId_].requiredQuestId;
    prize.questRequired = _prizeList[tokenId_].questRequired;
    prize.closed = _prizeList[tokenId_].closed;
  }

  /// @dev プライズリストを取得
  /// @param page_ ページ番号
  /// @param pageSize_ 1ページあたりのサイズ
  /// @return list プライズリスト
  /// @return length リスト長さ
  function getPrizeList(
    uint256 page_,
    uint256 pageSize_
  ) external view returns (IPrizePoap.Prize[] memory list, uint256 length) {
    require(pageSize_ > 0, "page size must be positive");
    length = _prizeList.length;
    uint256 actualSize = pageSize_;
    if ((page_ + 1) * pageSize_ > length) {
      actualSize = length;
    }
    list = new IPrizePoap.Prize[](actualSize);
    for (uint256 i = 0; i < actualSize; i++) {
      list[i] = _prizeList[page_ * pageSize_ + i];
    }
  }

  /// @dev プライズリスト長さを取得
  /// @return length プライズリスト長さ
  function getPrizeListLength() external view returns (uint256 length) {
    length = _prizeList.length;
  }

  /// @dev プライズトークンURIを取得
  /// @param tokenId_ プライズトークンID
  /// @return tokenURI トークンURI
  function uri(
    uint256 tokenId_
  ) public view override returns (string memory tokenURI) {
    require(exists(tokenId_), "Invalid token ID");
    tokenURI = bytes(baseURI).length > 0
      ? string.concat(baseURI, _prizeList[tokenId_].tokenURI)
      : "";
  }

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  /// @dev コミュニティポータルアドレスを設定
  /// @param newState_ コミュニティポータルアドレス
  function setCommunityPortal(address newState_) external onlyOwner {
    communityPortal = ICommunityPortal(newState_);
  }

  /// @dev クエストボードアドレスを設定
  /// @param newState_ クエストボードアドレス
  function setQuestBoard(address newState_) external onlyOwner {
    questBoard = IQuestBoard(newState_);
  }

  /// @dev ベースURIを設定
  /// @param newState_ ベースURI
  function setBaseURI(string memory newState_) external onlyOwner {
    baseURI = newState_;
  }

  /// @dev プライズ情報を設定
  /// @param newState_ プライズ情報
  function setPrize(
    uint256 tokenId,
    IPrizePoap.Prize memory newState_
  ) external onlyOwner {
    _prizeList[tokenId] = newState_;
  }

  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------

  /// @dev プライズを作成
  /// @param tokenURI_ トークンURI
  /// @param communityId_ コミュニティID
  /// @param requiredExp_ 必要経験値
  /// @param requiredQuestId_ 必要クエストID
  /// @param questRequired_ クエスト必須フラグ
  function create(
    string memory tokenURI_,
    uint32 communityId_,
    uint32 requiredExp_,
    uint32 requiredQuestId_,
    bool questRequired_
  ) external onlyOwner {
    ICommunityPortal.Community memory community = communityPortal.getCommunity(
      communityId_
    );
    require(!community.closed, "This community is not opened");
    IPrizePoap.Prize memory prize;
    prize.tokenURI = tokenURI_;
    prize.communityId = communityId_;
    prize.requiredExp = requiredExp_;
    prize.requiredQuestId = requiredQuestId_;
    prize.questRequired = questRequired_;
    _prizeList.push(prize);
    emit Created(
      msg.sender,
      uint32(_prizeList.length - 1),
      prize.tokenURI,
      prize.communityId,
      prize.requiredExp,
      prize.requiredQuestId,
      prize.questRequired,
      prize.closed
    );
  }

  /// @dev プライズをミント
  /// @param tokenId_ トークンID
  function mint(uint256 tokenId_) external obtainable(tokenId_, msg.sender) {
    _mint(msg.sender, tokenId_, 1, "0x00");
  }

  /// @dev プライズをミント
  /// @param tokenId_ トークンID
  /// @param to_ 送信先
  function mintOnlyQuestBoard(
    uint256 tokenId_,
    address to_
  ) external obtainable(tokenId_, to_) {
    require(msg.sender == address(questBoard), "Only questBoard");
    _mint(to_, tokenId_, 1, "0x00");
  }

  /// @dev プライズをバーン
  /// @param tokenId_ トークンID
  function burn(uint256 tokenId_) external {
    _burn(msg.sender, tokenId_, 1);
  }

  /// @dev プライズを獲得可能か判定
  /// @param target_ 対象アドレス
  /// @param tokenId_ トークンID
  /// @return 獲得可能か
  function checkObtainable(
    address target_,
    uint256 tokenId_
  ) public view returns (bool) {
    IPrizePoap.Prize memory prize = _prizeList[tokenId_];
    if (prize.questRequired) {
      return questBoard.balanceOf(target_, prize.requiredQuestId) > 0;
    }
    uint32 communityId = prize.communityId;
    ICommunityPortal.Community memory community = communityPortal.getCommunity(
      communityId
    );
    ICommunityPassport passportContract = ICommunityPassport(
      community.passport
    );
    ICommunityPassport.Passport memory passport = passportContract.getPassport(
      target_
    );
    return passport.exp >= prize.requiredExp;
  }

  /// @dev プライズを獲得可能か一括判定
  /// @param targets_ 対象アドレスリスト
  /// @param tokenIds_ トークンIDリスト
  /// @return obtainableList 獲得可能かリスト
  function checkBatchObtainable(
    address[] memory targets_,
    uint256[] memory tokenIds_
  ) external view returns (bool[] memory obtainableList) {
    require(
      targets_.length == tokenIds_.length,
      "targets and tokenIds length mismatch"
    );
    obtainableList = new bool[](tokenIds_.length);
    for (uint256 i; i < tokenIds_.length; i++) {
      obtainableList[i] = checkObtainable(targets_[i], tokenIds_[i]);
    }
  }

  /// @dev プライズを獲得済みか判定
  /// @param target_ 対象アドレス
  /// @param tokenId_ トークンID
  /// @return obtained 獲得済みか
  function checkObtained(
    address target_,
    uint256 tokenId_
  ) public view returns (bool obtained) {
    obtained = balanceOf(target_, tokenId_) > 0;
  }

  /// @dev プライズを獲得済みか一括判定
  /// @param targets_ 対象アドレスリスト
  /// @param tokenIds_ トークンIDリスト
  /// @return obtainedList 獲得済みかリスト
  function checkBatchObtained(
    address[] memory targets_,
    uint256[] memory tokenIds_
  ) external view returns (bool[] memory obtainedList) {
    require(
      targets_.length == tokenIds_.length,
      "targets and tokenIds length mismatch"
    );
    obtainedList = new bool[](tokenIds_.length);
    for (uint256 i; i < tokenIds_.length; i++) {
      obtainedList[i] = checkObtained(targets_[i], tokenIds_[i]);
    }
    return obtainedList;
  }

  // --------------------------------------------------------------------------------
  // Internal
  // --------------------------------------------------------------------------------

  /// @dev トークンの送受信前に呼ばれる
  /// @param operator 操作者
  /// @param from 送信元
  /// @param to 受信先
  /// @param ids トークンIDリスト
  /// @param amounts トークン量リスト
  /// @param data データ
  function _beforeTokenTransfer(
    address operator,
    address from,
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
  ) internal override(ERC1155Upgradeable, ERC1155SupplyUpgradeable) {
    require(
      from == address(0) || to == address(0),
      "Cannot transfer to others"
    );
    super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
  }

  /// @dev アップグレードの許可
  /// @param newImplementation 新しい実装アドレス
  function _authorizeUpgrade(
    address newImplementation
  ) internal override onlyOwner {}
}
