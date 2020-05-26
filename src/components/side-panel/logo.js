import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const LogoTitle = styled.div`
  display: inline-block;
  margin-left: 6px;
`;

const LogoName = styled.div`
  .logo__link {
    color: black;
    font-size: 32px;
    font-weight: 250;
    letter-spacing: 2px;
    text-decoration: none;
  }
`;
const LogoVersion = styled.div`
  font-size: 10px;
  color: grey;
  letter-spacing: 0.83px;
  line-height: 14px;
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: flex-start;
`;

// const LogoSvgWrapper = styled.div`
//   margin-top: 3px;
// `;

// const LogoSvg = () => (
//   <svg className="side-panel-logo__logo" width="22px" height="15px" viewBox="0 0 22 15">
//     <g transform="translate(11, -3) rotate(45.000000)">
//       <rect fill="#535C6C" x="0" y="5" width="10" height="10" />
//       <rect fill="#1FBAD6" x="5" y="0" width="10" height="10" />
//     </g>
//   </svg>
// );

const VCASLogo = ({ appName, appWebsite, version }) => (
  <LogoWrapper className="side-panel-logo">
    {/* <LogoSvgWrapper>
      <MapIcon style={{fill: "white", verticalAlign: 'middle'}} />
    </LogoSvgWrapper> */}
    <LogoTitle className="logo__title">
      <LogoName className="logo__name">
        <a
          className="logo__link"
          target="_blank"
          rel="noopener noreferrer"
          href={appWebsite}
        >
          {appName}
        </a>
      </LogoName>
      {version ? (
        <LogoVersion className="logo__version">{version}</LogoVersion>
      ) : null}
    </LogoTitle>
  </LogoWrapper>
);

VCASLogo.propTypes = {
  appName: PropTypes.string,
  version: PropTypes.string,
  appWebsite: PropTypes.string,
};

VCASLogo.defaultProps = {
  appName: "VCAS",
  version: "0.0.1",
  appWebsite: "https://www.eng.nus.edu.sg/c4ngp/",
};

export default VCASLogo;
