import { useRows } from "@latticexyz/react";
import { useMUD } from "./MUDContext";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

export const App = () => {
  const {
    components: { Counter },
    systemCalls: { paint },
    network: { storeCache },
  } = useMUD();

  const [paintedCanvas, setPaintedCanvas] = useState();
  const [color, setColor] = useState("red");

  const colorMapping = {
    "red": 1,
    "blue": 2,
  };

  const reverseColorMapping = {
    0: "white",
    1: "red",
    2: "blue",
  };

  const paintCanvas = async (x, y) => {
    try {
      paint(x, y, colorMapping[color]);
    } catch (e) {
      console.log("paint failed", e);
    }
  };

  const rows = 10;
  const cols = 10;

  const canvas = useRows(storeCache, { table: "Canvas" });

  console.log("canvas", canvas);

  useEffect(() => {
    if (!canvas) return;

    const newPaintedCanvas = [];
    const abiCoder = new ethers.utils.AbiCoder();

    for (let x = 0; x < rows; x++) {
      newPaintedCanvas[x] = [];
      for (let y = 0; y < cols; y++) {
        const encodedKey = abiCoder.encode(["uint32", "uint32"], [x, y]);
        const key = ethers.utils.keccak256(encodedKey);
        newPaintedCanvas[x][y] = canvas.find(el => el.key.key === key)?.value?.value || 0;
      }
    }

    console.log("newPaintedCanvas", newPaintedCanvas);
    setPaintedCanvas(newPaintedCanvas);
  }, [canvas]);

  return (
    <>
      <table style={{ border: "1px solid black" }}>
        <tbody>
          {[...Array(rows)].map((e, i) => (
            <tr key={i}>
              {[...Array(cols)].map((e, j) => (
                <td
                  key={j}
                  style={{ border: "1px solid black", minWidth: 20, height: 20, backgroundColor: paintedCanvas && reverseColorMapping[paintedCanvas[i][j]] }}
                  onClick={() => {
                    paintCanvas(i, j);
                  }}
                ></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ backgroundColor: color }}>Current Color</p>
      <button
        style={{ backgroundColor: "red" }}
        type="button"
        onClick={() => {
          setColor("red");
        }}
      >
        Select
      </button>
      <button
        style={{ backgroundColor: "blue" }}
        type="button"
        onClick={() => {
          setColor("blue");
        }}
      >
        Select
      </button>
    </>
  );
};
