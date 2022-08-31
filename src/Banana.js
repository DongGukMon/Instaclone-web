import React, { useState, useMemo } from "react";

const FirstContainer = React.memo(({ children, color }) => {
  console.log("First container is rendered");
  return (
    <div
      style={{
        backgroundColor: color ? "green" : "orange",
        width: 500,
        height: 500,
      }}
    >
      {children}
    </div>
  );
});

const SecondContainer = React.memo(({ children }) => {
  console.log("Second container is rendered");
  return (
    <div
      style={{
        backgroundColor: "blue",
        width: 300,
        height: 300,
      }}
    >
      {children}
    </div>
  );
});

const ThirdContainer = React.memo(() => {
  console.log("Third container is rendered");

  return (
    <div
      style={{
        backgroundColor: "yellow",
        width: 100,
        height: 100,
      }}
    ></div>
  );
});

const Banana = () => {
  const [color, setColor] = useState(false);
  console.log("Home is rendered");
  return (
    <div>
      <FirstContainer color={color} setColor={setColor}>
        <SecondContainer>
          <ThirdContainer />
        </SecondContainer>
      </FirstContainer>
      <button onClick={() => setColor(!color)}>Button</button>
    </div>
  );
};

export default React.memo(Banana);
