import { React, useState } from "react";

function PoidsInput(props) {
  const [poids, setPoids] = useState(props.poids);

  const [clicked, setClicked] = useState("hide");

  function handleClickPoids() {
    if (clicked === "hide") {
      setClicked("nothide");
    } else { setClicked("hide") };
  }

  function handleChange(event) {
    event.preventDefault();

    setPoids(event.target.value);
    props.changePoids(event.target.value);
  }

  return (
    <div className="col-6 col-form-label">
      <label>Ton poids (kg)
        <img
          className={props.modeSombre === true ? "myDIV questionDark" : "myDIV"}
          onClick={handleClickPoids}
          src={require('../../images/icons/icons8-question-mark-96.webp')} alt="?"
        />
        <div className={clicked}>
          <div className="hidden-text">
            <strong> Pourquoi te demander ton poids ? </strong> <br />
            <br />
            La force relative à ton poids (<i>par exemple un developpé couché à 100% de ton poids</i>) est une information bien plus intéressante que la force absolue (<i>un developpé couché à 100kg</i>) <br />
            <br />
            Ton poids permet donc à <strong> ProgrArmor </strong> de: <br />
            - Te comparer de manière équitable avec tes amis <br />
            - De suivre ta progression quelque soit ta prise de muscle ou perte de poids <br />
            <br />
            Pèses toi au moins une fois par semaine et toujours dans les mêmes conditions pour un traçage optimal <br />
            Tu peux gérer la visibilité de ton poids par tes amis dans les paramètres de ton compte <br />
            <br />
            <i> {"Cliques à nouveau sur l'icone"} <img className="myDIV" src={require('../../images/icons/icons8-question-mark-96.webp')} alt="?" /> {"pour faire disparaître ce bandeau d'information"} </i>
          </div>
        </div>
      </label>
      <div >
        <input
          type="number"
          className={props.modeSombre === true ? "form-control inputDark" : "form-control"}
          placeholder="120"
          value={poids}
          id="poids"
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default PoidsInput;

