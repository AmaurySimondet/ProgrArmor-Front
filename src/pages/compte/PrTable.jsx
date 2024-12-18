import { React, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Fuse from 'fuse.js';
import API from "../../utils/API.js";
import Loader from "../../components/Loader.jsx";

function PrTable() {
    // PR Table states
    const [exercicesPrTable, setExercicesPrTable] = useState([]);
    const [searchCategoryQueryPrTable, setSearchCategoryQueryPrTable] = useState('');
    const [categoriesPrTable, setCategoriesPrTable] = useState([]);
    const [PrTableQuery, setPrTableQuery] = useState({});
    const [PrTableTitle, setPrTableTitle] = useState({});
    const [PrTableResults, setPrTableResults] = useState(null);
    const [searchExerciceQueryPrTable, setSearchExerciceQueryPrTable] = useState('');
    const [allExercices, setAllExercices] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

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

    const handleSearchExercice = (event) => {
        setSearchExerciceQueryPrTable(event.target.value);
        if (event.target.value === '') {
            setExercicesPrTable(allExercices.slice(0, 7));
            return;
        }
        const fuse = new Fuse(allExercices, { keys: ['name.fr'] });
        const results = fuse.search(event.target.value);
        setExercicesPrTable(results.map(result => result.item));
    };

    const handleSearchCategory = (event) => {
        setSearchCategoryQueryPrTable(event.target.value);
        if (event.target.value === '') {
            setCategoriesPrTable(allCategories.slice(0, 7));
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
        API.getPRs({ ...PrTableQuery, userId: searchParams.get('id') }).then(response => {
            setPrTableResults(response.data.prs);
        }
        ).catch(error => {
            console.error("Error fetching PRs:", error);
        });
    }

    if (loading) {
        return <Loader />
    }

    const PrTableElement = ({ PrTableResults }) => {
        return (
            <div>
                <h2 style={{ margin: "40px" }}>Records Personels (PR)</h2>
                <table border="1" style={{ width: '100%', textAlign: 'center', backgroundColor: 'white', overflowX: 'auto' }}
                    className="table table-striped table-bordered">
                    <thead className="thead-white">
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

export default PrTable;