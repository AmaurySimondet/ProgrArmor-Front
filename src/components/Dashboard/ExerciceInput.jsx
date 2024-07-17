import { React, useState, useEffect } from "react";
import lesExercices from "./Exercices";
import MusclesCategorie from "./Categories/MusclesCategorie.js";
import Select from 'react-select';
import { customStyles, customStylesDark, customStylesDarkMini, customStylesMini } from "../../utils/customStyles";

function ExerciceInput(props) {
    const [exercice, setExercice] = useState(props.exercice);

    function handleChange(event) {
        if (event.target) {
            setExercice(oldExercice => {
                return ({
                    ...oldExercice,
                    [event.target.id]: event.target.value,
                })
            });
        }
        else {
            setExercice(oldExercice => {
                return ({
                    ...oldExercice,
                    [event.id]: event.value,
                })
            });
        }
    }

    useEffect(() => {
        props.changeExercice(exercice);

        if (exercice.name !== "Elevation" && exercice.name !== "Press" && exercice.name !== "Extension" && exercice.name !== "Abduction" && exercice.name !== "Adduction" && exercice.name !== "Curl") {
            delete exercice.muscle;
        }
    }, [exercice]);

    function handleClickPoubelle() {
        props.onDeleteExercices(props.id);

        event.preventDefault();
    }

    function handleClickLabel() {
        props.onClickExercice();
    }

    return (
        <div>
            {props.taille === "petit" ?
                <Select
                    placeholder="Exercice..."
                    onChange={handleChange}
                    options={lesExercices}
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
                    value={{ value: exercice.name, label: exercice.name }}
                />
                :
                <div className="form-group row">
                    <div onClick={handleClickLabel}>
                        <label className="exercice-label">
                            Exercice {props.index + 1}
                        </label>
                        {props.debutant ?
                            null
                            :
                            <img className={props.clickExercice ? "expert-toggle rotated" : "expert-toggle not-rotated"}
                                src={require('../../images/icons/icons8-expand-arrow-90.webp')} />
                        }
                    </div>
                    <div className="poubelle-div" style={{ paddingLeft: "0" }}>
                        <img className={props.modeSombre === true ? "poubelleDark" : "poubelle"} onClick={handleClickPoubelle} src={require('../../images/icons/icons8-trash-30.webp')} alt="Poubelle" />
                    </div>
                    <br />

                    <div className="col-12">
                        <Select
                            placeholder="Exercice..."
                            onChange={handleChange}
                            options={lesExercices}
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
                            value={{ value: exercice.name, label: exercice.name }}
                        />
                    </div>

                </div>
            }

            {exercice.name === "Elevation" ?
                props.taille === "petit" ?
                    <div>
                        <label className="col-form-label">
                            Muscle
                        </label>
                        <div className="col-9">
                            <Select
                                placeholder="Muscle..."
                                onChange={handleChange}
                                options={MusclesCategorie}
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
                                value={{ value: exercice.muscle, label: exercice.muscle }}
                            />
                        </div>
                    </div>
                    :
                    <div className="form-group row">
                        <label className="col-2 col-form-label">
                            Muscle
                        </label>
                        <div className="col-9">
                            <Select
                                placeholder="Muscle..."
                                onChange={handleChange}
                                options={MusclesCategorie}
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
                                value={{ value: exercice.muscle, label: exercice.muscle }}
                            />
                        </div>
                    </div>
                : exercice.name === "Curl" ?
                    props.taille === "petit" ?
                        <div>
                            <label className="col-form-label">
                                Muscle
                            </label>
                            <div className="col-9">
                                <Select
                                    placeholder="Muscle..."
                                    onChange={handleChange}
                                    options={MusclesCategorie}
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
                                    value={{ value: exercice.muscle, label: exercice.muscle }}
                                />
                            </div>
                        </div>
                        :
                        <div className="form-group row">
                            <label className="col-2 col-form-label">
                                Muscle
                            </label>
                            <div className="col-9">
                                <Select
                                    placeholder="Muscle..."
                                    onChange={handleChange}
                                    options={MusclesCategorie}
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
                                    value={{ value: exercice.muscle, label: exercice.muscle }}
                                />
                            </div>
                        </div>
                    : exercice.name === "Extension" ?
                        props.taille === "petit" ?
                            <div>
                                <label className="col-form-label">
                                    Muscle
                                </label>
                                <div className="col-9">
                                    <Select
                                        placeholder="Muscle..."
                                        onChange={handleChange}
                                        options={MusclesCategorie}
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
                                        value={{ value: exercice.muscle, label: exercice.muscle }}
                                    />
                                </div>
                            </div>
                            :
                            <div className="form-group row">
                                <label className="col-2 col-form-label">
                                    Muscle
                                </label>
                                <div className="col-9">
                                    <Select
                                        placeholder="Muscle..."
                                        onChange={handleChange}
                                        options={MusclesCategorie}
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
                                        value={{ value: exercice.muscle, label: exercice.muscle }}
                                    />
                                </div>
                            </div>
                        : exercice.name === "Abduction" ?
                            props.taille === "petit" ?
                                <div>
                                    <label className="col-form-label">
                                        Muscle
                                    </label>
                                    <div className="col-9">
                                        <Select
                                            placeholder="Muscle..."
                                            onChange={handleChange}
                                            options={MusclesCategorie}
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
                                            value={{ value: exercice.muscle, label: exercice.muscle }}
                                        />
                                    </div>
                                </div>
                                :
                                <div className="form-group row">
                                    <label className="col-2 col-form-label">
                                        Muscle
                                    </label>
                                    <div className="col-9">
                                        <Select
                                            placeholder="Muscle..."
                                            onChange={handleChange}
                                            options={MusclesCategorie}
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
                                            value={{ value: exercice.muscle, label: exercice.muscle }}
                                        />
                                    </div>
                                </div>
                            : exercice.name === "Adduction" ?
                                props.taille === "petit" ?
                                    <div>
                                        <label className="col-form-label">
                                            Muscle
                                        </label>
                                        <div className="col-9">
                                            <Select
                                                placeholder="Muscle..."
                                                onChange={handleChange}
                                                options={MusclesCategorie}
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
                                                value={{ value: exercice.muscle, label: exercice.muscle }}
                                            />
                                        </div>
                                    </div>
                                    :
                                    <div className="form-group row">
                                        <label className="col-2 col-form-label">
                                            Muscle
                                        </label>
                                        <div className="col-9">
                                            <Select
                                                placeholder="Muscle..."
                                                onChange={handleChange}
                                                options={MusclesCategorie}
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
                                                value={{ value: exercice.muscle, label: exercice.muscle }}
                                            />
                                        </div>
                                    </div>
                                : exercice.name === "Press" ?
                                    props.taille === "petit" ?
                                        <div>
                                            <label className="col-form-label">
                                                Muscle
                                            </label>
                                            <div className="col-9">
                                                <Select
                                                    placeholder="Muscle..."
                                                    onChange={handleChange}
                                                    options={MusclesCategorie}
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
                                                    value={{ value: exercice.muscle, label: exercice.muscle }}
                                                />
                                            </div>
                                        </div>
                                        :
                                        <div className="form-group row">
                                            <label className="col-2 col-form-label">
                                                Muscle
                                            </label>
                                            <div className="col-9">
                                                <Select
                                                    placeholder="Muscle..."
                                                    onChange={handleChange}
                                                    options={MusclesCategorie}
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
                                                    value={{ value: exercice.muscle, label: exercice.muscle }}
                                                />
                                            </div>
                                        </div>
                                    : null}

            {exercice.name === "own-exercice" ?
                <div>
                    <div className="form-group row">
                        <div>
                            <p className="info-own-exercice">
                                <u>Attention:</u> Pour une experience optimale de ProgrArmor, choisis un exercice parmis la liste précédente <br />
                                {"Tu accèderas à plus de choix en selectionnant le mode Expert avec l'interrupteur"}
                            </p>
                        </div>
                    </div>

                    <div className="form-group row">
                        <label className="col-2 col-form-label">Ton exercice</label>

                        <div className="col-10">
                            <input type="text"
                                className={props.modeSombre ? "form-control inputDark" : "form-control"}
                                onChange={handleChange}
                                id="ownExercice"
                                value={exercice.ownExercice}
                            />
                        </div>
                    </div>

                </div>
                : null}
        </div>
    );
};

export default ExerciceInput;



