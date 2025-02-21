import { React } from "react";
import NavigBar from "../components/NavigBar.jsx"
import { COLORS } from "../utils/constants.js";
import AppFooter from "../components/AppFooter.jsx";

function Travaux() {

  return (
    <div style={{ backgroundColor: COLORS.PAGE_BACKGROUND }}>
      <div className="page-container">
        <NavigBar location="travaux" />




        {/* PAGE CONTENT */}
        <div className="content-wrap">

          <div className="Travaux-div popInElement">
            <h1>Oups !</h1>
            <p>
              <img className="travaux-icon" src={require('../images/icons/icons8-man-construction-worker-48.webp')} alt="miguel" />
              <br />
              Miguel fait encore chauffer la betonnière pour cette page !
              <br />
              Reviens plus tard...
              <br />
              <img className="travaux-icon" src={require('../images/icons/icons8-brick-48.webp')} alt="brique" />
            </p>
          </div>



        </div>


        <AppFooter />
      </div>
    </div>
  );
};

export default Travaux;