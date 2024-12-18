import React, { useState, useEffect } from "react";
import { getUserById } from "../utils/user";

function NavigBar(props) {
    const [toggled, setToggled] = useState(false);
    const [user, setUser] = useState(null);
    const [clickedWarning, setClickedWarning] = useState(false);

    function toggling() {
        setToggled(oldToggled => {
            return !oldToggled
        })
    }

    useEffect(() => {
        getUserById(localStorage.getItem('id')).then(setUser);
    }, []);

    return (
        <div>
            <nav className="navbar navbar-expand navbar-light bg-light navigbar">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <a className="navbar-brand" href="/dashboard"><img className="logo-navbar" src={require('../images/icons/logo-navbar.webp')} alt="logo" /></a>
                <a className="navbar-brand" href="/dashboard">
                    <h1 className="ProgArmor">ProgArmor
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
                                <input className="form-control mr-2" type="search" placeholder="Maître Yoyo" aria-label="Search" />
                                <button className="btn btn-black" type="submit">Go</button>
                            </div>
                            <hr style={{ borderColor: "black" }} />
                            <a className="nav-link" href="/dashboard"><img className="icon-navbar" src={require('../images/icons/home.webp')} alt='home' /> Dashboard</a>
                            <a className="nav-link" href="/notifications"><img className="icon-navbar" src={require('../images/icons/notifications.webp')} alt='notifications' /> Notifications</a>
                            <a className="nav-link" href="/session"><img className="icon-navbar" src={require('../images/icons/write.webp')} alt='session' /> Nouvelle séance</a>
                            <a className="nav-link" href="/programme"><img className="icon-navbar" src={require('../images/icons/plus.webp')} alt='programme' /> Programmes</a>
                            <hr style={{ borderColor: "black" }} />
                            <a className="nav-link" href={`/compte?id=${localStorage.getItem('id')}`}> <img className="icon-navbar" src={user?.profilePic ? user?.profilePic : require('../images/profilepic.webp')} alt='compte' style={{ borderRadius: "50%", border: "1px solid black" }} />{user?.fName} {user?.lName}</a>
                            <a className="nav-link" href="/aide"> <img className="icon-navbar" src={require('../images/icons/icons8-question-mark-96.webp')} alt='aide' style={{ filter: "invert(1)" }} /> Aide </a>
                            <hr style={{ borderColor: "black" }} />
                            <a className="nav-link" href="/a_propos"> A propos </a>
                            <a className="nav-link" href="/CGU"> CGU </a>
                        </div>
                    </div>

                </div>
            </nav>
        </div >
    )
}

export default NavigBar;