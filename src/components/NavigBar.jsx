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
            <nav className="navbar navbar-expand navbar-light bg-light navigbar">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <a className="navbar-brand" href="/dashboard"><img className="logo-navbar" src={require('../images/icons/logo-navbar.webp')} alt="logo" /></a>
                <a className="navbar-brand" href="/dashboard">
                    <h1 className="ProgrArmor">ProgrArmor
                        <sub style={{ fontSize: "0.5em" }}>alpha</sub>
                    </h1>
                </a>

                <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                    <img className={toggled ? "toggler-icon scaled" : "toggler-icon not-scaled"} onClick={toggling} src={require('../images/icons/output-onlinepngtools.webp')} alt="logo" />

                    <div>
                        <div className={toggled ? "toggle-is-clicked extended" : "toggle-is-clicked not-extended"}
                            style={toggled ? null : { border: "0" }} ></div>

                        <div className={toggled ? "param-choice-toggle visible" : "param-choice-toggle not-visible"} >

                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                                <input class="form-control mr-2" type="search" placeholder="Maître Yoyo" aria-label="Search" />
                                <button class="btn btn-black" type="submit">Go</button>
                            </div>
                            <hr style={{ borderColor: "black" }} />
                            <a className="nav-link" href="/dashboard"><img className="icon-navbar" src={require('../images/icons/home.webp')} alt='home' /> Dashboard</a>
                            <a className="nav-link" href="/notifications"><img className="icon-navbar" src={require('../images/icons/notifications.webp')} alt='notifications' /> Notifications</a>
                            <a className="nav-link" href="/session"><img className="icon-navbar" src={require('../images/icons/write.webp')} alt='session' /> Nouvelle séance</a>
                            <a className="nav-link" href="/programme"><img className="icon-navbar" src={require('../images/icons/plus.webp')} alt='programme' /> Programmes</a>
                            <hr style={{ borderColor: "black" }} />
                            <a className="nav-link" href="/compte"> <img className="icon-navbar" src={require('../images/profilepic.webp')} alt='compte' style={{ borderRadius: "50%", border: "1px solid black" }} />Compte </a>
                            <a className="nav-link" href="/aide"> <img className="icon-navbar" src={require('../images/icons/icons8-question-mark-96.webp')} alt='compte' style={{ filter: "invert(1)" }} /> Aide </a>
                            <hr style={{ borderColor: "black" }} />
                            <a className="nav-link" href="/a_propos"> A propos </a>
                            <a className="nav-link" href="/CGU"> CGU </a>
                        </div>
                    </div>

                </div>
            </nav>
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