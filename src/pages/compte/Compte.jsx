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
import { isPersonalRecord } from "../../utils/pr.js";

function Compte() {
  const upload = Upload({ apiKey: "free" });
  const { width } = useWindowDimensions();
  const inputFile = useRef(null);
  const [text, setText] = useState();
  const [user, setUser] = useState({})
  const [formInfo, setFormInfo] = useState({})
  const [modifyInfo, setModifyInfo] = useState(false);
  const [modifyPassword, setModifyPassword] = useState(false);
  const [searchExerciceQueryPrTable, setSearchExerciceQueryPrTable] = useState('');
  const [allExercices, setAllExercices] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  // PR Table states
  const [exercicesPrTable, setExercicesPrTable] = useState([]);
  const [searchCategoryQueryPrTable, setSearchCategoryQueryPrTable] = useState('');
  const [categoriesPrTable, setCategoriesPrTable] = useState([]);
  const [PrTableQuery, setPrTableQuery] = useState({});
  const [PrTableTitle, setPrTableTitle] = useState({});
  const [PrTableResults, setPrTableResults] = useState(null);
  // PR Search states
  const [exercicesPrSearch, setExercicesPrSearch] = useState(null);
  const [categoriesPrSearch, setCategoriesPrSearch] = useState([]);
  const [searchExerciceQueryPrSearch, setSearchExerciceQueryPrSearch] = useState('');
  const [searchCategoryQueryPrSearch, setSearchCategoryQueryPrSearch] = useState('');
  const [PrSearchTitle, setPrSearchTitle] = useState({});

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

  function PrTable() {
    const handleSearchExercice = (event) => {
      setSearchExerciceQueryPrTable(event.target.value);
      if (event.target.value === '') {
        setExercicesPrTable(allExercices.slice(0, 3));
        return;
      }
      const fuse = new Fuse(allExercices, { keys: ['name.fr'] });
      const results = fuse.search(event.target.value);
      setExercicesPrTable(results.map(result => result.item));
    };

    const handleSearchCategory = (event) => {
      setSearchCategoryQueryPrTable(event.target.value);
      if (event.target.value === '') {
        setCategoriesPrTable(allCategories.slice(0, 3));
        return;
      }
      const fuse = new Fuse(allCategories, { keys: ['name.fr'] });
      const results = fuse.search(event.target.value);
      setCategoriesPrTable(results.map(result => result.item));
    };

    const addExerciceSearch = (exercice) => {
      // Add the selected exercice to the PR search query and PR search title
      setPrTableQuery({ ...PrTableQuery, exercice: exercice._id });
      setPrTableTitle({ ...PrTableTitle, exercice: exercice.name.fr });
      setSearchExerciceQueryPrTable('');
    };

    const addCategorySearch = (category) => {
      // Add the selected category to the PR search query and PR search title
      setPrTableQuery({ ...PrTableQuery, categories: [...(PrTableQuery.categories || []), { category: category._id }] });
      setPrTableTitle({ ...PrTableTitle, categories: [...(PrTableTitle.categories || []), category.name.fr] });
      setSearchCategoryQueryPrTable('');
    };

    const handleClearPrTable = () => {
      setPrTableQuery({});
      setPrTableTitle({});
      setSearchExerciceQueryPrTable('');
      setSearchCategoryQueryPrTable('');
    };

    const handlePrTable = async () => {
      console.log('PR search query:', PrTableQuery);
      API.getPRs({ ...PrTableQuery, userId: localStorage.getItem("id") }).then(response => {
        console.log('PR search results:', response.data.prs);
        setPrTableResults(response.data.prs);
      }
      ).catch(error => {
        console.error("Error fetching PRs:", error);
      });
    }

    const PrTableElement = ({ PrTableResults }) => {
      return (
        <div>
          <h2 style={{ margin: "40px" }}>Records Personels (PR)</h2>
          <table border="1" style={{ width: '100%', textAlign: 'center', backgroundColor: 'white' }}
            className="table table-striped table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>Plage de répétition</th>
                <th>Repetitions</th>
                <th>Charge</th>
                <th>Elastique</th>
                <th style={{ color: "#aaaaaa" }}>Secondes</th>
                <th style={{ color: "#aaaaaa" }}>Charge</th>
                <th style={{ color: "#aaaaaa" }}>Elastique</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(PrTableResults).map(category => (
                <tr key={category}>
                  <td>{category}</td>
                  {/* Repetitions data */}
                  <td>{PrTableResults[category].repetitions?.value || '-'}</td>
                  <td>{PrTableResults[category].repetitions?.weightLoad || '-'}</td>
                  <td>{PrTableResults[category].repetitions?.elastic?.tension || '-'}</td>
                  {/* Seconds data */}
                  <td>{PrTableResults[category].seconds?.value || '-'}</td>
                  <td>{PrTableResults[category].seconds?.weightLoad || '-'}</td>
                  <td>{PrTableResults[category].seconds?.elastic?.tension || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    };

    return <div className='basic-flex popInElement' style={{ flexDirection: 'column', alignItems: 'center' }}>
      <h1 style={{ marginTop: '40px', marginBottom: '20px' }}>
        Tableau de PR</h1>
      <div >
        <div style={{ width: '90vw', textAlign: 'center' }}>
          {/* EXERCICE SEARCH */}
          <input
            type="text"
            value={searchExerciceQueryPrTable}
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
          {searchExerciceQueryPrTable && (
            <div style={{ marginBottom: '20px', textAlign: 'left', maxHeight: '200px', overflowY: 'auto' }}>
              {exercicesPrTable.length ? (
                exercicesPrTable.map((exercice, index) => (
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
            value={searchCategoryQueryPrTable}
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
          {searchCategoryQueryPrTable && (
            <div style={{ marginBottom: '20px', textAlign: 'left', maxHeight: '200px', overflowY: 'auto' }}>
              {categoriesPrTable.length ? (
                categoriesPrTable.map((category, index) => (
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
          {PrTableTitle.exercice && (<h3>{PrTableTitle.exercice}</h3>)}
          {PrTableTitle.categories && (<h3>{PrTableTitle.categories.join(', ')}</h3>)}

          {/* SEARCH BUTTON */}
          <br />
          <button className="btn btn-white m-2" onClick={handleClearPrTable}> Effacer </button>
          <button className="btn btn-black" onClick={handlePrTable}>Rechercher</button>

          {/* PR SEARCH RESULTS */}
          {PrTableResults && <PrTableElement PrTableResults={PrTableResults} />}
        </div>
      </div>
    </div>
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


  function PrSearch() {
    const [set, setSet] = useState({ unit: 'repetitions', value: '', weightLoad: '', elastic: '' });
    const [prStatus, setPrStatus] = useState(null);

    const handleSearchExercicePrSearch = (event) => {
      const query = event.target.value;
      setSearchExerciceQueryPrSearch(query);
      if (query === '') {
        setExercicesPrSearch(allExercices.slice(0, 3));
        return;
      }
      const fuse = new Fuse(allExercices, { keys: ['name.fr'] });
      const results = fuse.search(query);
      setExercicesPrSearch(results.map(result => result.item));
    };

    const handleSearchCategoryPrSearch = (event) => {
      const query = event.target.value;
      setSearchCategoryQueryPrSearch(query);
      if (query === '') {
        setCategoriesPrSearch(allCategories.slice(0, 3));
        return;
      }
      const fuse = new Fuse(allCategories, { keys: ['name.fr'] });
      const results = fuse.search(query);
      setCategoriesPrSearch(results.map(result => result.item));
    };

    const handleAddSet = (event) => {
      const { name, value } = event.target;
      setSet(prevSet => ({ ...prevSet, [name]: value }));
    };

    const addExerciceSearchPrSearch = (exercice) => {
      setPrSearchTitle(prevTitle => ({ ...prevTitle, exercice }));
      setSearchExerciceQueryPrSearch('');
    };

    const addCategorySearchPrSearch = (category) => {
      setPrSearchTitle(prevTitle => ({
        ...prevTitle,
        categories: [...(prevTitle.categories || []), category]
      }));
      setSearchCategoryQueryPrSearch('');
    };

    const handleCheckPrStatus = async () => {
      setPrSearchTitle({ ...PrSearchTitle, set });

      if (PrSearchTitle.exercice && set.unit && set.value && set.weightLoad) {
        try {
          console.log('Checking PR status for:', PrSearchTitle);
          let status = await isPersonalRecord(set, PrSearchTitle.exercice._id, PrSearchTitle.categories ? PrSearchTitle.categories.map(cat => ({ category: cat._id })) : []);
          // if status is null, "Not a PR" is displayed
          status = status || "Not a PR";
          setPrStatus(status);
        } catch (error) {
          console.error("Error checking PR status:", error);
        }
      }
    };

    const handleClearPrSearch = () => {
      setPrSearchTitle({});
      setPrStatus(null);
      setSet({ unit: 'repetitions', value: '', weightLoad: '', elastic: '' });
      setSearchExerciceQueryPrSearch('');
      setSearchCategoryQueryPrSearch('');
    }

    return (
      <div className="basic-flex popInElement" style={{ flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ marginTop: '40px', marginBottom: '20px' }}>Est-ce un PR ?</h1>

        <div style={{ width: '90vw', textAlign: 'center' }}>
          {/* Exercise Search Input */}
          <input
            type="text"
            value={searchExerciceQueryPrSearch}
            onChange={handleSearchExercicePrSearch}
            placeholder="Exercice"
            style={{
              padding: '10px',
              fontSize: '1rem',
              margin: '20px',
              width: '80%',
              maxWidth: '400px',
              borderRadius: '5px',
            }}
          />
          {searchExerciceQueryPrSearch && (
            <div style={{ marginBottom: '20px', textAlign: 'left', maxHeight: '200px', overflowY: 'auto' }}>
              {exercicesPrSearch.length ? (
                exercicesPrSearch.map((exercice, index) => (
                  <div
                    key={index}
                    onClick={() => addExerciceSearchPrSearch(exercice)}
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

          {/* Category Search Input */}
          <input
            type="text"
            value={searchCategoryQueryPrSearch}
            onChange={handleSearchCategoryPrSearch}
            placeholder="Catégorie"
            style={{
              padding: '10px',
              fontSize: '1rem',
              margin: '20px',
              width: '80%',
              maxWidth: '400px',
              borderRadius: '5px',
            }}
          />
          {searchCategoryQueryPrSearch && (
            <div style={{ marginBottom: '20px', textAlign: 'left', maxHeight: '200px', overflowY: 'auto' }}>
              {categoriesPrSearch.length ? (
                categoriesPrSearch.map((category, index) => (
                  <div
                    key={index}
                    onClick={() => addCategorySearchPrSearch(category)}
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

          {/* Set Details Inputs */}
          <div style={{ marginTop: '20px', display: "flex", flexDirection: "row", gap: '20px' }}>
            <label style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              Unité
              <select name="unit" value={set.unit} onChange={handleAddSet} style={{
                padding: '10px',
                fontSize: '1rem',
                margin: '20px 0',
                width: '80%',
                maxWidth: '400px',
                borderRadius: '5px',
              }}>
                <option value="repetitions" selected>Repetitions</option>
                <option value="seconds">Seconds</option>
              </select>
            </label>
            <label style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              Valeur
              <input type="number" name="value" value={set.value} onChange={handleAddSet} style={{
                padding: '10px',
                fontSize: '1rem',
                margin: '20px 0',
                width: '80%',
                maxWidth: '400px',
                borderRadius: '5px',
              }} />
            </label>
            <label style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              Charge
              <input type="number" name="weightLoad" value={set.weightLoad} onChange={handleAddSet} style={{
                padding: '10px',
                fontSize: '1rem',
                margin: '20px 0',
                width: '80%',
                maxWidth: '400px',
                borderRadius: '5px',
              }} />
            </label>
            <label style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              Elastique
              <input type="text" name="elastic" value={set.elastic} onChange={handleAddSet} style={{
                padding: '10px',
                fontSize: '1rem',
                margin: '20px 0',
                width: '80%',
                maxWidth: '400px',
                borderRadius: '5px',
              }} />
            </label>
          </div>

          {/* PR SEARCH TITLE */}
          <br />
          {PrSearchTitle.exercice && (<h3>{PrSearchTitle.exercice.name.fr}</h3>)}
          {PrSearchTitle.categories && (<h3>{PrSearchTitle.categories.map(cat => cat.name.fr).join(', ')}</h3>)}
          {PrSearchTitle.set && (
            <h3> {PrSearchTitle.set.value} {PrSearchTitle.set.unit} {` @ ${PrSearchTitle.set.weightLoad} kg`} {PrSearchTitle.set.elastic && `Elastique: ${PrSearchTitle.set.elastic}`} </h3>
          )}

          {/* Check PR Button */}
          <br />
          <button className="btn btn-white m-2" onClick={handleClearPrSearch}> Effacer </button>
          <button className="btn btn-black" onClick={handleCheckPrStatus}>Vérifier le PR</button>

          {/* Display PR Status */}
          {prStatus && (
            <div style={{ marginTop: '20px', fontSize: '1.5rem', color: prStatus === "PR" ? 'green' : (prStatus === "SB" ? 'orange' : 'red') }}>
              {prStatus === "PR" ? "PR : Record Personnel !" : prStatus === "SB" ? "SB : Même meilleur résultat" : "Pas un PR"}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: COLORS.PAGE_BACKGROUND }}>
      <div className="page-container">
        <NavigBar location="session" />


        <div className="content-wrap">
          {UserInfo()}

          {PrSearch()}

          {PrTable()}

          {Seances()}
        </div>

        <Footer />
      </div>
    </div>
  )
}

export default Compte