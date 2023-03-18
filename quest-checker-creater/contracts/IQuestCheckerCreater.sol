// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IQuestCheckerCreater {
  error InvalidInterfaceId();

  function createQuestChecker(
    bytes4 interfaceId,
    address target
  ) external returns (address);
}
