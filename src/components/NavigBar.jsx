import React, { useState } from "react";

function NavigBar(props) {
    const [gearIsClicked, setGearIsClicked] = useState(false);
    const [toggled, setToggled] = useState(false);
    const [clickedWarning, setClickedWarning] = useState(false);

    function handleClick() {
        setGearIsClicked(oldGear => {
            return !oldGear
        })
    }

    function toggling() {
        setToggled(oldToggled => {
            return !oldToggled
        })
    }

    const [dimensions, setDimensions] = React.useState({
        height: window.innerHeight,
        width: window.innerWidth
    })

    React.useEffect(() => {
        function handleResize() {
            setDimensions({
                height: window.innerHeight,
                width: window.innerWidth
            })
        }

        var timeout = false;
        window.addEventListener('resize', function () {
            clearTimeout(timeout);;
            timeout = setTimeout(handleResize, 200);
        });
    })

    function handleClickWarning() {
        setClickedWarning(true);

    }

    return (
        <div>
            {
                dimensions.width < 500 ?
                    <nav className="navbar navbar-expand navbar-light bg-light navigbar">
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <a className="navbar-brand" href="/dashboard"><img className="logo-navbar" src={require('../images/icons/logo-navbar.webp')} alt="logo" /></a>
                        <a className="navbar-brand" href="/dashboard"><h1 className="ProgrArmor">ProgrArmor</h1></a>
                        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                            <img className={toggled ? "toggler-icon scaled" : "toggler-icon not-scaled"} onClick={toggling} src={require('../images/icons/output-onlinepngtools.webp')} alt="logo" />

                            <div>
                                <div className={toggled ? "toggle-is-clicked extended" : "toggle-is-clicked not-extended"}
                                    style={toggled ? null : { border: "0" }} ></div>

                                <table className={toggled ? "param-choice-toggle visible" : "param-choice-toggle not-visible"} >
                                    <tbody>
                                        <tr>
                                            <td>
                                                <a className="nav-link" href="/dashboard"><img className="icon-navbar" src={require('../images/icons/home.webp')} alt='home' /></a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <a className="nav-link" href="/session"><img className="icon-navbar" src={require('../images/icons/write.webp')} alt='session' /></a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <a className="nav-link" href="/stats"><img className="icon-navbar" src={require('../images/icons/chart.webp')} alt='stats' /></a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <a className="nav-link" href="/programme"><img className="icon-navbar" src={require('../images/icons/plus.webp')} alt='programme' /></a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <a className="nav-link" href="/social"><img className="icon-navbar" src={require('../images/icons/social.webp')} alt='social' /></a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <a className="nav-link" href="/accomplissements"><img className="icon-navbar" src={require('../images/icons/accomplissements.webp')} alt='accomplissements' /></a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <a className="nav-link" href="/notifications"><img className="icon-navbar" src={require('../images/icons/notifications.webp')} alt='notifications' /></a>
                                            </td>
                                        </tr>
                                        <div className="div-navigbar-text">
                                            <tr>
                                                <td>
                                                    <a className="param-choice" href="/compte"> Compte </a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <a className="param-choice" href="/aide"> Aide </a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <a className="param-choice" href="/a_propos"> A propos </a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <a className="param-choice" href="/CGU"> CGU </a>
                                                </td>
                                            </tr>
                                        </div>
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </nav>
                    :
                    <div>
                        <nav className="navbar navbar-expand navbar-light bg-light navigbar">
                            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <a className="navbar-brand" href="/dashboard"><img className="logo-navbar" src={require('../images/icons/logo-navbar.webp')} alt="logo" /></a>
                            <a className="navbar-brand" href="/dashboard"><h1 className="ProgrArmor">ProgrArmor</h1></a>
                            <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                                <ul className="navbar-nav mr-auto mt-2 mt-lg-0 navbar-elements">
                                    <li className="nav-item active">
                                        <a className="nav-link" href="/dashboard"><img className="icon-navbar" src={require('../images/icons/home.webp')} alt='home' /></a>
                                    </li>
                                    <li className="nav-item active">
                                        <a className="nav-link" href="/session"><img className="icon-navbar" src={require('../images/icons/write.webp')} alt='session' /></a>
                                    </li>
                                    <li className="nav-item active">
                                        <a className="nav-link" href="/stats"><img className="icon-navbar" src={require('../images/icons/chart.webp')} alt='stats' /></a>
                                    </li>
                                    <li className="nav-item active">
                                        <a className="nav-link" href="/programme"><img className="icon-navbar" src={require('../images/icons/plus.webp')} alt='programme' /></a>
                                    </li>
                                    <li className="nav-item active">
                                        <a className="nav-link" href="/social"><img className="icon-navbar" src={require('../images/icons/social.webp')} alt='social' /></a>
                                    </li>
                                    <li className="nav-item active">
                                        <a className="nav-link" href="/accomplissements"><img style={{ width: "19px" }} className="icon-navbar" src={require('../images/icons/accomplissements.webp')} alt='accomplissements' /></a>
                                    </li>
                                    <li className="nav-item active">
                                        <a className="nav-link" href="/notifications"><img style={{ width: "19px" }} className="icon-navbar" src={require('../images/icons/notifications.webp')} alt='notifications' /></a>
                                    </li>
                                    <li className="nav-item active">
                                        <a onClick={handleClick} className="nav-link">
                                            <img className={gearIsClicked ? "icon-navbar rotated" : "icon-navbar not-rotated"} src={require('../images/icons/gear.webp')} alt='parametres' />
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </nav>


                        <div>
                            <div className={gearIsClicked ? "gear-is-clicked extended" : "gear-is-clicked not-extended"}>

                                <table className="param-choice-div" >
                                    <tbody>
                                        <tr>
                                            <td>
                                                <a className="param-choice" href="/compte"> Compte </a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <a className="param-choice" href="/aide"> Aide </a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <a className="param-choice" href="/a_propos"> A propos </a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <a className="param-choice" href="/CGU"> CGU </a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
            }
            {
                props.show === true ?
                    clickedWarning ?
                        null
                        :
                        <div className="warning-border">
                            <div className="text">
                                <p className="La-croix" onClick={handleClickWarning}> <strong>  X </strong> </p>
                                <p className="attention" > <strong> Attention ! </strong>  </p>
                                <p> Ce site est encore en version pré-alpha, cela signifie : </p>
                                <p> - que ProgrArmor se garde tout droit concernant votre accès à ce site, </p>
                                <p> - que ProgrArmor se garde tout droit concernant vos données,
                                    et que celles-ci pourraient être supprimées pour des raisons de développement ou pour tout autre raison, </p>
                                <p> - que le site peut comporter de nombreux bugs et manquer de fonctionnalités, </p>
                                <br />
                                <p> Vous êtes donc conviez à indiquer toute suggestion et tout bug avec un maximum {"d'information "}
                                    en message direct sur {"l'un de nos réseaux ou par tout autre moyen"}</p>
                            </div>
                        </div>
                    : null
            }
        </div >
    )
}

export default NavigBar;