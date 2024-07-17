import SerieInput from "./SerieInput";
import CategorieInput from "./CategorieInput";
import { React, useState, useEffect } from "react";
import ExerciceEchauffementInput from "./ExerciceEchauffementInput";
import { v4 as uuidv4 } from 'uuid';

function EchauffementInput(props) {
    const [series, setSeries] = useState([...Object.values(props.echauffement.Series)]);
    const [categories, setCategories] = useState([...Object.values(props.echauffement.Categories)]);
    const [echauffement, setEchauffement] = useState(props.echauffement);
    const [clickExercice, setClickExercice] = useState(props.click);

    function handleClickExercice() {
        setClickExercice(!clickExercice);

    }


    function changeEchauffement(echauffement) {
        setEchauffement(oldEchauffement => {
            return ({
                ...oldEchauffement,
                echauffement: echauffement,
            });
        });
    }

    function writeSeries(series) {
        let sameReps = true;
        let sameCharge = true;

        let reps = series[0].repsTime;
        let charge = series[0].charge;
        series.map((serie, index) => {
            if (index > 0) {
                if (serie.repsTime !== reps) {
                    sameReps = false;
                }
                if (serie.charge !== charge) {
                    sameCharge = false;
                }
            }
        })

        if (sameReps && sameCharge) {
            return series.length + "x" + reps + "x" + charge;
        }
        else {
            let text = "";
            series.map((serie, index) => {
                if (index > 0) {
                    text += "\n";
                }
                if (index !== series.length - 1) {
                    text += "1x" + serie.repsTime + "x" + serie.charge + ", ";
                }
                else {
                    text += "1x" + serie.repsTime + "x" + serie.charge;
                }
            })
            return text;
        }
    }

    useEffect(() => {
        const Series = { ...series };
        const Categories = { ...categories };
        const Echauffement = { ...echauffement, Series, Categories };
        props.changeEchauffements(Echauffement, props.id);
    }, [echauffement, series, categories])

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

    function changeCategorie(changedC, id) {
        let newC = [...categories]
        let indexOfChg = newC.findIndex(c => c.id === id)

        newC.splice(indexOfChg, 1, changedC)

        setCategories(newC)
    }

    function onAddCategorie(event) {
        event.preventDefault();

        let newC = [...categories]

        newC.push({ id: uuidv4() })

        setCategories(newC)
    }

    function onDeleteCategorie(id) {
        let newC = [...categories];
        let indexOfDel = newC.findIndex(c => c.id === id)

        //replace by nothing
        newC.splice(indexOfDel, 1)

        setCategories(newC);
    }

    return (
        <div className="exercice-div">
            <hr className={props.modeSombre === true ? "hr-exercice-dark " : "hr-exercice"} />

            <ExerciceEchauffementInput
                id={props.id} key={props.id} onClickExercice={handleClickExercice} echauffement={echauffement.echauffement}
                clickExercice={clickExercice} value={echauffement.exercice} index={props.index}
                onDeleteEchauffements={props.onDeleteEchauffements} changeEchauffement={changeEchauffement}
                modeSombre={props.modeSombre} dimensions={props.dimensions}
            />

            {clickExercice ?
                <div>
                    {categories ? categories.map((categorie, index) => {
                        return (
                            <div>
                                <hr className={props.modeSombre === true ? "hr-serie-dark " : "hr-serie"} />

                                <CategorieInput
                                    key={categorie.id}
                                    id={categorie.id}
                                    index={index}
                                    dimensions={props.dimensions}
                                    categorie={categorie}
                                    exercice={echauffement.echauffement}
                                    changeCategorie={changeCategorie}
                                    onDeleteCategorie={onDeleteCategorie}
                                    modeSombre={props.modeSombre}
                                />

                            </div>
                        );
                    })
                        : null}


                    <button className="btn btn-dark form-button" onClick={onAddCategorie} type="submit">Ajouter une categorie à cet exercice !</button>
                    <br />


                    {
                        series ? series.map((serie, index) => {
                            return (
                                <div>
                                    <hr className={props.modeSombre === true ? "hr-serie-dark " : "hr-serie"} />

                                    <SerieInput
                                        key={serie.id}
                                        id={serie.id}
                                        index={index}
                                        serie={serie}
                                        length={series.length}
                                        exercice={echauffement.echauffement}
                                        poids={props.poids}
                                        onAddSerie={onAddSerie}
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
                :
                <div>
                    {"Catégories: "}

                    <br />

                    {categories ? categories.map((categorie, index) => {
                        if (categorie.name !== "Elastique") {
                            if (index === categories.length - 1) {
                                return categorie.input
                            }
                            else {
                                return categorie.input + ", "
                            }
                        }
                        else {
                            if (index === categories.length - 1) {
                                if (categorie.input === "mesure") {
                                    return "{" + categorie.utilisation + ";" + categorie.estimation + ";mesure=" + categorie.estimation + "}"
                                }
                                else {
                                    return "{" + categorie.utilisation + ";" + categorie.input + ";tension=" + categorie.estimation + "}"
                                }
                            }
                            else {
                                if (categorie.input === "mesure") {
                                    return "{" + categorie.utilisation + ";" + categorie.estimation + ";mesure=" + categorie.estimation + "}, "
                                }
                                else {
                                    return "{" + categorie.utilisation + ";" + categorie.input + ";tension=" + categorie.estimation + "}, "
                                }
                            }
                        }
                    })
                        : null}

                    <br />
                    <br />

                    {series.length > 0 ?
                        <div>
                            {"Séries: "}
                            <br />
                            {writeSeries(series)}
                        </div>
                        : null}
                </div>
            }


        </div>
    )
}

export default EchauffementInput;