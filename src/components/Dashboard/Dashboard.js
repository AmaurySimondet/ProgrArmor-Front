import { React, useState, useEffect } from "react";
import NavigBar from "../NavigBar.jsx"
import Bienvenue from "../Bienvenue.jsx"
import API from "../../utils/API";
import ExerciceInput from "./ExerciceInput"
import DetailInput from "./DetailInput"
import { customStyles, customStylesDark, customStylesMini, customStylesDarkMini } from "../../utils/customStyles";
import CategorieInput from "./CategorieInput"
import Footer from "../Footer.jsx";
import Slider from '@mui/material/Slider';
import { alpha, styled } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import Switch from '@mui/material/Switch';
import Select from 'react-select';
import { v4 as uuidv4 } from 'uuid';

function containsObj(arr, obj) {
    let contains = arr.some(elem => {
        return JSON.stringify(obj) === JSON.stringify(elem);
    });
    return contains
}

const GreenSwitch = styled(Switch)(({ theme }) => ({

    '& .MuiSwitch-switchBase.Mui-checked': {
        color: red['A700'],
        '&:hover': {
            backgroundColor: alpha(red['A700'], theme.palette.action.hoverOpacity),
        },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: red['A700'],
    },
}));

let StyleSlider = styled(Slider)(({ theme }) => ({
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

const marks = [
    {
        value: 0,
        label: '0',
    },
    {
        value: 1,
        label: '1',
    },
    {
        value: 2,
        label: '2',
    },
    {
        value: 3,
        label: '3',
    },
    {
        value: 4,
        label: '4',
    },
    {
        value: 5,
        label: '5',
    },

];

function valuetext(value) {
    return `${value}`;

}

function Dashboard() {


    const [seances, setSeances] = useState([]);
    const [exercice, setExercice] = useState({ exercice: { name: "title", ownExercice: "" } });
    const [listeNoms, setListeNoms] = useState([]);
    const [details, setDetails] = useState([]);
    const [categories, setCategories] = useState([])
    const [params, setParams] = useState({ id: localStorage.getItem("id"), nom: "", periode: "max", tri: "Ordre chronologique décroissant", repsFrom: "", repsTo: "", exerciceName: "title", exerciceOwnExercice: "" });
    const [categoriesAddRien, setCategoriesAddRien] = useState([])
    const [detailsAddRien, setDetailsAddRien] = useState([])
    const [checkbox, setCheckbox] = useState({ affichageCharge: true, affichageReps: true, affichageNom: true, affichageDate: true, affichageExercice: true, affichageType: false, affichagePercent: true, affichagePoids: false, affichageModif: false, affichageSuppr: false, affichageExport: false });
    const [clicked, setClicked] = useState([false, false, false, false, false])
    const [clickedDetail, setClickedDetail] = useState([false, false, false, false, false])
    const [switched, setSwitched] = useState(false);
    const [dimensions, setDimensions] = useState({
        height: window.innerHeight,
        width: window.innerWidth
    })
    const [clickAffichage, setClickAffichage] = useState(false);
    const [clickFiltrage, setClickFiltrage] = useState(false);
    const [user, setUser] = useState({ modeSombre: false });

    async function getUser() {
        const { data } = await API.getUser({ id: localStorage.getItem("id") });
        if (data.success === false) {
            alert(data.message);
        } else {
            if (data.profile.modeSombre && data.profile.modeSombre === true) {
                // 👇 add class to body element
                document.body.classList.add('darkMode');
                setSwitched(true);

                StyleSlider = styled(Slider)(({ theme }) => ({
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
            }
            else {
                data.profile.modeSombre = false;
            }

            // set listeNoms
            let arr = [{ id: "nom", label: "/ (défaut)", value: "title" }]
            if (data.profile.seances) {
                data.profile.seances.forEach((seance, index) => {
                    if (seance.nom) {
                        if (seance.nom.ancienNom !== "nouveau-nom") {
                            if (!arr.includes(seance.nom.ancienNom)) {
                                let obj = { id: "nom", label: seance.nom.ancienNom, value: seance.nom.ancienNom }
                                if (!containsObj(arr, obj)) {
                                    arr.push(obj)
                                }
                            }
                        }
                        else {
                            if (!arr.includes(seance.nom.nouveauNom)) {
                                let obj = { id: "nom", label: seance.nom.nouveauNom, value: seance.nom.nouveauNom }
                                if (!containsObj(arr, obj)) {
                                    arr.push(obj)
                                }
                            }
                        }
                    }
                })
            }
            arr.push({ id: "nom", value: "nouveau-nom", label: "Entrer un nouveau nom de séance..." })

            setListeNoms(arr);
            setUser(data.profile);
        };
    }

    useEffect(() => {
        setTimeout(getUser, 50);
    }, []);


    function handleClickAffichage() {
        setClickAffichage(!clickAffichage);
    }

    function handleClickFiltrage() {
        setClickFiltrage(!clickFiltrage);
    }

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

    function handleChangeSwitch() {
        event.preventDefault();

        setSwitched(!switched);
    }

    function handleClick(event) {
        let e = parseInt(event.target.id)

        setClicked(clicked.slice(0, e).concat([!clicked[e]], clicked.slice(e + 1, clicked.length)));

        setParams(oldParams => {
            return ({
                ...oldParams,
                ["categorie" + e + "name"]: "",
                ["categorie" + e + "utilisation"]: "",
                ["categorie" + e + "input"]: "",
                ["categorie" + e + "estimation"]: "",
            })
        });
    }

    function handleClickDetail(event) {
        let e = parseInt(event.target.id)

        setClickedDetail(clickedDetail.slice(0, e).concat([!clickedDetail[e]], clickedDetail.slice(e + 1, clickedDetail.length)));

        setParams(oldParams => {
            return ({
                ...oldParams,
                ["detail" + e + "name"]: "",
                ["detail" + e + "input"]: "",
            })
        });
    }

    function handleChangeSliderCategorie(event) {
        let arr = [];
        let arr2 = [];

        for (let i = 0; i < event.target.value; i++) {
            arr.push("rien");
            arr2.push({ id: uuidv4(), index: i })
        };

        setCategoriesAddRien(arr);
        setCategories(arr2)

    }

    function handleChangeSliderDetail(event) {
        let arr = [];
        let arr2 = [];

        for (let i = 0; i < event.target.value; i++) {
            arr.push("rien");
            arr2.push({ id: uuidv4(), index: i })
        };

        setDetailsAddRien(arr);
        setDetails(arr2)
    }

    async function getWorkouts() {
        if (params.categories) {
            params.categories.forEach((categorie, index) => {
                if (categorie.name === "Elastique") {
                    setParams(oldParams => {
                        return ({
                            ...oldParams,
                            ["categorie" + index + "name"]: categorie.name,
                            ["categorie" + index + "utilisation"]: categorie.utilisation,
                            ["categorie" + index + "input"]: categorie.input,
                            ["categorie" + index + "estimation"]: categorie.estimation,
                        })
                    });
                }
                else {
                    setParams(oldParams => {
                        return ({
                            ...oldParams,
                            ["categorie" + categorie.index + "name"]: categorie.name,
                            ["categorie" + categorie.index + "input"]: categorie.input,
                        })
                    });
                }
            })
            delete params.categories
        }
        if (params.details) {
            params.details.forEach((detail, index) => {
                setParams(oldParams => {
                    return ({
                        ...oldParams,
                        ["detail" + detail.index + "name"]: detail.name,
                        ["detail" + detail.index + "input"]: detail.input,
                    })
                });
            })
            delete params.details
        }

        const { data } = await API.workouts(params);
        if (data.success === false) {
            if (data.message === "Aucune séance !") {
                console.log(data.message);
            }
            else { alert(data.message); }
        } else {
            setSeances(data.seances);
        }
    }

    useEffect(() => {
        setTimeout(getWorkouts, 50);
    }, [params]);

    function handleChange(event) {
        console.log(event)
        if (event.target) {
            setParams(oldParams => {
                return ({
                    ...oldParams,
                    [event.target.id]: event.target.value,
                })
            });
        }
        else {
            setParams(oldParams => {
                return ({
                    ...oldParams,
                    [event.id]: event.value,
                })
            });
        }
    }

    function handleChangeCheckbox(e) {
        let value = e.target.value;

        setCheckbox(oldCheckbox => {
            return ({
                ...oldCheckbox,
                [value]: !oldCheckbox[value],
            })
        });
    }

    function changeExercice(exercice) {
        setExercice(oldExercice => {
            return ({
                ...oldExercice,
                exercice: exercice,
            });
        });
    }

    useEffect(() => {
        if (exercice.exercice.name === "Elevation" || exercice.exercice.name === "Curl" || exercice.exercice.name === "Extension" || exercice.exercice.name === "Abduction" || exercice.exercice.name === "Adduction" || exercice.exercice.name === "Press") {
            if (exercice.exercice.muscle) {
                setParams(oldParams => {
                    return ({
                        ...oldParams,
                        exerciceName: exercice.exercice.name,
                        exerciceOwnExercice: exercice.exercice.ownExercice,
                        exerciceMuscle: exercice.exercice.muscle
                    })
                })
            }
        }
        else {
            setParams(oldParams => {
                return ({
                    ...oldParams,
                    exerciceName: exercice.exercice.name,
                    exerciceOwnExercice: exercice.exercice.ownExercice,
                    exerciceMuscle: "",
                })
            })
        }
    }, [exercice]);

    function trStyleBlack(index) {
        let backgroundColor;

        if (index % 2 === 0) {
            backgroundColor = "#330000"
        } else {
            backgroundColor = "#220000"
        }

        return ({
            backgroundColor: backgroundColor
        })
    }

    function tdStyleBlack(index) {
        let font;

        if (index % 2 === 0) {
            font = "#ffbaba"
        } else {
            font = "white"
        }

        return ({
            color: font
        })
    }

    function trStyleWhite(index) {
        let backgroundColor;

        if (index % 2 === 0) {
            backgroundColor = "white"
        } else {
            backgroundColor = "#f0f0f0"
        }

        return ({
            backgroundColor: backgroundColor
        })
    }

    function tdStyleWhite(index) {
        let font;

        if (index % 2 === 0) {
            font = "#ff0000"
        } else {
            font = "black"
        }

        return ({
            color: font
        })
    }

    function changeCategorie(changedC, id) {
        let newC = [...categories]
        let indexOfChg = newC.findIndex(c => c.id === id)

        newC.splice(indexOfChg, 1, changedC)

        setCategories(newC)
    }

    useEffect(() => {
        setParams(oldParams => {
            return ({
                ...oldParams,
                categories: categories
            })
        })
    }, [categories]);

    useEffect(() => {
        setParams(oldParams => {
            return ({
                ...oldParams,
                details: details
            })
        })
    }, [details]);

    function changeDetail(changedD, id) {
        let newD = [...details]
        let indexOfChg = newD.findIndex(d => d.id === id)

        newD.splice(indexOfChg, 1, changedD)

        setCategories(newD)
    }

    function resetParameters() {
        event.preventDefault();

        setCategories([])
        setDetails([])
        setClicked([true, true, true, true, true])
        setClickedDetail([true, true, true, true, true])
        setCategoriesAddRien([])
        setDetailsAddRien([])
        setParams({ nom: "", periode: "max", tri: "Ordre chronologique décroissant", repsFrom: "", repsTo: "", exerciceName: "title", exerciceOwnExercice: "" })
    }

    function handleClickModify(event) {
        window.location = "/session?seanceId=" + event.target.id
    }

    async function handleClickSuppr(event) {
        const res = await API.supprSeance({ id: localStorage.getItem("id"), seanceId: event.target.id })

        if (res.success === false) {
            alert(res.message)
        }
        else {
            window.location = "/dashboard"
        }
    }

    function exportTableToCSV(html, filename) {
        var csv = [];
        var rows = document.querySelectorAll("table tr");

        csv.push(["Ce tableau est une exportation de Prograrmor"])
        csv.push(["ProgrArmor outil ultime de la progression sportive: journal et historique programme statistiques de tes amis et autre"])
        csv.push(["https://prograrmor.com/"])
        csv.push([])
        for (let i = 1; i < rows.length; i++) {
            let row = [], cols = rows[i].querySelectorAll("td, th");
            for (let j = 0; j < cols.length; j++) {
                row.push(cols[j].innerText);
            }
            csv.push(row.join(","));
        }

        // download csv file
        downloadCSV(csv.join("\n"), "Dashboard.csv");
    }

    function downloadCSV(csv, filename) {
        let csvFile;
        let downloadLink;

        csvFile = new Blob([csv], { type: "text/csv" });
        downloadLink = document.createElement("a");
        downloadLink.download = filename;
        downloadLink.href = window.URL.createObjectURL(csvFile);
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
    }

    return (
        <div>


            {
                seances.length === 0 ?
                    <NavigBar show={true} location="dashboard" />
                    :
                    <NavigBar show={false} location="dashboard" />
            }



            {seances.length === 0 ?
                <div >
                    <Bienvenue modeSombre={user?.modeSombre} />
                    <Footer />
                </div>
                :
                dimensions.width < 925 ?
                    <div className="Dashboard">

                        <h1 className="Dashboard-h1">Historique des séances</h1>

                        <form className="debutant-form">
                            <h2
                                onClick={handleClickFiltrage}>
                                Filtrage
                                <img className={clickFiltrage ? "expert-toggle rotated" : "expert-toggle not-rotated"}
                                    src={require('../../images/icons/icons8-expand-arrow-90.webp')} />
                            </h2>


                            <div className={clickFiltrage ? "extended" : "not-extended"}>
                                <div className="form-group row">
                                    <div className="form-group col-6">
                                        <label className=" col-form-label">
                                            Tri
                                        </label>
                                        <Select onChange={handleChange} placeholder="Tri..." id="tri"
                                            options={[
                                                { id: "tri", label: "Ordre chronologique décroissant (défaut)", value: "Ordre chronologique décroissant" },
                                                { id: "tri", label: "Ordre chronologique croissant", value: "Ordre chronologique croissant" },
                                                { id: "tri", label: "Charge (ordre décroissant)", value: "Charge (ordre décroissant)" },
                                                { id: "tri", label: "%PDC (ordre décroissant)", value: "PDC (ordre décroissant)" }
                                            ]}
                                            styles={
                                                dimensions.width <= 500 ?
                                                    user.modeSombre === true ?
                                                        customStylesDarkMini
                                                        :
                                                        customStylesMini
                                                    :
                                                    user.modeSombre === true ?
                                                        customStylesDark
                                                        :
                                                        customStyles
                                            }
                                            value={{ label: params.tri, value: params.tri }}
                                        />
                                    </div>

                                    <div className="form-group col-6">
                                        <label className=" col-form-label">
                                            Periode
                                        </label>
                                        <Select onChange={handleChange} placeholder="Periode..." id="periode"
                                            options={[
                                                { id: "periode", label: "Max (défaut)", value: "max" },
                                                { id: "periode", label: "7 derniers jours", value: "7d" },
                                                { id: "periode", label: "30 derniers jours", value: "30d" },
                                                { id: "periode", label: "90 derniers jours (3 mois)", value: "90d" },
                                                { id: "periode", label: "180 derniers jours (6 mois)", value: "180d" },
                                                { id: "periode", label: "Depuis 1 an", value: "1y" }
                                            ]}
                                            styles={
                                                dimensions.width <= 500 ?
                                                    user.modeSombre === true ?
                                                        customStylesDarkMini
                                                        :
                                                        customStylesMini
                                                    :
                                                    user.modeSombre === true ?
                                                        customStylesDark
                                                        :
                                                        customStyles
                                            }
                                            value={{ label: params.periode, value: params.periode }}
                                        />
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <div className="form-group col-6">
                                        <label className="col-form-label">
                                            Exercice
                                        </label>
                                        <ExerciceInput dimensions={dimensions} modeSombre={user.modeSombre ? true : false} exercice={exercice.exercice} taille="petit" typeSerie={0} id="exercice" changeExercice={changeExercice} />
                                    </div>

                                    <div className="form-group col-6">
                                        <label className="col-form-label">
                                            Reps / Temps
                                        </label>
                                        <input type="text"
                                            className={user.modeSombre ? "inputDark form-control" : "form-control"}
                                            value={params.repsFrom}
                                            onChange={handleChange}
                                            placeholder="Aucun filtre"
                                            id="repsFrom"
                                        />
                                        <label className="col-form-label">
                                            à
                                        </label>
                                        <input type="text"
                                            className={user.modeSombre ? "inputDark form-control" : "form-control"}
                                            value={params.repsTo}
                                            onChange={handleChange}
                                            placeholder="Aucun filtre"
                                            id="repsTo"
                                        />
                                    </div>
                                </div>

                                {categoriesAddRien.map((rien, index) => {
                                    return (
                                        <div className="form-group row">
                                            <div className="form-group col-12">
                                                <label onClick={handleClick} id={index} className="col-form-label categorie-label">
                                                    Catégorie {index + 1} <img className={user.modeSombre === true ? "reset-img  questionDark" : "reset-img"} onClick={handleClick} src={require('../../images/icons/reset.webp')} />
                                                </label>
                                                <CategorieInput dimensions={dimensions} modeSombre={user.modeSombre ? true : false} categorie={categories[index]} info="dash" click={clicked[index]} id={"catégorie" + index} index={index} dashboard={true} exercice={exercice.exercice} changeCategorie={changeCategorie} />
                                            </div>
                                        </div>
                                    )
                                })}

                                {detailsAddRien.map((rien, index) => {
                                    return (
                                        <div className="form-group row">
                                            <div className="form-group col-12">
                                                <label onClick={handleClickDetail} id={index} className="col-form-label detail-label">
                                                    Détail {index + 1} <img onClick={handleClickDetail} className={user.modeSombre === true ? "reset-img  questionDark" : "reset-img"} src={require('../../images/icons/reset.webp')} />
                                                </label>
                                                <DetailInput dimensions={dimensions} modeSombre={user.modeSombre ? true : false} detail={details[index]} info={true} click={clickedDetail[index]} id={"detail" + index} index={index} dashboard={true} changeDetail={changeDetail} />
                                            </div>
                                        </div>
                                    )
                                })}

                                <div className="form-group row">
                                    <div className="form-group col-6" style={{ margin: "0" }}>
                                        <label className=" col-form-label">
                                            Nom
                                        </label>
                                        <Select onChange={handleChange} placeholder="Nom..." id="nom"
                                            options={listeNoms}
                                            styles={
                                                dimensions.width <= 500 ?
                                                    user.modeSombre === true ?
                                                        customStylesDarkMini
                                                        :
                                                        customStylesMini
                                                    :
                                                    user.modeSombre === true ?
                                                        customStylesDark
                                                        :
                                                        customStyles
                                            }
                                            value={{ label: params.nom, value: params.nom }}
                                        />
                                    </div>

                                    <div className="form-group col-3 button-dashboard">
                                        <button className="btn btn-dark form-button" onClick={resetParameters} type="submit">Reset des paramètres</button>
                                    </div>
                                </div>
                            </div>


                            <h2
                                onClick={handleClickAffichage}>
                                Affichage
                                <img className={clickAffichage ? "expert-toggle rotated" : "expert-toggle not-rotated"}
                                    src={require('../../images/icons/icons8-expand-arrow-90.webp')} />
                            </h2>


                            <div className={clickAffichage ? "extended" : "not-extended"}>
                                <div className="form-group row slider-style">
                                    <label className="col-1 col-form-label">
                                        Nombre de catégories
                                    </label>
                                    <div className="col-5">
                                        <StyleSlider
                                            style={
                                                {
                                                    width: "70%",
                                                }
                                            }
                                            defaultValue={0}
                                            onChange={handleChangeSliderCategorie}
                                            getAriaValueText={valuetext}
                                            aria-labelledby="discrete-slider-custom"
                                            step={1}
                                            max={5}
                                            min={0}
                                            valueLabelDisplay="auto"
                                            marks={marks}
                                        />
                                    </div>

                                    <label className="col-1 col-form-label">
                                        Nombre de détails
                                    </label>
                                    <div className="col-5">
                                        <StyleSlider
                                            style={
                                                {
                                                    width: "70%",
                                                }
                                            }
                                            defaultValue={0}
                                            onChange={handleChangeSliderDetail}
                                            getAriaValueText={valuetext}
                                            aria-labelledby="discrete-slider-custom"
                                            step={1}
                                            max={5}
                                            min={0}
                                            valueLabelDisplay="auto"
                                            marks={marks}
                                        />
                                    </div>

                                </div>

                                <div className="form-group row">
                                    <div className="form-group group-margin 2">
                                        <input defaultChecked={true} type="checkbox" className="col-form-control" onChange={handleChangeCheckbox} value="affichageNom" id="affichageNom" />
                                        <label className="col-form-label" htmlFor="#affichageNom"> Nom </label>

                                        <input defaultChecked={true} type="checkbox" className="col-form-control" onChange={handleChangeCheckbox} value="affichageDate" id="affichageDate" />
                                        <label className="col-form-label" htmlFor="#affichageDate"> Date </label>

                                        <input defaultChecked={false} type="checkbox" className="col-form-control" onChange={handleChangeCheckbox} value="affichagePoids" id="affichagePoids" />
                                        <label className="col-form-label" htmlFor="#affichagePoids"> Poids </label>

                                        <input defaultChecked={true} type="checkbox" className="col-form-control" onChange={handleChangeCheckbox} value="affichageExercice" id="affichageExercice" />
                                        <label className="col-form-label" htmlFor="#affichageExercice"> Exercice </label>

                                        <input defaultChecked={false} type="checkbox" className="col-form-control" onChange={handleChangeCheckbox} value="affichageType" id="affichageType" />
                                        <label className="col-form-label" htmlFor="#affichageType"> Type </label>

                                        <input defaultChecked={true} type="checkbox" className="col-form-control" onChange={handleChangeCheckbox} value="affichageReps" id="affichageReps" />
                                        <label className="col-form-label" htmlFor="#affichageReps"> Reps </label>

                                        <input defaultChecked={true} type="checkbox" className="col-form-control" onChange={handleChangeCheckbox} value="affichageCharge" id="affichageCharge" />
                                        <label className="col-form-label" htmlFor="#affichageCharge"> Charge </label>

                                        <input defaultChecked={true} type="checkbox" className="col-form-control" onChange={handleChangeCheckbox} value="affichagePercent" id="affichagePercent" />
                                        <label className="col-form-labell" htmlFor="#affichagePercent"> % PDC </label>
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <div className="form-group group-margin col-12">
                                        <p className=""> Tableau blanc
                                            <GreenSwitch
                                                onChange={handleChangeSwitch}
                                                defaultChecked={user.modeSombre ? user.modeSombre === true ? true : false : false}
                                            /> Tableau noir </p>
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <div className="form-group col-4">
                                        <input defaultChecked={false} type="checkbox" className="col-form-control" onChange={handleChangeCheckbox} value="affichageModif" id="affichageModif" />
                                        <label className="col-form-label" htmlFor="#affichageModif"> Modifier des séances </label>
                                    </div>

                                    <div className="form-group group-margin-last col-4">
                                        <input defaultChecked={false} type="checkbox" className="col-form-control" onChange={handleChangeCheckbox} value="affichageSuppr" id="affichageSuppr" />
                                        <label className="col-form-label" htmlFor="#affichageSuppr"> Supprimer des séances </label>
                                    </div>

                                    <div className="form-group group-margin-last col-4">
                                        <input defaultChecked={false} type="checkbox" className="col-form-control" onChange={handleChangeCheckbox} value="affichageExport" id="affichageExport" />
                                        <label className="col-form-label" htmlFor="#affichageExport"> Exporter le tableau en CSV </label>
                                    </div>
                                </div>

                            </div>

                        </form>
                    </div>

                    :

                    <div className="Dashboard">

                        <h1 className="Dashboard-h1">Historique des séances</h1>

                        <table className="dashboard-table">
                            <tr>
                                <td className="td-left">
                                    <h2
                                        onClick={handleClickFiltrage}>
                                        Filtrage
                                        <img className={clickFiltrage ? "expert-toggle rotated" : "expert-toggle not-rotated"}
                                            src={require('../../images/icons/icons8-expand-arrow-90.webp')} />
                                    </h2>


                                    <div className={clickFiltrage ? "extended" : "not-extended"}>
                                        <div className="form-group row">
                                            <div className="form-group col-6">
                                                <label className=" col-form-label">
                                                    Tri
                                                </label>
                                                <Select onChange={handleChange} placeholder="Tri..." id="tri"
                                                    options={[
                                                        { id: "tri", label: "Ordre chronologique décroissant (défaut)", value: "Ordre chronologique décroissant" },
                                                        { id: "tri", label: "Ordre chronologique croissant", value: "Ordre chronologique croissant" },
                                                        { id: "tri", label: "Charge (ordre décroissant)", value: "Charge (ordre décroissant)" },
                                                        { id: "tri", label: "%PDC (ordre décroissant)", value: "PDC (ordre décroissant)" }
                                                    ]}
                                                    styles={
                                                        dimensions.width <= 500 ?
                                                            user.modeSombre === true ?
                                                                customStylesDarkMini
                                                                :
                                                                customStylesMini
                                                            :
                                                            user.modeSombre === true ?
                                                                customStylesDark
                                                                :
                                                                customStyles
                                                    }
                                                    value={{ label: params.tri, value: params.tri }}
                                                />
                                            </div>

                                            <div className="form-group col-6">
                                                <label className=" col-form-label">
                                                    Periode
                                                </label>
                                                <Select onChange={handleChange} placeholder="Periode..." id="periode"
                                                    options={[
                                                        { id: "periode", label: "Max (défaut)", value: "max" },
                                                        { id: "periode", label: "7 derniers jours", value: "7d" },
                                                        { id: "periode", label: "30 derniers jours", value: "30d" },
                                                        { id: "periode", label: "90 derniers jours (3 mois)", value: "90d" },
                                                        { id: "periode", label: "180 derniers jours (6 mois)", value: "180d" },
                                                        { id: "periode", label: "Depuis 1 an", value: "1y" }
                                                    ]}
                                                    styles={
                                                        dimensions.width <= 500 ?
                                                            user.modeSombre === true ?
                                                                customStylesDarkMini
                                                                :
                                                                customStylesMini
                                                            :
                                                            user.modeSombre === true ?
                                                                customStylesDark
                                                                :
                                                                customStyles
                                                    }
                                                    value={{ label: params.periode, value: params.periode }}
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <div className="form-group col-6">
                                                <label className="col-form-label">
                                                    Exercice
                                                </label>
                                                <ExerciceInput dimensions={dimensions} modeSombre={user.modeSombre ? true : false}
                                                    exercice={exercice.exercice}
                                                    taille="petit"
                                                    typeSerie={0} id="exercice" changeExercice={changeExercice}
                                                />
                                            </div>

                                            <div className="form-group col-6">
                                                <label className="col-form-label">
                                                    Reps / Temps
                                                </label>
                                                <input type="text"
                                                    className={user.modeSombre ? "inputDark form-control" : "form-control"}
                                                    value={params.repsFrom}
                                                    onChange={handleChange}
                                                    placeholder="Aucun filtre"
                                                    id="repsFrom"
                                                />
                                                <label className="col-form-label">
                                                    à
                                                </label>
                                                <input type="text"
                                                    className={user.modeSombre ? "inputDark form-control" : "form-control"}
                                                    value={params.repsTo}
                                                    onChange={handleChange}
                                                    placeholder="Aucun filtre"
                                                    id="repsTo"
                                                />
                                            </div>
                                        </div>

                                        {categoriesAddRien.map((rien, index) => {
                                            return (
                                                <div className="form-group row">
                                                    <div className="form-group col-12">
                                                        <label onClick={handleClick} id={index} className="col-form-label categorie-label">
                                                            Catégorie {index + 1} <img onClick={handleClick} className={user.modeSombre === true ? "reset-img  questionDark" : "reset-img"} src={require('../../images/icons/reset.webp')} />
                                                        </label>
                                                        <CategorieInput dimensions={dimensions} modeSombre={user.modeSombre ? true : false} categorie={categories[index]} info="dash" click={clicked[index]} id={"catégorie" + index} index={index} dashboard={true} exercice={exercice.exercice} changeCategorie={changeCategorie} />
                                                    </div>
                                                </div>
                                            )
                                        })}

                                        {detailsAddRien.map((rien, index) => {
                                            return (
                                                <div className="form-group row">
                                                    <div className="form-group col-12">
                                                        <label onClick={handleClickDetail} id={index} className="col-form-label detail-label">
                                                            Détail {index + 1} <img onClick={handleClickDetail} className={user.modeSombre === true ? "reset-img  questionDark" : "reset-img"} src={require('../../images/icons/reset.webp')} />
                                                        </label>
                                                        <DetailInput dimensions={dimensions} modeSombre={user.modeSombre ? true : false} detail={details[index]} info={true} click={clickedDetail[index]} id={"detail" + index} index={index} dashboard={true} changeDetail={changeDetail} />
                                                    </div>
                                                </div>
                                            )
                                        })}

                                        <div className="form-group row">
                                            <div className="form-group col-6">
                                                <label className=" col-form-label">
                                                    Nom
                                                </label>
                                                <Select onChange={handleChange} placeholder="Nom..." id="nom"
                                                    options={listeNoms}
                                                    styles={
                                                        dimensions.width <= 500 ?
                                                            user.modeSombre === true ?
                                                                customStylesDarkMini
                                                                :
                                                                customStylesMini
                                                            :
                                                            user.modeSombre === true ?
                                                                customStylesDark
                                                                :
                                                                customStyles
                                                    }
                                                    value={{ label: params.nom, value: params.nom }}
                                                />
                                            </div>

                                            <div className="form-group col-3 button-dashboard">
                                                <button className="btn btn-dark form-button" onClick={resetParameters} type="submit">Reset des paramètres</button>
                                            </div>
                                        </div>
                                    </div>

                                </td>



                                <td className="td-right">
                                    <h2
                                        onClick={handleClickAffichage}>
                                        Affichage
                                        <img className={clickAffichage ? "expert-toggle rotated" : "expert-toggle not-rotated"}
                                            src={require('../../images/icons/icons8-expand-arrow-90.webp')} />
                                    </h2>


                                    <div className={clickAffichage ? "extended" : "not-extended"}>
                                        <div className="form-group row slider-style">
                                            <label className="col-1 col-form-label">
                                                Nombre de catégories
                                            </label>
                                            <div className="col-5">
                                                <StyleSlider
                                                    style={
                                                        {
                                                            width: "70%",
                                                        }
                                                    }
                                                    defaultValue={categories.length}
                                                    onChange={handleChangeSliderCategorie}
                                                    getAriaValueText={valuetext}
                                                    aria-labelledby="discrete-slider-custom"
                                                    step={1}
                                                    max={5}
                                                    min={0}
                                                    valueLabelDisplay="auto"
                                                    marks={marks}
                                                />
                                            </div>

                                            <label className="col-1 col-form-label">
                                                Nombre de détails
                                            </label>
                                            <div className="col-5">
                                                <StyleSlider
                                                    style={
                                                        {
                                                            width: "70%",
                                                        }
                                                    }
                                                    defaultValue={details.length}
                                                    onChange={handleChangeSliderDetail}
                                                    getAriaValueText={valuetext}
                                                    aria-labelledby="discrete-slider-custom"
                                                    step={1}
                                                    max={5}
                                                    min={0}
                                                    valueLabelDisplay="auto"
                                                    marks={marks}
                                                />
                                            </div>

                                        </div>

                                        <div className="form-group row">
                                            <div className="form-group group-margin 2">
                                                <input defaultChecked={true} type="checkbox" className="col-form-control" onChange={handleChangeCheckbox} value="affichageNom" id="affichageNom" />
                                                <label className="col-form-label" htmlFor="#affichageNom"> Nom </label>

                                                <input defaultChecked={true} type="checkbox" className="col-form-control" onChange={handleChangeCheckbox} value="affichageDate" id="affichageDate" />
                                                <label className="col-form-label" htmlFor="#affichageDate"> Date </label>

                                                <input defaultChecked={false} type="checkbox" className="col-form-control" onChange={handleChangeCheckbox} value="affichagePoids" id="affichagePoids" />
                                                <label className="col-form-label" htmlFor="#affichagePoids"> Poids </label>

                                                <input defaultChecked={true} type="checkbox" className="col-form-control" onChange={handleChangeCheckbox} value="affichageExercice" id="affichageExercice" />
                                                <label className="col-form-label" htmlFor="#affichageExercice"> Exercice </label>

                                                <input defaultChecked={false} type="checkbox" className="col-form-control" onChange={handleChangeCheckbox} value="affichageType" id="affichageType" />
                                                <label className="col-form-label" htmlFor="#affichageType"> Type </label>

                                                <input defaultChecked={true} type="checkbox" className="col-form-control" onChange={handleChangeCheckbox} value="affichageReps" id="affichageReps" />
                                                <label className="col-form-label" htmlFor="#affichageReps"> Reps </label>

                                                <input defaultChecked={true} type="checkbox" className="col-form-control" onChange={handleChangeCheckbox} value="affichageCharge" id="affichageCharge" />
                                                <label className="col-form-label" htmlFor="#affichageCharge"> Charge </label>

                                                <input defaultChecked={true} type="checkbox" className="col-form-control" onChange={handleChangeCheckbox} value="affichagePercent" id="affichagePercent" />
                                                <label className="col-form-labell" htmlFor="#affichagePercent"> % PDC </label>
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <div className="form-group group-margin col-12">
                                                <p className=""> Tableau blanc
                                                    <GreenSwitch
                                                        onChange={handleChangeSwitch}
                                                        defaultChecked={user.modeSombre ? user.modeSombre === true ? true : false : false}
                                                    /> Tableau noir </p>
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <div className="form-group col-4">
                                                <input defaultChecked={false} type="checkbox" className="col-form-control" onChange={handleChangeCheckbox} value="affichageModif" id="affichageModif" />
                                                <label className="col-form-label" htmlFor="#affichageModif"> Modifier des séances </label>
                                            </div>

                                            <div className="form-group group-margin-last col-4">
                                                <input defaultChecked={false} type="checkbox" className="col-form-control" onChange={handleChangeCheckbox} value="affichageSuppr" id="affichageSuppr" />
                                                <label className="col-form-label" htmlFor="#affichageSuppr"> Supprimer des séances </label>
                                            </div>

                                            <div className="form-group group-margin-last col-4">
                                                <input defaultChecked={false} type="checkbox" className="col-form-control" onChange={handleChangeCheckbox} value="affichageExport" id="affichageExport" />
                                                <label className="col-form-label" htmlFor="#affichageExport"> Exporter en CSV </label>
                                            </div>
                                        </div>
                                    </div>

                                </td>
                            </tr>
                        </table>
                    </div>

            }

            {seances.length === 0 ? null :
                <div className="Dashboard">
                    {checkbox.affichageExport ?
                        <button className="btn btn-lg btn-dark large-margin-bottom" onClick={exportTableToCSV}>
                            Exporter le tableau actuel en CSV
                        </button>
                        : null}

                    <table className={switched ? "table table-hover table-responsive-lg table-dark dashboard-table" : "table table-hover table-responsive-lg dashboard-table"}>
                        <thead className={switched ? "thead-dark" : ""}>
                            <tr>
                                {/* <th scope="col">ID</th> */}
                                {checkbox.affichageModif ? <th scope="col">Modifier </th> : null}
                                {checkbox.affichageSuppr ? <th scope="col">Supprimer </th> : null}
                                {checkbox.affichageNom ? <th scope="col">Nom </th> : null}
                                {checkbox.affichageDate ? <th scope="col">Date </th> : null}
                                {checkbox.affichagePoids ? <th scope="col">Poids</th> : null}
                                {checkbox.affichageExercice ? <th scope="col">Exercice</th> : null}
                                {categoriesAddRien.map(rien => {
                                    return <th scope="col">Categorie</th>
                                })}
                                {checkbox.affichageType ? <th scope="col">Type</th> : null}
                                {checkbox.affichageReps ? <th scope="col">Reps / Temps</th> : null}
                                {checkbox.affichageCharge ? <th scope="col">Charge (kg)</th> : null}
                                {checkbox.affichagePercent ? <th scope="col">% PDC</th> : null}
                                {detailsAddRien.map(rien => {
                                    return <th scope="col">Detail</th>
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {seances.map((seance, indexSeance) => {
                                if (seance !== null) {
                                    return (seance.exercices.map((exercice, indexExercice) => {
                                        if (exercice !== null) {
                                            return (exercice.Series && Object.values(exercice.Series).map((serie, indexSerie) => {
                                                if (serie !== null) {
                                                    return (
                                                        <tr style={switched ? trStyleBlack(indexSeance) : trStyleWhite(indexSeance)}>
                                                            {checkbox.affichageModif ?
                                                                indexExercice === 0 ?
                                                                    indexSerie === 0 ?
                                                                        <td style={switched ? tdStyleBlack(indexExercice) : tdStyleWhite(indexExercice)} className="dashboard-td">
                                                                            <img id={seance.id} onClick={handleClickModify} className={switched ? "modify-black" : "modify-white"} src={require('../../images/icons/write.webp')} alt='session' />
                                                                        </td>
                                                                        :
                                                                        <td style={switched ? tdStyleBlack(indexExercice) : tdStyleWhite(indexExercice)} className="dashboard-td">

                                                                        </td>
                                                                    :
                                                                    <td style={switched ? tdStyleBlack(indexExercice) : tdStyleWhite(indexExercice)} className="dashboard-td">

                                                                    </td>
                                                                :
                                                                null
                                                            }
                                                            {/* <td>{seance.id}</td> */}
                                                            {checkbox.affichageSuppr ?
                                                                indexExercice === 0 ?
                                                                    indexSerie === 0 ?
                                                                        <td style={switched ? tdStyleBlack(indexExercice) : tdStyleWhite(indexExercice)} className="dashboard-td">
                                                                            <img id={seance.id} onClick={handleClickSuppr} className={switched ? "suppr-black" : "suppr-white"} src={require('../../images/icons/icons8-trash-30.webp')} alt='session' />
                                                                        </td>
                                                                        :
                                                                        <td style={switched ? tdStyleBlack(indexExercice) : tdStyleWhite(indexExercice)} className="dashboard-td">

                                                                        </td>
                                                                    :
                                                                    <td style={switched ? tdStyleBlack(indexExercice) : tdStyleWhite(indexExercice)} className="dashboard-td">

                                                                    </td>
                                                                :
                                                                null
                                                            }
                                                            {checkbox.affichageNom ?
                                                                seance.nom ?
                                                                    seance.nom.ancienNom !== "nouveau-nom" ?
                                                                        <td style={switched ? tdStyleBlack(indexExercice) : tdStyleWhite(indexExercice)} className="dashboard-td">
                                                                            {seance.nom.ancienNom}
                                                                        </td>
                                                                        :
                                                                        <td style={switched ? tdStyleBlack(indexExercice) : tdStyleWhite(indexExercice)} className="dashboard-td">
                                                                            {seance.nom.nouveauNom}
                                                                        </td>
                                                                    :
                                                                    <td style={switched ? tdStyleBlack(indexExercice) : tdStyleWhite(indexExercice)} className="dashboard-td">
                                                                        /
                                                                    </td>
                                                                : null}
                                                            {checkbox.affichageDate ?
                                                                <td style={switched ? tdStyleBlack(indexExercice) : tdStyleWhite(indexExercice)} className="dashboard-td">
                                                                    {seance.date}
                                                                </td>
                                                                : null}
                                                            {checkbox.affichagePoids ?
                                                                <td style={switched ? tdStyleBlack(indexExercice) : tdStyleWhite(indexExercice)} className="dashboard-td">
                                                                    {seance.poids}
                                                                </td>
                                                                : null}
                                                            {checkbox.affichageExercice ?
                                                                <td style={switched ? tdStyleBlack(indexExercice) : tdStyleWhite(indexExercice)} className="dashboard-td">
                                                                    {exercice.exercice.name === "own-exercice" ? exercice.exercice.ownExercice : exercice.exercice.name}
                                                                    {exercice.exercice.muscle ? " - " + exercice.exercice.muscle : null}
                                                                </td>
                                                                : null}
                                                            {categoriesAddRien.map((rien, index) => {
                                                                if (exercice.Categories) {
                                                                    if (Object.values(exercice.Categories)[index]) {
                                                                        if (Object.values(exercice.Categories)[index].name === "Elastique") {
                                                                            return (
                                                                                <td style={switched ? tdStyleBlack(indexExercice) : tdStyleWhite(indexExercice)} className="dashboard-td">
                                                                                    Elastique en {Object.values(exercice.Categories)[index].utilisation} estimé à {Object.values(exercice.Categories)[index].estimation} kg
                                                                                </td>
                                                                            )
                                                                        }
                                                                        else {
                                                                            return (
                                                                                <td style={switched ? tdStyleBlack(indexExercice) : tdStyleWhite(indexExercice)} className="dashboard-td">
                                                                                    {Object.values(exercice.Categories)[index].input}
                                                                                </td>
                                                                            )
                                                                        }
                                                                    }
                                                                    else {
                                                                        return (
                                                                            <td style={switched ? tdStyleBlack(indexExercice) : tdStyleWhite(indexExercice)} className="dashboard-td">
                                                                                /
                                                                            </td>
                                                                        )
                                                                    }
                                                                }
                                                                else {
                                                                    return (
                                                                        <td style={switched ? tdStyleBlack(indexExercice) : tdStyleWhite(indexExercice)} className="dashboard-td">
                                                                            /
                                                                        </td>
                                                                    )
                                                                }
                                                            })}
                                                            {checkbox.affichageType ?
                                                                <td style={switched ? tdStyleBlack(indexExercice) : tdStyleWhite(indexExercice)} className="dashboard-td">
                                                                    {serie.typeSerie === "reps" ? "Répétitions" : null}
                                                                    {serie.typeSerie === "time" ? "Temps (sec)" : null}
                                                                </td>
                                                                : null}
                                                            {checkbox.affichageReps ?
                                                                <td style={switched ? tdStyleBlack(indexExercice) : tdStyleWhite(indexExercice)} className="dashboard-td">
                                                                    {serie.repsTime}
                                                                </td>
                                                                : null}
                                                            {checkbox.affichageCharge ?
                                                                <td style={switched ? tdStyleBlack(indexExercice) : tdStyleWhite(indexExercice)} className="dashboard-td">
                                                                    {serie.charge}
                                                                </td>
                                                                : null}
                                                            {checkbox.affichagePercent ?
                                                                <td style={switched ? tdStyleBlack(indexExercice) : tdStyleWhite(indexExercice)} className="dashboard-td">
                                                                    {serie.percent}
                                                                </td>
                                                                : null}
                                                            {detailsAddRien.map((rien, index) => {
                                                                if (seance.details) {
                                                                    if (Object.values(seance.details)[index]) {
                                                                        return (
                                                                            <td style={switched ? tdStyleBlack(indexExercice) : tdStyleWhite(indexExercice)} className="dashboard-td">
                                                                                {Object.values(seance.details)[index].input}
                                                                            </td>
                                                                        )
                                                                    }
                                                                    else {
                                                                        return (
                                                                            <td style={switched ? tdStyleBlack(indexExercice) : tdStyleWhite(indexExercice)} className="dashboard-td">
                                                                                /
                                                                            </td>
                                                                        )
                                                                    }
                                                                }
                                                                else {
                                                                    return (
                                                                        <td style={switched ? tdStyleBlack(indexExercice) : tdStyleWhite(indexExercice)} className="dashboard-td">
                                                                            /
                                                                        </td>
                                                                    )
                                                                }
                                                            })}
                                                        </tr>
                                                    )
                                                }
                                            }))
                                        }
                                    }))
                                }
                            })
                            }
                        </tbody>
                    </table>
                </div>
            }

            {seances.length === 0 ? null : <Footer />}

        </div>
    )
}

export default Dashboard;