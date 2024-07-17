import { React, useState, useEffect } from "react";
import API from "../../utils/API";
import Select from "react-select";
import { customStyles, customStylesDark, customStylesMini, customStylesDarkMini } from "../../utils/customStyles";
import PoidsInput from "./PoidsInput";
import FullExerciceInput from "./FullExerciceInput"
import { v4 as uuidv4 } from 'uuid';
import { useSearchParams } from "react-router-dom";

function DebutantForm(props) {
    // console.log("debutant seance from props", props.seance)

    const [seance, setSeance] = useState(props.seance);
    const [params, setParams] = useState({ load: "" });
    const [searchParams, setSearchParams] = useSearchParams();

    async function handleClick() {
        event.preventDefault();
        let emptySerie = false
        let err = false;

        console.log("debutant recording seance", seance);

        //CONDITIONS
        if (seance.date === '' && err === false) {
            err = true;
            alert("Et c'était quand ça ? tu m'as pas dis la date !")
        }

        if (seance.poids === '' && err === false) {
            err = true;
            alert("Tu pèses combien ? Pas de tricherie avec moi tu m'as pas donné ton poids !")
        }

        if (seance.exercices.length === 0 && err === false) {
            err = true;
            alert("Ah bah super ta séance, y a aucun exo !")
        }

        seance.exercices.forEach(exercice => {
            if (Object.keys(exercice.Series).length === 0 && err === false) {
                err = true;
                alert("Faut avouer qu'un exercice sans série c'est pas commode !")
            }

            Object.values(exercice.Series).forEach(serie => {
                if (serie.repsTime === '' || serie.charge === '' || !serie.repsTime || !serie.charge && err === false) {
                    err = true;
                    alert("Une serie n'est pas remplie !")
                }
            })

            if (exercice.exercice.name === "title" && err === false) {
                err = true;
                alert("Une catégorie n'est pas un exercice voyons !")
            }

            if (exercice.exercice.name === "" && err === false) {
                err = true;
                alert("Tu m'as pas donné le nom de ton exo petit cachottier !")
            }
        });

        //API
        if (err === false) {
            let data;
            console.log(searchParams.get("seanceId"))

            if (searchParams.get("seanceId")) {
                data = await API.debutantform(
                    {
                        seance:
                            { ...seance, id: searchParams.get("seanceId") },
                        seanceId: searchParams.get("seanceId"),
                        id: localStorage.getItem("id")
                    });

                console.log(data.data)

                if (data.data.success === true) {
                    window.location = "/dashboard";
                } else {
                    alert(data.data.message);
                }
            }
            else {
                data = await API.debutantform(
                    {
                        seance: seance,
                        id: localStorage.getItem("id")
                    });

                if (data.data.success === true) {
                    window.location = "/dashboard";
                } else {
                    alert(data.data.message);
                }
            }
        }
    }

    function handleChangeDate(event) {
        event.preventDefault();

        setSeance(oldSeance => {
            return ({
                ...oldSeance,
                date: event.target.value,
            });
        })
    }

    function changePoids(poids) {
        event.preventDefault();

        setSeance(oldSeance => {
            return ({
                ...oldSeance,
                poids: poids,
            });
        })
    }

    function changeExercices(changedExercice, id) {
        let newSeance = { ...seance }
        let indexOfChg = seance.exercices.findIndex(ex => ex.id === id)

        newSeance.exercices.splice(indexOfChg, 1, changedExercice)

        setSeance(newSeance)
    }

    function onAddExercices(event) {
        event.preventDefault();

        let newS = { ...seance }

        newS = {
            ...newS,
            exercices: [...newS.exercices, { exercice: { name: "" }, Series: {}, id: uuidv4() }]
        }

        setSeance(newS)

    }

    function onInsertExercice(event) {
        event.preventDefault();

        let newS = { ...seance };
        let newE = { exercice: { name: "" }, Series: {}, id: uuidv4() };
        let indexInsert = parseInt(event.target.id) + 1;

        newS.exercices.splice(indexInsert, 0, newE)

        newS = {
            ...newS,
            exercices: newS.exercices
        }

        setSeance(newS)

    }

    function onDeleteExercices(id) {
        let newSeance = seance;
        let indexOfDel = seance.exercices.findIndex(ex => ex.id === id)

        //replace by nothing
        newSeance.exercices.splice(indexOfDel, 1)

        setSeance(oldSeance => {
            return ({
                ...oldSeance,
                exercices: newSeance.exercices
            })
        })
    }

    function handleChange(event) {
        setParams(oldParams => {
            return ({
                ...oldParams,
                [event.id]: event.value,
            })
        });
    }

    async function loadSeance(event) {
        event.preventDefault();

        const { data } = await API.loadSeance(params);
        if (data.success === false) {
            if (data.message === "Aucune séance !") {
                console.log(data.message);
            }
            else { alert(data.message); }
        } else {
            console.log("loaded seance", data.seance)
            if (data.seance) {
                if (data.seance.nom) {
                    props.loadExpert(data.seance)
                }
                else {
                    setSeance({ ...data.seance, id: uuidv4() })
                }
            }
            else {
                setSeance({ id: uuidv4(), date: "", poids: "", exercices: [] });
            }
        }
    }

    // useEffect(() => {
    //     if (props.seance !== seance) {
    //         setSeance(props.seance)
    //     }
    // }, [props.seance])

    return (
        <form className="debutant-form">

            <div className=" row">
                <div className="col-12 col-form-label" style={{ marginRight: "10px" }}>
                    <label>Séance précédente</label>
                    <div>
                        <Select
                            placeholder="Séance précédente à charger..."
                            onChange={handleChange}
                            options={[
                                { id: "load", label: "/ (défaut)", value: "title" },
                                { id: "load", label: "Dernière séance en date", value: "lastDate" },
                                { id: "load", label: "Dernière séance enregistrée", value: "lastRec" }
                            ]}
                            className="mini-margin-bottom"
                            styles={
                                props.dimensions.width <= 500 ?
                                    props.modeSombre === true ?
                                        customStylesDarkMini
                                        :
                                        customStylesMini
                                    :
                                    props.modeSombre === true ?
                                        customStylesDark
                                        :
                                        customStyles
                            }
                        />
                    </div>
                    <div>
                        <button className="btn btn-dark loadButton" onClick={loadSeance} type="submit">Charger la séance</button>
                    </div>
                </div>
            </div>

            <div className="DateInput form-group row">
                <div className="col-5 col-form-label" style={{ marginRight: "10px" }}>
                    <label >Date</label>
                    <div >
                        <input type="date"
                            className={props.modeSombre === true ? "form-control inputDark" : "form-control"}
                            value={seance.date}
                            onChange={handleChangeDate}
                            id="date"
                        />
                    </div>
                </div>

                <PoidsInput modeSombre={props.modeSombre} key={seance.id} poids={seance.poids} changePoids={changePoids} />
            </div>



            {seance?.exercices.map((exercice, index) => {
                return (
                    <div>
                        <FullExerciceInput
                            key={exercice.id}
                            id={exercice.id}
                            index={index}
                            dimensions={props.dimensions}
                            exercice={exercice}
                            poids={seance.poids}
                            changeExercices={changeExercices}
                            onDeleteExercices={onDeleteExercices}
                            modeSombre={props.modeSombre}
                        />

                        <button className="btn btn-dark form-button" id={index} onClick={onInsertExercice} type="submit">Insérer un exercice ici !</button>
                        <br />
                    </div>)
            })}

            <button className="btn btn-dark form-button" onClick={onAddExercices} type="submit">Ajouter un exercice à cette séance !</button>
            <br />

            <div className="form-button-div">
                <button className={props.modeSombre ? "btn btn-lg btn-black enregistrer-button large-margin-updown" : "btn btn-lg btn-white enregistrer-button large-margin-updown"} onClick={handleClick} type="submit">Enregistrer la séance !</button>
            </div>

            <div style={{ marginTop: "20%" }}></div>
        </form>
    )
};

export default DebutantForm;