import React, { useRef, useEffect } from "react";
import { Runtime, Inspector } from "@observablehq/runtime";
import notebook from "@modster/candlestick-chart";

function CandlestickChart() {
  const chartRef = useRef();

  useEffect(() => {
    const runtime = new Runtime();
    runtime.module(notebook, (name) => {
      if (name === "chart") return new Inspector(chartRef.current);
    });
    return () => runtime.dispose();
  }, []);

  return (
    <>
      <div ref={chartRef} />
      <p>
        Credit:{" "}
        <a href="https://observablehq.com/@modster/candlestick-chart">
          Candlestick Chart by MichaelGreeff
        </a>
      </p>
    </>
  );
}

export default CandlestickChart;
