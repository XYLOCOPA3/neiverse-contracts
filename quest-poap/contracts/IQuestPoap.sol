// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IQuestPoap is IERC721 {
    function getTokenURIFromAddress(
        address fan
    ) external view returns (string memory);

    function hashMsgSender(address addr) external pure returns (uint256);

    function safeMint(address to) external;

    function burn(address to) external;

    function contractURI() external view returns (string memory);
}
