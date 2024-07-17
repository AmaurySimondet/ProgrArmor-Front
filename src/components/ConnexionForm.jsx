import { React, useState } from "react";
import API from "../utils/API";

function ConnexionForm(props) {
  const stateNull = {
    email: "",
    password: ""
  };

  const [state, setState] = useState(stateNull);

  async function handleClick() {
    event.preventDefault();

    const { email, password } = state;

    if (!email || email.length === 0) {
      return alert("Donne moi ton email !");
    }
    if (!password || password.length === 0) {
      return alert("Donne moi un mot de passe (pas pourrie de préférence) !");
    }
    try {
      const { data } = await API.login(email, password);
      if (data.success === true) {
        console.log(data)
        window.location = "/token?token=" + data.token;
      } else { alert(data.message); }
    } catch (error) {
      alert(error);
    }
  };

  function handleChange(event) {
    setState(oldState => {
      return ({
        ...oldState,
        [event.target.id]: event.target.value
      });
    });
  };

  return (
    <div>
      <div className="form-group row large-margin-top">
        <label className="col-sm-2 col-form-label">Email</label>
        <div className="col-sm-10">
          <input type="email"
            className="form-control"
            placeholder="pasdeproces@lasauce.com"
            id="email"
            value={state.email}
            onChange={handleChange}
            autoFocus
          />
        </div>
      </div>

      <div className="form-group row mini-margin-bottom">
        <label className="col-sm-2 col-form-label">Mot de passe</label>
        <div className="col-sm-10">
          <input
            type="password"
            className="form-control"
            placeholder="La_Tasse_d'Aline"
            value={state.password}
            id="password"
            onChange={handleChange}
            autoFocus
          />
        </div>
      </div>

      <p onClick={props.handleClickMdp}
        className="basic-margin-bottom mdpOublié">
        Mot de passe oublié ?</p>

      <button className="btn btn-lg btn-dark" onClick={handleClick} type="submit">Connexion</button>
    </div>
  )
}

export default ConnexionForm;