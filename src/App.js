import { React } from "react";
import { Route, Routes } from "react-router-dom";
import DashBoard from "./pages/dashboard/DashBoard.jsx";
import Inscription from "./components/Inscription";
import Connexion from "./components/Connexion";
import CGU from "./components/CGU";
import Token from "./components/Token";

import Stats from "./components/Dashboard/Stats";
import PrivateRoute from "./components/PrivateRoute.js";
import Travaux from "./components/Dashboard/Travaux";
import Session from "./pages/session/Session.jsx";
import Compte from "./pages/compte/Compte.jsx";
import Admin from "./components/Dashboard/Admin.jsx";
import InstallApp from "./components/Dashboard/Help/InstallApp.jsx";
import Aide from "./components/Dashboard/Aide.jsx";

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

            <Route path="/admin" element={<PrivateRoute />}>
                <Route exact path='/admin' element={<Admin />} />
            </Route>
        </Routes>
    );
};

export { App };