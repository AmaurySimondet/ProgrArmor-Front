import { React, useState, useEffect } from "react";
import { isPersonalRecord } from "../../utils/pr.js";
import Fuse from 'fuse.js';
import API from "../../utils/API.js";
import Loader from "../../components/Loader.jsx";

function PrSearch() {
    // PR Search states
    const [exercicesPrSearch, setExercicesPrSearch] = useState(null);
    const [categoriesPrSearch, setCategoriesPrSearch] = useState([]);
    const [searchExerciceQueryPrSearch, setSearchExerciceQueryPrSearch] = useState('');
    const [searchCategoryQueryPrSearch, setSearchCategoryQueryPrSearch] = useState('');
    const [PrSearchTitle, setPrSearchTitle] = useState({});
    const [set, setSet] = useState({ unit: 'repetitions', value: '', weightLoad: '', elastic: '' });
    const [prStatus, setPrStatus] = useState(null);
    const [allExercices, setAllExercices] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        API.getExercices() // Replace with the actual method to fetch exercices
            .then(response => {
                let fetchedExercices = response.data.exercices || [];
                setAllExercices(fetchedExercices);
            })
            .catch(error => {
                console.error("Error fetching exercices:", error);
            });
        API.getCategories() // Replace with the actual method to fetch categories
            .then(response => {
                let fetchedCategories = response.data.categories || [];
                setAllCategories(fetchedCategories);
            })
            .catch(error => {
                console.error("Error fetching categories:", error);
            });
        setLoading(false);
    }, []);

    const handleSearchExercicePrSearch = (event) => {
        const query = event.target.value;
        setSearchExerciceQueryPrSearch(query);
        if (query === '') {
            setExercicesPrSearch(allExercices.slice(0, 8));
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
            setCategoriesPrSearch(allCategories.slice(0, 8));
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

    if (loading) {
        return <Loader />
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
                            <option value="repetitions">Repetitions</option>
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

export default PrSearch;