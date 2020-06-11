import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

const StyledTooltipContainer = styled.div`
  box-shadow: ${(props) => props.theme.panelBoxShadow};
  align-items: stretch;
  background-color: ${(props) => props.theme.sidePanelBg};
  color: ${(props) => props.theme.textColor};
  border-radius: 5px;
  position: absolute;
  z-index: 1000;
  pointer-events: none;
  padding: 10px;
`;

const MapTooltip = ({ tooltipInfo }) => {
  const {
    objectType,
    hoveredObject,
    pointerX,
    pointerY,
    coordinate,
  } = tooltipInfo;

  const [size, setSize] = useState({
    width: 200,
    height: 250,
  });

  const tooltipComponent = useRef();

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: tooltipComponent.current.scrollWidth,
        height: tooltipComponent.current.scrollHeight,
      });
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [tooltipComponent]);

  const _getPosition = (x, y) => {
    const topOffset = 5;
    const leftOffset = 5;
    const windowW = window.innerWidth;
    const windowH = window.innerHeight;
    const { width, height } = size;
    console.log({ width, height });
    const pos = {};
    if (x + leftOffset + width > windowW) {
      pos.right = windowW - x + leftOffset;
    } else {
      pos.left = x + leftOffset;
    }

    if (y + topOffset + height > windowH) {
      pos.bottom = 10;
    } else {
      pos.top = y + topOffset;
    }
    return pos;
  };

  return (
    <StyledTooltipContainer
      ref={tooltipComponent}
      style={{
        ..._getPosition(pointerX, pointerY),
      }}
    >
      {objectType === "vessel" && (
        <div>
          <div>
            <b>MMSI</b>: {hoveredObject.mmsi}
          </div>
          <div>
            <b>Ship Name</b>: {hoveredObject.shipname}
          </div>
          <div>
            <b>Ship Type</b>: {hoveredObject.shiptype}
          </div>
          <div>
            <b>Speed</b>: {hoveredObject.speed}
          </div>
          <div>
            <b>Course</b>: {hoveredObject.course}
          </div>
          <div>
            <b>Heading</b>: {hoveredObject.heading}
          </div>
          <div>
            <b>Collision Risk</b>:{" "}
            {Math.round((hoveredObject.risk + Number.EPSILON) * 100) / 100}
          </div>
          <div>
            <b>Longitude</b>:{" "}
            {Math.round((coordinate[0] + Number.EPSILON) * 100) / 100}
          </div>
          <div>
            <b>Latitude</b>:{" "}
            {Math.round((coordinate[1] + Number.EPSILON) * 100) / 100}
          </div>
        </div>
      )}

      {(objectType === "anchorage" || objectType === "mooring") && (
        <div>
          <div>
            <b>Seamark Type</b>: {hoveredObject["seamark_type"]}
          </div>
          <div>
            <b>Name</b>: {hoveredObject.name}
          </div>
        </div>
      )}
    </StyledTooltipContainer>
  );
};

export default MapTooltip;
