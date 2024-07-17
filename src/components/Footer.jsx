import { React, useState, useEffect, useRef } from "react";

function Footer(props) {

    return (

        <div>

            <footer className="footer footer-black">

                <a href="https://twitter.com/ProgrArmor"><img className="social" src={require('../images/icons/twitter.webp')} alt='twitter' /></a>

                <a href="https://www.instagram.com/prograrmor/"><img className="social" src={require('../images/icons/instagram.webp')} alt='instagram' /></a>

                <a href="https://www.facebook.com/profile.php?id=100087568835793"><img className="social" src={require('../images/icons/facebook.webp')} alt='facebook' /></a>

                <a href="https://discord.gg/Gj98SjG8"><img className="social" src={require('../images/icons/discord.webp')} alt='discord' /></a>

                <a href="https://www.tiktok.com/@prograrmor"><img className="social" src={require('../images/icons/tiktok.webp')} alt='tiktok' /></a>

                <a href="https://www.youtube.com/@prograrmor"><img className="social" src={require('../images/icons/youtube.webp')} alt='youtube' /></a>

            </footer>

        </div>
    )
}

export default Footer;