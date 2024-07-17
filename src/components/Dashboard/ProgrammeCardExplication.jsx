import { React, useState, useEffect } from 'react';
import ReactCardFlip from "react-card-flip";
import { Scrollbars } from 'react-custom-scrollbars';

function ProgrammeCard(props) {
    const [dimensions, setDimensions] = useState({
        height: window.innerHeight,
        width: window.innerWidth
    });
    const [isFlipped, setIsFlipped] = useState(false);
    const [mouseEnter, setMouseEnter] = useState(false);

    function handleFlip() {
        setIsFlipped(!isFlipped);
    }

    function handleMouseEnter() {
        setMouseEnter(true);
    }

    function handleMouseLeave() {
        setMouseEnter(false);
    }

    useEffect(() => {
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
    });

    return (
        <div className="react-card">
            <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
                <div className="YOUR_FRONT_CCOMPONENT" onClick={handleFlip} style={props.modeSombre ? null : { color: "white" }}>

                    <div className="programme-card programme-card-explication" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        <Scrollbars autoHide>
                            <div className="programme-card-header">
                                <div style={dimensions.width > 850 ? { marginBottom: "40px" } : { marginBottom: "10px" }}>
                                    <h1 style={{ marginBottom: "1rem", marginTop: "20px" }}> Titre </h1>
                                    <p> Description </p>
                                    <p style={{ margin: "0" }}> ID du programme</p>
                                </div>

                                <div style={dimensions.width > 850 ? { marginBottom: "40px" } : { marginBottom: "10px" }}>
                                    <p> Type de programme </p>
                                    <p> Niveau conseillé </p>
                                    <p> Séances / semaine</p>
                                    <p> Durée max d'une séance</p>
                                    <p> Materiel nécessaire</p>
                                </div>


                                <i style={{ fontSize: "10px" }}>
                                    Cliquez sur le programme pour en savoir plus
                                </i>


                            </div>

                            <div className={
                                mouseEnter ?
                                    "programme-card-profile-explication-hover"
                                    :
                                    "programme-card-profile-explication"
                            }>
                                <table className="basic-table">
                                    <tr>
                                        <td>
                                            <img className="unknown-profile-pic profile-pic" src={require('../../images/profilepic.webp')} alt='unknown-profile-pic' />
                                        </td>
                                        <td>
                                            <p style={{ margin: "auto", display: "inline-block" }}>Prénom Nom</p>
                                            <br />
                                            <p style={{ margin: "auto", display: "inline-block" }}>ID créateur</p>
                                        </td>
                                    </tr>
                                </table>

                                {/* LIKE COMMENTS */}
                                <table className="basic-table">
                                    <tr>
                                        <td>
                                            <img className="small-img" src={require('../../images/icons/like.webp')} alt='like' />
                                        </td>
                                        <td>
                                            <p style={{ margin: "auto", fontSize: "50%" }}> Nbre de likes </p>
                                        </td>
                                        <td>
                                            <img className="small-img" src={require('../../images/icons/comment.webp')} alt='comment' />
                                        </td>
                                        <td>
                                            <p style={{ margin: "auto", fontSize: "50%" }}> Nbre de commentaires </p>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </Scrollbars>
                    </div >
                </div >



                <div className="YOUR_BACK_COMPONENT" onClick={handleFlip}>
                    <div className="programme-card programme-card-explication">
                        <div>

                            <img className="panties" src={require('../../images/other/panties.webp')} alt='panties' />
                        </div>
                    </div>
                </div>
            </ReactCardFlip >
        </div >
    )
};

export default ProgrammeCard;