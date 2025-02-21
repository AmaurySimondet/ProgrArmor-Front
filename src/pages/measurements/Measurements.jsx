import { React } from "react";
import NavigBar from "../../components/NavigBar.jsx"
import { COLORS } from "../../utils/constants.js";
import AppFooter from "../../components/AppFooter.jsx";

function Selector() {

    return (
        <div style={{ backgroundColor: COLORS.PAGE_BACKGROUND }}>
            <div className="page-container">
                <NavigBar location="Selector" />




                {/* PAGE CONTENT */}
                <div className="content-wrap">

                    <div className="popInElement">
                        <h1>Oups !</h1>
                    </div>



                </div>


                <AppFooter />
            </div>
        </div>
    );
};

export default Selector;