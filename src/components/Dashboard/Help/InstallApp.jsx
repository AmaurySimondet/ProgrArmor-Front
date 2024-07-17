import { React } from "react"

function InstallApp(props) {
    return (
        <div>
            <div className="basic-div">
                <div>
                    <div >
                        <div >Rendez-vous sur ProgrArmor en 1 clic grâce à notre application web
                        </div>
                        <div >
                        </div>
                        <div >Quel téléphone utilisez-vous ?
                        </div>
                        <div >
                            <button className="btn btn-dark btn-lg help-button"> <a style={{ color: "white", textDecoration: "none" }} href="#iphone" >iPhone
                            </a>
                            </button>
                            <button className="btn btn-dark btn-lg help-button"> <a style={{ color: "white", textDecoration: "none" }} href="#samsung" >Autre
                            </a>
                            </button>
                        </div>
                        <img className={props.modeSombre === true ? "questionDark" : ""} src="https://uploads-ssl.webflow.com/612cdb668b06dbb2a51f99ee/637cacf73009a4a0703e9873_57%20(1).svg" loading="lazy" width="52" alt="" />
                    </div>
                </div>


                <div className="large-margin-top" id="iphone" >
                    <h2 >Télécharger ProgrArmor sur Iphone
                    </h2>
                    <div >
                        <div >Si vous utilisez Safari, voici les étapes pour télécharger l&#x27;application web ProgrArmor : <br />
                            <br />
                            <ol className="ol-installapp">
                                <li>Rendez-vous sur le site ProgrArmor sur Safari</li>
                                <li>Cliquez sur l&#x27;icône en bas au centre de votre écran (avec une flèche qui sort d&#x27;un carré) </li>
                                <li>Descendez et cliquez sur &quot;Sur l&#x27;écran d&#x27;accueil&quot;</li>
                            </ol>‍
                            <br />Si habituellement vous utilisez un autre navigateur sur iPhone, vous devrez passer par safari pour cette manipulation. Vous pourrez cependant utiliser l&#x27;application normalement par la suite !
                            <br />‍
                        </div>
                        <div >
                            <img src={require('../../../images/help/InstallApp_ProgrArmor_iPhone.webp')} className="img-installapp" alt="img-installapp" />
                        </div>
                    </div>
                </div>



                <div className="large-margin-updown" id="samsung" >
                    <h2 >Télécharger ProgrArmor sur un autre smartphone
                    </h2>
                    <div >
                        <div >La manipulation sera identique sur tous les navigateurs hormis Safari, voyons cela :<br />
                            <br />
                            <ol className="ol-installapp">
                                <li>Rendez-vous sur le site ProgrArmor sur votre navigateur</li>
                                <li>Cliquez sur les 3 points (ou 3 barres) qui permettent d&#x27;ouvrir un menu sur le navigateur </li>
                                <li>Cliquez sur "Ajouter à l'écran d'acceuil"</li>
                            </ol>‍
                        </div>
                        <div >
                            <img src={require('../../../images/help/InstallApp_ProgrArmor_Samsung.webp')} className="img-installapp" alt="img-installapp" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default InstallApp;