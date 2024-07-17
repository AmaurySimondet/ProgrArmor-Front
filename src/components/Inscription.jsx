import { React, useState, useEffect, useRef } from "react";
import HomeHeader from "./HomeHeader.jsx"
import BoutonsSociaux from "./BoutonsSociaux.jsx"
import InscriptionForm from "./InscriptionForm.jsx"
import Footer from "./Footer.jsx";
import API from "../utils/API.js";

function Inscription() {
    const [dimensions, setDimensions] = useState({
        height: window.innerHeight,
        width: window.innerWidth
    })
    const [showButton, setShowButton] = useState(false);
    const div1 = useRef();
    const div2 = useRef();
    const div3 = useRef();
    const div4 = useRef();
    const div5 = useRef();
    const [classdiv1, setClassdiv1] = useState("not-visible");
    const [classdiv2, setClassdiv2] = useState("not-visible");
    const [classdiv3, setClassdiv3] = useState("not-visible");
    const [classdiv4, setClassdiv4] = useState("not-visible");
    const [classdiv5, setClassdiv5] = useState("not-visible");

    useEffect(() => {
        window.addEventListener("scroll", () => {
            if (window.pageYOffset > 300) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        });
    }, []);

    useEffect(() => {
        const y1 = div1.current.offsetTop;
        const y2 = div2.current.offsetTop;
        const y3 = div3.current.offsetTop;
        const y4 = div4.current.offsetTop;
        const y5 = div5.current.offsetTop;
        const yMargin = 300;

        window.addEventListener("scroll", () => {
            if (window.pageYOffset > y1 - yMargin) {
                setClassdiv1("visible");
            }
            if (window.pageYOffset < y1 - yMargin) {
                setClassdiv1("not-visible");
            }

            if (window.pageYOffset > y2 - yMargin) {
                setClassdiv2("visible");
            }
            if (window.pageYOffset < y2 - yMargin) {
                setClassdiv2("not-visible");
            }

            if (dimensions.width > 900) {
                if (window.pageYOffset > y3 - yMargin) {
                    setClassdiv3("visible");
                }
                if (window.pageYOffset < y3 - yMargin) {
                    setClassdiv3("not-visible");
                }

                if (window.pageYOffset > y4 - yMargin) {
                    setClassdiv4("visible");
                }
                if (window.pageYOffset < y4 - yMargin) {
                    setClassdiv4("not-visible");
                }

                if (window.pageYOffset > y5 - yMargin) {
                    setClassdiv5("visible");
                }
                if (window.pageYOffset < y5 - yMargin) {
                    setClassdiv5("not-visible");
                }
            }
            if (dimensions.width <= 900) {
                if (window.pageYOffset > y3 - yMargin) {
                    setClassdiv3("visible");
                }
                if (window.pageYOffset < y3 - yMargin) {
                    setClassdiv3("not-visible");
                }

                if (window.pageYOffset > y4 - yMargin) {
                    setClassdiv4("visible");
                }
                if (window.pageYOffset < y4 - yMargin) {
                    setClassdiv4("not-visible");
                }

                if (window.pageYOffset > y5 - yMargin) {
                    setClassdiv5("visible");
                }
                if (window.pageYOffset < y5 - yMargin) {
                    setClassdiv5("not-visible");
                }
            }



        });
    }, []);

    useEffect(() => {
        console.log(window.pageYOffset)
    }, [window.pageYOffset])

    // This function will scroll the window to the top 
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // for smoothly scrolling
        });
    };

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
    })

    async function createTokenAndId() {
        const result = await API.verifyToken({ token: localStorage.getItem("token") });
        if (result.data.success === true) {
            window.location = "/dashboard";
        }
        else {
            console.log(result.data.message)
        }
    }

    if (localStorage.getItem("token")) {
        createTokenAndId();
    }

    return (
        <div>
            <HomeHeader />

            {/* DIV 1 */}
            <div
                className={
                    dimensions.width > 900 ? "basic-flex"
                        :
                        "basic-flex"}
                ref={dimensions.width > 900 ? div1 : null}>

                <div className={dimensions.width > 900 ? "basic-flexed"
                    :
                    dimensions.width < 500 ? "basic-noflexed500"
                        :
                        "basic-noflexed"}
                    style={{ textAlign: "center", height: "650px" }}>

                    <div style={{ width: "90%", margin: "auto" }}>
                        <h1 className="h1-inscription">Inscris toi !</h1>
                        <h2 className="h2-inscription">Armes toi avec les meilleurs outils pour ta progression</h2>

                        <BoutonsSociaux inscription={true} />

                        <InscriptionForm />

                    </div>
                </div>


                <div className={
                    dimensions.width > 900 ? "basic-flexed"
                        :
                        "basic-noflexed500" + " " + classdiv1}
                    style={dimensions.width < 900 ? { height: "400px" } : null}
                    ref={dimensions.width < 900 ? div1 : null}>
                    <img src={require('../images/inscription.webp')} alt="ad" />
                </div>
            </div>

            <hr className="hr-inscription" />


            {/* DIV 2 */}
            <div
                className={
                    dimensions.width > 900 ? "basic-flex" + " " + classdiv2
                        :
                        "basic-flex"}
                ref={dimensions.width > 900 ? div2 : null}>

                <div className={
                    dimensions.width > 900 ? "basic-flexed"
                        :
                        "basic-noflexed500" + " " + classdiv2}
                    ref={dimensions.width < 900 ? div2 : null}>
                    <img src={require('../images/other/historique.webp')} alt="ad" />
                </div>

                <div className={dimensions.width > 900 ? "basic-flexed"
                    :
                    "basic-noflexed500 large-margin-updown"}
                    style={{ textAlign: "center", width: "90%", margin: "auto", display: "grid", alignContent: "center" }}>


                    <div style={{ width: "90%", margin: "auto" }}>
                        <h1 className="h1-inscription">Tu peux jeter ton cahier d'entraînement !</h1>
                        <h2 className="h2-inscription">
                            Ton historique d'entraînement te suivras partout. Tu pourras le consulter à tout moment. <br />
                            <br />
                            Avec les nombreuses options de filtrage, tu pourras retrouver tes séances en un clin d'oeil. <br />
                            <br />
                            Tu pourras aussi consulter tes statistiques et les comparer à celles de tes amis. <br />
                        </h2>

                    </div>
                </div>
            </div>

            <hr className="hr-inscription" />

            {/* DIV 3 */}
            <div
                className={
                    dimensions.width > 900 ? "basic-flex" + " " + classdiv3
                        :
                        "basic-flex"}
                ref={dimensions.width > 900 ? div3 : null}>

                <div className={dimensions.width > 900 ? "basic-flexed"
                    :
                    "basic-noflexed500 large-margin-updown" + " " + classdiv3}
                    ref={dimensions.width < 900 ? div3 : null}
                    style={{ textAlign: "center", width: "90%", margin: "auto", display: "grid", alignContent: "center" }}>


                    <div style={{ width: "90%", margin: "auto" }}>
                        <h1 className="h1-inscription"> Une prise de note facilitée </h1>
                        <h2 className="h2-inscription">
                            Ne perds pas ton temps à écrire tes séances, nous le faisons pour toi ! <br />
                            <br />
                            ProgrArmor te propose de charger une séance précédente, tu n'auras plus qu'a modifier les changements ! <br />
                            <br />
                            Tu peux aussi créer tes propres séances avec le mode prise de note rapide ! <br />
                        </h2>
                    </div>



                </div>

                <div className={
                    dimensions.width > 900 ? "basic-flexed"
                        :
                        "basic-noflexed500"}>
                    <img src={require('../images/other/prise-note.webp')} alt="ad" />
                </div>
            </div>

            <hr className="hr-inscription" />

            {/* DIV 4 */}
            <div
                className={
                    dimensions.width > 900 ? "basic-flex" + " " + classdiv4
                        :
                        "basic-flex"}
                ref={dimensions.width > 900 ? div4 : null}>

                <div className={
                    dimensions.width > 900 ? "basic-flexed"
                        :
                        "basic-noflexed500" + " " + classdiv4}
                    ref={dimensions.width < 900 ? div4 : null}>
                    <img src={require('../images/other/plus.webp')} alt="ad" />
                </div>

                <div className={dimensions.width > 900 ? "basic-flexed"
                    :
                    "basic-noflexed500 large-margin-updown"}
                    style={{ textAlign: "center", width: "90%", margin: "auto", display: "grid", alignContent: "center" }}>


                    <div style={{ width: "90%", margin: "auto" }}>
                        <h1 className="h1-inscription"> Et bien plus encore ! </h1>
                        <h2 className="h2-inscription">
                            Enregistre même tes séances les plus farfelues avec le mode expert ! <br />
                            <br />
                            Trouves le programme parfait parmis ceux de la communauté, ou créer le tiens et obtiens des commentaires pertinents ! <br />
                            <br />
                            Suis tes amis et charies les s'ils ne progressent pas ! <br />
                            <br />
                        </h2>
                    </div>


                </div>
            </div>

            <hr className="hr-inscription" />

            {/* DIV 5 */}
            <div
                className={
                    dimensions.width > 900 ? "basic-flex" + " " + classdiv5
                        :
                        "basic-flex"}
                ref={dimensions.width > 900 ? div5 : null}>

                <div className={dimensions.width > 900 ? "basic-flexed"
                    :
                    "basic-noflexed500 large-margin-updown" + " " + classdiv5}
                    ref={dimensions.width < 900 ? div5 : null}
                    style={{ textAlign: "center", width: "90%", margin: "auto", display: "grid", alignContent: "center" }}>

                    <div style={{ width: "90%", margin: "auto" }}>
                        <h1 className="h1-inscription"> Ta progression doit être ta priorité. </h1>
                        <h2 className="h2-inscription">
                            Utilises ProgrArmor dès maintenant et améliore ta pratique sportive, c'est gratuit. <br />
                            <br />
                            <button className="btn btn-lg btn-dark" onClick={scrollToTop}>
                                Je suis prêt !
                            </button>
                        </h2>
                    </div>

                </div>

                <div className={
                    dimensions.width > 900 ? "basic-flexed"
                        :
                        "basic-noflexed500"}>
                    <img src={require('../images/inscription.webp')} alt="ad" />
                </div>
            </div>


            {/* C'est gratuit et tout le monde l'utilise */}


            {/* BOUTON GO TO TOP */}
            {showButton && (
                <button onClick={scrollToTop} className="btn btn-dark btn-to-top">
                    <img src={require("./../images/icons/arrow-up.webp")}
                        style={{ width: "100%", height: "100%" }} />
                </button>
            )}

            <Footer />
        </div>
    )
}

export default Inscription;