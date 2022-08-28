import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

// export const containerStyle = css`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   flex-direction: column;
// `;

export const lightTheme = {
  accent: "#0095f6",
  borderColor: "rgb(219,219,219)",
  maxWidth: "930px",
};

export const darkTheme = {
  fontColor: "white",
  bgColor: "#2c2c2c",
  maxWidth: "930px",
};

export const GlobalStyles = createGlobalStyle`
      ${reset}
      input {
        all:unset;
      }
      * {
        box-sizing:border-box;
      }
      body {
          background-color: ${(props) => props.theme.bgColor};
          background-color: #FAFAFA;
          font-size:14px;
          font-family:'Open Sans', sans-serif;
      }
      a {
        text-decoration: none;
      }
  `;
