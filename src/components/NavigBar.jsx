import React, { useState } from "react";
import Chrono from "./Chrono";

function NavigBar() {
    const [toggled, setToggled] = useState(false);

    function toggling() {
        setToggled(oldToggled => {
            return !oldToggled
        })
    }

    return (
        <div>
            <nav className="navbar navbar-expand navbar-light bg-light navigbar">
                <div className="position-relative">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>
                <a className="navbar-brand" href="/dashboard"><img className="logo-navbar" src={require('../images/icons/logo-navbar.webp')} alt="logo" /></a>
                <a className="navbar-brand" href="/dashboard">
                    <h1 className="ProgArmor">ProgArmor
                        <sub style={{ fontSize: "0.5em" }}>alpha</sub>
                    </h1>
                </a>

                <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                    <div className={toggled ? "toggler-icon scaled" : "toggler-icon not-scaled"} >
                        <img onClick={toggling} src={require('../images/icons/output-onlinepngtools.webp')} alt="logo" />
                    </div>

                    <div>
                        <div className={toggled ? "toggle-is-clicked extended" : "toggle-is-clicked not-extended"}
                            style={toggled ? null : { border: "0" }} ></div>

                        <div className={toggled ? "param-choice-toggle visible" : "param-choice-toggle not-visible"} >

                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                                <input className="form-control mr-2" type="search" placeholder="Maître Yoyo" aria-label="Search" />
                                <button className="btn btn-black" type="submit">Go</button>
                            </div>
                            <hr style={{ borderColor: "black" }} />
                            <a className="nav-link" href="/aide"> <img className="icon-navbar" src={require('../images/icons/icons8-question-mark-96.webp')} alt='aide' style={{ filter: "invert(1)" }} /> Aide </a>
                            <a className="nav-link" href="/admin"><img className="icon-navbar" src={require('../images/icons/lock.webp')} alt='admin' /> Admin</a>
                            <hr style={{ borderColor: "black" }} />
                            <a className="nav-link" href="/a_propos"> A propos </a>
                            <a className="nav-link" href="/CGU"> CGU </a>
                        </div>
                    </div>

                </div>
            </nav >
            <Chrono />
        </div >
    )
}

export default NavigBar;