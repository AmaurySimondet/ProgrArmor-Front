import React, { useState, useEffect } from 'react';
import { useWindowDimensions } from "../utils/useEffect";

function HomeHeader() {
  const dimensions = useWindowDimensions();

  return (
    <nav className="navbar navbar-expand navbar-light bg-light inscription-navbar">
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <a className="navbar-brand" href="/inscription"><img className="logo-navbar" src={require('../images/icons/logo-navbar.webp')} alt="logo" /></a>
      {dimensions.width > 500 ? <a className="ProgrArmor-a" href="/inscription"><h1 className="ProgrArmor">ProgrArmor</h1></a> : null}
      <div className="collapse navbar-collapse" id="navbarTogglerDemo01">

        <ul className="navbar-nav mr-auto mt-2 mt-lg-0 navbar-elements">
          <li className="nav-item active">
            <a className="nav-link" href="/connexion">Connexion</a>
          </li>
          <li className="nav-item active">
            <a className="nav-link" href="/cgu">CGU</a>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default HomeHeader;