// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {ERC5192} from "erc5192/src/ERC5192.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {IQuestPoap} from "./IQuestPoap.sol";

contract QuestPoap is ERC5192, Ownable, IQuestPoap {
    uint256 public totalSupply;
    string private _svg;

    constructor(
        string memory _name
    ) ERC5192(string.concat(_name, " POAP"), "QPOAP", true) {
        _svg = string.concat(
            "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>",
            _name,
            " POAP</text></svg>"
        );
    }

    function getTokenURIFromAddress(
        address fan
    ) external view returns (string memory) {
        return tokenURI(hashMsgSender(fan));
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        _requireMinted(tokenId);
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
        return finalTokenUri;
    }

    function hashMsgSender(address addr) public pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(addr)));
    }

    function safeMint(address to) external {
        if (owner() != msg.sender) to = msg.sender;
        totalSupply++;
        _safeMint(to, hashMsgSender(to));
    }

    function burn(address to) external {
        if (owner() != msg.sender) to = msg.sender;
        totalSupply--;
        _burn(hashMsgSender(to));
    }

    function contractURI() external view returns (string memory) {
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
                        '", "external_link": "https://fanbase-front.vercel.app"}'
                    )
                )
            )
        );
        string memory finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );
        return finalTokenUri;
    }
}
