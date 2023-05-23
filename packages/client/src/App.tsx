import { useRows } from "@latticexyz/react";
import { useMUD } from "./MUDContext";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

export const App = () => {
  const {
    systemCalls: { paint },
    network: { storeCache },
  } = useMUD();

  const [paintedCanvas, setPaintedCanvas] = useState();
  const [color, setColor] = useState("#ff0000");

  const reverseColorMapping = {
    0: "white",
    1: "red",
    2: "blue",
  };

  const paintCanvas = async (x: number, y: number) => {
    try {
      paint(x, y, color);
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
                  style={{ cursor: "pointer", border: "1px solid black", minWidth: 20, height: 20, backgroundColor: paintedCanvas && paintedCanvas[j][i] }}
                  onClick={() => {
                    paintCanvas(j, i);
                  }}
                ></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ marginBottom: 4 }}><strong>Select paint color:</strong></p>
      <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
    </>
  );
};
