// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {CommunityPassport} from "../CommunityPassport.sol";

/// @title CommunityPassportV2
/// @author keit (@keitEngineer)
/// @notice This is dummy for upgrade test.
contract CommunityPassportV2 is CommunityPassport {
  /// @dev dummy
  /// @return hello dummy
  function sayHello() external pure returns (string memory hello) {
    hello = "Hello, World!";
  }
}
