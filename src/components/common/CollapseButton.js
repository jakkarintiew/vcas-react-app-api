import styled from "styled-components";

const CollapseButton = styled.div`
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  justify-content: center;
  background-color: ${(props) => props.theme.sideBarCloseBtnBgd};
  border-radius: 1px;
  color: ${(props) => props.theme.sideBarCloseBtnColor};
  display: flex;
  height: 20px;
  position: absolute;
  right: -8px;
  top: ${(props) => props.theme.sidePanel.margin.top}px;
  width: 20px;
  :hover {
    cursor: pointer;
    box-shadow: none;
    background-color: ${(props) => props.theme.sideBarCloseBtnBgdHover};
  }
`;

// const CollapseButton = ({ panelName, initialDegree }) => {
//   // Redux states
//   const dispatch = useDispatch();
//   const panelOpen = useSelector((state) => state.panelOpen);
//   const togglePanelOpen = (panelName) => {
//     dispatch(togglePanelOpenActionCreator(panelName));
//   };

//   const panel =
//     panelOpen[
//       Object.keys(panelOpen).find(
//         (key) => panelOpen[key].panelName === panelName
//       )
//     ];

//   return (
//     <div>
//       <StyledCollapseButton
//         className="side-bar__close"
//         onClick={togglePanelOpen(panelName)}
//       >
//         <ArrowRight
//           height="12px"
//           style={{
//             transform: `rotate(${
//               panel.isOpen ? initialDegree + 180 : initialDegree
//             }deg)`,
//           }}
//         />
//       </StyledCollapseButton>
//     </div>
//   );
// };

export default CollapseButton;
