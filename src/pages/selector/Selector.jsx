import { React } from "react";
import NavigBar from "../../components/NavigBar.jsx"
import { COLORS } from "../../utils/constants.js";
import AppFooter from "../../components/AppFooter.jsx";

function Selector() {
    return (
        <div style={{ backgroundColor: COLORS.PAGE_BACKGROUND }}>
            <div className="page-container">
                <NavigBar location="Selector" />

                {/* PAGE CONTENT */}
                <div className="content-wrap">
                    <div className="popInElement">
                        <h1 style={{ textAlign: 'center' }}>Alors, on enregistre quoi ?</h1>

                        <div className="sessionChoiceContainer">
                            <div
                                onClick={() => window.location.href = '/session'}
                                className='sessionChoice'
                            >
                                <div style={{ fontSize: '36px' }}>💪</div>
                                <div>Ma séance</div>
                            </div>

                            <div
                                // onClick={() => window.location.href = '/meal'}
                                className='sessionChoice disabled'
                            >
                                <div style={{ fontSize: '36px' }}>🍽️</div>
                                <div>Mon repas</div>
                            </div>

                            <div
                                // onClick={() => window.location.href = '/measurements'}
                                className='sessionChoice disabled'
                            >
                                <div style={{ fontSize: '36px' }}>📏</div>
                                <div>Mes mensurations</div>
                            </div>

                            <div
                                // onClick={() => window.location.href = '/steps'}
                                className='sessionChoice disabled'
                            >
                                <div style={{ fontSize: '36px' }}>👣</div>
                                <div>Mes pas</div>
                            </div>

                            <div
                                // onClick={() => window.location.href = '/sleep'}
                                className='sessionChoice disabled'
                            >
                                <div style={{ fontSize: '36px' }}>😴</div>
                                <div>Mon sommeil</div>
                            </div>

                            <div
                                className='sessionChoice disabled'
                            >
                                <div style={{ fontSize: '36px' }}>🌸</div>
                                <div>Mes menstruations</div>
                            </div>
                        </div>
                    </div>
                </div>

                <AppFooter />
            </div>
        </div>
    );
};

export default Selector;