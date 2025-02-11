import React from "react";
import { useLocation } from "react-router-dom";

function BoutonsSociaux(props) {
  const url = process.env.REACT_APP_BACKEND_URL;
  const location = useLocation();

  // Get redirect URL from query parameters, or use current URL if not present
  const searchParams = new URLSearchParams(location.search);
  const redirectUrl = searchParams.get('redirect') || `${location.pathname}${location.search}`;

  // Add redirect parameter to social auth URLs
  const googleAuthUrl = `${url}/user/auth/google?redirect=${encodeURIComponent(redirectUrl)}`;
  const facebookAuthUrl = `${url}/user/auth/facebook?redirect=${encodeURIComponent(redirectUrl)}`;

  return (
    <div>
      <a className="btn btn btn-social btn-google" href={googleAuthUrl} role="button">
        <img className="icon-google" style={{ boxShadow: "none" }} src={require('../images/icons/icons8-google-plus-squared-48.webp')} alt="google" />
        {props.inscription ? "Inscription via Google" : "Connexion via Google"}
      </a>

      <a className="btn btn btn-social btn-facebook" href={facebookAuthUrl} role="button" style={{ pointerEvents: "none", opacity: 0.5 }}>
        <img className="icon-facebook" style={{ boxShadow: "none" }} src={require('../images/icons/icons8-facebook-circled-48.webp')} alt="facebook" />
        {props.inscription ? "Inscription via Facebook" : "Connexion via Facebook"}
      </a>
    </div>
  )
}

export default BoutonsSociaux;