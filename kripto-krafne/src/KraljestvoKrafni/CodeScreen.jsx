import React from "react";
import "./CodeScreen.css";

const CodeScreen = ({ revealed, code = "krafna" }) => {
  return (
    <div className="code-screen">
      <div className="screen-pixels">
        {revealed && (
          <div className="code-display animate-flicker" style={{ fontSize: '3rem' }}>
            {code}
          </div>
        )}
      </div>
      <div className="led led-red"></div>
    </div>
  );
};

export default CodeScreen;