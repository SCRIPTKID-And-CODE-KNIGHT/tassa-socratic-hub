import React from "react";

const HackedPage = () => (
  <div style={{
    background: "#181818",
    color: "#ff3333",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "monospace"
  }}>
    <h1 style={{ fontSize: "5rem" }}>403 FORBIDDEN</h1>
    <p style={{ fontSize: "2rem" }}>
      Site not accessible at the moment.
    </p>
  </div>
);

const App = () => <HackedPage />;

export default App;
