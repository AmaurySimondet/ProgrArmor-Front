import Footer from "../Footer";
import NavigBar from "../NavigBar";
import { React, useState, useEffect } from "react"
import InstallApp from "./Help/InstallApp";
import API from "../../utils/API";
import ConversionBerger from "./Help/ConversionBerger";

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
        <div>
            <NavigBar location="aide" />

            <div className="basic-div" style={{ minHeight: "85vh" }}>
                <h1 className="large-margin-updown"> Aide </h1>

                <h2
                    className="large-margin-bottom"
                    onClick={handleClickInstallApp}
                    id="InstallApp">

                    Installer l'application ProgrArmor

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

            <Footer />
        </div>

    )
}

export default Aide;