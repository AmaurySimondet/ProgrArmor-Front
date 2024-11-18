import React, { useState, useEffect } from 'react';
import Loader from '../../components/Loader';
import { useWindowDimensions } from '../../utils/useEffect';
import { randomBodybuildingEmojis } from '../../utils/emojis';
import API from '../../utils/API';


const SessionNameChoice = ({ onNext, onBack }) => {
    const [names, setNames] = useState([]);
    const [allNames, setAllNames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [customName, setCustomName] = useState('');
    const [showMore, setShowMore] = useState(true); // Track whether to show the "More Choices" button
    const [emojis, setEmojis] = useState([]);
    const { width } = useWindowDimensions();

    useEffect(() => {
        // Fetch session names from the API
        API.getSeanceNames({ userId: localStorage.getItem("id") }) // Replace with actual user ID or other params if needed
            .then(response => {
                const fetchedNames = response.data.seanceNames || [];
                const uniqueNames = fetchedNames.map(name => name.name).filter((value, index, self) => self.indexOf(value) === index);

                // Set all names and initially display only the first 2
                setAllNames(uniqueNames);
                setNames(uniqueNames.slice(0, 2)); // Show only first 2 names initially
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching seance names:", error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        setEmojis(randomBodybuildingEmojis(allNames.length));
    }, [allNames]);

    const handleMoreChoices = () => {
        setNames(allNames); // Show all session names
        setShowMore(false); // Hide the "More Choices" button
    };

    if (loading) {
        return <Loader />;
    }

    const handleChoice = (name) => {
        onNext(name);
    };

    const handleCustomNameChange = (e) => {
        setCustomName(e.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleCustomNameSubmit();
        }
    };

    const handleCustomNameSubmit = () => {
        if (customName.trim()) {
            onNext(customName);
        }
    };

    return (
        <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '20px' }} className='popInElement'>
            <h1
                style={{ color: '#9b0000', display: 'flex', alignItems: 'center', gap: '10px' }}
            >
                <span onClick={onBack} style={{ cursor: 'pointer' }} className="clickable">&lt; Retour</span>
            </h1>
            <h1 style={{ textAlign: 'center' }}>Choisir le nom de la séance</h1>
            <div className="sessionChoiceContainer">
                {names.map((name, index) => (
                    <div
                        key={index}
                        onClick={() => handleChoice(name)}
                        className='sessionChoice'
                    >
                        <div style={{ fontSize: width < 500 ? '18px' : '36px' }}>{emojis[index]}</div>
                        <div>{name}</div>
                    </div>
                ))}
                <div
                    className='sessionChoice'
                    style={{ backgroundColor: '#CCCCCC', width: "300px" }}
                >
                    <input
                        type="text"
                        value={customName}
                        onChange={handleCustomNameChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Entrer un nom"
                        style={{ width: '100%', marginBottom: '10px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                    />
                    <button
                        onClick={handleCustomNameSubmit}
                        className='btn btn-white'
                    >
                        Valider
                    </button>
                </div>
                {
                    showMore && allNames.length > 0 && (
                        <div
                            onClick={handleMoreChoices}
                            className='sessionChoicePlus'
                        >
                            <div style={width < 500 ? { fontSize: '18px' } : { fontSize: '36px' }}>➕</div>
                        </div>
                    )
                }
            </div >
        </div >
    );
};

export default SessionNameChoice;
