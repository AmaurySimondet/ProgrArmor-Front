import { React, useState, useEffect } from 'react';
import Footer from '../Footer';
import NavigBar from '../NavigBar';
import { useSearchParams } from "react-router-dom";
import { writeSeries, writeCategories } from "../../utils/WriteExercice";
import { getReguScore, getPR } from "../../utils/stats";
import { getUser, getProgrammesByUser, getUserById } from "../../utils/user";

function Profil() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [userID, setUserID] = useState();
    const [user, setUser] = useState({});
    const [profile, setProfile] = useState();
    const [dimensions, setDimensions] = useState({
        height: window.innerHeight,
        width: window.innerWidth
    })
    const [lastSeance, setLastSeance] = useState();
    const [programmes, setProgrammes] = useState();
    const [PR, setPR] = useState();
    const [ReguScore, setReguScore] = useState();


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

    useEffect(() => {
        getUser(localStorage.getItem("id")).then((user) => {
            setUser(user);
        });
    }, []);

    useEffect(() => {
        setUserID(searchParams.get("id"));
    }, [searchParams])

    useEffect(() => {

        if (userID) {
            getUserById(userID).then((obj) => {
                setProfile(obj.profile);
                setLastSeance(obj.lastSeance);
            });
            getProgrammesByUser(userID).then((programmes) => {
                setProgrammes(programmes);
            });
            getPR(userID).then((PR) => {
                setPR(PR);
            });
            getReguScore(userID).then((ReguScore) => {
                setReguScore(ReguScore);
            });
            console.log("userID", userID);
        }

    }, [userID])

    useEffect(() => {
        if (lastSeance) {
            console.log("lastSeance", lastSeance);
        }
    }, [lastSeance])

    return (
        <div>
            <NavigBar />

            <div className='basic-div basic-flex2'>

                <div className="form-group row large-margin-bottom">
                    <label className="col-form-label">
                        Rechercher un utilisateur:
                    </label>

                    <input type="text" className={user.modeSombre ? "form-control inputDark" : "form-control"}
                        placeholder="ID utilisateur"
                        onChange={(e) => setSearchParams({ id: e.target.value })} />

                </div>

                <br />

                {userID ?
                    profile ?
                        <div className='Profile'
                            style={user.modeSombre ? null : { backgroundColor: "#9b0000", border: "black" }}>
                            <div className='basic-flexed2' style={{ marginTop: "40px" }}>

                                <img
                                    src={profile.profilePic}
                                    className="profile-pic"
                                    style={{ margin: "auto 2vw" }}
                                    alt="profilePic"
                                />

                                <h1
                                    style={{ margin: "auto 2vw" }}>{profile.fName} {profile.lName}
                                </h1>

                            </div>

                            <br />

                            <div className='basic-flexed2' style={{ marginBottom: "40px" }}>
                                <p style={{ margin: "auto 2vw" }}>
                                    Abonnés : {"{à venir}"}
                                </p>

                                <button style={{ margin: "auto 2vw" }}
                                    className="btn btn-dark large-margin-bottom" disabled>
                                    S'abonner
                                </button>
                            </div>

                            <br />

                            <div className={dimensions.width > 900 ? 'basic-flexed2' : ""} style={{ marginBottom: "40px" }} >

                                {/* PROGRAMMES */}
                                <div className={dimensions.width > 900 ? 'section' : "smartphoneSection"}>
                                    <h2 style={{ margin: "auto 2vw" }}>Programmes:</h2>

                                    <br />


                                    <ul>
                                        {programmes.length > 0 ? programmes.map((programme, index) => {
                                            return (
                                                <li key={index}>
                                                    <a href={`/programme?programmeId=${programme._id}`}
                                                        style={{ color: "#ff0000" }}>
                                                        {programme.titre}
                                                    </a>
                                                </li>
                                            )
                                        }) :
                                            <li><p>Aucun programme</p></li>}
                                    </ul>

                                </div>

                                {/* LAST SEANCE */}
                                <div className={dimensions.width > 900 ? 'section' : "smartphoneSection"}>
                                    <h2 style={{ margin: "auto 2vw" }}>Dernière séance:</h2>

                                    <br />


                                    <div className='lastSeance'>
                                        <h3 style={{ margin: "0" }}>{lastSeance.date}</h3>
                                        {lastSeance.exercices.map((exercice, index) => {
                                            return (
                                                <div key={index} style={{ marginBottom: "20px" }}>
                                                    <p style={{ margin: "0", fontWeight: "500", color: "#ffa5a5" }}>{exercice.exercice.name}</p>

                                                    {exercice.Categories ?
                                                        <p style={{ margin: "0" }}>{writeCategories(Object.values(exercice.Categories))}</p>
                                                        : null}

                                                    {Object.values(exercice.Series).length > 0 ?
                                                        <p style={{ margin: "0" }}>{writeSeries(Object.values(exercice.Series))}</p>

                                                        : null}
                                                </div>
                                            )
                                        })}
                                    </div>

                                </div>

                                {/* STATS */}
                                <div className="smartphoneSection">
                                    <h2 style={{ margin: "auto 2vw" }}>Statistiques:</h2>

                                    <br />


                                    <ul>
                                        <li> Lorem ipsum </li>
                                        <li> Lorem ipsum </li>
                                        <li> Lorem ipsum </li>
                                        <li> Lorem ipsum </li>
                                        <li> Lorem ipsum </li>
                                    </ul>

                                </div>
                            </div>

                            {/* PR */}
                            <div className='basic-flexed2' style={{ marginBottom: "40px" }}>
                                <div>
                                    <h2 style={{ margin: "auto 2vw" }}>Records Personnels:</h2>

                                    <br />

                                    <h3 style={{ margin: "auto 2vw" }}>1-3 répétitions:</h3>
                                    <ol>
                                        {PR?.PR13?.length > 0 ? PR.PR13.map((pr, index) => {
                                            return (
                                                <li key={index}>
                                                    <p>
                                                        <div style={{ fontWeight: "500" }}>
                                                            {pr.exercice} {pr.categories ? ", " + pr.categories : null}
                                                        </div>



                                                        {pr.reps}x{pr.charge}kg ({pr.percent}%)
                                                    </p>
                                                </li>
                                            )
                                        })
                                            :
                                            <li><p>Aucun record personnel</p></li>}

                                    </ol>

                                    <br />

                                    <h3 style={{ margin: "auto 2vw" }}>3-6 répétitions:</h3>
                                    <ol>
                                        {PR?.PR36?.length > 0 ? PR.PR36.map((pr, index) => {
                                            return (
                                                <li key={index}>
                                                    <p>
                                                        <div style={{ fontWeight: "500" }}>
                                                            {pr.exercice} {pr.categories ? ", " + pr.categories : null}
                                                        </div>



                                                        {pr.reps}x{pr.charge}kg ({pr.percent}%)
                                                    </p>
                                                </li>
                                            )
                                        })
                                            :
                                            <li><p>Aucun record personnel</p></li>}
                                    </ol>

                                    <br />

                                    <h3 style={{ margin: "auto 2vw" }}>6-12 répétitions:</h3>
                                    <ol>
                                        {PR?.PR612?.length > 0 ? PR.PR612.map((pr, index) => {
                                            return (
                                                <li key={index}>
                                                    <p>
                                                        <div style={{ fontWeight: "500" }}>
                                                            {pr.exercice} {pr.categories ? ", " + pr.categories : null}
                                                        </div>



                                                        {pr.reps}x{pr.charge}kg ({pr.percent}%)
                                                    </p>
                                                </li>
                                            )
                                        })
                                            :
                                            <li><p>Aucun record personnel</p></li>}
                                    </ol>

                                    <br />

                                    <h3 style={{ margin: "auto 2vw" }}>12+ répétitions:</h3>
                                    <ol>
                                        {PR?.PR12?.length > 0 ? PR.PR12.map((pr, index) => {
                                            return (
                                                <li key={index}>
                                                    <p>
                                                        <div style={{ fontWeight: "500" }}>
                                                            {pr.exercice} {pr.categories ? ", " + pr.categories : null}
                                                        </div>



                                                        {pr.reps}x{pr.charge}kg ({pr.percent}%)
                                                    </p>
                                                </li>
                                            )
                                        })
                                            :
                                            <li><p>Aucun record personnel</p></li>}
                                    </ol>


                                </div>
                            </div>


                        </div>








                        : <h1 style={{ height: "auto" }}>Utilisateur introuvable</h1>
                    : <h1>Aucun utilisateur selectionné</h1>}




            </div>

            <Footer />
        </div>
    )
}

export default Profil;