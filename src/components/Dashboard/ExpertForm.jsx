import { React, useState, useEffect } from "react";
import API from "../../utils/API";
import PoidsInput from "./PoidsInput";
import Select from "react-select"
import { customStyles, customStylesDark, customStylesMini, customStylesDarkMini } from "../../utils/customStyles";
import DetailInput from "./DetailInput";
import EchauffementInput from "./EchauffementInput";
import FullExerciceExpertInput from "./FullExerciceExpertInput"
import { v4 as uuidv4 } from 'uuid';
import { useSearchParams } from "react-router-dom";
import { seanceContainErr } from "../../utils/verifications";

function containsObj(arr, obj) {
    let contains = arr.some(elem => {
        return JSON.stringify(obj) === JSON.stringify(elem);
    });
    return contains
}

function ExpertForm(props) {
    // console.log("expert seance from props", props.seance)

    const [seance, setSeance] = useState(props.seance);
    const [clickEchauffement, setClickEchauffement] = useState(props.seance.echauffements.length > 0 ? true : false);
    const [paramsSelect, setParamsSelect] = useState();
    const [clickExercices, setClickExercices] = useState(props.seance.exercices.length > 0 ? true : false);
    const [clickDetails, setClickDetails] = useState(props.seance.details.length > 0 ? true : false);
    const [params, setParams] = useState({ id: localStorage.getItem("id"), load: "" });
    const [listeNoms, setListeNoms] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();

    function handleClickEchauffement() {
        setClickEchauffement(!clickEchauffement);
    }

    function handleClickExercices() {
        setClickExercices(!clickExercices);
    }

    function handleClickDetails() {
        setClickDetails(!clickDetails);
    }

    async function handleClick() {
        event.preventDefault();

        console.log("expert recording seance", seance);

        //CONDITIONS
        let { err, alertMessage } = seanceContainErr(seance);
        if (err === true) {
            alert(alertMessage);
        }

        //API
        if (err === false) {
            let data;
            console.log("id from params", searchParams.get("seanceId"))

            if (searchParams.get("seanceId")) {
                data = await API.debutantform(
                    {
                        seance:
                            { ...seance, id: searchParams.get("seanceId") },
                        seanceId: searchParams.get("seanceId"),
                        id: localStorage.getItem("id")
                    });

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

    function changeDetail(changedD, id) {
        let newSeance = { ...seance }
        let indexOfChg = seance.details.findIndex(d => d.id === id)

        newSeance.details.splice(indexOfChg, 1, changedD)

        setSeance(newSeance)
    }

    function onAddDetail(event) {
        event.preventDefault();

        let newS = { ...seance }

        newS = {
            ...newS,
            details: [...newS.details, { id: uuidv4() }]
        }

        setSeance(newS)

    }

    function onDeleteDetail(id) {
        let newSeance = seance;
        let indexOfDel = seance.details.findIndex(d => d.id === id)

        //replace by nothing
        newSeance.details.splice(indexOfDel, 1)

        setSeance(oldSeance => {
            return ({
                ...oldSeance,
                details: newSeance.details
            })
        })
    }

    function changeEchauffements(changedExercice, id) {
        let newSeance = { ...seance }
        let indexOfChg = seance.echauffements.findIndex(ex => ex.id === id)

        newSeance.echauffements.splice(indexOfChg, 1, changedExercice)

        setSeance(newSeance)
    }

    function onAddEchauffements(event) {
        event.preventDefault();

        let newS = { ...seance }

        newS = {
            ...newS,
            echauffements: [...newS.echauffements, { echauffement: { name: "" }, Series: {}, Categories: {}, id: uuidv4() }]
        }

        setSeance(newS)

    }

    function onDeleteEchauffements(id) {
        let newSeance = seance;
        let indexOfDel = seance.echauffements.findIndex(ex => ex.id === id)

        //replace by nothing
        newSeance.echauffements.splice(indexOfDel, 1)

        setSeance(oldSeance => {
            return ({
                ...oldSeance,
                echauffements: newSeance.echauffements
            })
        })
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
                if (!data.seance.nom) {
                    alert("Vous ne pouvez pas charger une séance débutant en mode expert !")
                }
                else {
                    setSeance({ ...data.seance, id: uuidv4() })
                    setClickExercices(true);
                    if (data.seance.echauffements.length > 0) {
                        setClickEchauffement(true);
                    }
                    if (data.seance.details.length > 0) {
                        setClickDetails(true);
                    }
                }
            }
            else {
                setSeance({ id: uuidv4(), date: "", poids: "", exercices: [], nom: {}, echauffements: [], details: [] });
                setClickDetails(false);
                setClickEchauffement(false);
            }
        }
    }

    function handleChange(event) {
        setParams(oldParams => {
            return ({
                ...oldParams,
                [event.id]: event.value,
            })
        });
    }

    async function getNames() {
        const { data } = await API.workouts({ nom: "", periode: "max", tri: "Ordre chronologique décroissant", repsFrom: "", repsTo: "", exerciceName: "title", exerciceOwnExercice: "", id: localStorage.getItem("id") });
        if (data.success === false) {
            alert(data.message);
        } else {
            console.log("data", data)
            let arr = [{ label: "/ (défaut)", value: "title" }]

            let arr2 = [
                { className: "select-title", id: "load", label: "/ (défaut)", value: "title" },
                { id: "load", label: "Dernière séance en date", value: "lastDate" },
                { id: "load", label: "Dernière séance enregistrée", value: "lastRec" },
                { id: "load", label: "", value: "title" },
                { className: "select-title", id: "load", label: "Par nom de séance", value: "title" }
            ]

            data.seances.forEach((seance, index) => {
                if (seance.nom) {
                    if (seance.nom.ancienNom !== "nouveau-nom") {
                        if (!arr.includes(seance.nom.ancienNom)) {
                            let obj = { label: seance.nom.ancienNom, value: seance.nom.ancienNom }
                            if (!containsObj(arr, obj)) {
                                arr.push(obj)
                            }
                            let obj1 = { id: "load", label: `Dernière séance "${seance.nom.ancienNom}" enregistrée`, value: `lastRec-${seance.nom.ancienNom}` }
                            let obj2 = { id: "load", label: `Dernière séance "${seance.nom.ancienNom}" en date`, value: `lastDate-${seance.nom.ancienNom}` }
                            if (!containsObj(arr2, obj1)) {
                                arr2.push(obj1)
                            }
                            if (!containsObj(arr2, obj2)) {
                                arr2.push(obj2)
                            }
                        }
                    }
                    else {
                        if (!arr.includes(seance.nom.nouveauNom)) {
                            let obj = { label: seance.nom.nouveauNom, value: seance.nom.nouveauNom }
                            if (!containsObj(arr, obj)) {
                                arr.push(obj)
                            }
                            let obj1 = { id: "load", label: `Dernière séance "${seance.nom.nouveauNom}" enregistrée`, value: `lastRec-${seance.nom.nouveauNom}` }
                            let obj2 = { id: "load", label: `Dernière séance "${seance.nom.nouveauNom}" en date`, value: `lastDate-${seance.nom.nouveauNom}` }
                            if (!containsObj(arr2, obj1)) {
                                arr2.push(obj1)
                            }
                            if (!containsObj(arr2, obj2)) {
                                arr2.push(obj2)
                            }
                        }
                    }
                }
            })
            arr.push({ value: "nouveau-nom", label: "Entrer un nouveau nom de séance..." })
            setListeNoms(arr);
            setParamsSelect(arr2)
        }
    }

    function handleChangeName(event) {
        if (event.target) {
            setSeance(oldSeance => {
                return ({
                    ...oldSeance,
                    nom: { ...seance.nom, nouveauNom: event.target.value }
                })
            });
        }
        else {
            setSeance(oldSeance => {
                return ({
                    ...oldSeance,
                    nom: { ...seance.nom, ancienNom: event.value },
                })
            });
        }
    }

    function onInsertExercice(event) {
        event.preventDefault();

        let newS = { ...seance };
        let newE = { exercice: { name: "" }, Series: {}, Categories: {}, id: uuidv4() };
        let indexInsert = parseInt(event.target.id) + 1;

        newS.exercices.splice(indexInsert, 0, newE)

        newS = {
            ...newS,
            exercices: newS.exercices
        }

        setSeance(newS)

    }

    function onInsertEchauffement(event) {
        event.preventDefault();

        let newS = { ...seance };
        let newE = { echauffement: { name: "" }, Series: {}, Categories: {}, id: uuidv4() };
        let indexInsert = parseInt(event.target.id) + 1;

        newS.echauffements.splice(indexInsert, 0, newE)

        newS = {
            ...newS,
            echauffements: newS.echauffements
        }

        setSeance(newS)

    }

    useEffect(() => {
        console.log("useEffect getNames")
        getNames();
    }, []);


    return (
        <form className="debutant-form">

            <div className=" row">
                <div className="col-12 col-form-label" style={{ marginRight: "10px" }}>
                    <label>Séance précédente</label>
                    <div>
                        <Select
                            placeholder="Séance précédente à charger..."
                            onChange={handleChange}
                            options={paramsSelect}
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

            <div className="NameInput row">
                <div className="col-12 col-form-label" style={{ marginRight: "10px" }}>
                    <label className="">
                        Nom de la séance
                    </label>
                    <div className="">
                        <Select
                            placeholder="Nom..."
                            onChange={handleChangeName}
                            options={listeNoms}
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
                            value={{ value: seance.nom.ancienNom, label: seance.nom.ancienNom }}
                        />
                    </div>
                </div>

                {seance.nom.ancienNom === "nouveau-nom" ?
                    <div className="form-group row col-12">
                        <label className="col-form-label">Nom de la séance</label>
                        <input type="text"
                            className={props.modeSombre ? "form-control inputDark" : "form-control"}
                            onChange={handleChangeName}
                            placeholder="Annihilation des biceps"
                            id="nouveauNom"
                            value={seance.nom.nouveauNom}
                        />
                    </div>
                    : null}
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


            {
                clickEchauffement ?
                    <div>
                        <p onClick={handleClickEchauffement} className="expert-title">
                            Echauffement <img className="expert-toggle" src={require('../../images/icons/icons8-expand-arrow-90.webp')} />
                        </p>
                        {seance.echauffements ?
                            seance.echauffements.map((echauffement, index) => {
                                return (
                                    <div>
                                        <EchauffementInput
                                            key={echauffement.id}
                                            index={index}
                                            dimensions={props.dimensions}
                                            id={echauffement.id}
                                            modeSombre={props.modeSombre}
                                            poids={seance.poids}
                                            echauffement={echauffement}
                                            click={true}
                                            onAddEchauffements={onAddEchauffements}
                                            changeEchauffements={changeEchauffements}
                                            onDeleteEchauffements={onDeleteEchauffements}
                                        />

                                        <button className="btn btn-dark form-button" id={index} onClick={onInsertEchauffement} type="submit">Insérer un echauffement ici !</button>
                                        <br />
                                    </div>)
                            })
                            : null
                        }

                        <hr className={props.modeSombre ? "hr-serie-dark" : "hr-serie"} />
                        <button className="btn btn-dark form-button" onClick={onAddEchauffements} type="submit">Ajouter un échauffement à cette séance !</button>
                        <br />
                    </div>
                    :
                    <div>
                        <p onClick={handleClickEchauffement} className="expert-title"> Echauffement <img className="expert-toggle-inverted" src={require('../../images/icons/icons8-expand-arrow-90.webp')} /> </p>
                        <hr className={props.modeSombre ? "hr-serie-dark" : "hr-serie"} />
                    </div>
            }

            {
                clickExercices ?
                    <div>
                        <p onClick={handleClickExercices} className="expert-title"> Exercices <img className="expert-toggle" src={require('../../images/icons/icons8-expand-arrow-90.webp')} /> </p>
                        {seance.exercices ? seance.exercices.map((exercice, index) => {
                            return (
                                <div>
                                    <FullExerciceExpertInput
                                        key={exercice.id}
                                        index={index}
                                        dimensions={props.dimensions}
                                        id={exercice.id}
                                        modeSombre={props.modeSombre}
                                        exercice={exercice}
                                        poids={seance.poids}
                                        click={true}
                                        onAddExercices={onAddExercices}
                                        changeExercices={changeExercices}
                                        onDeleteExercices={onDeleteExercices}
                                    />

                                    <button className="btn btn-dark form-button" id={index} onClick={onInsertExercice} type="submit">Insérer un exercice ici !</button>
                                    <br />
                                </div>)
                        })
                            : null}

                        <hr className={props.modeSombre ? "hr-serie-dark" : "hr-serie"} />
                        <button className="btn btn-dark form-button" onClick={onAddExercices} type="submit">Ajouter un exercice à cette séance !</button>
                        <br />
                    </div>
                    :
                    <div>
                        <p onClick={handleClickExercices} className="expert-title"> Exercices <img className="expert-toggle-inverted" src={require('../../images/icons/icons8-expand-arrow-90.webp')} /> </p>
                        <hr className={props.modeSombre ? "hr-serie-dark" : "hr-serie"} />
                    </div>
            }

            {
                clickDetails ?
                    <div>
                        <p onClick={handleClickDetails} className="expert-title"> Details <img className="expert-toggle" src={require('../../images/icons/icons8-expand-arrow-90.webp')} /> </p>
                        {seance.details ? seance.details.map((detail, index) => {
                            return (
                                <div>
                                    <hr className="hr-detail" />

                                    <DetailInput
                                        key={detail.id}
                                        index={index}
                                        id={detail.id}
                                        modeSombre={props.modeSombre}
                                        detail={detail}
                                        dimensions={props.dimensions}
                                        onAddDetail={onAddDetail}
                                        changeDetail={changeDetail}
                                        onDeleteDetail={onDeleteDetail}
                                    />

                                </div>
                            );
                        })
                            : null}

                        <div className="detail-div">
                            <hr className={props.modeSombre ? "hr-serie-dark" : "hr-serie"} />
                            <button className="btn btn-dark form-button" onClick={onAddDetail} type="submit">Ajouter un détail à cette séance !</button>
                        </div>
                        <br />
                    </div>
                    :
                    <div>
                        <p onClick={handleClickDetails} className="expert-title"> Details <img className="expert-toggle-inverted" src={require('../../images/icons/icons8-expand-arrow-90.webp')} /> </p>
                        <hr className={props.modeSombre ? "hr-serie-dark" : "hr-serie"} />
                    </div>
            }

            <div className="form-button-div">
                <button className={props.modeSombre ? "btn btn-lg btn-black enregistrer-button large-margin-updown" : "btn btn-lg btn-white enregistrer-button large-margin-updown"} onClick={handleClick} type="submit">Enregistrer la séance !</button>
            </div>
        </form >
    )
};

export default ExpertForm;