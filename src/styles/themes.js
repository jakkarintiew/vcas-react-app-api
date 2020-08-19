import { css } from "styled-components";

export const transition = "all .4s ease";
export const transitionFast = "all .2s ease";
export const transitionSlow = "all .8s ease";

export const boxShadow = "0 1px 2px 0 rgba(0,0,0,0.10)";
export const boxSizing = "border-box";
export const borderRadius = "1px";
export const borderColor = "#3A414C";
export const borderColorLT = "#F1F1F1";

// TEXT
export const fontFamily = `ff-clan-web-pro, 'Helvetica Neue', Helvetica, sans-serif`;
export const fontWeight = 400;
export const fontSize = "0.875em";
export const lineHeight = 1.71429;
export const labelColor = "#424242";
export const labelHoverColor = "#C6C6C6";
export const labelColorLT = "#EEEEEE";

export const labelTextColor = "#f7f7f7";
export const labelTextColorLT = "#3A414C";

export const textColor = "#A0A7B4";
export const textColorLT = "#3A414C";
export const titleColorLT = "#29323C";

export const subtextColor = "#6A7485";
export const subtextColorLT = "#A0A7B4";
export const subtextColorActive = "#FFFFFF";

export const titleTextColor = "#FFFFFF";
export const textColorHl = "#F0F0F0";
export const textColorHlLT = "#000000";
export const activeColor = "#0288D1";
export const activeColorLT = "#2473BD";
export const activeColorHover = "#108188";
export const errorColor = "#F9042C";
export const logoColor = activeColor;

// Button
export const primaryBtnBgd = "#0F9668";
export const primaryBtnActBgd = "#13B17B";
export const primaryBtnColor = "#FFFFFF";
export const primaryBtnActColor = "#FFFFFF";
export const primaryBtnBgdHover = "#13B17B";
export const primaryBtnRadius = "2px";

export const secondaryBtnBgd = "#6A7485";
export const secondaryBtnActBgd = "#A0A7B4";
export const secondaryBtnColor = "#FFFFFF";
export const secondaryBtnActColor = "#FFFFFF";
export const secondaryBtnBgdHover = "#A0A7B4";

export const linkBtnBgd = "transparent";
export const linkBtnActBgd = linkBtnBgd;
export const linkBtnColor = "#A0A7B4";
export const linkBtnActColor = "#F1F1F1";
export const linkBtnActBgdHover = linkBtnBgd;

export const negativeBtnBgd = errorColor;
export const negativeBtnActBgd = "#FF193E";
export const negativeBtnBgdHover = "#FF193E";
export const negativeBtnColor = "#FFFFFF";
export const negativeBtnActColor = "#FFFFFF";

export const floatingBtnBgd = "#29323C";
export const floatingBtnActBgd = "#3A4552";
export const floatingBtnBgdHover = "#3A4552";
export const floatingBtnColor = subtextColor;
export const floatingBtnActColor = subtextColorActive;

// Input
export const inputBoxHeight = "34px";
export const inputBoxHeightSmall = "24px";
export const inputBoxHeightTiny = "18px";
export const inputPadding = "4px 10px";
export const inputPaddingSmall = "4px 6px";
export const inputPaddingTiny = "2px 4px";
export const inputFontSize = "11px";
export const inputFontSizeSmall = "10px";
export const inputFontWeight = 500;
export const inputBgd = "#29323C";
export const inputBgdHover = "#3A414C";
export const inputBgdActive = "#3A414C";
export const inputBorderColor = "#29323C";
export const inputBorderHoverColor = "#3A414C";
export const inputBorderActiveColor = "#D3D8E0";
export const inputColor = "#A0A7B4";
export const inputBorderRadius = "1px";
export const inputPlaceholderColor = "#6A7485";
export const inputPlaceholderFontWeight = 400;

export const secondaryInputBgd = "#242730";
export const secondaryInputBgdHover = "#3A414C";
export const secondaryInputBgdActive = "#3A414C";
export const secondaryInputColor = "#A0A7B4";
export const secondaryInputBorderColor = "#242730";
export const secondaryInputBorderActiveColor = "#D3D8E0";

const input = css`
  align-items: center;
  background-color: ${(props) => props.theme.inputBgd};
  border: 1px solid
    ${(props) =>
      props.active
        ? props.theme.inputBorderActiveColor
        : props.error
        ? props.theme.errorColor
        : props.theme.inputBgd};
  border-radius: 2px;
  caret-color: ${(props) => props.theme.inputBorderActiveColor};
  color: ${(props) => props.theme.inputColor};
  display: flex;
  font-size: ${(props) =>
    ["small", "tiny"].includes(props.size)
      ? props.theme.inputFontSizeSmall
      : props.theme.inputFontSize};
  font-weight: ${(props) => props.theme.inputFontWeight};
  height: ${(props) =>
    props.size === "small"
      ? props.theme.inputBoxHeightSmall
      : props.size === "tiny"
      ? props.theme.inputBoxHeightTiny
      : props.theme.inputBoxHeight};
  justify-content: space-between;
  outline: none;
  overflow: hidden;
  padding: ${(props) =>
    props.size === "small"
      ? props.theme.inputPaddingSmall
      : props.size === "tiny"
      ? props.theme.inputPaddingTiny
      : props.theme.inputPadding};
  text-overflow: ellipsis;
  transition: ${(props) => props.theme.transition};
  white-space: nowrap;
  width: 100%;
  word-wrap: normal;
  pointer-events: ${(props) => (props.disabled ? "none" : "all")};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  :hover {
    cursor: ${(props) => (props.type === "number" ? "text" : "pointer")};
    background-color: ${(props) =>
      props.active ? props.theme.inputBgdActive : props.theme.inputBgdHover};
    border-color: ${(props) =>
      props.active
        ? props.theme.inputBorderActiveColor
        : props.theme.inputBorderHoverColor};
  }
  :active,
  :focus,
  &.focus,
  &.active {
    background-color: ${(props) => props.theme.inputBgdActive};
    border-color: ${(props) => props.theme.inputBorderActiveColor};
  }
  ::placeholder {
    color: ${(props) => props.theme.inputPlaceholderColor};
    font-weight: ${(props) => props.theme.inputPlaceholderFontWeight};
  }
  /* Disable Arrows on Number Inputs */
  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const inputLT = css`
  ${input}
  background-color: ${(props) => props.theme.selectBackgroundLT};
  border: 1px solid
  ${(props) =>
    props.active
      ? props.theme.selectActiveBorderColor
      : props.error
      ? props.theme.errorColor
      : props.theme.selectBorderColorLT};
  color: ${(props) => props.theme.selectColorLT};
  caret-color: ${(props) => props.theme.selectColorLT};
  ::-webkit-input-placeholder {
    color: ${(props) => props.theme.subtextColorLT};
    font-weight: 400;
  }
  :active,
  :focus,
  &.focus,
  &.active {
    background-color: ${(props) => props.theme.selectBackgroundLT};
    border-color: ${(props) => props.theme.textColorLT};
  }
  :hover {
    background-color: ${(props) => props.theme.selectBackgroundLT};
    cursor: ${(props) =>
      ["number", "text"].includes(props.type) ? "text" : "pointer"};
    border-color: ${(props) =>
      props.active ? props.theme.textColorLT : props.theme.subtextColor};
  }
`;

// Select
export const selectColor = inputColor;
export const selectColorLT = titleColorLT;

export const selectActiveBorderColor = "#D3D8E0";
export const selectFontSize = "11px";
export const selectFontWeight = "400";
export const selectFontWeightBold = "500";

export const selectColorPlaceHolder = "#6A7485";
export const selectBackground = inputBgd;
export const selectBackgroundHover = inputBgdHover;
export const selectBackgroundLT = "#FFFFFF";
export const selectBackgroundHoverLT = "#F8F8F9";
export const selectBorderColor = "#D3D8E0";
export const selectBorderColorLT = "#D3D8E0";
export const selectBorderRadius = "1px";
export const selectBorder = 0;

export const dropdownListHighlightBg = "#6A7485";
export const dropdownListHighlightBgLT = "#F8F8F9";
export const dropdownListShadow = "0 6px 12px 0 rgba(0,0,0,0.16)";
export const dropdownListBgd = "#3A414C";
export const dropdownListBgdLT = "#FFFFFF";
export const dropdownListBorderTop = "#242730";
export const dropdownWrapperZ = 100;

// Checkbox
export const checkboxWidth = 16;
export const checkboxHeight = 16;
export const checkboxMargin = 12;
export const checkboxBorderColor = selectBorderColor;
export const checkboxBorderRadius = "2px";
export const checkboxBorderColorLT = selectBorderColorLT;
export const checkboxBoxBgd = "white";
export const checkboxBoxBgdChecked = primaryBtnBgd;

// Side Panel
export const sidePanelHeaderBg = "#303030";
export const sidePanelInnerPadding = 10;
export const sidePanelBg = "#212121";
export const sidePanelScrollBarWidth = 10;
export const sidePanelScrollBarHeight = 10;
export const sideBarCloseBtnBgd = secondaryBtnBgd;
export const sideBarCloseBtnColor = "#303030";
export const sideBarCloseBtnBgdHover = secondaryBtnActBgd;

export const panelBackground = "#212121";
export const panelBackgroundHover = "#3A4552";
export const panelActiveBg = "#3A4552";
export const panelActiveBgLT = "#6A7485";
export const panelHeaderIcon = "#6A7485";
export const panelHeaderIconActive = "#A0A7B4";
export const panelHeaderHeight = 48;
export const panelBoxShadow = "0 3px 6px 0 rgba(0,0,0,0.10)";
export const panelBorderRadius = "2px";
export const panelBackgroundLT = "#F8F8F9";

export const panelBorderColor = "#3A414C";
export const panelBorder = `1px solid ${borderColor}`;
export const panelBorderLT = `1px solid ${borderColorLT}`;

export const mapPanelBackgroundColor = "#242730";
export const mapPanelHeaderBackgroundColor = "#29323C";
export const tooltipBg = "#F8F8F9";
export const tooltipColor = "#333334";

export const textTruncate = {
  maxWidth: "100%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  wordWrap: "normal",
};

export const DIMENSIONS = {
  sidePanel: {
    width: 300,
    margin: { top: 20, left: 20, bottom: 30, right: 20 },
    headerHeight: 96,
  },
  mapControl: {
    width: 204,
    padding: 12,
  },
};

// MapBox Styles
export const mapStyle = "mapbox://styles/mapbox/dark-v10";
export const mapStyleLT = "mapbox://styles/mapbox/light-v10";

export const darkTheme = {
  ...DIMENSIONS,
  // Transitions
  transition,
  transitionFast,
  transitionSlow,

  // styles
  activeColor,
  activeColorHover,
  borderRadius,
  boxShadow,
  errorColor,
  dropdownListHighlightBg,
  dropdownListHighlightBgLT,
  dropdownListBgd,
  dropdownListBgdLT,
  dropdownListBorderTop,

  labelColor,
  labelHoverColor,
  mapPanelBackgroundColor,
  mapPanelHeaderBackgroundColor,

  // Select
  selectActiveBorderColor,
  selectBackground,
  selectBackgroundLT,
  selectBackgroundHover,
  selectBackgroundHoverLT,
  selectBorder,
  selectBorderColor,
  selectBorderRadius,
  selectBorderColorLT,
  selectColor,
  selectColorPlaceHolder,
  selectFontSize,
  selectFontWeight,
  selectColorLT,
  selectFontWeightBold,

  // Input
  inputBgd,
  inputBgdHover,
  inputBgdActive,
  inputBoxHeight,
  inputBoxHeightSmall,
  inputBoxHeightTiny,
  inputBorderColor,
  inputBorderActiveColor,
  inputBorderHoverColor,
  inputBorderRadius,
  inputColor,
  inputPadding,
  inputPaddingSmall,
  inputPaddingTiny,
  inputFontSize,
  inputFontSizeSmall,
  inputFontWeight,
  inputPlaceholderColor,
  inputPlaceholderFontWeight,

  secondaryInputBgd,
  secondaryInputBgdHover,
  secondaryInputBgdActive,
  secondaryInputColor,
  secondaryInputBorderColor,
  secondaryInputBorderActiveColor,

  // Checkbox
  checkboxWidth,
  checkboxHeight,
  checkboxMargin,
  checkboxBorderColor,
  checkboxBorderRadius,
  checkboxBorderColorLT,
  checkboxBoxBgd,
  checkboxBoxBgdChecked,

  // Button
  primaryBtnBgd,
  primaryBtnActBgd,
  primaryBtnColor,
  primaryBtnActColor,
  primaryBtnBgdHover,
  primaryBtnRadius,
  secondaryBtnBgd,
  secondaryBtnActBgd,
  secondaryBtnBgdHover,
  secondaryBtnColor,
  secondaryBtnActColor,

  negativeBtnBgd,
  negativeBtnActBgd,
  negativeBtnBgdHover,
  negativeBtnColor,
  negativeBtnActColor,

  linkBtnBgd,
  linkBtnActBgd,
  linkBtnColor,
  linkBtnActColor,
  linkBtnActBgdHover,

  floatingBtnBgd,
  floatingBtnActBgd,
  floatingBtnBgdHover,
  floatingBtnColor,
  floatingBtnActColor,

  // Side Panel
  sidePanelBg,
  sidePanelInnerPadding,
  sideBarCloseBtnBgd,
  sideBarCloseBtnColor,
  sideBarCloseBtnBgdHover,
  sidePanelHeaderBg,
  sidePanelScrollBarWidth,
  sidePanelScrollBarHeight,

  // Side Panel Panel
  panelActiveBg,
  panelBackground,
  panelBackgroundHover,
  panelBackgroundLT,
  panelBoxShadow,
  panelBorderRadius,
  panelBorder,
  panelBorderColor,
  panelBorderLT,
  panelHeaderIcon,
  panelHeaderIconActive,
  panelHeaderHeight,
  // panelDropdownScrollBar,

  // Text
  fontFamily,
  fontWeight,
  fontSize,
  lineHeight,
  textColor,
  textColorLT,
  textColorHl,
  titleTextColor,
  subtextColor,
  subtextColorLT,
  subtextColorActive,
  textTruncate,
  titleColorLT,
  tooltipBg,
  tooltipColor,
  logoColor,
  labelTextColor,

  // Map
  mapStyle: mapStyle,
};

export const lightTheme = {
  ...darkTheme,
  // template
  activeColor: activeColorLT,
  input: inputLT,
  textColor: textColorLT,
  sidePanelBg: "#FFFFFF",
  selectColor: selectColorLT,
  titleTextColor: "#000000",
  sidePanelHeaderBg: "#f2f2f2",
  subtextColorActive: activeColorLT,
  tooltipBg: "#1869B5",
  tooltipColor: "#FFFFFF",
  dropdownListBgd: "#FFFFFF",
  textColorHl: activeColorLT,
  labelColor: labelColorLT,

  inputBgd: "#F7F7F7",
  inputBgdHover: "#FFFFFF",
  inputBgdActive: "#FFFFFF",

  dropdownListHighlightBg: "#F0F0F0",

  panelBackground: "#F7F7F7",
  panelBackgroundHover: "#F7F7F7",
  panelBorderColor: "#D3D8E0",

  sideBarCloseBtnBgd: "#F7F7F7",
  sideBarCloseBtnColor: textColorLT,
  sideBarCloseBtnBgdHover: "#F7F7F7",

  secondaryInputBgd: "#F7F7F7",
  secondaryInputBgdActive: "#F7F7F7",
  secondaryInputBgdHover: "#FFFFFF",
  secondaryInputBorderActiveColor: "#000000",
  secondaryInputBorderColor: "none",
  secondaryInputColor: "#545454",

  panelActiveBg: "#F7F7F7",
  mapPanelBackgroundColor: "#FFFFFF",
  mapPanelHeaderBackgroundColor: "#F7F7F7",

  sliderBarColor: "#A0A7B4",
  sliderBarBgd: "#D3D8E0",
  sliderHandleColor: "#F7F7F7",
  sliderHandleHoverColor: "#F7F7F7",

  subtextColor: subtextColorLT,
  switchBtnBgd: "#F7F7F7",
  secondarySwitchBtnBgd: "#F7F7F7",
  secondarySwitchTrackBgd: "#D3D8E0",
  switchBtnBgdActive: "#F7F7F7",
  switchTrackBgd: "#D3D8E0",
  switchTrackBgdActive: activeColorLT,

  // button switch background and hover color
  primaryBtnBgd: primaryBtnActBgd,
  primaryBtnActBgd: primaryBtnBgd,
  primaryBtnBgdHover: primaryBtnBgd,

  secondaryBtnBgd: secondaryBtnActBgd,
  secondaryBtnActBgd: secondaryBtnBgd,
  secondaryBtnBgdHover: secondaryBtnBgd,

  floatingBtnBgd: "#F7F7F7",
  floatingBtnActBgd: "#F7F7F7",
  floatingBtnBgdHover: "#F7F7F7",
  floatingBtnColor: subtextColor,
  floatingBtnActColor: activeColorLT,

  linkBtnActColor: textColorLT,

  rangeBrushBgd: "#D3D8E0",
  histogramFillInRange: activeColorLT,
  histogramFillOutRange: "#A0A7B4",

  labelTextColor: labelTextColorLT,

  // Map
  mapStyle: mapStyleLT,
};

export const mutedLightTheme = {
  ...darkTheme,
  activeColor: "#E2E2E2",
  dropdownListBgd: "#FFFFFF",
  dropdownListBorderTop: "none",
  dropdownListHighlightBg: "#F6F6F6",
  inputBgd: "#E2E2E2",
  inputBgdActive: "#E2E2E2",
  inputBgdHover: "inherit",
  inputBorderActiveColor: "#000000",
  inputColor: "#000000",
  panelActiveBg: "#E2E2E2",
  panelBackground: "#FFFFFF",
  panelBackgroundHover: "#EEEEEE",
  panelBorderColor: "#E2E2E2",
  primaryBtnBgd: "#E2E2E2",
  primaryBtnBgdHover: "#333333",
  primaryBtnColor: "#000000",
  secondaryBtnActBgd: "#EEEEEE",
  secondaryBtnActColor: "#000000",
  secondaryBtnBgd: "#E2E2E2",
  secondaryBtnBgdHover: "#CBCBCB",

  sideBarCloseBtnBgd: "#E2E2E2",
  sideBarCloseBtnColor: "#000000",
  sideBarCloseBtnBgdHover: "#FFFFFF",

  floatingBtnBgd: "#FFFFFF",
  floatingBtnActBgd: "#EEEEEE",
  floatingBtnBgdHover: "#EEEEEE",
  floatingBtnColor: "#757575",
  floatingBtnActColor: "#000000",

  secondaryBtnColor: "#000000",
  secondaryInputBgd: "#F6F6F6",
  secondaryInputBgdActive: "#F6F6F6",
  secondaryInputBgdHover: "#F6F6F6",
  secondaryInputBorderActiveColor: "#000000",
  secondaryInputBorderColor: "none",
  secondaryInputColor: "#545454",
  sidePanelBg: "#F6F6F6",
  sidePanelHeaderBg: "#FFFFFF",
  subtextColor: "#AFAFAF",
  subtextColorActive: "#000000",
  textColor: "#000000",
  textColorHl: "#545454",
  mapPanelBackgroundColor: "#F6F6F6",
  mapPanelHeaderBackgroundColor: "#FFFFFF",
  titleTextColor: "#000000",
  switchBtnBgdActive: "#000000",
  switchBtnBgd: "#FFFFFF",
  switchTrackBgdActive: "#E2E2E2",
  secondarySwitchTrackBgd: "#E2E2E2",
  switchTrackBgd: "#E2E2E2",
  secondarySwitchBtnBgd: "#FFFFFF",
  histogramFillInRange: "#000000",
  histogramFillOutRange: "#E2E2E2",
  rangeBrushBgd: "#E2E2E2",
  sliderBarBgd: "#E2E2E2",
  sliderHandleColor: "#FFFFFF",
  sliderBarColor: "#000000",
};
