import { React, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import NavigBar from "../NavigBar.jsx"
import DebutantForm from "./DebutantForm.jsx"
import ExpertForm from "./ExpertForm.jsx"
import API from "../../utils/API.js";
import { alpha, styled } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import Switch from '@mui/material/Switch';
import Footer from "../Footer.jsx";
import { v4 as uuidv4 } from 'uuid';
import PriseDeNote from "./PriseDeNote.jsx"

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

function Session() {
  const [switched, setSwitched] = useState();
  const [searchParams, setSearchParams] = useSearchParams();
  const [seance, setSeance] = useState();
  const [user, setUser] = useState();
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth
  })
  const [priseDeNote, setPriseDeNote] = useState(false);

  function handlePriseDeNote() {
    setPriseDeNote(!priseDeNote);
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

  async function getUser() {
    const { data } = await API.getUser({ id: localStorage.getItem("id") });
    if (data.success === false) {
      alert(data.message);
    } else {
      console.log(data.profile);
      if (data.profile.modeSombre && data.profile.modeSombre === true) {
        // 👇 add class to body element
        document.body.classList.add('darkMode');
      }
      setUser(data.profile);
    };
  }

  async function loadSeanceIfParams() {

    if (searchParams.get("seanceId")) {
      const { data } = await API.loadSeance({ seanceId: searchParams.get("seanceId") });

      if (data.success === false) {
        if (data.message === "Aucune séance !") {
          console.log(data.message);
        }
        else { alert(data.message); }
      }

      else {
        if (data.seance) {
          if (data.seance.nom) {
            setSwitched(true)
            setSeance(data.seance)
            console.log("seance from params", data.seance)
          }
          else {
            setSwitched(false)
            setSeance(data.seance)
            console.log("seance from params", data.seance)
          }
        }
      }
    }
    else {
      setSwitched(false)
    }
  }

  function DebutantToExpert(seance) {
    let expS = { ...seance, nom: {}, echauffements: [], details: [] }

    expS.exercices.forEach((ex, indEx) => {
      expS.exercices[indEx] = { ...ex, Categories: {} }
    })

    return expS
  }

  useEffect(() => {
    getUser();
    loadSeanceIfParams();
  }, []);

  function handleChange() {
    setSwitched(!switched);
  }

  function submitNote(seance) {
    setPriseDeNote(false);
    setSwitched(true);
    setSeance(seance);
  }

  function loadExpert(seance) {
    setSwitched(true);
    setSeance(seance);
  }

  return (
    <div>
      <NavigBar location="session" />

      <button className={user && user.modeSombre ? "btn btn-black" : "btn btn-white"} style={{ margin: "20px" }} onClick={handlePriseDeNote}>
        {!priseDeNote ? "Mode prise de note rapide" : "Mode normal"}
      </button>

      {priseDeNote ?
        <PriseDeNote submitNote={submitNote} modeSombre={user.modeSombre} />
        :
        <div className="session-div">

          <h1> Enregistre ta séance ! </h1>

          <p className="session-div-switch">
            Débutant <GreenSwitch defaultChecked={seance ? !switched : switched} onChange={handleChange} /> Expert
          </p>

          {switched ?
            <ExpertForm
              seance={
                seance ?
                  seance.nom ?
                    seance
                    :
                    DebutantToExpert(seance)
                  :
                  { id: uuidv4(), date: "", poids: "", exercices: [], nom: {}, echauffements: [], details: [] }
              }
              modeSombre={user && user.modeSombre ? true : false}
              dimensions={dimensions} />
            :
            <DebutantForm
              loadExpert={loadExpert}
              seance={
                seance ?
                  seance
                  :
                  { id: uuidv4(), date: "", poids: "", exercices: [] }
              }
              modeSombre={user && user.modeSombre ? true : false}
              dimensions={dimensions} />
          }

        </div>
      }

      <Footer />
    </div>
  );
};

export default Session;