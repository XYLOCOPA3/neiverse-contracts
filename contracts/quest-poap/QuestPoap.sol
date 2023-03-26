// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {ERC5192} from "erc5192/src/ERC5192.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";

import {IQuestPoap} from "./IQuestPoap.sol";

/// @title QuestPoap
/// @author keit (@keitEngineer)
/// @notice This is a contract to create QuestPoap.
contract QuestPoap is ERC5192, Ownable, IQuestPoap {
  // --------------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------------

  uint256 public totalSupply;

  string private _svg;

  string public externalLink;

  // --------------------------------------------------------------------------------
  // Initialize
  // --------------------------------------------------------------------------------

  /// @dev コンストラクタ
  /// @param name_ POAPの名前
  /// @param externalLink_ POAPの外部リンク
  constructor(
    string memory name_,
    string memory externalLink_
  ) ERC5192(string.concat(name_, " POAP"), "QPOAP", true) {
    _svg = string.concat(
      "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>",
      name_,
      " POAP</text></svg>"
    );
    externalLink = externalLink_;
  }

  // --------------------------------------------------------------------------------
  // Getter
  // --------------------------------------------------------------------------------

  /// @dev POAPのURIをアドレスから取得
  /// @param addr_ POAPを取得したアドレス
  /// @return uri POAPのURI
  function getTokenURIFromAddress(
    address addr_
  ) external view returns (string memory uri) {
    uri = tokenURI(hashMsgSender(addr_));
  }

  /// @dev POAPのURIを取得
  /// @param tokenId_ POAPのトークンID
  /// @return uri POAPのURI
  function tokenURI(
    uint256 tokenId_
  ) public view override returns (string memory uri) {
    _requireMinted(tokenId_);
    string memory json = Base64.encode(
      bytes(
        string(
          abi.encodePacked(
            '{"name": "',
            name(),
            '", "description": "This is ',
            name(),
            '.", "image": "data:image/svg+xml;base64,',
            Base64.encode(bytes(_svg)),
            '"}'
          )
        )
      )
    );
    string memory finalTokenUri = string(
      abi.encodePacked("data:application/json;base64,", json)
    );
    uri = finalTokenUri;
  }

  /// @dev コントラクトURIを取得
  /// @return uri コントラクトのURI
  function contractURI() external view returns (string memory uri) {
    string memory json = Base64.encode(
      bytes(
        string(
          abi.encodePacked(
            '{"name": "',
            name(),
            '", "description": "This is ',
            name(),
            '.", "image": "data:image/svg+xml;base64,',
            Base64.encode(bytes(_svg)),
            '", "external_link": "',
            externalLink,
            '"}'
          )
        )
      )
    );
    string memory finalTokenUri = string(
      abi.encodePacked("data:application/json;base64,", json)
    );
    uri = finalTokenUri;
  }

  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------

  /// @dev アドレスからトークンIDを取得
  /// @param addr_ アドレス
  /// @return value トークンID
  function hashMsgSender(address addr_) public pure returns (uint256 value) {
    return uint256(keccak256(abi.encodePacked(addr_)));
  }

  /// @dev ミント
  /// @param to_ ミント先アドレス
  function safeMint(address to_) external {
    if (owner() != msg.sender) to_ = msg.sender;
    totalSupply++;
    _safeMint(to_, hashMsgSender(to_));
  }

  /// @dev バーン
  /// @param to_ バーン先アドレス
  function burn(address to_) external {
    if (owner() != msg.sender) to_ = msg.sender;
    totalSupply--;
    _burn(hashMsgSender(to_));
  }
}
