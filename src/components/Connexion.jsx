import { React, useState, useEffect } from "react";
import HomeHeader from "./HomeHeader.jsx"
import BoutonsSociaux from "./BoutonsSociaux.jsx"
import ConnexionForm from "./ConnexionForm.jsx"
import Footer from "./Footer.jsx";
import API from "../utils/API.js";
import emailjs from 'emailjs-com';
import { v4 as uuidv4 } from 'uuid';

function Connexion() {
    const [mdpClicked, setMdpClicked] = useState(false);
    const [email, setEmail] = useState("");
    const [timer, setTimer] = useState(60);
    const [sentClicked, setSentClicked] = useState(false);
    const [intervalId, setIntervalId] = useState(0);
    const [code, setCode] = useState("");
    const [codeEmail, setCodeEmail] = useState("");
    const [newMDP, setNewMDP] = useState("");
    const [confirmMDP, setConfirmMDP] = useState("");
    const [dimensions, setDimensions] = useState({
        height: window.innerHeight,
        width: window.innerWidth
    })
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


    function handleClickMdp() {
        setMdpClicked(!mdpClicked);
    }

    //RECUPERATION EMAIL
    async function sendRecuperationEmail(req, res) {
        // res.json({ success: true, message: "Email envoyé !" })

        const service_id = "service_crf18d7"
        const template_id = "template_mg1f8tg"
        const publicKey = "oLFuFSUDmzcbeaA1W"
        const code = uuidv4().slice(0, 8);
        setCode(code);

        const message = "Voici ton code de récupération :\n" + code;

        const templateParams = {
            to_name: req.fName,
            message: message,
            to_email: req.email
        };

        try {
            emailjs.send(service_id, template_id, templateParams, publicKey)
                .then(function (response) {
                    console.log('SUCCESS!', response.status, response.text);
                }, function (err) {
                    console.log('FAILED...', err);
                });
        }
        catch (e) {
            console.log(e);
        }

    }

    async function handleForgotPassword() {
        const { data } = await API.getUser({ email: email });

        if (data.success === true) {
            setSentClicked(true);
            launchTimer();
            let fName = data.profile.fName;

            sendRecuperationEmail({ fName: fName, email: email });
        }
        else {
            alert("Aucune adresse mail correspondante");
        }
    }

    function launchTimer() {
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(0);
        }

        let newInterval = setInterval(() => {
            setTimer(timer => timer - 1);
        }, 1000);
        setIntervalId(newInterval);
    }

    function containsSC(str) {
        const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        return specialChars.test(str);
    }

    useEffect(() => {
        if (timer <= 0) {
            setSentClicked(false);
            setTimer(60);
        }
    }, [timer]);

    async function handleApplyNewMDP() {
        let error = false;

        if (newMDP !== confirmMDP) {
            alert("Les mots de passe ne correspondent pas");
            error = true;
        }
        if (newMDP.length < 8) {
            alert("Le mot de passe doit contenir au moins 8 caractères");
            error = true;
        }
        if (codeEmail !== code) {
            alert("Le code est incorrect");
            error = true;
        }
        if (containsSC(newMDP) === false) {
            alert("Le mot de passe doit contenir au moins un caractère spécial");
            error = true;
        }

        if (error === false) {
            const { data } = await API.resetPassword({ email: email, password: newMDP });
            if (data.success === true) {
                alert("Mot de passe modifié");
                setMdpClicked(false);
            }
            else {
                alert("Erreur lors de la modification du mot de passe");
            }
        }
    }



    return (
        <div>
            <HomeHeader />

            <div className="tr-connexion">
                {dimensions.width > 900 ?
                    <div className="connexion-img-div" style={{ flexBasis: "35%" }}>
                        <img className="connexion-img" src={require('../images/connexion.webp')} alt="ad" />
                    </div>
                    : null}

                <div style={{ flexGrow: "1" }} className="huge-margin-bottom">

                    {mdpClicked ?
                        <div className="basic-div">

                            <h1 className="h1-inscription"> J'y penses et puis j'oublie </h1>
                            <h2 className="h2-inscription"> Je t'envoies un mail de récupération chef </h2>

                            <button onClick={handleClickMdp}
                                className="btn btn-dark large-margin-updown">
                                Retour </button>

                            <input
                                className="form-control"
                                placeholder="Ton email"
                                type="email"
                                onChange={e => setEmail(e.target.value)}
                            ></input>

                            {sentClicked ?
                                <div>
                                    <p className="basic-margin-top">
                                        Un mail de récupération a été envoyé à l'adresse
                                        <br />
                                        {" " + email + " "}
                                        <br />
                                        Vérifies tes spams aussi au cas où !
                                        <br />
                                        Tu pourras renvoyer un mail dans 60 secondes.
                                    </p>

                                    <button className="btn btn-dark basic-margin-updown" disabled>
                                        {timer}
                                    </button>

                                </div>
                                :
                                <button
                                    onClick={handleForgotPassword}
                                    className="btn btn-dark basic-margin-top large-margin-bottom">
                                    Envoyer </button>
                            }

                            <input
                                className="form-control mini-margin-bottom"
                                placeholder="Code email"
                                onChange={e => setCodeEmail(e.target.value)}
                            ></input>

                            <input
                                className="form-control mini-margin-bottom"
                                placeholder="Nouveau mot de passe"
                                type="password"
                                onChange={e => setNewMDP(e.target.value)}
                            ></input>

                            <input
                                className="form-control mini-margin-bottom"
                                placeholder="Confirme ton mot de passe"
                                type="password"
                                onChange={e => setConfirmMDP(e.target.value)}
                            ></input>

                            <button
                                onClick={handleApplyNewMDP}
                                className="btn btn-dark large-margin-updown">
                                Appliquer </button>

                        </div>

                        :
                        <div className="basic-div">
                            <div>
                                <h1 className="h1-inscription">{"On s'connait non ?"}</h1>
                                <h2 className="h2-inscription">Connexion</h2>
                            </div>

                            <BoutonsSociaux inscription={false} />

                            <ConnexionForm handleClickMdp={handleClickMdp} />
                        </div>

                    }


                </div>
            </div>

            <Footer />
        </div>
    )
}

export default Connexion