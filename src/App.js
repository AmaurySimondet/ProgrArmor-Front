import { React } from "react";
import { Route, Routes } from "react-router-dom";
import DashBoard from "./pages/dashboard/DashBoard.jsx";
import Inscription from "./components/Inscription.jsx";
import Connexion from "./components/Connexion.jsx";
import CGU from "./components/CGU.jsx";
import Token from "./components/Token.jsx";

import Stats from "./components/Stats.jsx";
import PrivateRoute from "./components/PrivateRoute.js";
import Travaux from "./pages/Travaux.jsx";
import Session from "./pages/session/Session.jsx";
import Compte from "./pages/compte/Compte.jsx";
import InstallApp from "./pages/aide/InstallApp.jsx";
import Aide from "./pages/aide/Aide.jsx";

// import eruda from "eruda";

function App() {

    // document.body.style.zoom = "95%";

    // //console
    // let el = document.createElement('div');
    // document.body.appendChild(el);

    // eruda.init({
    //     container: el,
    //     tool: ['console', 'elements']
    // });

    return (
        <Routes>
            <Route exact path="/" element={<Inscription />} />
            <Route exact path="/inscription" element={<Inscription />} />
            <Route exact path="/cgu" element={<CGU />} />
            <Route exact path="/connexion" element={<Connexion />} />
            <Route exact path="/token/*" element={<Token />} />

            <Route path="/dashboard/*" element={<PrivateRoute />}>
                <Route exact path='/dashboard/*' element={<DashBoard />} />
            </Route>

            <Route path="/stats/*" element={<PrivateRoute />}>
                <Route exact path='/stats/*' element={<Stats />} />
            </Route>

            <Route path="/programme/*" element={<PrivateRoute />}>
                <Route exact path='/programme/*' element={<Travaux />} />
            </Route>

            <Route path="/programme/*" element={<PrivateRoute />}>
                <Route exact path='/programme/*' element={<Travaux />} />
            </Route>

            <Route path="/compte/*" element={<PrivateRoute />}>
                <Route exact path='/compte/*' element={<Compte />} />
            </Route>

            <Route path="/notifications/*" element={<PrivateRoute />}>
                <Route exact path='/notifications/*' element={<Travaux />} />
            </Route>

            <Route path="/aide" element={<PrivateRoute />}>
                <Route exact path='/aide' element={<Aide />} />
                <Route exact path='/aide/InstallApp/*' element={<InstallApp />} />
            </Route>

            <Route path="/session/*" element={<PrivateRoute />}>
                <Route exact path='/session/*' element={<Session />} />
            </Route>
        </Routes>
    );
};

export { App };