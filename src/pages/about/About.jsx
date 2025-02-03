import { React, useState, useEffect, useRef } from "react";
import HomeHeader from "../../components/HomeHeader.jsx";
import Footer from "../../components/Footer.jsx";
import { COLORS } from "../../utils/constants.js";
import AppFooter from "../../components/AppFooter.jsx";
import NavigBar from "../../components/NavigBar.jsx";

function About() {
    const [classdiv1, setClassdiv1] = useState("not-visible");
    const [classdiv2, setClassdiv2] = useState("not-visible");
    const div1 = useRef();
    const div2 = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    const divNumber = entry.target.dataset.section;
                    if (entry.isIntersecting) {
                        switch (divNumber) {
                            case '1': setClassdiv1("visible"); break;
                            case '2': setClassdiv2("visible"); break;
                        }
                    } else {
                        switch (divNumber) {
                            case '1': setClassdiv1("not-visible"); break;
                            case '2': setClassdiv2("not-visible"); break;
                        }
                    }
                });
            },
            { threshold: 0.2 }
        );

        [div1, div2].forEach((ref, index) => {
            if (ref.current) {
                ref.current.dataset.section = index + 1;
                observer.observe(ref.current);
            }
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div style={{ backgroundColor: COLORS.PAGE_BACKGROUND }}>
            <div className="page-container">
                <NavigBar location="about" />

                <main className="content-wrap popInElement" style={{ margin: "0 auto" }}>
                    {/* Section Introduction */}
                    <section className="feature-section">
                        <div className="feature-content">
                            <h1 className="h1-inscription">À propos de ProgArmor</h1>
                            <h2 className="h2-inscription" style={{ fontWeight: "normal" }}>
                                Une application créée par des passionnés, pour des passionnés
                            </h2>
                        </div>
                        <div className="feature-image" ref={div1}>
                            <img src={require('../../images/inscription.webp')} alt="À propos" />
                        </div>
                    </section>

                    <hr className="hr-inscription" />

                    {/* Section Histoire */}
                    <section className={`feature-section reverse ${classdiv1}`} ref={div1}>
                        <div className="feature-image">
                            <img src={require('../../images/other/historique.webp')} alt="Notre histoire" />
                        </div>
                        <div className="feature-content">
                            <h1 className="h1-inscription">Notre Histoire</h1>
                            <h2 className="h2-inscription" style={{ fontWeight: "normal" }}>
                                ProgArmor est né d'une frustration simple : le manque d'outils vraiment adaptés
                                pour suivre sa progression en musculation.
                                <br /><br />
                                Développé à la frontière Franco-Suisse avec passion, notre objectif est de créer l'application
                                que nous aurions voulu avoir quand nous avons commencé.
                            </h2>
                        </div>
                    </section>

                    <hr className="hr-inscription" />

                    {/* Section Contact */}
                    <section className={`feature-section ${classdiv2}`} ref={div2}>
                        <div className="feature-content">
                            <h1 className="h1-inscription">Contactez-nous</h1>
                            <h2 className="h2-inscription" style={{ fontWeight: "normal" }}>
                                Une question ? Une suggestion ? N'hésitez pas à nous contacter !
                                <br /><br />
                                Email : mail.progarmor@gmail.com
                                <br />
                                Twitter : @ProgArmor
                                <br />
                                Instagram : @ProgArmor
                            </h2>
                        </div>
                        <div className="feature-image">
                            <img src={require('../../images/other/plus.webp')} alt="Contact" />
                        </div>
                    </section>
                </main>

                <AppFooter />
            </div>
        </div>
    );
}

export default About; 