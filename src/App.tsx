import { open } from "@tauri-apps/plugin-dialog";
import { readFile } from "@tauri-apps/plugin-fs";
import { useState } from "react";
import "./App.css";
import { TextWriter, Uint8ArrayReader, ZipReader } from "@zip.js/zip.js";

function App() {
  const [data, setData] = useState<Record<any, any> | null>(null);

  // async function greet() {
  //   // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  //   setGreetMsg(await invoke("greet", { name }));
  // }

  async function handleOpen() {
    const result = await open({
      multiple: false,
      directory: false,
      filters: [
        {
          name: ".netcanvas",
          extensions: ["netcanvas", "zip"],
        },
        {
          name: "All Files",
          extensions: ["*"],
        },
      ],
    });
    console.log(result);
    if (result) {
      const fileContent = await readFile(result.path);
      console.log(fileContent);

      const zipFileReader = new Uint8ArrayReader(fileContent);
      const zipReader = new ZipReader(zipFileReader);

      const entries = await zipReader.getEntries();

      const protocol = entries.find(
        (entry) => entry.filename === "protocol.json"
      );

      if (!protocol) {
        console.error("Protocol file not found");
        return;
      }

      const protocolData = await protocol.getData!(new TextWriter());

      setData(JSON.parse(protocolData));

      console.log(JSON.parse(protocolData));
    }
  }

  return (
    <div className="container">
      <button onClick={handleOpen}>Choose protocol file</button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default App;
