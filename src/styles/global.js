import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
font-family: ${(props) => props.theme.fontFamily};
font-weight: ${(props) => props.theme.fontWeight};
font-size: ${(props) => props.theme.fontSize};
line-height: ${(props) => props.theme.lineHeight};
*,
*:before,
*:after {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
ul {
  margin: 0;
  padding: 0;
}
li {
  margin: 0;
}
a {
  text-decoration: none;
  color: ${(props) => props.theme.labelColor};
}
`;
