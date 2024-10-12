import { React, useState, useEffect, useRef } from "react";
import NavigBar from "../../components/NavigBar.jsx";
import API from "../../utils/API.js";
import Footer from "../../components/Footer.jsx";
import { Upload } from "upload-js";
import { COLORS } from "../../utils/colors.js";
import { useWindowDimensions } from "../../utils/useEffect.js";
import Loader from "../../components/Loader.jsx";
import { fetchSeancesData } from "../../utils/seance.js";
import SessionPostChild from "../session/SessionPostChild.jsx";
import { stringToDate } from "../../utils/dates.js";
import Fuse from 'fuse.js';

function Compte() {
  const upload = Upload({ apiKey: "free" });
  const { width } = useWindowDimensions();
  const inputFile = useRef(null);
  const [text, setText] = useState();
  const [user, setUser] = useState({})
  const [formInfo, setFormInfo] = useState({})
  const [modifyInfo, setModifyInfo] = useState(false);
  const [modifyPassword, setModifyPassword] = useState(false);
  const [searchExerciceQuery, setSearchExerciceQuery] = useState('');
  const [allExercices, setAllExercices] = useState([]);
  const [exercices, setExercices] = useState([]);
  const [searchCategoryQuery, setSearchCategoryQuery] = useState('');
  const [allCategories, setAllCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [PRSearchQuery, setPRSearchQuery] = useState({});
  const [PRSearchTitle, setPRSearchTitle] = useState({});
  const [PRSearchResults, setPRSearchResults] = useState([]);


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
    API.getExercices() // Replace with the actual method to fetch exercices
      .then(response => {
        let fetchedExercices = response.data.exercices || [];
        setAllExercices(fetchedExercices);
        setExercices(fetchedExercices.slice(0, 3)); // Show only the first 3 exercices initially
      })
      .catch(error => {
        console.error("Error fetching exercices:", error);
        setLoading(false);
      });
    API.getCategories() // Replace with the actual method to fetch categories
      .then(response => {
        let fetchedCategories = response.data.categories || [];
        setAllCategories(fetchedCategories);
        setCategories(fetchedCategories.slice(0, 3)); // Show only the first 3 categories initially
      })
      .catch(error => {
        console.error("Error fetching categories:", error);
        setLoading(false);
      });
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

  const handleSearchExercice = (event) => {
    setSearchExerciceQuery(event.target.value);
    if (event.target.value === '') {
      setExercices(allExercices.slice(0, 3));
      return;
    }
    const fuse = new Fuse(allExercices, { keys: ['name.fr'] });
    const results = fuse.search(event.target.value);
    setExercices(results.map(result => result.item));
  };

  const handleSearchCategory = (event) => {
    setSearchCategoryQuery(event.target.value);
    if (event.target.value === '') {
      setCategories(allCategories.slice(0, 3));
      return;
    }
    const fuse = new Fuse(allCategories, { keys: ['name.fr'] });
    const results = fuse.search(event.target.value);
    setCategories(results.map(result => result.item));
  };

  const addExerciceSearch = (exercice) => {
    // Add the selected exercice to the PR search query and PR search title
    setPRSearchQuery({ ...PRSearchQuery, exercice: exercice._id });
    setPRSearchTitle({ ...PRSearchTitle, exercice: exercice.name.fr });
    setSearchExerciceQuery('');
  };

  const addCategorySearch = (category) => {
    // Add the selected category to the PR search query and PR search title
    setPRSearchQuery({ ...PRSearchQuery, categories: [...(PRSearchQuery.categories || []), { category: category._id }] });
    setPRSearchTitle({ ...PRSearchTitle, categories: [...(PRSearchTitle.categories || []), category.name.fr] });
    setSearchCategoryQuery('');
  };

  const handleClearPRSearch = () => {
    setPRSearchQuery({});
    setPRSearchTitle({});
    setSearchExerciceQuery('');
    setSearchCategoryQuery('');
  };

  const handlePRSearch = async () => {
    console.log('PR search query:', PRSearchQuery);
    API.getPRs({ ...PRSearchQuery, userId: localStorage.getItem("id") }).then(response => {
      console.log('PR search results:', response.data.prs);
      setPRSearchResults(response.data.prs);
    }
    ).catch(error => {
      console.error("Error fetching PRs:", error);
    });
  }

  const PRTable = ({ PRSearchResults }) => {
    return (
      <div>
        <h2 style={{ margin: "40px" }}>Records Personels (PR)</h2>
        <table border="1" style={{ width: '100%', textAlign: 'center', backgroundColor: 'white' }}>
          <thead>
            <tr>
              <th>Plage de répétition</th>
              <th>Repetitions (Valeur)</th>
              <th>Repetitions (Chargement)</th>
              <th>Repetitions (Elastique)</th>
              <th>Seconds (Valeur)</th>
              <th>Seconds (Chargement)</th>
              <th>Seconds (Elastique)</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(PRSearchResults).map(category => (
              <tr key={category}>
                <td>{category}</td>
                {/* Repetitions data */}
                <td>{PRSearchResults[category].repetitions?.value || 'N/A'}</td>
                <td>{PRSearchResults[category].repetitions?.weightLoad || 'N/A'}</td>
                <td>{PRSearchResults[category].repetitions?.elastic?.tension || 'N/A'}</td>
                {/* Seconds data */}
                <td>{PRSearchResults[category].seconds?.value || 'N/A'}</td>
                <td>{PRSearchResults[category].seconds?.weightLoad || 'N/A'}</td>
                <td>{PRSearchResults[category].seconds?.elastic?.tension || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };


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

  function UserInfo() {
    return <div>
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
                  <h2> {user.fName} {user.lName} </h2>
                  <h2 className="profile-email"> {user.email} </h2>
                </div>
                : null}

              <button className="btn btn-dark m-2" onClick={handleModifyForm} block="true" type="submit">
                Modifier les infos
              </button>
              <br />

              <button className="btn btn-dark m-2" onClick={handleModifyPasswordForm} block="true" type="submit">
                Modifier le mot de passe
              </button>
            </div>

            <button className="btn btn-black btn-lg profile-disconnect-btn" onClick={disconnect} block="true" type="submit">
              Se déconnecter
            </button>
          </div>
      }
    </div>
  }

  function Seances() {
    const [loading, setLoading] = useState(true);
    const [seances, setSeances] = useState(null);
    const [users, setUsers] = useState(null);

    useEffect(() => {
      // SEANCES
      // wait for fetchSeancesData to complete before setting the loading state to false
      const fetchSeances = async () => {
        const seances = await fetchSeancesData(localStorage.getItem("id"));
        setSeances(seances);
      };
      fetchSeances();

      // USERS
      const fetchUsersData = async () => {
        try {
          const response = await API.getUsers();
          setUsers(response.data.users);
        } catch (error) {
          console.error("Error fetching users data:", error);
        }
      };
      fetchUsersData();
    }, []);

    // when users and seances are loaded, set loading to false
    useEffect(() => {
      if (seances && users) {
        setLoading(false);
      }
    }, [seances, users]);

    useEffect(() => {
      console.log('Seances:', seances);
    }, [seances]);

    if (loading) {
      return <Loader />
    }

    const backgroundColors = ["#9C005D", "#9C1B00", "#9B0000", "#8B009C", "#9C3600"];

    return (
      <div>
        {/* USERS */}
        <div className='basic-flex popInElement' style={{ flexDirection: 'column', alignItems: 'center', padding: width < 400 ? "5px" : width < 550 ? "10px" : "20px" }}>
          <h1 style={{ marginTop: '40px', marginBottom: '20px' }}>
            Tu connais ces gens?</h1>
          <div className='basic-flex' style={{
            flexDirection: 'column', gap: '20px', display: 'flex',
            height: '70px',
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollSnapType: 'x mandatory',
            paddingBottom: '20px',
            scrollbarWidth: 'none',
            position: 'relative', // Required for the index positioning
            maxWidth: '600px',
          }}>
            {users && users.length > 0 ? (
              users.map((user, index) => (
                <div key={user._id} className='basic-flex' style={{ gap: '20px', alignItems: 'center' }}>
                  <img
                    className="icon-navbar"
                    src={require('../../images/profilepic.webp')}
                    alt='compte'
                    style={{
                      borderRadius: "50%",
                      border: "1px solid black",
                    }}
                  />
                  <div>
                    <div>{user.fName} {user.lName}</div>
                    <button className="btn btn-black">Suivre</button>
                  </div>
                </div>
              ))
            ) : (
              <div>No users available</div>
            )}
          </div>
        </div>

        {/* SEANCES */}
        <div className='basic-flex popInElement' style={{ flexDirection: 'column', gap: '40px', alignItems: 'center' }}>
          <h1 style={{ marginTop: '40px', marginBottom: '0' }}>
            Mes séances</h1>
          {seances && seances.length > 0 ? (
            seances.map((seance, index) => (
              <div className="session-post" style={
                width < 400 ? { padding: '5px', margin: "20px 0 0 0" } :
                  width < 550 ? { padding: '10px', margin: "20px 10px 0 10px" } :
                    { padding: '20px', margin: "20px 20px 0 20px" }}>
                <SessionPostChild
                  key={seance._id} // Always provide a key when rendering lists
                  user={seance.user}
                  postTitle={seance.title ? seance.title : "N/A"}
                  postDescription={seance.description}
                  selectedName={seance.name}
                  selectedDate={stringToDate(seance.date)}
                  selectedExercices={seance.exercices}
                  stats={seance.stats ? seance.stats : { nSets: "N/A", nReps: "N/A", intervalReps: "N/A", totalWeight: "N/A", intervalWeight: "N/A" }}
                  backgroundColors={backgroundColors}
                  recordSummary={seance.recordSummary ? seance.recordSummary : []}
                  editable={false}
                />
              </div>
            ))
          ) : (
            <div>Tu n'as pas encore de séance enregistrée !</div>
          )}
        </div>
      </div >
    );
  }

  return (
    <div style={{ backgroundColor: COLORS.PAGE_BACKGROUND }}>
      <div className="page-container">
        <NavigBar location="session" />


        <div className="content-wrap">
          {UserInfo()}

          {/* PR SEARCH */}
          <div className='basic-flex popInElement' style={{ flexDirection: 'column', alignItems: 'center' }}>
            <h1 style={{ marginTop: '40px', marginBottom: '20px' }}>
              Recherche de PR</h1>
            <div >
              <div style={{ width: '90vw', textAlign: 'center' }}>
                {/* EXERCICE SEARCH */}
                <input
                  type="text"
                  value={searchExerciceQuery}
                  onChange={handleSearchExercice}
                  placeholder="Exercice"
                  style={{
                    padding: '10px',
                    fontSize: '1rem',
                    margin: '20px 0',
                    width: '80%',
                    maxWidth: '400px',
                    borderRadius: '5px',
                  }}
                />
                {searchExerciceQuery && (
                  <div style={{ marginBottom: '20px', textAlign: 'left', maxHeight: '200px', overflowY: 'auto' }}>
                    {exercices.length ? (
                      exercices.map((exercice, index) => (
                        <div
                          key={index}
                          onClick={() => addExerciceSearch(exercice)}
                          className="inputClickable"
                        >
                          {exercice.name.fr}
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: '10px', color: '#999' }}>Aucun résultat trouvé</div>
                    )}
                  </div>
                )}

                {/* CATEGORY SEARCH */}
                <br />
                <input
                  type="text"
                  value={searchCategoryQuery}
                  onChange={handleSearchCategory}
                  placeholder="Catégorie"
                  style={{
                    padding: '10px',
                    fontSize: '1rem',
                    margin: '20px 0',
                    width: '80%',
                    maxWidth: '400px',
                    borderRadius: '5px',
                  }}
                />
                {searchCategoryQuery && (
                  <div style={{ marginBottom: '20px', textAlign: 'left', maxHeight: '200px', overflowY: 'auto' }}>
                    {categories.length ? (
                      categories.map((category, index) => (
                        <div
                          key={index}
                          onClick={() => addCategorySearch(category)}
                          className="inputClickable"
                        >
                          {category.name.fr}
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: '10px', color: '#999' }}>Aucun résultat trouvé</div>
                    )}
                  </div>
                )}

                {/* PR SEARCH TITLE */}
                <br />
                {PRSearchTitle.exercice && (<h3>{PRSearchTitle.exercice}</h3>)}
                {PRSearchTitle.categories && (<h3>{PRSearchTitle.categories.join(', ')}</h3>)}

                {/* SEARCH BUTTON */}
                <br />
                <button className="btn btn-white m-2" onClick={handleClearPRSearch}> Effacer </button>
                <button className="btn btn-black" onClick={handlePRSearch}>Rechercher</button>

                {/* PR SEARCH RESULTS */}
                {PRSearchResults && <PRTable PRSearchResults={PRSearchResults} />}
              </div>
            </div>
          </div>

          {Seances()}
        </div>

        <Footer />
      </div>
    </div>
  )
}

export default Compte