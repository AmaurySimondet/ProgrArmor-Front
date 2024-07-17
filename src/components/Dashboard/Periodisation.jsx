import { React, useState, useEffect } from 'react';
import SeanceOfProgramme from './SeanceOfProgramme';
import { v4 as uuidv4 } from 'uuid';

function Periodisation(props) {
    const [seances, setSeances] = useState(props.periodisation.seances);
    const [clickPeriodisation, setClickPeriodisation] = useState(false);
    const [closed, setClosed] = useState(false);

    function handleClickPeriodisation() {
        setClickPeriodisation(!clickPeriodisation);
    }

    useEffect(() => {
        setClosed(clickPeriodisation);
    }, [clickPeriodisation]);

    useEffect(() => {
        props.writePeriodisation(props.id, seances);
    }, [seances]);

    useEffect(() => {
        if (props.closedPeriodisation !== clickPeriodisation) {
            setClickPeriodisation(props.closedPeriodisation)
        }
    }, [props.closedPeriodisation])

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

    function addSeance() {
        setSeances([...seances,
        { id: uuidv4(), exercices: [], echauffements: [], jourRepos: 0 }]);
    }

    function handleDeleteSeance(id) {
        setSeances(seances.filter(seance => seance.id !== id));
    }

    function handleClickPoubelle() {
        props.handleDeletePeriodisation(props.id);
    }

    function getMarginTop() {
        if (dimensions.width > 900) {
            return "40px";
        } else {
            return "5%";
        }
    }

    function writeSeance(id, newSeance) {
        let newSeances = [...seances];
        let indexOfChg = seances.findIndex(seance => seance.id === id);
        newSeances.splice(indexOfChg, 1, newSeance);
        setSeances(newSeances);
    }

    return (
        <div>
            <h1 id="seanceTitle" style={{ display: "inline-block" }} onClick={handleClickPeriodisation}>
                Periodisation {props.index + 1}
                <img className={clickPeriodisation ? "expert-toggle rotated" : "expert-toggle not-rotated"}
                    src={require('../../images/icons/icons8-expand-arrow-90.webp')} />
            </h1>

            <img className={props.modeSombre === true ? "poubelleDark " : "poubelle"}
                onClick={handleClickPoubelle}
                style={{ float: "right", display: "inline-block", height: "10%", marginTop: getMarginTop() }}
                src={require('../../images/icons/icons8-trash-30.webp')}
                alt="Poubelle" />

            {seances?.map((seance, index) => {
                return (
                    <SeanceOfProgramme
                        key={seance.id}
                        id={seance.id}
                        index={index}
                        modeSombre={props.modeSombre}
                        seance={seance}
                        length={seances.length}
                        closed={closed}
                        writeSeance={writeSeance}
                        closedPeriodisation={clickPeriodisation}
                        handleDeleteSeance={handleDeleteSeance}
                    />
                )
            })}

            {clickPeriodisation ? null : <button className='btn btn-dark block large-margin-updown'
                style={{ marginLeft: "0" }}
                onClick={addSeance}>
                Ajouter une séance
            </button>
            }

            {props.length > 1 ?
                clickPeriodisation ?
                    <div>
                        <hr className='hr-serie' />
                        <p>
                            <strong>Cycles:</strong> {props.periodisation.cycle}
                        </p>
                    </div>
                    :
                    <div>
                        <label>
                            Nombre de cycle(s) avant la periodisation suivante:
                        </label>
                        <input
                            type="number"
                            className="form-control"
                            value={props.periodisation.cycle}
                            onChange={(e) => props.writeCycle(props.id, e.target.value)}
                        />
                    </div>
                :
                null
            }
        </div>
    )
}

export default Periodisation;