import React, { useState, useRef } from "react";
import EnglishInput from "./components/EnglishInput";
import ERCanvas from "./components/ERCanvas";
import Examples from "./components/Examples";
import { parseERWithGemini } from "./utils/parser";
import { exportToSvg, exportToPng } from "./utils/exporter";

export default function App() {
  const [diagram, setDiagram] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [textValue, setTextValue] = useState("");
  
  const svgRef = useRef(null);

  async function handleInput(text) {
    setLoading(true);
    setError("");
    try {
      const data = await parseERWithGemini(text);
      setDiagram(data);
    } catch (e) {
      setError(e.toString());
      setDiagram(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 1200, margin: "auto", fontFamily: "Segoe UI, Arial", padding: '20px' }}>
      <h2>Natural Language to ER Diagram</h2>
      <EnglishInput 
        value={textValue}
        onChange={setTextValue}
        onSubmit={handleInput} 
        loading={loading} 
      />
      <Examples onSelect={setTextValue} disabled={loading} />
      {error && <div style={{ color: "red", marginTop: '10px' }}>{error}</div>}
      
      <div style={{ margin: "20px 0" }}>
        <ERCanvas er={diagram} svgRef={svgRef} />
      </div>

      {diagram && (
        <div>
          <button onClick={() => exportToSvg(svgRef, 'er-diagram')} style={{marginRight: '10px'}}>Export as SVG</button>
          <button onClick={() => exportToPng(svgRef, 'er-diagram')}>Export as PNG</button>
        </div>
      )}
    </div>
  );
}

