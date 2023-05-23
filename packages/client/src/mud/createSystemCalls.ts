import { getComponentValue } from "@latticexyz/recs";
import { awaitStreamValue } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";
import { ethers } from "ethers";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { worldSend, txReduced$, singletonEntity }: SetupNetworkResult,
  { Counter }: ClientComponents
) {
  const increment = async () => {
    const tx = await worldSend("increment", []);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(Counter, singletonEntity);
  };

  const abiCoder = new ethers.utils.AbiCoder();

  const paint = async (x: number, y: number, color: number) => {
    // const encodedKey = abiCoder.encode(["uint32", "uint32"], [x, y]);
    // const key = ethers.utils.keccak256(encodedKey);
    await worldSend("paint", [x, y, color]);
  };

  return {
    increment,
    paint,
  };
}
