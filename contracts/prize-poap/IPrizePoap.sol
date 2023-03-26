// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {IERC1155Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC1155/IERC1155Upgradeable.sol";

/// @title IPrizePoap
/// @author keit (@keitEngineer)
/// @notice This is an interface of PrizePoap.
interface IPrizePoap is IERC1155Upgradeable {
  // --------------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------------

  struct Prize {
    string tokenURI;
    uint32 communityId;
    uint32 requiredExp;
    uint32 requiredQuestId;
    bool questRequired;
    bool closed;
  }

  // --------------------------------------------------------------------------------
  // Event
  // --------------------------------------------------------------------------------

  event Created(
    address indexed publisher,
    uint32 indexed prizeId,
    string tokenURI,
    uint32 indexed communityId,
    uint32 requiredExp,
    uint32 requiredQuestId,
    bool questRequired,
    bool closed
  );

  // --------------------------------------------------------------------------------
  // Initialize
  // --------------------------------------------------------------------------------

  /// @dev 初期化
  /// @param communityPortal_ コミュニティポータルアドレス
  /// @param questBoard_ クエストボードアドレス
  /// @param baseURI_ ベースURI
  function initialize(
    address communityPortal_,
    address questBoard_,
    string memory baseURI_
  ) external;

  // --------------------------------------------------------------------------------
  // Getter
  // --------------------------------------------------------------------------------

  /// @dev プライズ情報を取得
  /// @param tokenId_ プライズトークンID
  /// @return prize プライズ情報
  function getPrize(
    uint256 tokenId_
  ) external view returns (IPrizePoap.Prize memory prize);

  /// @dev プライズリストを取得
  /// @param page_ ページ番号
  /// @param pageSize_ 1ページあたりのサイズ
  /// @return list プライズリスト
  /// @return length リスト長さ
  function getPrizeList(
    uint256 page_,
    uint256 pageSize_
  ) external view returns (IPrizePoap.Prize[] memory list, uint256 length);

  /// @dev プライズリスト長さを取得
  /// @return length プライズリスト長さ
  function getPrizeListLength() external view returns (uint256 length);

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  /// @dev コミュニティポータルアドレスを設定
  /// @param newState_ コミュニティポータルアドレス
  function setCommunityPortal(address newState_) external;

  /// @dev クエストボードアドレスを設定
  /// @param newState_ クエストボードアドレス
  function setQuestBoard(address newState_) external;

  /// @dev ベースURIを設定
  /// @param newState_ ベースURI
  function setBaseURI(string memory newState_) external;

  /// @dev プライズ情報を設定
  /// @param newState_ プライズ情報
  function setPrize(
    uint256 tokenId,
    IPrizePoap.Prize memory newState_
  ) external;

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
  ) external;

  /// @dev プライズをミント
  /// @param tokenId_ トークンID
  function mint(uint256 tokenId_) external;

  /// @dev プライズをミント
  /// @param tokenId_ トークンID
  /// @param to_ 送信先
  function mintOnlyQuestBoard(uint256 tokenId_, address to_) external;

  /// @dev プライズをバーン
  /// @param tokenId_ トークンID
  function burn(uint256 tokenId_) external;

  /// @dev プライズを獲得可能か判定
  /// @param target_ 対象アドレス
  /// @param tokenId_ トークンID
  /// @return 獲得可能か
  function checkObtainable(
    address target_,
    uint256 tokenId_
  ) external view returns (bool);

  /// @dev プライズを獲得可能か一括判定
  /// @param targets_ 対象アドレスリスト
  /// @param tokenIds_ トークンIDリスト
  /// @return obtainableList 獲得可能かリスト
  function checkBatchObtainable(
    address[] memory targets_,
    uint256[] memory tokenIds_
  ) external view returns (bool[] memory obtainableList);

  /// @dev プライズを獲得済みか判定
  /// @param target_ 対象アドレス
  /// @param tokenId_ トークンID
  /// @return obtained 獲得済みか
  function checkObtained(
    address target_,
    uint256 tokenId_
  ) external view returns (bool obtained);

  /// @dev プライズを獲得済みか一括判定
  /// @param targets_ 対象アドレスリスト
  /// @param tokenIds_ トークンIDリスト
  /// @return obtainedList 獲得済みかリスト
  function checkBatchObtained(
    address[] memory targets_,
    uint256[] memory tokenIds_
  ) external view returns (bool[] memory obtainedList);
}
