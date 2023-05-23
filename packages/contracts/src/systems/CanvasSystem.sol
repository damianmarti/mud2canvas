// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Canvas } from "../codegen/Tables.sol";

contract CanvasSystem is System {
  function paint(uint32 x, uint32 y, uint32 color) public returns (uint32) {
    Canvas.set(keccak256(abi.encode(x, y)), color);
    return color;
  }
}