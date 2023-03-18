// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface ICommunityPassportCreater {
  function createCommunityPassport(
    string memory _name,
    string memory _communityURI,
    string memory _contructURI,
    uint32 communityId
  ) external returns (address);
}
