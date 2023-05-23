import { mudConfig } from "@latticexyz/world/register";

export default mudConfig({
  tables: {
    Counter: {
      keySchema: {},
      schema: "uint32",
    },
    Canvas: {
      KeySchema: {
        x: "uint32",
        y: "uint32"
      },
      schema: "string"
    }
  },
});
