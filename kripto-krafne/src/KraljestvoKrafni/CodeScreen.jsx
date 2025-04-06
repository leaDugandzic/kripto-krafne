import React from "react";
import "./CodeScreen.css";

const CodeScreen = ({ revealed, code = "krafna{5ug4r_5pr1nkl3}" }) => {
  return (
    <div className="code-screen">
      <div className="screen-pixels">
        {revealed && (
          <div className="code-display animate-flicker" style={{ fontSize: '1.1rem' }}>
            {code}
          </div>
        )}
      </div>
      <div className="led led-red"></div>
    </div>
  );
};

export default CodeScreen;