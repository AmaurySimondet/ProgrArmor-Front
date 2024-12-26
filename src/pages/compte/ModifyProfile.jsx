import React, { useState } from 'react';
import API from '../../utils/API.js';

function ModifyProfile({ user, onClose }) {
    const [formData, setFormData] = useState({
        fName: user.fName || '',
        lName: user.lName || '',
        email: user.email || '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        // Validate form
        let newErrors = {};

        // Check for empty fields
        if (formData.fName.trim() === '') {
            newErrors.fName = "Le prénom est requis";
        }
        if (formData.lName.trim() === '') {
            newErrors.lName = "Le nom est requis";
        }
        if (formData.email.trim() === '') {
            newErrors.email = "L'email est requis";
        } else {
            // Email format validation using the same pattern as InscriptionForm
            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email.trim())) {
                newErrors.email = "Format d'email invalide";
            }
        }
        if (formData.password && formData.password !== formData.confirmPassword) {
            newErrors.password = "Les mots de passe ne correspondent pas";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Create object with only modified fields
        const changedFields = {};
        Object.keys(formData).forEach(key => {
            if (key === 'confirmPassword') return; // Skip confirmPassword
            if (formData[key] && formData[key] !== user[key]) {
                changedFields[key] = formData[key];
            }
        });

        if (Object.keys(changedFields).length === 0) {
            onClose();
            return;
        }

        try {
            console.log('Updating user with:', changedFields);
            await API.modifyUser({ ...changedFields, id: localStorage.getItem('id') });

            // If password was changed, log out the user
            if (changedFields.password) {
                localStorage.clear();
                window.location.href = '/connexion';
                return;
            }

            onClose();
        } catch (error) {
            console.error('Error updating profile:', error);
            setErrors({ submit: 'Erreur lors de la mise à jour du profil' });
        }
    };

    return (
        <div className="modal-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div className="modal-content" style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                maxWidth: '500px',
                width: '90%'
            }}>
                <h2>Envie de changement ?</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label>Prénom</label>
                        <input
                            type="text"
                            name="fName"
                            value={formData.fName}
                            onChange={handleChange}
                            className="form-control"
                        />
                        {errors.fName && <div className="error-message" style={{ color: 'red' }}>{errors.fName}</div>}
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label>Nom</label>
                        <input
                            type="text"
                            name="lName"
                            value={formData.lName}
                            onChange={handleChange}
                            className="form-control"
                        />
                        {errors.lName && <div className="error-message" style={{ color: 'red' }}>{errors.lName}</div>}
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-control"
                        />
                        {errors.email && <div className="error-message" style={{ color: 'red' }}>{errors.email}</div>}
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label>Nouveau mot de passe (optionnel)</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="form-control"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    border: 'none',
                                    background: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label>Confirmer le mot de passe</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="form-control"
                                disabled={!formData.password}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    border: 'none',
                                    background: 'none',
                                    cursor: 'pointer'
                                }}
                                disabled={!formData.password}
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                        {errors.password && <div className="error-message" style={{ color: 'red' }}>{errors.password}</div>}
                    </div>

                    {errors.submit && <div className="error-message" style={{ color: 'red', marginBottom: '15px' }}>{errors.submit}</div>}

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button type="button" className="btn btn-white" onClick={onClose}>
                            Annuler
                        </button>
                        <button type="submit" className="btn btn-black">
                            Sauvegarder
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ModifyProfile; 