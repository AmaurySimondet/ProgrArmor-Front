import Footer from "../../components/Footer";
import NavigBar from "../../components/NavigBar";
import { React, useState, useEffect } from "react"
import InstallApp from "./InstallApp";
import API from "../../utils/API";
import ConversionBerger from "./ConversionBerger";
import { COLORS } from "../../utils/colors";

function Aide() {
    const [clickInstallApp, setClickInstallApp] = useState(false);
    const [clickBerger, setClickBerger] = useState(false);
    const [user, setUser] = useState();

    async function getUser() {
        const { data } = await API.getUser({ id: localStorage.getItem("id") });
        if (data.success === false) {
            alert(data.message);
        } else {
            console.log(data.profile);
            if (data.profile.modeSombre && data.profile.modeSombre === true) {
                // 👇 add class to body element
                document.body.classList.add('darkMode');
            }
            setUser(data.profile);
        };
    }

    function handleClickInstallApp() {
        setClickInstallApp(!clickInstallApp)
    }

    function handleClickBerger() {
        setClickBerger(!clickBerger)
    }

    useEffect(() => {
        getUser();
    }, [])

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
                            <InstallApp modeSombre={user ? user.modeSombre === true ? true : false : false} />
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
                            <ConversionBerger modeSombre={user ? user.modeSombre === true ? true : false : false} />
                        </div>
                    </div>

                </div>



                <Footer />
            </div>
        </div>
    )
}

export default Aide;