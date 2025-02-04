import { React, useState, useEffect, useRef } from "react";
import HomeHeader from "../../components/HomeHeader.jsx";
import BoutonsSociaux from "../../components/BoutonsSociaux.jsx";
import InscriptionForm from "./InscriptionForm.jsx";
import Footer from "../../components/Footer.jsx";
import API from "../../utils/API.js";
import { COLORS } from "../../utils/constants.js";
import createTokenAndId from "../../utils/token.js";

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
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("token")) {
            setLoading(true);

            createTokenAndId().then(() => {
                setLoading(false);
            });
        }
    }, []); // Empty dependency array means this only runs once on mount

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    const divNumber = entry.target.dataset.section;
                    if (entry.isIntersecting) {
                        switch (divNumber) {
                            case '1': setClassdiv1("visible"); break;
                            case '2': setClassdiv2("visible"); break;
                            case '3': setClassdiv3("visible"); break;
                            case '4': setClassdiv4("visible"); break;
                            case '5': setClassdiv5("visible"); break;
                        }
                    } else {
                        switch (divNumber) {
                            case '1': setClassdiv1("not-visible"); break;
                            case '2': setClassdiv2("not-visible"); break;
                            case '3': setClassdiv3("not-visible"); break;
                            case '4': setClassdiv4("not-visible"); break;
                            case '5': setClassdiv5("not-visible"); break;
                        }
                    }
                });
            },
            { threshold: 0.2 }
        );

        // Observer chaque div
        [div1, div2, div3, div4, div5].forEach((ref, index) => {
            if (ref.current) {
                ref.current.dataset.section = index + 1;
                observer.observe(ref.current);
            }
        });

        return () => observer.disconnect();
    }, [dimensions.width]);

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
            });
        }

        let timeout = null;
        const debouncedHandleResize = () => {
            clearTimeout(timeout);
            timeout = setTimeout(handleResize, 200);
        };

        window.addEventListener('resize', debouncedHandleResize);

        // Cleanup function to remove event listener
        return () => {
            window.removeEventListener('resize', debouncedHandleResize);
            clearTimeout(timeout);
        };
    }, []); // Empty dependency array since we only want to set this up once

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        API.getInscriptionStats().then(res => {
            setStats(res.data);
        });
    }, []);

    return (
        <div style={{ backgroundColor: COLORS.PAGE_BACKGROUND }}>
            <div className="page-container">
                <HomeHeader loading={loading} />


                <main className="content-wrap popInElement" style={{ margin: "0 auto" }}>
                    {/* Section 1: Sign Up */}
                    <section className="feature-section">
                        <div className="feature-content">
                            <h1 className="h1-inscription">Inscris toi !</h1>
                            <h2 className="h2-inscription" style={{ fontWeight: "normal" }}>Armes toi avec les meilleurs outils pour ta progression</h2>
                            <BoutonsSociaux inscription={true} />
                            <InscriptionForm />
                        </div>
                        <div className="feature-image" ref={div1}>
                            <img src={require('../../images/inscription.webp')} alt="Inscription" />
                        </div>
                    </section>

                    <hr className="hr-inscription" />

                    {/* Section: Testimonials */}
                    <section className={`testimonials-section ${classdiv1}`} ref={div1} style={{ justifySelf: "center" }}>
                        <h2>Ils utilisent déjà ProgArmor !</h2>
                        <p>Bon enfin on va dire que la communauté s'aggrandit quoi...</p>
                        <div className="testimonials-grid">
                            {/* Testimonials content */}
                        </div>
                    </section>

                    {/* Section: Stats */}
                    <section className="stats-section" style={{ justifySelf: "center" }}>
                        <div className="stat-item">
                            <h3>{stats.totalUsers}</h3>
                            <p>Athlètes actifs</p>
                        </div>
                        <div className="stat-item">
                            <h3>{stats.totalSeances}</h3>
                            <p>Séances enregistrées</p>
                        </div>
                        <div className="stat-item">
                            <h3>∞</h3>
                            <p>Possibilités de progression</p>
                        </div>
                    </section>

                    <hr className="hr-inscription" />

                    {/* Section 2: Training History */}
                    <section className={`feature-section reverse ${classdiv2}`} ref={div2}>
                        <div className="feature-image">
                            <img src={require('../../images/other/historique.webp')} alt="Historique" />
                        </div>
                        <div className="feature-content">
                            <h1 className="h1-inscription">Ton historique, partout avec toi</h1>
                            <h2 className="h2-inscription" style={{ fontWeight: "normal" }}>
                                Synchronise tes séances automatiquement et analyse ta progression en détail.
                                <br /><br />
                                Retrouve instantanément tes performances grâce aux filtres avancés.
                                <br /><br />
                                Compare tes stats avec celles de tes amis et défie-les !
                                (Oui, on encourage la compétition amicale 😉)
                            </h2>
                        </div>
                    </section>

                    <hr className="hr-inscription" />

                    {/* Section 3: Note Taking */}
                    <section className={`feature-section ${classdiv3}`} ref={div3}>
                        <div className="feature-image">
                            <img src={require('../../images/other/prise-note.webp')} alt="Prise de notes" />
                        </div>
                        <div className="feature-content">
                            <h1 className="h1-inscription">Enregistre tes séances en un clin d'œil</h1>
                            <h2 className="h2-inscription" style={{ fontWeight: "normal" }}>
                                Concentre-toi sur ton entraînement, on s'occupe du reste.
                                <br /><br />
                                Charge tes séances précédentes en un clic et adapte-les à ta forme du jour.
                                <br /><br />
                                Mode prise de note rapide pour capturer l'essentiel sans perdre le rythme !
                            </h2>
                        </div>
                    </section>

                    <hr className="hr-inscription" />

                    {/* Section 4: Additional Features */}
                    <section className={`feature-section reverse ${classdiv4}`} ref={div4}>
                        <div className="feature-image">
                            <img src={require('../../images/other/plus.webp')} alt="Plus de fonctionnalités" />
                        </div>
                        <div className="feature-content">
                            <h1 className="h1-inscription">Des outils conçus pour ta réussite</h1>
                            <h2 className="h2-inscription" style={{ fontWeight: "normal" }}>
                                Mode expert pour personnaliser chaque détail de tes séances.
                                <br /><br />
                                Découvre des programmes créés par la communauté ou partage les tiens.
                                <br /><br />
                                Challenge tes amis et motive-les à se dépasser !
                                (ou chambre-les gentiment quand ils sèchent l'entraînement 😏)
                            </h2>
                        </div>
                    </section>

                    <hr className="hr-inscription" />

                    {/* Section 5: Call to Action */}
                    <section className={`feature-section ${classdiv5}`} ref={div5}>
                        <div className="feature-image">
                            <img src={require('../../images/inscription.webp')} alt="Inscription finale" />
                        </div>
                        <div className="feature-content">
                            <h1 className="h1-inscription">Commence ton voyage vers le progrès</h1>
                            <h2 className="h2-inscription" style={{ fontWeight: "normal" }}>
                                Rejoins des milliers d'athlètes qui ont déjà fait le choix de la progression.
                                C'est gratuit, c'est puissant, c'est ProgArmor.
                                <br /><br />
                                <button className="btn btn-lg btn-dark" onClick={scrollToTop}>
                                    C'est parti !
                                </button>
                            </h2>
                        </div>
                    </section>
                </main>

                <Footer />

                {showButton && (
                    <button onClick={scrollToTop} className="scroll-top-button btn-dark">
                        ↑
                    </button>
                )}
            </div>
        </div>
    );
}

export default Inscription;