// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {ERC1155Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import {ERC1155SupplyUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155SupplyUpgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import {IQuestBoard} from "./IQuestBoard.sol";
import {IQuestChecker} from "../quest-checker/IQuestChecker.sol";
import {ICommunityPortal} from "../community-portal/ICommunityPortal.sol";
import {IQuestCheckerCreater} from "../quest-checker-creater/IQuestCheckerCreater.sol";
import {IPrizePoap} from "../prize-poap/IPrizePoap.sol";

/// @title QuestBoard
/// @author keit (@keitEngineer)
/// @notice This is a contract for managing quests.
contract QuestBoard is
  Initializable,
  IQuestBoard,
  ERC1155Upgradeable,
  ERC1155SupplyUpgradeable,
  OwnableUpgradeable,
  UUPSUpgradeable
{
  // --------------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------------

  ICommunityPortal public communityPortal;

  IQuestCheckerCreater public questCheckerCreater;

  IPrizePoap public prizePoap;

  IQuestBoard.Quest[] private _questBoard;

  mapping(address => mapping(uint256 => bool)) public obtained;

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
  /// @param questCheckerCreater_ クエストチェッカークリエーターアドレス
  /// @param prizePoap_ プライズポープアドレス
  function initialize(
    address communityPortal_,
    address questCheckerCreater_,
    address prizePoap_
  ) public initializer {
    __ERC1155_init("");
    __ERC1155Supply_init();
    __Ownable_init();
    __UUPSUpgradeable_init();
    communityPortal = ICommunityPortal(communityPortal_);
    questCheckerCreater = IQuestCheckerCreater(questCheckerCreater_);
    prizePoap = IPrizePoap(prizePoap_);
  }

  // --------------------------------------------------------------------------------
  // Getter
  // --------------------------------------------------------------------------------

  /// @dev クエストを取得する
  /// @param questId_ クエストID
  /// @return quest クエスト情報
  function getQuest(
    uint256 questId_
  ) external view returns (IQuestBoard.Quest memory quest) {
    quest.title = _questBoard[questId_].title;
    quest.questURI = _questBoard[questId_].questURI;
    quest.questCheckerAddress = _questBoard[questId_].questCheckerAddress;
    quest.communityId = _questBoard[questId_].communityId;
    quest.obtainableExp = _questBoard[questId_].obtainableExp;
    quest.obtainablePrizeId = _questBoard[questId_].obtainablePrizeId;
    quest.prizeObtainable = _questBoard[questId_].prizeObtainable;
    quest.closed = _questBoard[questId_].closed;
  }

  /// @dev クエストリストを取得する
  /// @param page_ ページ番号
  /// @param pageSize_ 1ページあたりのサイズ
  /// @return list クエストリスト
  /// @return length リスト長さ
  function getQuestList(
    uint256 page_,
    uint256 pageSize_
  ) external view returns (IQuestBoard.Quest[] memory list, uint256 length) {
    require(pageSize_ > 0, "page size must be positive");
    length = _questBoard.length;
    uint256 actualSize = pageSize_;
    if ((page_ + 1) * pageSize_ > length) {
      actualSize = length;
    }
    list = new Quest[](actualSize);
    for (uint256 i = 0; i < actualSize; i++) {
      list[i] = _questBoard[page_ * pageSize_ + i];
    }
  }

  /// @dev クエストURIの取得
  /// @param questId_ クエストID
  /// @return tokenURI クエストURI
  function uri(
    uint256 questId_
  ) public view override returns (string memory tokenURI) {
    tokenURI = _questBoard[questId_].questURI;
  }

  /// @dev クエスト総数の取得
  /// @return totalSupply クエスト総数
  function questSupply() external view returns (uint256 totalSupply) {
    totalSupply = _questBoard.length;
  }

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  /// @dev クエストを設定
  /// @param questId_ クエストID
  /// @param newState_ クエスト
  function setQuest(
    uint256 questId_,
    IQuestBoard.Quest memory newState_
  ) external onlyOwner {
    _questBoard[questId_] = newState_;
  }

  /// @dev コミュニティポータルの設定
  /// @param newState_ コミュニティポータル
  function setCommunityPortal(address newState_) external onlyOwner {
    communityPortal = ICommunityPortal(newState_);
  }

  /// @dev クエストチェッカークリエーターの設定
  /// @param newState_ クエストチェッカークリエーター
  function setQuestCheckerCreater(address newState_) external onlyOwner {
    questCheckerCreater = IQuestCheckerCreater(newState_);
  }

  /// @dev プライズポープの設定
  /// @param newState_ プライズポープ
  function setPrizePoap(address newState_) external onlyOwner {
    prizePoap = IPrizePoap(newState_);
  }

  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------

  /// @dev クエストの作成
  /// @param title_ タイトル
  /// @param questURI_ クエストURI
  /// @param communityId_ コミュニティID
  /// @param obtainableExp_ 獲得可能経験値
  /// @param obtainablePrizeId_ 獲得可能プライズID
  /// @param prizeObtainable_ プライズ獲得可能フラグ
  /// @param interfaceId_ インターフェースID
  /// @param target_ ターゲットアドレス
  function createQuest(
    string memory title_,
    string memory questURI_,
    uint32 communityId_,
    uint32 obtainableExp_,
    uint32 obtainablePrizeId_,
    bool prizeObtainable_,
    bytes4 interfaceId_,
    address target_
  ) external onlyOwner {
    require(obtainableExp_ > 0, "Not enough obtainableExp");
    ICommunityPortal.Community memory community = communityPortal.getCommunity(
      communityId_
    );
    require(!community.closed, "This community is not opend");
    IQuestBoard.Quest memory quest;
    quest.title = title_;
    quest.questURI = questURI_;
    address questCheckerAddress = questCheckerCreater.createQuestChecker(
      interfaceId_,
      target_
    );
    quest.questCheckerAddress = questCheckerAddress;
    quest.communityId = communityId_;
    quest.obtainableExp = obtainableExp_;
    quest.obtainablePrizeId = obtainablePrizeId_;
    quest.prizeObtainable = prizeObtainable_;
    _questBoard.push(quest);
    emit Create(
      uint32(_questBoard.length - 1),
      quest.title,
      quest.questURI,
      quest.questCheckerAddress,
      quest.communityId,
      quest.obtainableExp,
      quest.obtainablePrizeId,
      quest.prizeObtainable,
      target_
    );
  }

  /// @dev クエスト達成報告
  /// @param questId_ クエストID
  function claim(uint32 questId_) external {
    require(balanceOf(msg.sender, questId_) == 0, "You have already minted");
    IQuestChecker questChecker = IQuestChecker(
      _questBoard[questId_].questCheckerAddress
    );
    require(
      questChecker.checkCompleted(msg.sender),
      "You have not completed this quest yet."
    );
    _mint(msg.sender, questId_, 1, "0x00");
    if (!obtained[msg.sender][questId_]) {
      obtained[msg.sender][questId_] = true;
      communityPortal.addExp(
        _questBoard[questId_].communityId,
        msg.sender,
        _questBoard[questId_].obtainableExp
      );
      if (_questBoard[questId_].prizeObtainable) {
        prizePoap.mintOnlyQuestBoard(
          _questBoard[questId_].obtainablePrizeId,
          msg.sender
        );
      }
    }
    emit Claim(questId_, msg.sender);
  }

  /// @dev バーン
  /// @param questId_ クエストID
  function burn(uint32 questId_) external {
    _burn(msg.sender, questId_, 1);
    emit Burn(questId_, msg.sender);
  }

  /// @dev クエスト達成済みか一括確認
  /// @param questIds_ クエストIDリスト
  /// @param userList_ ユーザリスト
  /// @return completedList 達成済みかどうかのリスト
  function checkBatchCompleted(
    uint256[] memory questIds_,
    address[] memory userList_
  ) external view returns (bool[] memory completedList) {
    require(
      questIds_.length == userList_.length,
      "questIds and fanList length mismatch"
    );
    completedList = new bool[](questIds_.length);
    for (uint256 i; i < questIds_.length; i++) {
      IQuestChecker questChecker = IQuestChecker(
        _questBoard[questIds_[i]].questCheckerAddress
      );
      completedList[i] = questChecker.checkCompleted(userList_[i]);
    }
  }

  // --------------------------------------------------------------------------------
  // Internal
  // --------------------------------------------------------------------------------

  /// @dev トークンの送受信前に呼ばれる
  /// @param operator 操作者
  /// @param from 送信元
  /// @param to 受信先
  /// @param ids クエストIDリスト
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
