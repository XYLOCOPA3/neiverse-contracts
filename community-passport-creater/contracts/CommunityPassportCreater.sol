// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {ICommunityPassportCreater} from "./ICommunityPassportCreater.sol";
import {CommunityPassport} from "./CommunityPassport/CommunityPassport.sol";

contract CommunityPassportCreater is ICommunityPassportCreater {
  function createCommunityPassport(
    string memory _name,
    string memory _communityURI,
    string memory _contructURI,
    uint32 communityId
  ) external returns (address) {
    string memory name = string.concat(_name, " Passport");
    string memory symbol = string.concat(_name, " SBT");
    CommunityPassport passport = new CommunityPassport(
      name,
      symbol,
      _communityURI,
      _contructURI,
      communityId
    );
    passport.transferOwnership(msg.sender);
    return address(passport);
  }
}
