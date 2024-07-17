import { React, useState, useEffect } from 'react';
import Select from 'react-select';
import { customStyles, customStylesDark, customStylesMini, customStylesDarkMini } from '../../utils/customStyles';
import Periodisation from './Periodisation';
import { v4 as uuidv4 } from 'uuid';
import TypesDeProgrammes from './Programme/TypeDeProgrammes'
import Niveaux from './Programme/Niveaux'
import ProgrammeMateriel from './Programme/ProgrammeMateriel';
import Footer from '../Footer';
import NavigBar from '../NavigBar';
import API from '../../utils/API';
import { useSearchParams } from 'react-router-dom';
import { programmeContainErr } from '../../utils/verifications';
import { getUser } from '../../utils/user';
import { styleOnDim } from '../../utils/styling';
import adminProgramme from '../../data/adminProgramme';

function ProgrammeCreator(props) {
    const [periodisationsClosed, setPeriodisationsClosed] = useState(false);
    const [programme, setProgramme] = useState({
        id: uuidv4(),
        titre: "",
        description: "",
        type: { id: "", label: "", value: "" },
        niveau: { id: "", label: "", value: "" },
        duree: "0",
        materiel: [],
        programme: [{
            id: uuidv4(),
            seances: [
                {
                    id: uuidv4(), exercices: []
                }
            ],
            cycle: "",
        }]
    });
    const [user, setUser] = useState({ modeSombre: false });
    const [searchParams, setSearchParams] = useSearchParams();

    async function loadProgrammeIfParams() {
        if (searchParams.get("programmeId")) {
            const { data } = await API.getProgramme({
                programmeId: searchParams.get("programmeId"),
                createdBy: localStorage.getItem("id")
            });

            if (data.success === false) {
                if (data.message === "Aucun programme !") {
                    console.log(data.message);
                }
                else { alert(data.message); }
            }

            else {
                if (data.programme) {
                    setProgramme(data.programme);
                    console.log("programme", data.programme);
                }
            }
        }
    }

    useEffect(() => {
        getUser(localStorage.getItem("id")).then((user) => {
            setUser(user);
        });
    }, []);

    useEffect(() => {
        loadProgrammeIfParams();
    }, []);


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

    function handleChange(event) {
        if (event.target) {
            if (event.target.id === "titre") {
                setProgramme({ ...programme, titre: event.target.value });
            } else if (event.target.id === "description") {
                setProgramme({ ...programme, description: event.target.value });
            } else if (event.target.id === "duree") {
                setProgramme({ ...programme, duree: event.target.value });
            }
        }
        else {
            if (event.id === "type") {
                setProgramme({ ...programme, type: event });
            }
            if (event.id === "niveaux") {
                setProgramme({ ...programme, niveau: event });
            }
            if ((event.length > 0 && event[0])) {
                if (event[0].id === "materiel") {
                    setProgramme({ ...programme, materiel: event });
                }
            }
            if (event.length === 0) {
                setProgramme({ ...programme, materiel: [] });
            }
        }
    }

    function addPeriodisation() {
        setProgramme({
            ...programme,
            programme: [...programme.programme, { id: uuidv4(), seances: [], cycle: "" }]
        });
    }

    function handleDeletePeriodisation(id) {
        setProgramme({
            ...programme,
            programme: programme.programme.filter(periodisation => periodisation.id !== id)
        });
    }

    function closingPeriodisations() {
        setPeriodisationsClosed(!periodisationsClosed);
    }

    function printProgramme() {
        console.log(programme);
    }

    async function sendProgramme() {
        console.log("sendProgramme", programme);

        console.log("programmeContainErr", programmeContainErr(programme));
        if (programmeContainErr(programme).err === true) {
            alert(programmeContainErr(programme).alertMessage);
        } else {
            let periodisationsSeances = [];
            programme.programme.forEach(periodisation => {
                periodisationsSeances.push(periodisation.seances.length);
            });

            let objSent = {
                programmeId: programme.id,
                titre: programme.titre,
                description: programme.description,
                type: programme.type.value,
                niveau: programme.niveau.value,
                duree: programme.duree,
                materiel: programme.materiel,
                programme: programme.programme,
                createdBy: localStorage.getItem("id"),
                seancesSemaine: Math.max(...periodisationsSeances),
                seancesTotal: periodisationsSeances.reduce((a, b) => a + b, 0)
            }

            const { data } = await API.createProgramme(objSent);

            if (data.success === false) {
                if (data.message === "Creation programme ratée !") {
                    console.log(data.message);
                }
                else { alert(data.message); }
            }
            else {
                window.location = "/programme";
            }

        }
    }



    function writePeriodisation(id, seances) {
        setProgramme({
            ...programme,
            programme: programme.programme.map(periodisation => {
                if (periodisation.id === id) {
                    periodisation.seances = seances;
                }
                return periodisation;
            })
        });
    }

    function writeCycle(id, value) {
        setProgramme({
            ...programme,
            programme: programme.programme.map(periodisation => {
                if (periodisation.id === id) {
                    periodisation.cycle = value;
                }
                return periodisation;
            })
        });
    }

    function adminLoadProgramme() {
        let obj = adminProgramme;
        let newObj = {};
        Object.keys(obj).forEach(key => {
            newObj[key] = obj[key];
        });
        newObj.id = uuidv4();
        setProgramme(newObj)

    }

    return (
        <div>
            <NavigBar />

            <div className="basic-div">
                <div style={{ display: "flex", alignItems: "center" }} className="large-margin-top">
                    <div style={{ paddingRight: "40px" }}>
                        <button className="btn btn-dark" onClick={() => { window.location = "/programme" }}> Retour en arrière </button>
                        <p> <i> Toute progression sera perdue </i> </p>
                    </div>

                    <h1>Enregistre ton programme !</h1>
                </div>



                <div>
                    <button className='btn btn-black block basic-margin-bottom-and-auto'
                        onClick={adminLoadProgramme}>
                        Admin: Charger programme type
                    </button>

                    <div className='form-group row'>
                        <div className='col-12 basic-margin-updown'>
                            <label>Titre</label>
                            <input type="text"
                                onChange={handleChange}
                                id="titre"
                                placeholder="FullStack... heu je veux dire FullBody"
                                className={user.modeSombre ? 'form-control inputDark' : 'form-control'} value={programme.titre} />
                        </div>

                        <div className='col-12 basic-margin-updown'>
                            <label>Description</label>
                            <textarea type="text"
                                onChange={handleChange}
                                id="description"
                                placeholder="Vous savez, le truc qui explique ce que c'est"
                                className={user.modeSombre ? 'form-control inputDark' : 'form-control'}
                                value={programme.description} />
                        </div>

                        <div className='col-4 basic-margin-updown'>
                            <label> Type de programme </label>
                            <Select options={TypesDeProgrammes}
                                placeholder="Type de programme..."
                                onChange={handleChange}
                                value={{ id: programme.type.id, label: programme.type.label, value: programme.type.value }}
                                styles={styleOnDim(dimensions, user)} />
                        </div>

                        <div className='col-4 basic-margin-updown'>
                            <label> Niveau </label>
                            <Select options={Niveaux}
                                placeholder="Niveau..."
                                onChange={handleChange}
                                value={{ id: programme.niveau.id, label: programme.niveau.label, value: programme.niveau.value }}
                                styles={styleOnDim(dimensions, user)} />
                        </div>

                        <div className='col-4 basic-margin-updown'>
                            <label> Durée max d'une séance </label>
                            <input
                                type="number"
                                onChange={handleChange}
                                id="duree"
                                placeholder="En minutes"
                                style={{ textAlign: 'center', height: "50px" }}
                                className={user.modeSombre ? 'form-control inputDark' : 'form-control'}
                                value={programme.duree} />
                        </div>

                        <div className="col-12">
                            <label className="col-form-label">Materiel</label>
                            <Select
                                isMulti
                                onChange={handleChange}
                                id="materiel"
                                value={programme.materiel}
                                options={ProgrammeMateriel}
                                styles={styleOnDim(dimensions, user)}
                                placeholder="Tout (défaut)"
                            />
                        </div>
                    </div>

                    <button className='btn btn-dark block large-margin-updown'
                        onClick={closingPeriodisations} disabled={programme.programme.length > 0 ? false : true}>
                        {periodisationsClosed ? "Ouvrir toutes les periodisations" : "Résumer toutes les periodisations"}
                    </button>

                    {programme.programme?.map((periodisation, index) => {
                        return (
                            <div>
                                <Periodisation
                                    key={periodisation.id}
                                    id={periodisation.id}
                                    periodisation={periodisation}
                                    index={index}
                                    length={programme.programme.length}
                                    modeSombre={user.modeSombre}
                                    closedPeriodisation={periodisationsClosed}
                                    writePeriodisation={writePeriodisation}
                                    handleDeletePeriodisation={handleDeletePeriodisation}
                                    writeCycle={writeCycle}
                                />
                                <hr className='hr-detail large-margin-top' />
                            </div>
                        )
                    })
                    }

                    <button className='btn btn-dark block large-margin-updown'
                        style={{ marginLeft: "0" }}
                        onClick={addPeriodisation}>
                        Ajouter une périodisation
                    </button>

                    <button className='btn btn-dark block large-margin-updown'
                        onClick={closingPeriodisations} disabled={programme.programme.length > 0 ? false : true}>
                        {periodisationsClosed ? "Ouvrir toutes les periodisations" : "Résumer toutes les periodisations"}
                    </button>

                    <button className='btn btn-black block large-margin-updown'
                        onClick={sendProgramme}>
                        Enregistrer le programme !
                    </button>
                </div>
            </div>

            <Footer />
        </div>


    )
}

export default ProgrammeCreator;