import { React, useState, useEffect } from 'react';

import FullExerciceExpertInput from './FullExerciceExpertInput';
import { v4 as uuidv4 } from 'uuid';
import { writeExercice, writeExercicesHtml } from "../../utils/WriteExercice";

function SeanceOfProgramme(props) {

    const [seance, setSeance] = useState(props.seance);
    const [clickSeance, setClickSeance] = useState(false);
    const [exerciceInSeance, setExerciceInSeance] = useState({});

    function handleClickSeance() {
        setClickSeance(!clickSeance);
    }

    useEffect(() => {
        props.writeSeance(props.id, seance);
    }, [seance]);

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

    function handleClickPoubelle() {
        props.handleDeleteSeance(props.id);
    }

    function changeExercices(changedExercice, id) {
        let newSeance = { ...seance }
        let indexOfChg = seance.exercices.findIndex(ex => ex.id === id)

        newSeance.exercices.splice(indexOfChg, 1, changedExercice)

        setSeance(newSeance)
    }

    function handleChange(event) {
        if (event.target) {
            if (event.target.id === "jourDeRepos") {
                setSeance(oldSeance => {
                    return ({
                        ...oldSeance,
                        jourDeRepos: event.target.value
                    })
                })
            }
        }
    }

    function onAddExercices(event) {
        event.preventDefault();

        let newS = { ...seance }

        newS = {
            ...newS,
            exercices: [...newS.exercices, { exercice: { name: "" }, Series: {}, Categories: {}, id: uuidv4() }]
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

    function writeExerciceInSeance(exercice, id) {
        let jsonExercices = exerciceInSeance;
        jsonExercices[id] = writeExercice(exercice);
        setExerciceInSeance(jsonExercices);
    }

    useEffect(() => {
        if (props.closed !== clickSeance) {
            setClickSeance(props.closed)
        }
    }, [props.closed])


    return (
        <div>

            <div>

                {props.closedPeriodisation ?
                    <p style={{ fontWeight: "800" }}> Seance {props.index + 1}: </p>
                    :
                    <div>
                        <h2 id="seanceTitle" style={{ display: "inline-block" }}
                            onClick={handleClickSeance} className="basic-margin-bottom">
                            Seance {props.index + 1}
                            <img className={clickSeance ? "expert-toggle rotated" : "expert-toggle not-rotated"}
                                src={require('../../images/icons/icons8-expand-arrow-90.webp')} />
                        </h2>

                        <img className={props.modeSombre === true ? "poubelleDark " : "poubelle"}
                            onClick={handleClickPoubelle}
                            style={{ float: "right", display: "inline-block", height: "10%", marginTop: "2%" }}
                            src={require('../../images/icons/icons8-trash-30.webp')}
                            alt="Poubelle" />
                    </div>
                }

                {clickSeance ?
                    writeExercicesHtml(exerciceInSeance, props.length, props.index)
                    :
                    seance.exercices ? seance.exercices.map((exercice, index) => {
                        return (
                            <div>
                                <FullExerciceExpertInput
                                    changeExercices={changeExercices}
                                    click={true}
                                    dimensions={dimensions}
                                    exercice={exercice}
                                    id={exercice.id}
                                    index={index}
                                    key={exercice.id}
                                    modeSombre={props.modeSombre}
                                    onDeleteExercices={onDeleteExercices}
                                    poids={seance.poids}
                                    programme={true}
                                    writeExerciceInSeance={writeExerciceInSeance}
                                />

                                <button className="btn btn-dark form-button large-margin-bottom" id={index} onClick={onAddExercices} type="submit">Ajouter un exercice</button>
                                <br />
                            </div>)
                    }) : null
                }

            </div>

            {props.closedPeriodisation ? null :
                seance.exercices[0] ? null
                    : <button className="btn btn-dark form-button large-margin-bottom" onClick={onAddExercices} type="submit">Ajouter un exercice</button>
            }

            {props.closedPeriodisation ? null :
                clickSeance ? null :
                    <div className="col-12">
                        <label className="col-form-label"
                            style={{ fontWeight: "800" }}>
                            Jour de repos avant séance suivante (maximum)
                        </label>
                        <input
                            type="number"
                            onChange={handleChange}
                            id="jourDeRepos"
                            placeholder="42"
                            style={{ textAlign: 'center', height: "50px" }}
                            className={props.modeSombre ? 'form-control inputDark' : 'form-control'}
                            value={seance.jourDeRepos} />
                    </div>
            }

        </div>
    )
}

export default SeanceOfProgramme;