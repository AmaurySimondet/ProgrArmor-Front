import React, { useState, useEffect } from 'react';
import { Loader } from '../../components/Loader';
import Alert from '../../components/Alert';
import FoodPostChild from './FoodPostChild';
import API from '../../utils/API';
import { getUserById } from '../../utils/user';

const FoodPost = ({ selectedFoods, onBack }) => {
    const [postTitle, setPostTitle] = useState('');
    const [postDescription, setPostDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [user, setUser] = useState(null);

    const showAlert = (message, type) => {
        setAlert({ message, type });
    };

    const handleClose = () => {
        setAlert(null);
    };

    const handlePostSubmit = async () => {
        if (!postTitle) {
            showAlert("Veuillez ajouter un titre à votre repas.", "danger");
            return;
        }

        setIsSubmitting(true);

        // TODO: Implement meal creation API call
        try {
            // const response = await API.createMeal({ ... });
            setAlert({ message: "Repas créé avec succès!", type: "success" });
            setTimeout(() => {
                window.location.href = `/dashboard`
            }, 2000);
        } catch (error) {
            setIsSubmitting(false);
            setAlert({ message: "Erreur lors de la création du repas: " + error, type: "danger" });
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUserById(localStorage.getItem('id'));
            setUser(user);
            setLoading(false);
        };
        fetchUser();
    }, []);

    if (loading) {
        return <Loader />;
    }

    return (
        <div className='basic-flex popInElement' style={{ flexDirection: 'column', gap: '40px', alignItems: 'center' }}>
            <h1 style={{ color: '#9b0000', position: "absolute", left: "40px", margin: "20px 0" }}>
                <span onClick={onBack} style={{ cursor: 'pointer' }} className="clickable">&lt; Retour</span>
            </h1>

            <div className="session-post" style={{ padding: '20px', marginTop: '80px' }}>
                <FoodPostChild
                    user={user}
                    postTitle={postTitle}
                    setPostTitle={setPostTitle}
                    postDescription={postDescription}
                    setPostDescription={setPostDescription}
                    selectedFoods={selectedFoods}
                    editable={true}
                />

                <button
                    onClick={handlePostSubmit}
                    className="btn btn-black mt-2"
                    style={{ width: '100%' }}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Publication en cours...' : 'Publier le repas'}
                </button>
            </div>

            <div>
                {alert && (
                    <Alert message={alert.message} type={alert.type} onClose={handleClose} />
                )}
            </div>
        </div>
    );
};

export default FoodPost; 