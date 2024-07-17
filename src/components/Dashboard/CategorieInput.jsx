import { React, useState, useEffect } from "react";
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import Select from "react-select";
import { customStyles, customStylesDark, customStylesDarkMini, customStylesMini } from "../../utils/customStyles";

import AllCategories from "./Categories/AllCategories.js";

import lesTypesBarres from "./Categories/TypesBarres.js";
import lesElastiques from "./Categories/Elastiques.js";
import Streetworkout from "./Categories/StreetWorkout.js";
import MusclesCategorie from "./Categories/MusclesCategorie.js";
import PositionCorps from "./Categories/PositionCorps.js";
import PositionBras from "./Categories/PositionBras.js";
import PositionJambes from "./Categories/PositionJambes.js";
import positionElastique from "./Categories/PositionElastique.js";
import PositionMains from "./Categories/PositionMains.js";
import PositionPieds from "./Categories/PositionPieds.js";
import AxeCategorie from "./Categories/AxeCategorie.js";
import CoudeGenou from "./Categories/CoudeGenou.js";
import Unilateral from "./Categories/Unilateral.js";
import Execution from "./Categories/ExecutionCategorie.js";
import ExecutionSpecifique from "./Categories/ExecutionSpecifique.js";
import PriseCategorie from "./Categories/PriseCategorie.js";
import TempoCategorie from "./Categories/TempoCategorie.js";
import Partiel from "./Categories/Partiel.js";
import DépartCategorie from "./Categories/DépartCategorie.js";
import ExplosifCategorie from "./Categories/ExplosifCategorie.js";
import Halterophilie from "./Categories/Halterophilie.js";
import AccessoireObjet from "./Categories/AccessoireObjet.js";
import RPE from "./Categories/RPE.js";
import Douleur from "./Categories/Douleur.js";
import TermeGenerique from "./Categories/TermeGenerique.js";

import StreetworkoutHiddenText from "./Categories/StreetworkoutHiddenText.js";
import CategorieHiddenText from "./Categories/CategorieHiddenText.js";
import ElastiqueHiddenText from "./Categories/ElastiqueHiddenText.js";


const StyleSliderWhite = styled(Slider)(({ theme }) => ({
    '& .MuiSlider-thumb': {
        color: red['A700'],
    },
    '& .MuiSlider-thumb:hover': {
        color: red['A400'],
    },
    '& .MuiSlider-dragging': {
        backgroundColor: red['A700'],
    },
    '& .MuiSlider-rail': {
        backgroundColor: red['A700'],
    },
    '& .MuiSlider-track': {
        backgroundColor: red['A700'],
    },
    '& .MuiSlider-mark': {
        backgroundColor: red['A700'],
    },
}));

const StyleSliderBlack = styled(Slider)(({ theme }) => ({
    '& .MuiSlider-thumb': {
        color: red['A700'],
    },
    '& .MuiSlider-thumb:hover': {
        color: red['A400'],
    },
    '& .MuiSlider-dragging': {
        backgroundColor: red['A700'],
    },
    '& .MuiSlider-rail': {
        backgroundColor: red['A700'],
    },
    '& .MuiSlider-track': {
        backgroundColor: red['A700'],
    },
    '& .MuiSlider-mark': {
        backgroundColor: red['A700'],
    }, '& .MuiSlider-markLabel': {
        color: "white",
    }
}));

const marks = [
    {
        value: 0,
        label: '0',
    },
    {
        value: 0.5,
        label: '0.5',
    },
    {
        value: 1.5,
        label: '1.5',
    },
    {
        value: 3,
        label: '3',
    },
    {
        value: 6,
        label: '6',
    },
    {
        value: 9,
        label: '9',
    },

];

function valuetext(value) {
    return `${value}%`;

}

function CategorieInput(props) {
    const [categorie, setCategorie] = useState(props.categorie || {
        name: "",
        input: "",
        type: "",
        muscle: "",
    });
    const [streetworkoutHiddenClicked, setStreetworkoutHiddenClicked] = useState("hide");
    const [categorieHiddenClick, setcategorieHiddenClick] = useState('hide')
    const [elastiqueHiddenClick, setElastiqueHiddenClick] = useState('hide')

    function handleClickElastique() {
        if (elastiqueHiddenClick === "hide") {
            setElastiqueHiddenClick("nothide");
        } else { setElastiqueHiddenClick("hide") };
    }

    function handleClickCategorie() {
        if (categorieHiddenClick === "hide") {
            setcategorieHiddenClick("nothide");
        } else { setcategorieHiddenClick("hide") };
    }

    function handleClickStreetworkout() {
        if (streetworkoutHiddenClicked === "hide") {
            setStreetworkoutHiddenClicked("nothide");
        } else { setStreetworkoutHiddenClicked("hide") };
    }

    function handleChange(event) {
        // console.log("event", event)

        if (event.target) {
            // console.log(event.target.id, event.target.value)
            setCategorie(oldCategorie => {
                return ({
                    ...oldCategorie,
                    [event.target.id]: event.target.value,
                })
            });
        }
        else {
            if (event.id === "muscle") {
                setCategorie(oldCategorie => {
                    return ({
                        ...oldCategorie,
                        input: event.value,
                        name: "Muscle"
                    })
                });
            }
            if (event.id && event.id !== "muscle") {
                // console.log(event.id, event.value, event.name)
                setCategorie(oldCategorie => {
                    return ({
                        ...oldCategorie,
                        [event.id]: event.value,
                        name: event.name
                    })
                });
            }
            if (!event.name && !categorie.name) {
                setCategorie(oldCategorie => {
                    return ({
                        ...oldCategorie,
                        name: event.label
                    })
                });
            }
        }
    }

    function handleChangeSlider(event) {
        event.preventDefault();

        setCategorie(oldCategorie => {
            return ({
                ...oldCategorie,
                tension: event.target.value,
                estimation: (event.target.value / 3 * parseInt(categorie.input)).toFixed(2),
            })
        });
    }

    useEffect(() => {
        if (categorie.name === "Elastique") {
            categorie.estimation = (categorie.tension / 3 * parseInt(categorie.input)).toFixed(2)
        }
    }, [categorie.input])

    useEffect(() => {
        if (categorie.name === "Elastique") {
            categorie.estimation = (categorie.tension / 3 * parseInt(categorie.input)).toFixed(2)
        }
    }, [categorie.tension])

    useEffect(() => {
        props.changeCategorie(categorie, props.id)
        if (categorie.name === "title") {
            props.onDeleteCategorie
        }
    }, [categorie])

    useEffect(() => {
        if (props.click) {
            setCategorie({ id: props.id, index: props.index })
        }
    }, [props.click])

    function handleClickPoubelle() {
        props.onDeleteCategorie(props.id);

        event.preventDefault();
    }

    function divStyle(index, dark) {
        let fourColorsArray = []
        if (dark) {
            fourColorsArray = ['ffffff', 'ffc9c9', 'ff8282', 'ff0000']
        }
        else {
            fourColorsArray = ['ff0000', 'aa0000', '550000', '000000']
        }
        let numb = index % 4
        let color = '#' + fourColorsArray[numb]
        let font;

        if (index % 2 === 0) {
            font = 400;
        } else {
            font = 500;
        }

        return ({
            color: color,
            fontWeight: font
        })
    }

    return (
        <div style={divStyle(props.index, props.modeSombre)} className="Categorie">

            {categorie.name ?
                null
                :
                props.info === "false" ?
                    <Select
                        placeholder="Categorie..."
                        onChange={handleChange}
                        options={AllCategories}
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
                        value={{ value: categorie.name, label: categorie.name }}
                    />
                    :
                    <div className="form-group row">
                        {props.info === "false" ?
                            null
                            :
                            !props.dashboard ?
                                <div>
                                    <label>
                                        Catégorie {props.dashboard ? props.index + 1 : null} {props.dimensions > 500 ? "(" + props.exercice.name + ")" : null}
                                    </label>
                                    <img className={props.modeSombre === true ? "myDIV questionDark " : "myDIV"} onClick={handleClickCategorie} src={require('../../images/icons/icons8-question-mark-96.webp')} alt="?" />
                                    <div className={categorieHiddenClick}>
                                        <CategorieHiddenText />
                                    </div>
                                    <div style={{ display: "inline-block" }}>
                                        <img className={props.modeSombre === true ? "poubelleDark " : "poubelle"} onClick={handleClickPoubelle} src={require('../../images/icons/icons8-trash-30.webp')} alt="Poubelle" />
                                    </div>
                                </div>
                                :
                                <div>
                                    <label>
                                        Catégorie {props.dashboard ? props.index + 1 : null} {props.dimensions > 500 ? "(" + props.exercice.name + ")" : null}
                                    </label>
                                    <img className={props.modeSombre === true ? "myDIV questionDark " : "myDIV"} onClick={handleClickCategorie} src={require('../../images/icons/icons8-question-mark-96.webp')} alt="?" />
                                    <div className={categorieHiddenClick}>
                                        <CategorieHiddenText />
                                    </div>
                                </div>
                        }
                        <Select
                            placeholder="Categorie..."
                            onChange={handleChange}
                            options={AllCategories}
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
                            className={props.info === "dash" ? "col-10" : " col-12"}
                            value={{ value: categorie.name, label: categorie.name }}
                        />

                    </div>
            }

            {categorie.name === "Aucune" ?
                props.info === "false" ?
                    <Select
                        placeholder="Categorie..."
                        onChange={handleChange}
                        options={AllCategories}
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
                        value={{ value: categorie.name, label: categorie.name }}
                    />
                    :
                    <div className="form-group row">
                        {props.info === "false" ?
                            null
                            :
                            <label>
                                Catégorie {props.dashboard ? props.index + 1 : null} {props.dimensions > 500 ? "(" + props.exercice.name + ")" : null}
                                <img className={props.modeSombre === true ? "myDIV questionDark " : "myDIV"} onClick={handleClickCategorie} src={require('../../images/icons/icons8-question-mark-96.webp')} alt="?" />
                                <div className={categorieHiddenClick}>
                                    <CategorieHiddenText />
                                </div>
                            </label>
                        }
                        <Select
                            placeholder="Categorie..."
                            onChange={handleChange}
                            options={AllCategories}
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
                            className={props.info === "dash" ? "col-10" : " col-11"}
                            value={{ value: categorie.name, label: categorie.name }}
                        />

                        {props.dashboard ? null : <div className="col-1">
                            <img className={props.modeSombre === true ? "poubelleDark " : "poubelle"} onClick={handleClickPoubelle} src={require('../../images/icons/icons8-trash-30.webp')} alt="Poubelle" />
                        </div>}
                    </div>
                : null}

            {categorie.name === "Variante Street Workout" ?
                props.info === "false" ?
                    <Select
                        placeholder="Categorie..."
                        onChange={handleChange}
                        options={Streetworkout}
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
                        value={{ value: categorie.input, label: categorie.input }}
                    />
                    :
                    <div className="form-group row">
                        {props.info === "false" ?
                            null
                            :
                            <label>
                                {categorie.name}
                                <img className={props.modeSombre === true ? "myDIV questionDark " : "myDIV"} onClick={handleClickStreetworkout} src={require('../../images/icons/icons8-question-mark-96.webp')} alt="?" />
                                <div className={streetworkoutHiddenClicked}>
                                    <StreetworkoutHiddenText />
                                </div>
                            </label>
                        }
                        <Select
                            placeholder="Categorie..."
                            onChange={handleChange}
                            options={Streetworkout}
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
                            className={props.info === "dash" ? "col-10" : " col-11"}
                            value={{ value: categorie.input, label: categorie.input }}
                        />

                        {props.dashboard ? null : <div className="col-1">
                            <img className={props.modeSombre === true ? "poubelleDark " : "poubelle"} onClick={handleClickPoubelle} src={require('../../images/icons/icons8-trash-30.webp')} alt="Poubelle" />
                        </div>}
                    </div>
                : null}
            {categorie.name === "Type de barre / poids" ?
                props.info === "false" ?
                    <Select
                        placeholder="Categorie..."
                        onChange={handleChange}
                        options={lesTypesBarres}
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
                        value={{ value: categorie.input, label: categorie.input }}
                    />
                    :
                    <div className="form-group row">
                        {props.info === "false" ?
                            null
                            :
                            <label className="col-12">
                                {categorie.name}
                            </label>
                        }
                        <Select
                            placeholder="Categorie..."
                            onChange={handleChange}
                            options={lesTypesBarres}
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
                            className={props.info === "dash" ? "col-10" : " col-11"}
                            value={{ value: categorie.input, label: categorie.input }}
                        />

                        {props.dashboard ? null : <div className="col-1">
                            <img className={props.modeSombre === true ? "poubelleDark " : "poubelle"} onClick={handleClickPoubelle} src={require('../../images/icons/icons8-trash-30.webp')} alt="Poubelle" />
                        </div>}
                    </div>
                : null}
            {categorie.name === "Muscle" ?
                props.info === "false" ?
                    <Select
                        placeholder="Categorie..."
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
                        value={{ value: categorie.input, label: categorie.input }}
                    />
                    :
                    <div className="form-group row">
                        {props.info === "false" ?
                            null
                            :
                            <label className="col-12">
                                {categorie.name}
                            </label>
                        }
                        <Select
                            placeholder="Categorie..."
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
                            className={props.info === "dash" ? "col-10" : " col-11"}
                            value={{ value: categorie.input, label: categorie.input }}
                        />

                        {props.dashboard ? null : <div className="col-1">
                            <img className={props.modeSombre === true ? "poubelleDark " : "poubelle"} onClick={handleClickPoubelle} src={require('../../images/icons/icons8-trash-30.webp')} alt="Poubelle" />
                        </div>}
                    </div>
                : null}
            {categorie.name === "Positionnement du corps" ?
                props.info === "false" ?
                    <Select
                        placeholder="Categorie..."
                        onChange={handleChange}
                        options={PositionCorps}
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
                        value={{ value: categorie.input, label: categorie.input }}
                    />
                    :
                    <div className="form-group row">
                        {props.info === "false" ?
                            null
                            :
                            <label className="col-12">
                                {categorie.name}
                            </label>
                        }
                        <Select
                            placeholder="Categorie..."
                            onChange={handleChange}
                            options={PositionCorps}
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
                            className={props.info === "dash" ? "col-10" : " col-11"}
                            value={{ value: categorie.input, label: categorie.input }}
                        />

                        {props.dashboard ? null : <div className="col-1">
                            <img className={props.modeSombre === true ? "poubelleDark " : "poubelle"} onClick={handleClickPoubelle} src={require('../../images/icons/icons8-trash-30.webp')} alt="Poubelle" />
                        </div>}
                    </div>
                : null}
            {categorie.name === "Positionnement élastique(s)/sangle(s)" ?
                props.info === "false" ?
                    <Select
                        placeholder="Categorie..."
                        onChange={handleChange}
                        options={positionElastique}
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
                        value={{ value: categorie.input, label: categorie.input }}
                    />
                    :
                    <div className="form-group row">
                        {props.info === "false" ?
                            null
                            :
                            <label className="col-12">
                                {categorie.name}
                            </label>
                        }
                        <Select
                            placeholder="Categorie..."
                            onChange={handleChange}
                            options={positionElastique}
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
                            className={props.info === "dash" ? "col-10" : " col-11"}
                            value={{ value: categorie.input, label: categorie.input }}
                        />

                        {props.dashboard ? null : <div className="col-1">
                            <img className={props.modeSombre === true ? "poubelleDark " : "poubelle"} onClick={handleClickPoubelle} src={require('../../images/icons/icons8-trash-30.webp')} alt="Poubelle" />
                        </div>}
                    </div>
                : null}
            {categorie.name === "Positionnement des bras" ?
                props.info === "false" ?
                    <Select
                        placeholder="Categorie..."
                        onChange={handleChange}
                        options={PositionBras}
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
                        value={{ value: categorie.input, label: categorie.input }}
                    />
                    :
                    <div className="form-group row">
                        {props.info === "false" ?
                            null
                            :
                            <label className="col-12">
                                {categorie.name}
                            </label>
                        }
                        <Select
                            placeholder="Categorie..."
                            onChange={handleChange}
                            options={PositionBras}
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
                            className={props.info === "dash" ? "col-10" : " col-11"}
                            value={{ value: categorie.input, label: categorie.input }}
                        />

                        {props.dashboard ? null : <div className="col-1">
                            <img className={props.modeSombre === true ? "poubelleDark " : "poubelle"} onClick={handleClickPoubelle} src={require('../../images/icons/icons8-trash-30.webp')} alt="Poubelle" />
                        </div>}
                    </div>
                : null}
            {categorie.name === "Positionnement des jambes" ?
                props.info === "false" ?
                    <Select
                        placeholder="Categorie..."
                        onChange={handleChange}
                        options={PositionJambes}
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
                        value={{ value: categorie.input, label: categorie.input }}
                    />
                    :
                    <div className="form-group row">
                        {props.info === "false" ?
                            null
                            :
                            <label className="col-12">
                                {categorie.name}
                            </label>
                        }
                        <Select
                            placeholder="Categorie..."
                            onChange={handleChange}
                            options={PositionJambes}
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
                            className={props.info === "dash" ? "col-10" : " col-11"}
                            value={{ value: categorie.input, label: categorie.input }}
                        />

                        {props.dashboard ? null : <div className="col-1">
                            <img className={props.modeSombre === true ? "poubelleDark " : "poubelle"} onClick={handleClickPoubelle} src={require('../../images/icons/icons8-trash-30.webp')} alt="Poubelle" />
                        </div>}
                    </div>
                : null}
            {categorie.name === "Positionnement des mains" ?
                props.info === "false" ?
                    <Select
                        placeholder="Categorie..."
                        onChange={handleChange}
                        options={PositionMains}
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
                        value={{ value: categorie.input, label: categorie.input }}
                    />
                    :
                    <div className="form-group row">
                        {props.info === "false" ?
                            null
                            :
                            <label className="col-12">
                                {categorie.name}
                            </label>
                        }
                        <Select
                            placeholder="Categorie..."
                            onChange={handleChange}
                            options={PositionMains}
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
                            className={props.info === "dash" ? "col-10" : " col-11"}
                            value={{ value: categorie.input, label: categorie.input }}
                        />

                        {props.dashboard ? null : <div className="col-1">
                            <img className={props.modeSombre === true ? "poubelleDark " : "poubelle"} onClick={handleClickPoubelle} src={require('../../images/icons/icons8-trash-30.webp')} alt="Poubelle" />
                        </div>}
                    </div>
                : null}
            {categorie.name === "Positionnement des pieds" ?
                props.info === "false" ?
                    <Select
                        placeholder="Categorie..."
                        onChange={handleChange}
                        options={PositionPieds}
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
                        value={{ value: categorie.input, label: categorie.input }}
                    />
                    :
                    <div className="form-group row">
                        {props.info === "false" ?
                            null
                            :
                            <label className="col-12">
                                {categorie.name}
                            </label>
                        }
                        <Select
                            placeholder="Categorie..."
                            onChange={handleChange}
                            options={PositionPieds}
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
                            className={props.info === "dash" ? "col-10" : " col-11"}
                            value={{ value: categorie.input, label: categorie.input }}
                        />

                        {props.dashboard ? null : <div className="col-1">
                            <img className={props.modeSombre === true ? "poubelleDark " : "poubelle"} onClick={handleClickPoubelle} src={require('../../images/icons/icons8-trash-30.webp')} alt="Poubelle" />
                        </div>}
                    </div>
                : null}
            {categorie.name === "Placement et axe du corps / banc / barre" ?
                props.info === "false" ?
                    <Select
                        placeholder="Categorie..."
                        onChange={handleChange}
                        options={AxeCategorie}
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
                        value={{ value: categorie.input, label: categorie.input }}
                    />
                    :
                    <div className="form-group row">
                        {props.info === "false" ?
                            null
                            :
                            <label className="col-12">
                                {categorie.name}
                            </label>
                        }
                        <Select
                            placeholder="Categorie..."
                            onChange={handleChange}
                            options={AxeCategorie}
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
                            className={props.info === "dash" ? "col-10" : " col-11"}
                            value={{ value: categorie.input, label: categorie.input }}
                        />

                        {props.dashboard ? null : <div className="col-1">
                            <img className={props.modeSombre === true ? "poubelleDark " : "poubelle"} onClick={handleClickPoubelle} src={require('../../images/icons/icons8-trash-30.webp')} alt="Poubelle" />
                        </div>}
                    </div>
                : null}
            {categorie.name === "Ouverture coudes / genoux" ?
                props.info === "false" ?
                    <Select
                        placeholder="Categorie..."
                        onChange={handleChange}
                        options={CoudeGenou}
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
                        value={{ value: categorie.input, label: categorie.input }}
                    />
                    :
                    <div className="form-group row">
                        {props.info === "false" ?
                            null
                            :
                            <label className="col-12">
                                {categorie.name}
                            </label>
                        }
                        <Select
                            placeholder="Categorie..."
                            onChange={handleChange}
                            options={CoudeGenou}
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
                            className={props.info === "dash" ? "col-10" : " col-11"}
                            value={{ value: categorie.input, label: categorie.input }}
                        />

                        {props.dashboard ? null : <div className="col-1">
                            <img className={props.modeSombre === true ? "poubelleDark " : "poubelle"} onClick={handleClickPoubelle} src={require('../../images/icons/icons8-trash-30.webp')} alt="Poubelle" />
                        </div>}
                    </div>
                : null}
            {categorie.name === "Unilatéral" ?
                props.info === "false" ?
                    <Select
                        placeholder="Categorie..."
                        onChange={handleChange}
                        options={Unilateral}
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
                        value={{ value: categorie.input, label: categorie.input }}
                    />
                    :
                    <div className="form-group row">
                        {props.info === "false" ?
                            null
                            :
                            <label className="col-12">
                                {categorie.name}
                            </label>
                        }
                        <Select
                            placeholder="Categorie..."
                            onChange={handleChange}
                            options={Unilateral}
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
                            className={props.info === "dash" ? "col-10" : " col-11"}
                            value={{ value: categorie.input, label: categorie.input }}
                        />

                        {props.dashboard ? null : <div className="col-1">
                            <img className={props.modeSombre === true ? "poubelleDark " : "poubelle"} onClick={handleClickPoubelle} src={require('../../images/icons/icons8-trash-30.webp')} alt="Poubelle" />
                        </div>}
                    </div>
                : null}
            {categorie.name === "Type d'éxecution" ?
                props.info === "false" ?
                    <Select
                        placeholder="Categorie..."
                        onChange={handleChange}
                        options={Execution}
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
                        value={{ value: categorie.input, label: categorie.input }}
                    />
                    :
                    <div className="form-group row">
                        {props.info === "false" ?
                            null
                            :
                            <label className="col-12">
                                {categorie.name}
                            </label>
                        }
                        <Select
                            placeholder="Categorie..."
                            onChange={handleChange}
                            options={Execution}
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
                            className={props.info === "dash" ? "col-10" : " col-11"}
                            value={{ value: categorie.input, label: categorie.input }}
                        />

                        {props.dashboard ? null : <div className="col-1">
                            <img className={props.modeSombre === true ? "poubelleDark " : "poubelle"} onClick={handleClickPoubelle} src={require('../../images/icons/icons8-trash-30.webp')} alt="Poubelle" />
                        </div>}
                    </div>
                : null}
            {categorie.name === "Type d'éxecution spécifique" ?
                props.info === "false" ?
                    <Select
                        placeholder="Categorie..."
                        onChange={handleChange}
                        options={ExecutionSpecifique}
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
                        value={{ value: categorie.input, label: categorie.input }}
                    />
                    :
                    <div className="form-group row">
                        {props.info === "false" ?
                            null
                            :
                            <label className="col-12">
                                {categorie.name}
                            </label>
                        }
                        <Select
                            placeholder="Categorie..."
                            onChange={handleChange}
                            options={ExecutionSpecifique}
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
                            className={props.info === "dash" ? "col-10" : " col-11"}
                            value={{ value: categorie.input, label: categorie.input }}
                        />

                        {props.dashboard ? null : <div className="col-1">
                            <img className={props.modeSombre === true ? "poubelleDark " : "poubelle"} onClick={handleClickPoubelle} src={require('../../images/icons/icons8-trash-30.webp')} alt="Poubelle" />
                        </div>}
                    </div>
                : null}
            {categorie.name === "Temps de repos entre les séries" ?
                props.info === "false" ?
                    <div className={props.info === "false" ? "" : "col-11"}>
                        <input type="text"
                            className={props.modeSombre === true ? "form-control inputDark " : "form-control"}
                            id="input"
                            value={categorie.input}
                            onChange={handleChange}
                        />
                    </div>
                    :
                    <div className="form-group row">
                        {props.info === "false" ?
                            null
                            :
                            <label className="col-12">
                                {categorie.name}
                            </label>
                        }
                        <div className={props.info === "false" ? "" : "col-11"}>
                            <input type="text"
                                className={props.modeSombre === true ? "form-control inputDark " : "form-control"}
                                id="input"
                                value={categorie.input}
                                onChange={handleChange}
                            />
                        </div>

                        {props.dashboard ? null : <div className="col-1">
                            <img className={props.modeSombre === true ? "poubelleDark " : "poubelle"} onClick={handleClickPoubelle} src={require('../../images/icons/icons8-trash-30.webp')} alt="Poubelle" />
                        </div>}
                    </div>
                : null}
            {categorie.name === "RPE / Niveau d'intensité" ?
                props.info === "false" ?
                    <Select
                        placeholder="Categorie..."
                        onChange={handleChange}
                        options={RPE}
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
                        value={{ value: categorie.input, label: categorie.input }}
                    />
                    :
                    <div className="form-group row">
                        {props.info === "false" ?
                            null
                            :
                            <label className="col-12">
                                {categorie.name}
                            </label>
                        }
                        <Select
                            placeholder="Categorie..."
                            onChange={handleChange}
                            options={RPE}
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
                            className={props.info === "dash" ? "col-10" : " col-11"}
                            value={{ value: categorie.input, label: categorie.input }}
                        />

                        {props.dashboard ? null : <div className="col-1">
                            <img className={props.modeSombre === true ? "poubelleDark " : "poubelle"} onClick={handleClickPoubelle} src={require('../../images/icons/icons8-trash-30.webp')} alt="Poubelle" />
                        </div>}
                    </div>
                : null}
            {categorie.name === "Gêne / douleur / blessure" ?
                props.info === "false" ?
                    <Select
                        placeholder="Categorie..."
                        onChange={handleChange}
                        options={Douleur}
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
                        value={{ value: categorie.input, label: categorie.input }}
                    />
                    :
                    <div className="form-group row">
                        {props.info === "false" ?
                            null
                            :
                            <label className="col-12">
                                {categorie.name}
                            </label>
                        }
                        <Select
                            placeholder="Categorie..."
                            onChange={handleChange}
                            options={Douleur}
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
                            className={props.info === "dash" ? "col-10" : " col-11"}
                            value={{ value: categorie.input, label: categorie.input }}
                        />

                        {props.dashboard ? null : <div className="col-1">
                            <img className={props.modeSombre === true ? "poubelleDark " : "poubelle"} onClick={handleClickPoubelle} src={require('../../images/icons/icons8-trash-30.webp')} alt="Poubelle" />
                        </div>}
                    </div>
                : null}
            {categorie.name === "Type de prise" ?
                props.info === "false" ?
                    <Select
                        placeholder="Categorie..."
                        onChange={handleChange}
                        options={PriseCategorie}
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
                        value={{ value: categorie.input, label: categorie.input }}
                    />
                    :
                    <div className="form-group row">
                        {props.info === "false" ?
                            null
                            :
                            <label className="col-12">
                                {categorie.name}
                            </label>
                        }
                        <Select
                            placeholder="Categorie..."
                            onChange={handleChange}
                            options={PriseCategorie}
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
                            className={props.info === "dash" ? "col-10" : " col-11"}
                            value={{ value: categorie.input, label: categorie.input }}
                        />

                        {props.dashboard ? null : <div className="col-1">
                            <img className={props.modeSombre === true ? "poubelleDark " : "poubelle"} onClick={handleClickPoubelle} src={require('../../images/icons/icons8-trash-30.webp')} alt="Poubelle" />
                        </div>}
                    </div>
                : null}
            {categorie.name === "Tempo" ?
                props.info === "false" ?
                    <Select
                        placeholder="Categorie..."
                        onChange={handleChange}
                        options={TempoCategorie}
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
                        value={{ value: categorie.input, label: categorie.input }}
                    />
                    :
                    <div className="form-group row">
                        {props.info === "false" ?
                            null
                            :
                            <label className="col-12">
                                {categorie.name}
                            </label>
                        }
                        <Select
                            placeholder="Categorie..."
                            onChange={handleChange}
                            options={TempoCategorie}
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
                            className={props.info === "dash" ? "col-10" : " col-11"}
                            value={{ value: categorie.input, label: categorie.input }}
                        />

                        {props.dashboard ? null : <div className="col-1">
                            <img className={props.modeSombre === true ? "poubelleDark " : "poubelle"} onClick={handleClickPoubelle} src={require('../../images/icons/icons8-trash-30.webp')} alt="Poubelle" />
                        </div>}
                    </div>
                : null}
            {categorie.name === "Forme (Partiel)" ?
                props.info === "false" ?
                    <Select
                        placeholder="Categorie..."
                        onChange={handleChange}
                        options={Partiel}
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
                        value={{ value: categorie.input, label: categorie.input }}
                    />
                    :
                    <div className="form-group row">
                        {props.info === "false" ?
                            null
                            :
                            <label className="col-12">
                                {categorie.name}
                            </label>
                        }
                        <Select
                            placeholder="Categorie..."
                            onChange={handleChange}
                            options={Partiel}
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
                            className={props.info === "dash" ? "col-10" : " col-11"}
                            value={{ value: categorie.input, label: categorie.input }}
                        />

                        {props.dashboard ? null : <div className="col-1">
                            <img className={props.modeSombre === true ? "poubelleDark " : "poubelle"} onClick={handleClickPoubelle} src={require('../../images/icons/icons8-trash-30.webp')} alt="Poubelle" />
                        </div>}
                    </div>
                : null}
            {categorie.name === "Point de départ" ?
                props.info === "false" ?
                    <Select
                        placeholder="Categorie..."
                        onChange={handleChange}
                        options={DépartCategorie}
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
                        value={{ value: categorie.input, label: categorie.input }}
                    />
                    :
                    <div className="form-group row">
                        {props.info === "false" ?
                            null
                            :
                            <label className="col-12">
                                {categorie.name}
                            </label>
                        }
                        <Select
                            placeholder="Categorie..."
                            onChange={handleChange}
                            options={DépartCategorie}
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
                            className={props.info === "dash" ? "col-10" : " col-11"}
                            value={{ value: categorie.input, label: categorie.input }}
                        />

                        {props.dashboard ? null : <div className="col-1">
                            <img className={props.modeSombre === true ? "poubelleDark " : "poubelle"} onClick={handleClickPoubelle} src={require('../../images/icons/icons8-trash-30.webp')} alt="Poubelle" />
                        </div>}
                    </div>
                : null}
            {categorie.name === "Variante d'exercice explosif" ?
                props.info === "false" ?
                    <Select
                        placeholder="Categorie..."
                        onChange={handleChange}
                        options={ExplosifCategorie}
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
                        value={{ value: categorie.input, label: categorie.input }}
                    />
                    :
                    <div className="form-group row">
                        {props.info === "false" ?
                            null
                            :
                            <label className="col-12">
                                {categorie.name}
                            </label>
                        }
                        <Select
                            placeholder="Categorie..."
                            onChange={handleChange}
                            options={ExplosifCategorie}
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
                            className={props.info === "dash" ? "col-10" : " col-11"}
                            value={{ value: categorie.input, label: categorie.input }}
                        />

                        {props.dashboard ? null : <div className="col-1">
                            <img className={props.modeSombre === true ? "poubelleDark " : "poubelle"} onClick={handleClickPoubelle} src={require('../../images/icons/icons8-trash-30.webp')} alt="Poubelle" />
                        </div>}
                    </div>
                : null}
            {categorie.name === "Variante d'exercice d'haltérophilie" ?
                props.info === "false" ?
                    <Select
                        placeholder="Categorie..."
                        onChange={handleChange}
                        options={Halterophilie}
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
                        value={{ value: categorie.input, label: categorie.input }}
                    />
                    :
                    <div className="form-group row">
                        {props.info === "false" ?
                            null
                            :
                            <label className="col-12">
                                {categorie.name}
                            </label>
                        }
                        <Select
                            placeholder="Categorie..."
                            onChange={handleChange}
                            options={Halterophilie}
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
                            className={props.info === "dash" ? "col-10" : " col-11"}
                            value={{ value: categorie.input, label: categorie.input }}
                        />

                        {props.dashboard ? null : <div className="col-1">
                            <img className={props.modeSombre === true ? "poubelleDark " : "poubelle"} onClick={handleClickPoubelle} src={require('../../images/icons/icons8-trash-30.webp')} alt="Poubelle" />
                        </div>}
                    </div>
                : null}
            {categorie.name === "Terme générique" ?
                props.info === "false" ?
                    <Select
                        placeholder="Categorie..."
                        onChange={handleChange}
                        options={TermeGenerique}
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
                        value={{ value: categorie.input, label: categorie.input }}
                    />
                    :
                    <div className="form-group row">
                        {props.info === "false" ?
                            null
                            :
                            <label className="col-12">
                                {categorie.name}
                            </label>
                        }
                        <Select
                            placeholder="Categorie..."
                            onChange={handleChange}
                            options={TermeGenerique}
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
                            className={props.info === "dash" ? "col-10" : " col-11"}
                            value={{ value: categorie.input, label: categorie.input }}
                        />

                        {props.dashboard ? null : <div className="col-1">
                            <img className={props.modeSombre === true ? "poubelleDark " : "poubelle"} onClick={handleClickPoubelle} src={require('../../images/icons/icons8-trash-30.webp')} alt="Poubelle" />
                        </div>}
                    </div>
                : null}
            {categorie.name === "Accessoire supplémentaire ou objet spécifique" ?
                props.info === "false" ?
                    <Select
                        placeholder="Categorie..."
                        onChange={handleChange}
                        options={AccessoireObjet}
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
                        value={{ value: categorie.input, label: categorie.input }}
                    />
                    :
                    <div className="form-group row">
                        {props.info === "false" ?
                            null
                            :
                            <label className="col-12">
                                {categorie.name}
                            </label>
                        }
                        <Select
                            placeholder="Categorie..."
                            onChange={handleChange}
                            options={AccessoireObjet}
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
                            className={props.info === "dash" ? "col-10" : " col-11"}
                            value={{ value: categorie.input, label: categorie.input }}
                        />

                        {props.dashboard ? null : <div className="col-1">
                            <img className={props.modeSombre === true ? "poubelleDark " : "poubelle"} onClick={handleClickPoubelle} src={require('../../images/icons/icons8-trash-30.webp')} alt="Poubelle" />
                        </div>}
                    </div>
                : null}
            {categorie.name === "Elastique" ?
                props.info === "false" ?
                    <div>
                        <Select
                            placeholder="Utilisation..."
                            onChange={handleChange}
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
                            className={props.info === "dash" ? "col-10" : " col-11"}
                            options={[
                                { className: "select-title", id: "utilisation", value: "title", label: "/ (défaut)" },
                                { name: "Elastique", id: "utilisation", value: "Resistance", label: "Resistance" },
                                { name: "Elastique", id: "utilisation", value: "Assistance", label: "Assistance" }
                            ]}
                            value={{ value: categorie.utilisation, label: categorie.utilisation }}
                        />
                        <div style={{ height: "38px" }} className="col-10"></div>
                    </div>
                    :
                    props.dashboard ?
                        <div className="form-group row">
                            {props.info === "false" ?
                                null
                                :
                                <label className="col-12">
                                    Utilisation
                                </label>
                            }
                            <Select
                                placeholder="Utilisation..."
                                onChange={handleChange}
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
                                className={props.info === "dash" ? "col-10" : " col-11"}
                                options={[
                                    { className: "select-title", id: "utilisation", value: "title", label: "/ (défaut)" },
                                    { name: "Elastique", id: "utilisation", value: "Resistance", label: "Resistance" },
                                    { name: "Elastique", id: "utilisation", value: "Assistance", label: "Assistance" }
                                ]}
                                value={{ value: categorie.utilisation, label: categorie.utilisation }}
                            />

                            {props.dashboard ? null : <div className="col-1">
                                <img
                                    className={props.modeSombre === true ? "poubelleDark " : "poubelle"}
                                    onClick={handleClickPoubelle} src={require('../../images/icons/icons8-trash-30.webp')}
                                    alt="Poubelle"
                                />
                            </div>}
                        </div>
                        :
                        <div>
                            <h2 style={{ textAlign: "center" }}>
                                Elastique
                                <img
                                    className={props.modeSombre === true ? "poubelleDark " : "poubelle"}
                                    onClick={handleClickPoubelle} src={require('../../images/icons/icons8-trash-30.webp')}
                                    style={{ marginLeft: "2vw" }}
                                    alt="Poubelle" />

                            </h2>

                            <div className="form-group row">
                                {props.info === "false" ?
                                    null
                                    :
                                    <label className="col-12">
                                        Utilisation
                                    </label>
                                }
                                <Select
                                    placeholder="Utilisation..."
                                    onChange={handleChange}
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
                                    className={props.info === "dash" ? "col-10" : " col-11"}
                                    options={[
                                        { id: "utilisation", name: "Elastique", className: "select-title", value: "title", label: "/ (défaut)" },
                                        { id: "utilisation", name: "Elastique", value: "Resistance", label: "Resistance" },
                                        { id: "utilisation", name: "Elastique", value: "Assistance", label: "Assistance" }
                                    ]}
                                    value={{ value: categorie.utilisation, label: categorie.utilisation }}
                                />

                            </div>

                            <div className="form-group row">
                                <label className="col-12">
                                    Épaisseur / taille élastique
                                </label>
                                <Select
                                    placeholder="Categorie..."
                                    onChange={handleChange}
                                    options={lesElastiques}
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
                                    className={props.info === "dash" ? "col-10" : " col-11"}
                                    value={{ value: categorie.input, label: categorie.input }}
                                />
                            </div>

                            {categorie.input === "mesure" ?
                                <div className="form-group row">
                                    <label className="col-12">
                                        Tension (kg)
                                    </label>
                                    <div className="col-11">
                                        <input type="text"
                                            className={props.modeSombre === true ? "form-control inputDark " : "form-control"}
                                            id="estimation"
                                            value={categorie.estimation}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                :
                                <div>
                                    <div className="form-group row slider-style">
                                        <label className="col-12">
                                            Etirement (mètres)
                                        </label>
                                        {props.modeSombre === true ?
                                            <StyleSliderBlack
                                                style={
                                                    {
                                                        width: "74%",
                                                        marginLeft: "1%"
                                                    }
                                                }
                                                defaultValue={parseInt(categorie.tension)}
                                                onChange={handleChangeSlider}
                                                getAriaValueText={valuetext}
                                                aria-labelledby="discrete-slider-custom"
                                                step={0.5}
                                                max={9}
                                                min={0.5}
                                                valueLabelDisplay="auto"
                                                marks={marks}
                                            />
                                            :
                                            <StyleSliderWhite
                                                style={
                                                    {
                                                        width: "74%",
                                                        marginLeft: "1%"
                                                    }
                                                }
                                                defaultValue={parseFloat(categorie.tension)}
                                                onChange={handleChangeSlider}
                                                getAriaValueText={valuetext}
                                                aria-labelledby="discrete-slider-custom"
                                                step={0.5}
                                                max={9}
                                                min={0.5}
                                                valueLabelDisplay="auto"
                                                marks={marks}
                                            />
                                        }
                                    </div>

                                    <div className="form-group row">
                                        <label className="col-12">
                                            Estimation
                                            <img className={props.modeSombre === true ? "myDIV questionDark " : "myDIV"} onClick={handleClickElastique} src={require('../../images/icons/icons8-question-mark-96.webp')} alt="?" />
                                            <div className={elastiqueHiddenClick}>
                                                <ElastiqueHiddenText />
                                            </div>
                                        </label>
                                        <div className="col-11">
                                            <input type="text"
                                                className={props.modeSombre === true ? "form-control inputDark " : "form-control"}
                                                id="estimation"
                                                value={categorie.estimation + " kg"}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                : null}

        </div>
    );
};

export default CategorieInput;











