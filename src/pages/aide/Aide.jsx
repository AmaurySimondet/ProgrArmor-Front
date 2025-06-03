import Footer from "../../components/Footer";
import NavigBar from "../../components/NavigBar";
import { React, useEffect, useState } from "react"
import InstallApp from "./InstallApp";
import ConversionBerger from "./ConversionBerger";
import { COLORS, VIDEO_FORMATS } from "../../utils/constants";
import { resizeImage, validateFileSize, MAX_FILE_SIZE } from "../../utils/mediaUtils";
import { deleteFromS3, uploadToS3 } from "../../utils/s3Upload";
import API from "../../utils/API";
import Alert from "../../components/Alert";
import AppFooter from "../../components/AppFooter";

function Aide() {
    const [clickInstallApp, setClickInstallApp] = useState(false);
    const [clickBerger, setClickBerger] = useState(false);
    const [clickSendFeedback, setClickSendFeedback] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [feedbackMedia, setFeedbackMedia] = useState([]);
    const [mediaUploading, setMediaUploading] = useState(false);
    const [feedbackType, setFeedbackType] = useState('bug');
    const [alert, setAlert] = useState(null);

    const showAlert = (message, type) => {
        setAlert({ message, type });
    };

    const handleClose = () => {
        setAlert(null);
    };

    function handleClickInstallApp() {
        setClickInstallApp(!clickInstallApp)
    }

    function handleClickBerger() {
        setClickBerger(!clickBerger)
    }

    async function handleSendFeedback() {
        // TODO: Send through API
        await API.sendFeedback({
            type: feedbackType,
            text: feedback,
            media: feedbackMedia
        });
        showAlert("Merci pour votre feedback !", "success");
    }

    function handleChangeFeedback(event) {
        setFeedback(event.target.value);
    }

    function handleClickSendFeedback() {
        setClickSendFeedback(!clickSendFeedback);
    }

    const handleMediaUpload = async (event) => {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        try {
            setMediaUploading(true);
            const uploadedUrls = [];

            for (const file of files) {
                try {
                    validateFileSize(file);

                    let processedFile;
                    if (file.type.startsWith('image/')) {
                        processedFile = await resizeImage(file);
                    } else if (file.type.startsWith('video/')) {
                        if (file.size > MAX_FILE_SIZE) {
                            throw new Error('La vidéo est trop volumineuse. Veuillez la compresser avant de la télécharger.');
                        }
                        processedFile = file;
                    } else {
                        throw new Error('Format de fichier non supporté');
                    }

                    const uploadResult = await uploadToS3(processedFile, localStorage.getItem('id'));
                    console.log("Upload result:", uploadResult);
                    await API.uploadSeancePhoto(
                        uploadResult,
                        new Date(),
                        "Aide",
                        localStorage.getItem('id')
                    );
                    uploadedUrls.push(uploadResult);
                } catch (error) {
                    console.error('Error processing file:', error);
                    alert(error.message);
                    continue;
                }
            }
            console.log("Uploaded URLs:", uploadedUrls);

            setFeedbackMedia(prev => [...prev, ...uploadedUrls]);
            event.target.value = '';

        } catch (error) {
            console.error("Error uploading media:", error);
            alert("Erreur lors du téléchargement des fichiers");
        } finally {
            setMediaUploading(false);
        }
    };

    const handleDeleteMedia = async (urlToDelete) => {
        await deleteFromS3(urlToDelete);
        setFeedbackMedia(prev => prev.filter(media => media.cloudfrontUrl !== urlToDelete));
    };

    const handleFeedbackTypeChange = (event) => {
        setFeedbackType(event.target.value);
    };

    useEffect(() => {
        // Check if URL has #feedback hash and open feedback section
        if (window.location.hash === '#feedback') {
            setClickSendFeedback(true);
            // Smooth scroll to feedback section after a short delay to allow expansion
            setTimeout(() => {
                document.querySelector('h2[onClick="handleClickSendFeedback"]')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    }, []); // Run once on component mount

    return (
        <div style={{ backgroundColor: COLORS.PAGE_BACKGROUND }}>
            <div className="page-container">
                <NavigBar location="aide" />


                {/* PAGE CONTENT */}
                <div className="content-wrap">
                    <div className="basic-div popInElement" style={{ minHeight: "85vh" }}>
                        <h1 className="large-margin-updown"> Aide </h1>

                        <h2
                            className="large-margin-bottom"
                            onClick={handleClickInstallApp}
                            id="InstallApp">

                            Installer l'application ProgArmor

                            <img className={clickInstallApp ? "expert-toggle rotated" : "expert-toggle not-rotated"}
                                src={require('../../images/icons/icons8-expand-arrow-90.webp')} />
                        </h2>

                        <div className={clickInstallApp ? "extended-huge" : "not-extended"}>
                            <InstallApp />
                        </div>

                        <h2
                            className="large-margin-bottom"
                            onClick={handleClickSendFeedback}
                            style={{ cursor: "pointer" }}>

                            Rapporter un bug / suggérer une amélioration
                            <img className={clickSendFeedback ? "expert-toggle rotated" : "expert-toggle not-rotated"}
                                src={require('../../images/icons/icons8-expand-arrow-90.webp')} />
                        </h2>

                        <div className={clickSendFeedback ? "extended" : "not-extended"}>
                            <div className="basic-div">
                                <select
                                    className="form-control"
                                    value={feedbackType}
                                    onChange={handleFeedbackTypeChange}
                                    style={{ marginBottom: '10px' }}
                                >
                                    <option value="bug">Bug</option>
                                    <option value="amélioration">Amélioration</option>
                                </select>

                                <textarea
                                    className="form-control"
                                    placeholder="Décrivez le bug ou votre suggestion d'amélioration..."
                                    rows="4"
                                    style={{ width: "100%", marginBottom: "10px" }}
                                    value={feedback}
                                    onChange={handleChangeFeedback}
                                />

                                {/* Media upload section */}
                                <div style={{ marginBottom: '20px' }}>
                                    <input
                                        type="file"
                                        id="feedbackMedia"
                                        accept="image/*,video/*"
                                        multiple
                                        onChange={handleMediaUpload}
                                        style={{ display: 'none' }}
                                    />
                                    <div
                                        style={{
                                            border: '2px dashed #ccc',
                                            borderRadius: '8px',
                                            padding: '20px',
                                            cursor: 'pointer',
                                            position: 'relative',
                                            opacity: mediaUploading ? 0.5 : 1,
                                            marginBottom: '10px'
                                        }}
                                        onClick={() => document.getElementById('feedbackMedia').click()}
                                    >
                                        <img
                                            src={require('../../images/icons/camera.webp')}
                                            alt="upload"
                                            style={{ width: '30px', height: '30px', marginBottom: '10px' }}
                                        />
                                        <p style={{ margin: '0' }}>Ajouter des captures d'écran ou vidéos</p>
                                        {mediaUploading && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                width: '30px',
                                                height: '30px',
                                                border: '3px solid #f3f3f3',
                                                borderTop: '3px solid #3498db',
                                                borderRadius: '50%',
                                                animation: 'spin 1s linear infinite',
                                            }} />
                                        )}
                                    </div>

                                    {/* Display uploaded media */}
                                    {feedbackMedia.length > 0 && (
                                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                            {feedbackMedia.map((media, index) => (
                                                <div key={index} style={{ position: 'relative', width: '100px', height: '100px' }}>
                                                    {VIDEO_FORMATS.includes(media.cloudfrontUrl.toLowerCase().split('.').pop()) ? (
                                                        <video
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                            controls
                                                        >
                                                            <source src={media.cloudfrontUrl} type="video/mp4" />
                                                        </video>
                                                    ) : (
                                                        <img
                                                            src={media.cloudfrontUrl}
                                                            alt="feedback"
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        />
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteMedia(media.cloudfrontUrl)}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '5px',
                                                            right: '5px',
                                                            background: 'red',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '50%',
                                                            width: '20px',
                                                            height: '20px',
                                                            cursor: 'pointer',
                                                            padding: '0',
                                                            lineHeight: '1'
                                                        }}
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <button
                                    className="btn btn-dark"
                                    onClick={handleSendFeedback}
                                >
                                    Envoyer
                                </button>
                                <div>
                                    {alert && (
                                        <Alert message={alert.message} type={alert.type} onClose={handleClose} />
                                    )}
                                </div>
                            </div>
                        </div>

                        <h2
                            className="large-margin-bottom"
                            onClick={handleClickBerger}
                            id="Berger">

                            Conversion des tables de Berger (%1RM)
                            <img className={clickBerger ? "expert-toggle rotated" : "expert-toggle not-rotated"}
                                src={require('../../images/icons/icons8-expand-arrow-90.webp')} />
                        </h2>

                        <div className={clickBerger ? "extended" : " not-extended"}>
                            <ConversionBerger />
                        </div>
                    </div>

                </div>



                <AppFooter />
            </div>
        </div>
    )
}

export default Aide;