// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Canvas } from "../codegen/Tables.sol";

contract CanvasSystem is System {
  function paint(uint32 x, uint32 y, string memory color) public returns (string memory) {
    Canvas.set(keccak256(abi.encode(x, y)), color);
    bytes memory colorBytes = bytes(color);
    string memory colorUp = Canvas.get(keccak256(abi.encode(x, y + 1)));
    bytes memory colorUpBytes = bytes(colorUp);
    if (colorUpBytes.length > 0) {
      colorUpBytes[1] = colorBytes[1];
      colorUpBytes[2] = colorBytes[2];
      Canvas.set(keccak256(abi.encode(x, y + 1)), string(colorUpBytes));
    }
    string memory colorDown = Canvas.get(keccak256(abi.encode(x, y - 1)));
    bytes memory colorDownBytes = bytes(colorDown);
    if (colorDownBytes.length > 0) {
      colorDownBytes[1] = colorBytes[1];
      colorDownBytes[2] = colorBytes[2];
      Canvas.set(keccak256(abi.encode(x, y - 1)), string(colorDownBytes));
    }
    string memory colorRight = Canvas.get(keccak256(abi.encode(x + 1, y)));
    bytes memory colorRightBytes = bytes(colorRight);
    if (colorRightBytes.length > 0) {
      colorRightBytes[3] = colorBytes[3];
      colorRightBytes[4] = colorBytes[4];
      Canvas.set(keccak256(abi.encode(x + 1, y)), string(colorRightBytes));
    }
    string memory colorLeft = Canvas.get(keccak256(abi.encode(x - 1, y)));
    bytes memory colorLeftBytes = bytes(colorLeft);
    if (colorLeftBytes.length > 0) {
      colorLeftBytes[5] = colorBytes[5];
      colorLeftBytes[6] = colorBytes[6];
      Canvas.set(keccak256(abi.encode(x - 1, y)), string(colorLeftBytes));
    }
    return color;
  }
}
