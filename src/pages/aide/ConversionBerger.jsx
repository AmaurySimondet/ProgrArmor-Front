import { React, useState, useEffect } from 'react';

const Berger = [
    { rep: 1, percent: 100 },
    { rep: 2, percent: 97.4 },
    { rep: 3, percent: 94.9 },
    { rep: 4, percent: 92.4 },
    { rep: 5, percent: 89.8 },
    { rep: 6, percent: 87.6 },
    { rep: 7, percent: 85.5 },
    { rep: 8, percent: 83.3 },
    { rep: 9, percent: 81.1 },
    { rep: 10, percent: 78.8 },
    { rep: 11, percent: 75 },
    { rep: 12, percent: 72.5 },
    { rep: 13, percent: 70 },
    { rep: 14, percent: 67.5 },
    { rep: 15, percent: 65 },
]

function ConversionBerger(props) {
    const [dimensions, setDimensions] = useState({
        height: window.innerHeight,
        width: window.innerWidth
    });
    const [reps, setReps] = useState(8);
    const [pdc, setPdc] = useState(85);
    const [repsObjective, setRepsObjective] = useState(1);
    const [pdcObjective, setPdcObjective] = useState(100);
    const [convertedObjective, setConvertedObjective] = useState(0);
    const [check, setCheck] = useState(false);
    const [textObjective, setTextObjective] = useState("");
    const [textPerf, setTextPerf] = useState("");


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
        let checkTemp = 0;
        let perfReps = parseFloat(reps);
        let perfPdc = parseFloat(pdc);
        let objectiveReps = parseFloat(repsObjective);
        let objectivePdc = parseFloat(pdcObjective);
        let convertedBergerTemp = 1;
        let convertedObjectiveTemp = parseFloat(objectivePdc);
        let cent = false;

        if (objectiveReps <= 15 && objectiveReps > 0 && perfReps <= 15 && perfReps > 0) {
            if (objectivePdc === 0) {
                objectivePdc = 100;
                perfPdc += 100;
                cent = true
            }

            if (objectiveReps !== perfReps) {
                let bergerInput = Berger.find(e => e.rep === objectiveReps).percent; // 94.9%
                let bergerSerie = Berger.find(e => e.rep === perfReps).percent; // 72.5%

                let conversion = (100 / bergerInput) / 100; // 1.0537

                convertedBergerTemp = (bergerSerie * conversion); // 0.765
                convertedBergerTemp = convertedBergerTemp.toFixed(2)
                convertedObjectiveTemp = objectivePdc * convertedBergerTemp; // 114.6%

                if (cent === true) {
                    convertedObjectiveTemp -= 100;
                    perfPdc -= 100;
                }

                if (perfPdc >= convertedObjectiveTemp) {
                    checkTemp = 1;
                }

            }

            else {
                if (perfReps >= objectiveReps) {
                    if (perfPdc >= objectivePdc) {
                        checkTemp = 1;
                    }
                }
            }

            setTextObjective("");
            setTextPerf("");
        }

        else {
            if (objectiveReps > 15 || objectiveReps <= 0) {
                setTextObjective("Veuillez entrer un nombre de répétitions entre 1 et 15");
            }
            if (perfReps > 15 || perfReps <= 0) {
                setTextPerf("Veuillez entrer un nombre de répétitions entre 1 et 15");
            }

            console.log("perfReps", perfReps)

            if (perfReps >= objectiveReps) {
                if (perfPdc >= objectivePdc) {
                    checkTemp = 1;
                    convertedBergerTemp = "/"
                }
            }
        }

        setCheck(checkTemp);
        setConvertedObjective(convertedObjectiveTemp.toFixed(2));

    }, [reps, pdc, repsObjective, pdcObjective]);



    return (
        <div>

            <div className='grid-test large-margin-bottom'>
                <div>{ }</div>
                <label className=''>
                    Reps
                </label>
                <label className=''>
                    Charge en % PDC
                </label>
                <label className=''>
                    % PDC converti
                </label>
                <label className=''>
                    {dimensions.width <= 500 ? "Equiva -lent ?" : "Equivalent ?"}
                </label>


                <label className=''>
                    Perf
                </label>

                <input
                    type="number"
                    name="reps"
                    className={props.modeSombre ? "inputDark form-control " : "form-control "}
                    value={reps}
                    onChange={e => setReps(e.target.value)}
                />


                <input
                    type="number"
                    name="pdc"
                    className={props.modeSombre ? "inputDark form-control " : "form-control "}
                    value={pdc}
                    onChange={e => setPdc(e.target.value)}
                />
                <div>{ }</div>
                <div>{ }</div>


                <label className=''>
                    {dimensions.width <= 500 ? "Obje -ctif" : "Objectif"}
                </label>

                <input
                    type="number"
                    className={props.modeSombre ? "inputDark form-control " : "form-control "}
                    name="reps"
                    value={repsObjective}
                    onChange={e => setRepsObjective(e.target.value)}
                />

                <input
                    type="number"
                    className={props.modeSombre ? "inputDark form-control " : "form-control "}
                    name="pdc"
                    value={pdcObjective}
                    onChange={e => setPdcObjective(e.target.value)}
                />
                <input
                    type="number"
                    name="convertedObjective"
                    className={props.modeSombre ? "inputReadOnlyDark form-control " : "form-control "}
                    value={convertedObjective}
                    readOnly
                />
                <div className='basic-form-control'
                    style={check === 1 ? { backgroundColor: "#24B34C" } : { backgroundColor: "#ff0000" }}>
                    {check === 1 ? "Oui !" : "Non !"}
                </div>
            </div>




        </div>
    )
}

export default ConversionBerger;