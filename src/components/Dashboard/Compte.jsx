import { React, useState, useEffect, useRef } from "react";
import NavigBar from "../NavigBar.jsx"
import API from "../../utils/API";
import Footer from "../Footer.jsx";
import { Upload } from "upload-js";
import { alpha, styled } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import Switch from '@mui/material/Switch';

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

function Compte() {
  const upload = Upload({ apiKey: "free" });
  const inputFile = useRef(null);
  const [text, setText] = useState();
  const [user, setUser] = useState({})
  const [formInfo, setFormInfo] = useState({})
  const [modifyInfo, setModifyInfo] = useState(false);
  const [modifyPassword, setModifyPassword] = useState(false);
  const [switched, setSwitched] = useState();

  async function updateMode() {
    if (switched != user.modeSombre) {
      const res = await API.modifyUser({ id: localStorage.getItem("id"), modeSombre: "" + switched })
      console.log(res)

      window.location = '/compte'
    }
  }

  function handleChangeSwitch(event) {
    event.preventDefault();

    setSwitched(!switched);
  }

  useEffect(() => {
    updateMode();
  }, [switched])

  async function disconnect() {
    // await API.logout();
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    window.location = "/";
  };

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

  useEffect(() => {
    setTimeout(getUser, 50);
  }, []);

  function handleChange(event) {
    event.preventDefault();

    setFormInfo(oldFormInfo => {
      return ({
        ...oldFormInfo,
        [event.target.id]: event.target.value,
      })
    });
  }

  function handleModifyForm() {
    setModifyInfo(!modifyInfo);
  }

  function handleModifyPasswordForm() {
    setModifyPassword(!modifyPassword);
  }

  async function handleClickUpdateUser(event) {
    event.preventDefault();

    function containsSC(str) {
      const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
      return specialChars.test(str);
    }

    // console.log(formInfo)
    let { fName, lName, email, password, cpassword } = formInfo;

    if (email && fName && lName) {
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) return alert("Email au mauvais format !")

      else {
        const res = await API.modifyUser({ id: localStorage.getItem("id"), fName: fName, lName: lName, email: email })
        console.log(res)

        window.location = "/compte"
      }
    }

    if (password && cpassword) {
      if (password.length < 8 || containsSC(password) === false) return alert("Le mot de passe doit contenir 8 caractères dont un spécial")
      if (password !== cpassword) return alert("Doucement sur la picole t'as pas écris deux fois la même chose !")
      if (user.googleId || user.facebookId) return alert("Impossible de modifier le mdp pour les utilisateurs google et facebook !")

      else {
        const res = await API.modifyUser({ id: localStorage.getItem("id"), password: password })
        console.log(res)

        window.location = "/compte"
      }
    }

    else {
      alert("Modifications manquantes !")
    }
  }


  const boxRef = useRef();
  const [x, setX] = useState();
  const [y, setY] = useState();
  // This function calculate X and Y
  const getPosition = () => {
    const x = boxRef.current.offsetLeft;
    setX(x);
    const y = boxRef.current.offsetTop;
    setY(y);
  };

  // Get the position of the red box in the beginning
  useEffect(() => {
    getPosition();
  }, []);

  // Re-calculate X and Y of the red box when the window is resized by the user
  useEffect(() => {
    window.addEventListener("resize", getPosition);
  }, []);


  async function onFileSelected(event) {
    const [file] = event.target.files;
    const { fileUrl } = await upload.uploadFile(
      file,
      {
        onBegin: ({ cancel }) => setText("File upload started!"),
        onProgress: ({ progress }) => setText(`File uploading... ${progress}%`)
      }
    );
    setText(`File uploaded!`);

    const res = await API.modifyUser({ id: localStorage.getItem("id"), profilePic: fileUrl })
    console.log(res)

    window.location = "/compte"
  }

  return (
    <div>
      <NavigBar show={true} location="gear" />
      <div ref={boxRef}></div>

      {modifyInfo ?
        <form className="modify-info-form">
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">
              Prénom
            </label>
            <div className="col-sm-10">
              <input
                type="text"
                className={user.modeSombre === true ? "form-control inputDark" : "form-control"}
                placeholder="Monsieur"
                value={formInfo.fName}
                id="fName"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">
              Nom
            </label>
            <div className="col-sm-10">
              <input
                type="text"
                className={user.modeSombre === true ? "form-control inputDark" : "form-control"}
                placeholder="Fonte"
                value={formInfo.lName}
                id="lName"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">
              email
            </label>
            <div className="col-sm-10">
              <input
                type="email"
                className={user.modeSombre === true ? "form-control inputDark" : "form-control"}
                placeholder="argent@abonnés.com"
                value={formInfo.email}
                id="email"
                onChange={handleChange}
              />
            </div>
          </div>
          <button className="btn btn-dark btn-lg" onClick={handleClickUpdateUser} block="true" type="submit">
            Appliquer les modifications
          </button>
          <br />
          <button className="btn btn-dark btn-lg btn-arriere" onClick={handleModifyForm} block="true" type="submit">
            Revenir en arrière
          </button>
        </form>
        :
        modifyPassword ?
          <form className="modify-info-form">
            <div className="form-group row">
              <label className="col-sm-2 col-form-label">
                Mot de passe
              </label>
              <div className="col-sm-10">
                <input
                  type="password"
                  className={user.modeSombre === true ? "form-control inputDark" : "form-control"}
                  placeholder="GrecqueAndFrites69!"
                  value={formInfo.password}
                  id="password"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-2 col-form-label">
                Confirmer mot de passe
              </label>
              <div className="col-sm-10">
                <input
                  type="password"
                  className={user.modeSombre === true ? "form-control inputDark" : "form-control"}
                  placeholder="GrecqueAndFrites69!"
                  value={formInfo.cpassword}
                  id="cpassword"
                  onChange={handleChange}
                />
              </div>
            </div>
            <button className="btn btn-dark btn-lg" onClick={handleClickUpdateUser} block="true" type="submit">
              Appliquer les modifications
            </button>
            <br />
            <button className="btn btn-dark btn-lg btn-arriere" onClick={handleModifyPasswordForm} block="true" type="submit">
              Revenir en arrière
            </button>
          </form>
          :
          <div className="Compte">
            <input style={{ display: "none" }} type="file" onChange={onFileSelected} ref={inputFile} />

            <table className="profile-table">
              <tbody>
                <tr>

                  {user.profilePic ?
                    <td className="profile-td">
                      <div onClick={() => inputFile.current.click()} className="relative">
                        <img className="inner-img" src={require('../../images/icons/camera.webp')} alt="camera" />
                        <img className="profile-pic" src={user.profilePic} alt="profile-pic" />
                        <p> {text} </p>
                      </div>
                    </td>
                    :
                    <td>
                      <div onClick={() => inputFile.current.click()} className="relative">
                        <img className="inner-img" src={require('../../images/icons/camera.webp')} alt="camera" />
                        <img className="unknown-profile-pic profile-pic" src={require('../../images/profilepic.webp')} alt='unknown-profile-pic' />
                        <p> {text} </p>
                      </div>
                    </td>
                  }

                  {user ?
                    <td className="profile-td">
                      <h1> {user.fName} {user.lName} </h1>
                      <h1 className="profile-email"> {user.email} </h1>
                    </td>
                    : null}

                  <td>

                    <button className="btn btn-dark profile-btn" onClick={handleModifyForm} block="true" type="submit">
                      Modifier les infos
                    </button>
                    <br />

                    <button className="btn btn-dark" onClick={handleModifyPasswordForm} block="true" type="submit">
                      Modifier le mot de passe
                    </button>

                    <p className="session-div-switch">
                      Mode clair
                      <GreenSwitch onChange={handleChangeSwitch} checked={!!user.modeSombre} />
                      Mode Sombre
                    </p>

                  </td>
                </tr>
              </tbody>
            </table>

            <div className="small-profile">

              {user.profilePic ?
                <div onClick={() => inputFile.current.click()} className="relative">
                  <img className="inner-img" src={require('../../images/icons/camera.webp')} alt="camera" />
                  <img className="profile-pic profile-pic-small" src={user.profilePic} alt="profile-pic" />
                  <p> {text} </p>
                </div>
                :
                <div onClick={() => inputFile.current.click()} className="relative">
                  <img className="inner-img" src={require('../../images/icons/camera.webp')} alt="camera" />
                  <img className="unknown-profile-pic profile-pic profile-pic-small" src={require('../../images/profilepic.webp')} alt='unknown-profile-pic' />
                  <p> {text} </p>
                </div>
              }

              {user ?
                <div>
                  <h1> {user.fName} {user.lName} </h1>
                  <h1 className="profile-email"> {user.email} </h1>
                </div>
                : null}

              <button className="btn btn-dark profile-btn profile-btn-small" onClick={handleModifyForm} block="true" type="submit">
                Modifier les infos
              </button>
              <br />

              <button className="btn btn-dark" onClick={handleModifyPasswordForm} block="true" type="submit">
                Modifier le mot de passe
              </button>

              <p className="session-div-switch">
                Mode clair
                <GreenSwitch onChange={handleChangeSwitch} checked={!!user.modeSombre} />
                Mode Sombre </p>
            </div>

            <button className='btn btn-dark btn-lg' disabled={true}
              style={{ margin: "40px 20px" }}
              onClick={() => { window.location = "/profil?id=" + user.id }}>
              Voir profil en ligne
            </button>
            <button className="btn btn-black btn-lg profile-disconnect-btn" onClick={disconnect} block="true" type="submit">
              Se déconnecter
            </button>
          </div>
      }

      <Footer warnref={y} />
    </div>
  )
}

export default Compte