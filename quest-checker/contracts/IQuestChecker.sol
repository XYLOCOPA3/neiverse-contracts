// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IQuestChecker {
  function checkCompleted(address from) external view returns (bool);
}
