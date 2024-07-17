import ExerciceInput from "./ExerciceInput";
import SerieInput from "./SerieInput";
import CategorieInput from "./CategorieInput";
import { React, useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { writeSeries, writeCategories } from "../../utils/WriteExercice";

function FullExerciceInput(props) {
    let cat = [];
    if (props.exercice.Categories) {
        cat = [...Object.values(props.exercice.Categories)];
    }
    const [categories, setCategories] = useState(cat);
    const [series, setSeries] = useState([...Object.values(props.exercice.Series)]);
    const [fullExercice, setFullExercice] = useState(props.exercice);
    const [clickExercice, setClickExercice] = useState(props.click);

    function handleClickExercice() {
        setClickExercice(!clickExercice);

    }

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
        const Categories = { ...categories };
        const Exercice = { ...fullExercice, Series, Categories };
        console.log(props);
        props.changeExercices(Exercice, props.id);
        if (props.writeExerciceInSeance) {
            props.writeExerciceInSeance(Exercice, props.id);
        }
    }, [fullExercice, series, categories])

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

            <ExerciceInput
                debutant={false} onClickExercice={handleClickExercice}
                clickExercice={clickExercice} value={fullExercice.exercice} id={props.id} index={props.index}
                onDeleteExercices={props.onDeleteExercices} changeExercice={changeExercice}
                key={props.id} exercice={fullExercice.exercice} modeSombre={props.modeSombre}
                dimensions={props.dimensions}
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
                                    exercice={fullExercice.exercice}
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
                                        exercice={fullExercice.exercice}
                                        poids={props.poids}
                                        onAddSerie={onAddSerie}
                                        changeSerie={changeSerie}
                                        onDeleteSerie={onDeleteSerie}
                                        modeSombre={props.modeSombre}
                                        programme={props.programme}
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

                    {categories ?
                        writeCategories(categories)
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





        </div >
    )
}

export default FullExerciceInput;