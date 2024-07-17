import { React, useState, useEffect } from "react";
import PriseDeNoteHiddenText from "./PriseDeNoteHiddenText";
import API from "../../utils/API";
import Exercices from "./Exercices";
import AllCategories from "./Categories/AllCategories";
import AllDetails from "./Details/AllDetails";
import musclesCategorie from "./Categories/MusclesCategorie";
import Elastiques from "./Categories/Elastiques";

function PriseDeNote(props) {
    const [note, setNote] = useState();
    const [clicked, setClicked] = useState("hide");

    function handleClickQuestion() {
        if (clicked === "hide") {
            setClicked("nothide");
        } else { setClicked("hide") };
    }


    function handleNoteChange(event) {
        setNote(event.target.value);
    }

    async function handleSubmitNotes() {
        console.log(note);

        const { data } = await API.priseDeNote({
            note: note, muscles: musclesCategorie, elastiques: Elastiques,
            exercices: Exercices, details: AllDetails, categories: AllCategories
        });

        if (data.success === true) {
            props.submitNote(data.seance);
        }
        else {
            alert(data.message);
        }
    }


    return (
        <div className="basic-div">

            <table className="basic-table">
                <col style={{ width: "90%" }} />
                <col style={{ width: "10%" }} />
                <tr>
                    <td>
                        <h1>
                            Prise de note rapide
                        </h1>
                    </td>
                    <td>
                        <img className={props.modeSombre === true ? "myDIV questionDark" : "myDIV"} onClick={handleClickQuestion} src={require('../../images/icons/icons8-question-mark-96.webp')} alt="?" />
                    </td>
                </tr>
            </table>

            <p>
                <div className={clicked} style={{ marginTop: "10px", width: "100%" }}>
                    <PriseDeNoteHiddenText />
                </div>
            </p>

            <textarea
                name="note"
                value={note}
                className={props.modeSombre ? "inputDark form-control" : "form-control"}
                onChange={handleNoteChange}

                placeholder="Epopée de la force
                12/05/1998
                120..."
                rows="10"
            />



            <button className={props.modeSombre ? "btn btn-black large-margin-updown" : "btn btn-white large-margin-updown"}
                onClick={handleSubmitNotes}>
                Valider et générer la séance
            </button>
        </div >
    )
}

export default PriseDeNote;