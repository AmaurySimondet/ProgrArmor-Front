import ExerciceInput from "./ExerciceInput";
import SerieInput from "./SerieInput";
import { React, useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';

function FullExerciceInput(props) {

    const [series, setSeries] = useState([...Object.values(props.exercice.Series)]);
    const [fullExercice, setFullExercice] = useState(props.exercice);

    function changeExercice(exercice) {
        setFullExercice(oldFullExercice => {
            return ({
                ...oldFullExercice,
                exercice: exercice,
            });
        });
    }

    useEffect(() => {
        const Series = { ...series };
        const Exercice = { ...fullExercice, Series };
        props.changeExercices(Exercice, props.id);
    }, [fullExercice, series])

    function changeSerie(changedS, id) {
        let newS = [...series]
        let indexOfChg = newS.findIndex(ex => ex.id === id)

        newS.splice(indexOfChg, 1, changedS)

        setSeries(newS)
    }

    function onAddSerie(event) {
        event.preventDefault();

        let newSerie = [...series]

        newSerie.push({ id: uuidv4(), typeSerie: "reps", repsTime: "", charge: "", percent: "" })

        setSeries(newSerie)
    }

    function onCopySerie(event) {
        event.preventDefault();

        let newSeries = [...series]

        let last = {}
        if (newSeries[newSeries.length - 1]) {
            last = {
                ...newSeries[newSeries.length - 1],
                id: uuidv4()
            }
        }
        else {
            last = { id: uuidv4(), typeSerie: "reps", repsTime: "", charge: "", percent: "" }
        }

        newSeries.push(last)

        setSeries(newSeries)
    }

    function onDeleteSerie(id) {
        let newSeries = [...series];
        let indexOfDel = newSeries.findIndex(s => s.id === id)

        //replace by nothing
        newSeries.splice(indexOfDel, 1)

        setSeries(newSeries);
    }

    return (
        <div className="exercice-div">
            <hr className={props.modeSombre === true ? "hr-exercice-dark" : "hr-exercice"} />

            <ExerciceInput debutant={true} key={props.id} index={props.index}
                value={fullExercice.exercice} id={props.id} onDeleteExercices={props.onDeleteExercices}
                changeExercice={changeExercice} exercice={fullExercice.exercice} modeSombre={props.modeSombre}
                dimensions={props.dimensions}
            />

            {series ? series.map((serie, index) => {
                return (
                    <div>
                        <hr className={props.modeSombre === true ? "hr-serie-dark" : "hr-serie"} />

                        <SerieInput
                            key={serie.id}
                            id={serie.id}
                            index={index}
                            serie={serie}
                            length={series.length}
                            exercice={fullExercice.exercice}
                            poids={props.poids}
                            changeSerie={changeSerie}
                            onDeleteSerie={onDeleteSerie}
                            modeSombre={props.modeSombre}
                        />
                    </div>
                );
            })
                : null
            }

            <button className="btn btn-dark form-button" onClick={onAddSerie} type="submit">Ajouter une série !</button>
            <button className="btn btn-dark form-button copy-btn" onClick={onCopySerie} type="submit">Recopier la série !</button>
            <br />
        </div>
    )
}

export default FullExerciceInput;