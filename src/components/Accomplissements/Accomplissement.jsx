import { React, useState, useEffect } from 'react';

function Accomplissement(props) {
    const [dimensions, setDimensions] = useState({
        height: window.innerHeight,
        width: window.innerWidth
    });

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
        <div data-panel="{&quot;autoFocus&quot;:true,&quot;focusable&quot;:true,&quot;clickOnActivate&quot;:true}"
            className={dimensions.width < 500 ? "achieveRowMini" : "achieveRow"}>
            <div class="achieveImgHolder">
                <img src={props.img} style={
                    props.accomplished ?
                        dimensions.width < 500 ?
                            { width: "40px", height: "40px" }
                            :
                            null
                        :
                        dimensions.width < 500 ?
                            { width: "40px", height: "40px", filter: "grayscale(0.8) invert(0.7)" }
                            :
                            { filter: "grayscale(0.8) invert(0.7)" }
                } />
            </div>
            <div className={dimensions.width < 500 ? "achieveTxtHolderMini" : "achieveTxtHolder"}
                style={props.modeSombre ? null : { background: "#aaaaaa" }}>
                <div class="achieveTxt" style={dimensions.width < 500 ? { padding: "0" } : null}>
                    <h3 class="ellipsis" style={
                        props.modeSombre ? null : { color: "black" }
                    }>
                        {props.titre}
                    </h3>
                    <h5 style={
                        props.modeSombre ? null : { color: "#222222" }
                    }>
                        {props.description}
                    </h5>
                </div>

                {/* <div class="achieveUnlockTime">
                    {props.date ? "Débloqué le " + props.date : null}

                </div> */}
            </div>
        </div>
    )
}

export default Accomplissement;