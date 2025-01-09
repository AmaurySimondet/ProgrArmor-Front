import Footer from "../../components/Footer";
import NavigBar from "../../components/NavigBar";
import { React, useState } from "react"
import InstallApp from "./InstallApp";
import ConversionBerger from "./ConversionBerger";
import { COLORS } from "../../utils/constants";

function Aide() {
    const [clickInstallApp, setClickInstallApp] = useState(false);
    const [clickBerger, setClickBerger] = useState(false);

    function handleClickInstallApp() {
        setClickInstallApp(!clickInstallApp)
    }

    function handleClickBerger() {
        setClickBerger(!clickBerger)
    }

    return (
        <div style={{ backgroundColor: COLORS.PAGE_BACKGROUND }}>
            <div className="page-container">
                <NavigBar location="aide" />


                {/* PAGE CONTENT */}
                <div className="content-wrap">
                    <div className="basic-div popInElement" style={{ minHeight: "85vh" }}>
                        <h1 className="large-margin-updown"> Aide </h1>

                        <h2
                            className="large-margin-bottom"
                            onClick={handleClickInstallApp}
                            id="InstallApp">

                            Installer l'application ProgArmor

                            <img className={clickInstallApp ? "expert-toggle rotated" : "expert-toggle not-rotated"}
                                src={require('../../images/icons/icons8-expand-arrow-90.webp')} />
                        </h2>

                        <div className={clickInstallApp ? "extended-huge" : "not-extended"}>
                            <InstallApp />
                        </div>

                        <h2
                            className="large-margin-bottom"
                            onClick={handleClickBerger}
                            id="Berger">

                            Converion des tables de Berger (%1RM)
                            <img className={clickBerger ? "expert-toggle rotated" : "expert-toggle not-rotated"}
                                src={require('../../images/icons/icons8-expand-arrow-90.webp')} />
                        </h2>

                        <div className={clickBerger ? "extended" : " not-extended"}>
                            <ConversionBerger />
                        </div>
                    </div>

                </div>



                <Footer />
            </div>
        </div>
    )
}

export default Aide;