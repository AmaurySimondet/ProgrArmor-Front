import { React, useState, useEffect } from 'react';
import Footer from '../Footer';
import NavigBar from '../NavigBar';
import Select from 'react-select';
import ProgrammeCard from './ProgrammeCard';
import ProgrammeCardExplication from './ProgrammeCardExplication';
import { styleOnDim } from '../../utils/styling';
import ProgrammeMateriel from './Programme/ProgrammeMateriel';
import { getUser } from '../../utils/user';
import { useSearchParams } from 'react-router-dom';
import TypeDeProgrammes from './Programme/TypeDeProgrammes';
import Niveaux from './Programme/Niveaux';
import ProgrammeSorting from './Programme/ProgrammeSorting';
import { getProgrammes } from '../../utils/programme';

const nullSearchParamsValues = {
    commentedByMe: false,
    likedByMe: false,
    ownedByMe: false,
    type: null,
    niveau: null,
    tri: null,
    dureeMax: "",
    seancesParSemaine: "",
    programmeId: "",
    createdBy: "",
    materiel: null
}

function Programme(props) {
    const [dimensions, setDimensions] = useState({
        height: window.innerHeight,
        width: window.innerWidth
    });
    const [programmes, setProgrammes] = useState([]);
    const [user, setUser] = useState({ modeSombre: false });
    const [clickFiltrage, setClickFiltrage] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchParamsValues, setSearchParamsValues] = useState(nullSearchParamsValues);

    function handleClickCreate() {
        window.location = '/programmeCreator';
    }

    useEffect(() => {
        getUser(localStorage.getItem("id")).then((user) => {
            console.log("user: ", user);
            setUser(user);
        });
    }, []);

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

    useEffect(() => {
        getProgrammes(searchParams).then((programmes) => {
            setProgrammes(programmes);
        });
    }, []);

    useEffect(() => {
        getProgrammes(searchParamsValues).then((programmes) => {
            setProgrammes(programmes);
        });
    }, [searchParamsValues]);

    function handleClickFiltrage() {
        setClickFiltrage(!clickFiltrage);
    }

    function resetParameters() {
        setSearchParams(new URLSearchParams());
        setSearchParamsValues({ ...nullSearchParamsValues });
    }

    return (
        <div>
            <NavigBar />


            <div className="basic-div">

                <h1 className=''>
                    Programmes
                    <button className="btn btn-dark large-margin-left" onClick={handleClickCreate}>
                        Menu de création
                    </button>
                </h1>


                <div>
                    <h2
                        onClick={handleClickFiltrage}
                        style={{ display: "inline-block" }}>
                        Filtrage
                        <img className={clickFiltrage ? "expert-toggle rotated" : "expert-toggle not-rotated"}
                            src={require('../../images/icons/icons8-expand-arrow-90.webp')} />
                    </h2>
                    <button type="submit" className="btn btn-dark large-margin-left" onClick={resetParameters}>
                        Reset des paramètres
                    </button>
                    <div className={clickFiltrage ? "tri large-perc-margin-updown extended" : "tri large-perc-margin-updown not-extended"}>
                        <div className="form-group row">
                            <div className="col-4">
                                <label className="col-form-label">Tri par</label>
                                <Select
                                    options={ProgrammeSorting}
                                    value={searchParamsValues.tri}
                                    placeholder="Les plus aimés (défaut)"
                                    styles={styleOnDim(dimensions, user)}
                                    onChange={(e) => {
                                        const newParams = new URLSearchParams(searchParams);
                                        newParams.set('tri', e.value);
                                        setSearchParamsValues({
                                            ...searchParamsValues,
                                            tri: ProgrammeSorting.find((tri) => {
                                                return tri.value === e.value;
                                            })
                                        });
                                        setSearchParams(newParams);
                                    }}
                                />
                            </div>

                            <div className="col-4">
                                <label className="col-form-label">Type</label>
                                <Select
                                    options={TypeDeProgrammes}
                                    value={searchParamsValues.type}
                                    styles={styleOnDim(dimensions, user)}
                                    onChange={(e) => {
                                        const newParams = new URLSearchParams(searchParams);
                                        newParams.set('type', e.value);
                                        setSearchParamsValues({
                                            ...searchParamsValues,
                                            type: TypeDeProgrammes.find((type) => {
                                                return type.value === e.value;
                                            })
                                        });
                                        setSearchParams(newParams);
                                    }}
                                    placeholder="Type de programme..."
                                />
                            </div>

                            <div className="col-4">
                                <label className="col-form-label">Niveau</label>
                                <Select
                                    options={Niveaux}
                                    value={searchParamsValues.niveau}
                                    styles={styleOnDim(dimensions, user)}
                                    placeholder="Débutant..."
                                    onChange={(e) => {
                                        const newParams = new URLSearchParams(searchParams);
                                        newParams.set('niveau', e.value);
                                        setSearchParamsValues({
                                            ...searchParamsValues,
                                            niveau: Niveaux.find((niveau) => {
                                                return niveau.value === e.value;
                                            })
                                        });
                                        setSearchParams(newParams);
                                    }}

                                />
                            </div>

                            <div className="col-4">
                                <label className="col-form-label">Durée max d'une séance</label>
                                <input
                                    type="number"
                                    className={user.modeSombre === true ? "inputDark form-control" : "form-control"}
                                    placeholder="60"
                                    value={searchParamsValues.dureeMax}
                                    onChange={(e) => {
                                        const newParams = new URLSearchParams(searchParams);
                                        newParams.set('dureeMax', e.target.value);
                                        setSearchParamsValues({
                                            ...searchParamsValues,
                                            dureeMax: e.target.value
                                        });
                                        setSearchParams(newParams);
                                    }}
                                />
                            </div>

                            <div className="col-4">
                                <label className="col-form-label">Séances par semaine</label>
                                <input
                                    type="number"
                                    className={user.modeSombre === true ? "inputDark form-control" : "form-control"}
                                    placeholder="3"
                                    value={searchParamsValues.seancesParSemaine}
                                    onChange={(e) => {
                                        const newParams = new URLSearchParams(searchParams);
                                        newParams.set('seancesParSemaine', e.target.value);
                                        setSearchParamsValues({
                                            ...searchParamsValues,
                                            seancesParSemaine: e.target.value
                                        });
                                        setSearchParams(newParams);
                                    }}
                                />
                            </div>

                            <div className="col-4">
                                <label className="col-form-label">ID du créateur</label>
                                <input type="text" className={user.modeSombre === true ? "inputDark form-control" : "form-control"} placeholder="123456..."
                                    value={searchParamsValues.createdBy}
                                    onChange={(e) => {
                                        const newParams = new URLSearchParams(searchParams);
                                        newParams.set('createdBy', e.target.value);
                                        setSearchParamsValues({
                                            ...searchParamsValues,
                                            createdBy: e.target.value
                                        });
                                        setSearchParams(newParams);
                                    }}
                                />
                            </div>

                            <div className="col-4">
                                <label className="col-form-label">ID du programme</label>
                                <input type="text" className={user.modeSombre === true ? "inputDark form-control" : "form-control"} placeholder="123456..."
                                    value={searchParamsValues.programmeId}
                                    onChange={(e) => {
                                        const newParams = new URLSearchParams(searchParams);
                                        newParams.set('programmeId', e.target.value);
                                        setSearchParamsValues({
                                            ...searchParamsValues,
                                            programmeId: e.target.value
                                        });
                                        setSearchParams(newParams);
                                    }}
                                />
                            </div>

                            <div className="col-4">
                                <label className="col-form-label">Mes programmes</label>
                                <input type="checkbox" checked={searchParamsValues.ownedByMe} className={user.modeSombre === true ? "inputDark form-control" : "form-control"}
                                    value={searchParamsValues.ownedByMe}
                                    onChange={(e) => {
                                        setSearchParamsValues({
                                            ...searchParamsValues,
                                            ownedByMe: !searchParamsValues.ownedByMe
                                        });
                                        const newParams = new URLSearchParams(searchParams);
                                        newParams.set('ownedByMe', !searchParamsValues.ownedByMe);
                                        setSearchParams(newParams);
                                    }}
                                />
                            </div>

                            <div className="col-4">
                                <label className="col-form-label">Programmes likés</label>
                                <input type="checkbox" checked={searchParamsValues.likedByMe} className={user.modeSombre === true ? "inputDark form-control" : "form-control"}
                                    value={searchParamsValues.likedByMe}
                                    onChange={(e) => {
                                        setSearchParamsValues({
                                            ...searchParamsValues,
                                            likedByMe: !searchParamsValues.likedByMe
                                        });
                                        const newParams = new URLSearchParams(searchParams);
                                        newParams.set('likedByMe', !searchParamsValues.likedByMe);
                                        setSearchParams(newParams);
                                    }}
                                />
                            </div>

                            <div className="col-4">
                                <label className="col-form-label">Programmes commentés</label>
                                <input type="checkbox" checked={searchParamsValues.commentedByMe} className={user.modeSombre === true ? "inputDark form-control" : "form-control"}
                                    value={searchParamsValues.commentedByMe}
                                    onChange={(e) => {
                                        setSearchParamsValues({
                                            ...searchParamsValues,
                                            commentedByMe: !searchParamsValues.commentedByMe
                                        });
                                        const newParams = new URLSearchParams(searchParams);
                                        newParams.set('commentedByMe', !searchParamsValues.commentedByMe);
                                        setSearchParams(newParams);
                                    }}

                                />
                            </div>

                            <div className="col-12">
                                <label className="col-form-label">Materiel</label>
                                <Select
                                    isMulti
                                    options={ProgrammeMateriel}
                                    styles={styleOnDim(dimensions, user)}
                                    placeholder="Tout (défaut)"
                                    value={searchParamsValues.materiel}
                                    onChange={(e) => {
                                        const newParams = new URLSearchParams(searchParams);
                                        newParams.set('materiel', e.map(materiel => materiel.value).join(';') || '');
                                        setSearchParamsValues({
                                            ...searchParamsValues,
                                            materiel: e
                                        });
                                        setSearchParams(newParams);
                                    }}
                                />
                            </div>

                        </div>
                    </div>
                </div>

                <div className="programmes large-margin-bottom">
                    <ProgrammeCardExplication />

                    {programmes.map((programme, index) => (
                        <ProgrammeCard
                            key={programme.id}
                            id={programme.id}
                            index={index}
                            programme={programme}
                            modeSombre={user.modeSombre}
                        />
                    ))}
                </div>

            </div>


            <Footer />
        </div>
    );
}

export default Programme;