// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {IERC1155Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC1155/IERC1155Upgradeable.sol";

/// @title IQuestBoard
/// @author keit (@keitEngineer)
/// @notice This is an interface of QuestBoard.
interface IQuestBoard is IERC1155Upgradeable {
  // --------------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------------

  struct Quest {
    string title;
    string questURI;
    address questCheckerAddress;
    uint32 communityId;
    uint32 obtainableExp;
    uint32 obtainablePrizeId;
    bool prizeObtainable;
    bool closed;
  }

  // --------------------------------------------------------------------------------
  // Event
  // --------------------------------------------------------------------------------

  event Create(
    uint32 questId,
    string title,
    string questURI,
    address questCheckerAddress,
    uint32 indexed communityId,
    uint32 obtainableExp,
    uint32 obtainablePrizeId,
    bool prizeObtainable,
    address indexed target
  );
  event Claim(uint32 indexed questId, address indexed fan);
  event Burn(uint32 indexed questId, address indexed fan);

  // --------------------------------------------------------------------------------
  // Initialize
  // --------------------------------------------------------------------------------

  /// @dev 初期化
  /// @param communityPortal_ コミュニティポータルアドレス
  /// @param questCheckerCreater_ クエストチェッカークリエーターアドレス
  /// @param prizePoap_ プライズポープアドレス
  function initialize(
    address communityPortal_,
    address questCheckerCreater_,
    address prizePoap_
  ) external;

  // --------------------------------------------------------------------------------
  // Getter
  // --------------------------------------------------------------------------------

  /// @dev クエストを取得する
  /// @param questId_ クエストID
  /// @return quest クエスト情報
  function getQuest(
    uint256 questId_
  ) external view returns (IQuestBoard.Quest memory quest);

  /// @dev クエストリストを取得する
  /// @param page_ ページ番号
  /// @param pageSize_ 1ページあたりのサイズ
  /// @return list クエストリスト
  function getQuestList(
    uint256 page_,
    uint256 pageSize_
  ) external view returns (IQuestBoard.Quest[] memory list);

  /// @dev クエスト総数の取得
  /// @return totalSupply クエスト総数
  function questSupply() external view returns (uint256 totalSupply);

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  /// @dev クエストを設定
  /// @param questId_ クエストID
  /// @param newState_ クエスト
  function setQuest(
    uint256 questId_,
    IQuestBoard.Quest memory newState_
  ) external;

  /// @dev コミュニティポータルの設定
  /// @param newState_ コミュニティポータル
  function setCommunityPortal(address newState_) external;

  /// @dev クエストチェッカークリエーターの設定
  /// @param newState_ クエストチェッカークリエーター
  function setQuestCheckerCreater(address newState_) external;

  /// @dev プライズポープの設定
  /// @param newState_ プライズポープ
  function setPrizePoap(address newState_) external;

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
  ) external;

  /// @dev クエスト達成報告
  /// @param questId_ クエストID
  function claim(uint32 questId_) external;

  /// @dev バーン
  /// @param questId_ クエストID
  function burn(uint32 questId_) external;

  /// @dev クエスト達成済みか一括確認
  /// @param questIds_ クエストIDリスト
  /// @param userList_ ユーザリスト
  /// @return completedList 達成済みかどうかのリスト
  function checkBatchCompleted(
    uint256[] memory questIds_,
    address[] memory userList_
  ) external view returns (bool[] memory completedList);
}
