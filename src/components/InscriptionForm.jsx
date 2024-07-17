import { React, useState } from "react";
import API from "../utils/API";

function containsSC(str) {
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  return specialChars.test(str);
}


function InscriptionForm(){
  const stateNull = {
    fName: "",
    lName: "",
    email: "",
    password: "",
    cpassword: ""
  };

  const [state, setState] = useState(stateNull);

  async function handleClick(event) {
    event.preventDefault();

    const { fName, lName, email, password, cpassword } = state;

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) return alert("Email au mauvais format !")
    if (!email || email.length === 0) return alert("Aucun email fourni !");
    if (!password || password.length === 0) return alert("Aucun mot de passe fourni !");
    if (!fName || fName.length === 0) return alert("Aucun prénom fourni !");
    if (!lName || lName.length === 0) return alert("Aucun mom fourni !");
    if (password !== cpassword) return alert("Les mots de passes ne sont pas les mêmes !");
    if (password.length<8 || containsSC(password)===false) return alert("Le mot de passe doit contenir 8 caractères dont un spécial")

    try {
      const { data } = await API.signup({ fName: fName, lName: lName, email: email, password: password });
      if (data.success === true){
          console.log(data)
          window.location = "/token?token="+data.token;
      } else { alert(data.message); }
    } catch (error) {
      alert(error);
    }
  };

  function handleChange(event){
    setState(oldState => {
        return ({
            ...oldState,
            [event.target.id]: event.target.value
        });
    });
  };

    return(
        <form className="inscription-form">
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Prénom</label>
            <div className="col-sm-10">
              <input
              type="text"
              className="form-control"
              id="fName"
              placeholder="Sylvain"
              value={state.fName}
              onChange={handleChange}
              autoFocus/>
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="inputNom" className="col-sm-2 col-form-label">Nom</label>
            <div className="col-sm-10">
              <input
              type="text"
              className="form-control"
              id="lName"
              placeholder="D."
              value={state.lName}
              onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="staticEmail" className="col-sm-2 col-form-label">Email</label>
            <div className="col-sm-10">
              <input
              type="email"
              className="form-control"
              id="email"
              placeholder="emaildumaitre@yoyo.com"
              value={state.email}
              onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Mot de passe</label>
            <div className="col-sm-10">
              <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Naturel_?_Oui"
              value={state.password}
              onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Confirmation mot de passe</label>
            <div className="col-sm-10">
              <input
              type="password"
              className="form-control"
              id="cpassword"
              placeholder="Naturel_?_Oui"
              value={state.cpassword}
              onChange={handleChange}
              />
            </div>
          </div>
          <p className="p-cgu">En cliquant sur le bouton "Inscription" ci dessous,  vous certifiez avoir pris connaissance et approuvé nos CGU</p>
          <button className="btn btn-lg btn-dark" onClick={handleClick} type="submit">Inscription</button>
        </form>
    )
}

export default InscriptionForm;