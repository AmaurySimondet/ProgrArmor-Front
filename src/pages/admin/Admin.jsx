import { React, useEffect, useState } from "react";
import NavigBar from "../../components/NavigBar";
import { COLORS } from "../../utils/constants";
import API from "../../utils/API";
import DisplaySeancesPost from "../../components/DisplaySeancesPost";
import ProfilePic from "../../components/profilePic";
import AppFooter from "../../components/AppFooter";
import { MiniLoader } from "../../components/Loader";
import Alert from "../../components/Alert";

function Admin() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [routeStats, setRouteStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('routes');
    const [feedback, setFeedback] = useState([]);
    const [feedbackPage, setFeedbackPage] = useState(1);
    const [hasMoreFeedback, setHasMoreFeedback] = useState(true);
    const [formData, setFormData] = useState({
        docType: '',
        categoryType: '',
        exercice: '',
        category: '',
        nameFr: '',
        nameEn: '',
        popularityScore: '',
        examplesFr: ['', '', ''],
        examplesEn: ['', '', ''],
        associatedType: ''
    });
    const [availableTypes, setAvailableTypes] = useState([]);
    const [loadingTypes, setLoadingTypes] = useState(false);
    const [alert, setAlert] = useState(null);

    const showAlert = (message, type) => {
        setAlert({ message, type });
    };

    const handleClose = () => {
        setAlert(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === process.env.REACT_APP_ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Incorrect password');
        }
    };

    useEffect(() => {
        API.getRouteStats().then(res => setRouteStats(res.data)).catch(setError).finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (activeTab === 'feedback') {
            API.getFeedback({ page: feedbackPage })
                .then(res => {
                    setFeedback(prev => feedbackPage === 1 ? res.data.feedback : [...prev, ...res.data.feedback]);
                    setHasMoreFeedback(res.data.hasMore);
                })
                .catch(setError);
        }
    }, [activeTab, feedbackPage]);

    if (!isAuthenticated) {
        return (
            <div style={{ backgroundColor: COLORS.PAGE_BACKGROUND }}>
                <div className="page-container">
                    <NavigBar location="admin" />
                    <div className="content-wrap" style={{ backgroundColor: COLORS.PAGE_BACKGROUND }}>
                        <div className="basic-flex popInElement" style={{ flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
                            <h1>Admin Login</h1>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'row', gap: '20px', alignItems: 'center' }}>
                                <input
                                    type="password"
                                    className="form-control mr-2"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Mot de passe"
                                />
                                <button className="btn btn-dark large-margin-updown" type="submit">Login</button>
                                {error && <p style={{ color: 'red' }}>{error}</p>}
                            </form>
                        </div>
                    </div>
                    <AppFooter />
                </div>
            </div >
        );
    }

    const Tabs = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }} className="tab-container">
                <ul className="tabs" role="navigation" style={{ listStyle: 'none', padding: 0, display: 'flex', justifyContent: 'center' }}>
                    <li className={activeTab === 'routes' ? 'selected' : ''}>
                        <a className="tab" onClick={() => setActiveTab('routes')}>
                            <img src={require('../../images/icons/chart.webp')} alt="routes" style={{ width: '20px', height: '20px', filter: 'invert(1)', marginRight: '5px' }} />
                            Routes
                        </a>
                    </li>
                    <li className={activeTab === 'seances' ? 'selected' : ''}>
                        <a className="tab" onClick={() => setActiveTab('seances')}>
                            <img src={require('../../images/icons/write.webp')} alt="seances" style={{ width: '20px', height: '20px', filter: 'invert(1)', marginRight: '5px' }} />
                            Séances
                        </a>
                    </li>
                    <li className={activeTab === 'feedback' ? 'selected' : ''}>
                        <a className="tab" onClick={() => setActiveTab('feedback')}>
                            💬 Feedback
                        </a>
                    </li>
                    <li className={activeTab === 'documents' ? 'selected' : ''}>
                        <a className="tab" onClick={() => setActiveTab('documents')}>
                            📄 Documents
                        </a>
                    </li>
                </ul>
            </div>
        )
    }

    const RouteStats = () => {
        return (
            <div className="basic-flex popInElement" style={{ flexDirection: 'column', gap: '20px', alignItems: 'center', padding: '20px', maxWidth: '700px', margin: '0 auto' }}>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Copy</th>
                            <th>Route</th>
                            <th>Count</th>
                            <th>Avg (ms)</th>
                            <th>Min (ms)</th>
                            <th>Max (ms)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(routeStats)
                            .sort(([, a], [, b]) => b.avg - a.avg)
                            .map(([route, stats]) => (
                                <tr key={route}>
                                    <td>
                                        <button className="btn btn-white" onClick={() => {
                                            navigator.clipboard.writeText(route);
                                        }}>📄</button>
                                    </td>
                                    <td title={route}>{route.length > 30 ? route.slice(0, 30) + '...' : route}</td>
                                    <td>{stats.count}</td>
                                    <td>{Number(stats.avg).toFixed(2)}</td>
                                    <td>{Number(stats.min).toFixed(2)}</td>
                                    <td>{Number(stats.max).toFixed(2)}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        )
    }

    const FeedbackList = () => {
        return (
            <div className="basic-flex popInElement" style={{ flexDirection: 'column', gap: '20px', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
                {feedback.map((item, index) => (
                    <div key={index} className="card">
                        <div className="card-body">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => window.location.href = window.location.origin + '/compte?id=' + item.user._id}>
                                <ProfilePic size="40px" user={item.user} />
                                <h5 className="card-title" style={{ margin: 0 }}>{item.user?.fName} {item.user?.lName}</h5>
                                <h6 className="card-subtitle text-muted" style={{ margin: 0 }}>{item.user?.email}</h6>
                            </div>
                            <div className="badge bg-secondary mb-2" style={{ color: "white" }}>{item.type}</div>
                            <p className="card-text">{item.text}</p>
                            {item.media && item.media.map((media, i) => (
                                <img key={i} src={media.cloudfrontUrl} alt="Feedback media"
                                    onClick={() => window.open(media.cloudfrontUrl, '_blank')}
                                    style={{ maxWidth: '200px', margin: '10px', cursor: 'pointer' }} />
                            ))}
                            <br />
                            <small className="text-muted">
                                {new Date(item.createdAt).toLocaleDateString()}
                            </small>
                        </div>
                    </div>
                ))}
                {hasMoreFeedback && (
                    <button
                        className="btn btn-dark"
                        onClick={() => setFeedbackPage(prev => prev + 1)}
                    >
                        Load More
                    </button>
                )}
            </div>
        )
    }

    const DocumentForm = () => {
        const handleSubmit = async (e) => {
            e.preventDefault();
            // Simulation des appels API
            console.log('Submitting form data:', formData);
            // Fake API calls based on document type
            let res = null
            switch (formData.docType) {
                case 'exerciceType':
                    try {
                        res = await API.createExerciceType(formData);
                        console.log(res);
                        showAlert('Document created successfully, document: ' + JSON.stringify(res.data), 'success');
                    } catch (error) {
                        console.error(error);
                        showAlert('Failed to create document, error: ' + res.status, 'error');
                    }
                    break;
                case 'categoryType':
                    try {
                        res = await API.createCategoryType(formData);
                        console.log(res);
                        showAlert('Document created successfully, document: ' + JSON.stringify(res.data), 'success');
                    } catch (error) {
                        console.error(error);
                        showAlert('Failed to create document, error: ' + res.status, 'error');
                    }
                    break;
                case 'exercice':
                    try {
                        res = await API.createExercice(formData);
                        console.log(res);
                        showAlert('Document created successfully, document: ' + JSON.stringify(res.data), 'success');
                    } catch (error) {
                        console.error(error);
                        showAlert('Failed to create document, error: ' + res.status, 'error');
                    }
                    break;
                case 'category':
                    try {
                        res = await API.createCategory(formData);
                        console.log(res);
                        showAlert('Document created successfully, document: ' + JSON.stringify(res.data), 'success');
                    } catch (error) {
                        console.error(error);
                        showAlert('Failed to create document, error: ' + res.status, 'error');
                    }
                    break;
            }
        };

        const handleInputChange = (field, value) => {
            setFormData(prev => ({ ...prev, [field]: value }));
            if (field === 'docType') {
                if (value === 'exercice' || value === 'category') {
                    loadAssociatedTypes(value);
                } else {
                    setAvailableTypes([]);
                }
            }
        };

        const handleExampleChange = (lang, index, value) => {
            setFormData(prev => ({
                ...prev,
                [`examples${lang}`]: prev[`examples${lang}`].map((ex, i) => i === index ? value : ex)
            }));
        };

        const loadAssociatedTypes = async (docType) => {
            setLoadingTypes(true);
            try {
                let response;
                if (docType === 'exercice') {
                    response = await API.getExerciceTypes({ page: 1, limit: 100 });
                    setAvailableTypes(response.data.exerciceTypes || []);
                } else if (docType === 'category') {
                    response = await API.getCategoryTypes({ page: 1, limit: 100 });
                    setAvailableTypes(response.data.categorieTypes || []);
                } else {
                    setAvailableTypes([]);
                }
            } catch (error) {
                console.error('Error loading types:', error);
                setAvailableTypes([]);
            } finally {
                setLoadingTypes(false);
            }
        };

        return (
            <div className="basic-flex" style={{ flexDirection: 'column', gap: '20px', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
                <form onSubmit={handleSubmit} className="card">
                    <div className="card-body">
                        <div className="mb-3" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <label className="form-label">Document Type</label>
                            <select
                                className="form-select"
                                value={formData.docType}
                                onChange={(e) => handleInputChange('docType', e.target.value)}
                                style={{
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: '1px solid #ced4da',
                                    backgroundColor: '#fff',
                                    fontSize: '1em',
                                    cursor: 'pointer',
                                    transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
                                }}
                            >
                                <option value="">Select type...</option>
                                <option value="exerciceType">Exercice Type</option>
                                <option value="categoryType">Category Type</option>
                                <option value="exercice">Exercice</option>
                                <option value="category">Category</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Name (FR)</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.nameFr}
                                onChange={(e) => handleInputChange('nameFr', e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Name (EN)</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.nameEn}
                                onChange={(e) => handleInputChange('nameEn', e.target.value)}
                            />
                        </div>

                        {formData.docType.includes('Type') && (
                            <>
                                <div className="mb-3">
                                    <label className="form-label">Popularity Score (0-100)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        min="0"
                                        max="100"
                                        value={formData.popularityScore}
                                        onChange={(e) => handleInputChange('popularityScore', e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Examples (FR)</label>
                                    {formData.examplesFr.map((ex, i) => (
                                        <input
                                            key={i}
                                            type="text"
                                            className="form-control mb-2"
                                            value={ex}
                                            onChange={(e) => handleExampleChange('Fr', i, e.target.value)}
                                            placeholder={`Example ${i + 1}`}
                                        />
                                    ))}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Examples (EN)</label>
                                    {formData.examplesEn.map((ex, i) => (
                                        <input
                                            key={i}
                                            type="text"
                                            className="form-control mb-2"
                                            value={ex}
                                            onChange={(e) => handleExampleChange('En', i, e.target.value)}
                                            placeholder={`Example ${i + 1}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}

                        {!formData.docType.includes('Type') && (
                            <div className="mb-3" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <label className="form-label">Associated Type</label>
                                {loadingTypes ? (
                                    <div className="text-center">
                                        <MiniLoader />
                                    </div>
                                ) : (
                                    <select
                                        className="form-select"
                                        value={formData.associatedType}
                                        onChange={(e) => handleInputChange('associatedType', e.target.value)}
                                        disabled={loadingTypes}
                                        style={{
                                            padding: '10px',
                                            borderRadius: '8px',
                                            border: '1px solid #ced4da',
                                            backgroundColor: '#fff',
                                            fontSize: '1em',
                                            cursor: 'pointer',
                                            transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
                                        }}
                                    >
                                        <option value="">Select associated type...</option>
                                        {availableTypes.map((type) => (
                                            <option key={type._id} value={type._id}>
                                                {type.name.fr}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        )}

                        <button type="submit" className="btn btn-dark">Create Document</button>
                    </div>
                </form>

                {alert && <Alert message={alert.message} type={alert.type} onClose={handleClose} timeout={15000} />}
            </div>
        );
    };

    return (
        <div style={{ backgroundColor: COLORS.PAGE_BACKGROUND }}>
            <div className="page-container">
                <NavigBar location="admin" />
                <div className="content-wrap" style={{ backgroundColor: COLORS.PAGE_BACKGROUND }}>
                    {loading ? <Loader /> : (
                        <>
                            <Tabs />
                            {activeTab === 'routes' ? <RouteStats /> :
                                activeTab === 'seances' ? <DisplaySeancesPost admin={true} /> :
                                    activeTab === 'feedback' ? <FeedbackList /> :
                                        <DocumentForm />}
                        </>
                    )}
                </div>
                <AppFooter />
            </div>
        </div>
    )
}

export default Admin