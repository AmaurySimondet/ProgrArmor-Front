import { React, useState, useEffect } from 'react';
import ReactCardFlip from 'react-card-flip';
import API from '../../utils/API';
import { Scrollbars } from 'react-custom-scrollbars';
import { writeExercice } from "../../utils/WriteExercice";

function ProgrammeCard(props) {
    const [programme, setProgramme] = useState(props.programme);
    const [dimensions, setDimensions] = useState({
        height: window.innerHeight,
        width: window.innerWidth
    });
    const [isFlipped, setIsFlipped] = useState(false);
    const [liked, setLiked] = useState(false);
    const [commented, setCommented] = useState(false);
    const [likes, setLikes] = useState(0);
    const [flipWhoLiked, setFlipWhoLiked] = useState(false);
    const [whoLikedArray, setWhoLikedArray] = useState([]);
    const [programmeCreator, setProgrammeCreator] = useState({});
    const [mouseEnter, setMouseEnter] = useState(false);
    const [flipComment, setFlipComment] = useState(false);
    const [whoCommentedArray, setWhoCommentedArray] = useState([]);
    const [comment, setComment] = useState('');
    const [flipProgramme, setFlipProgramme] = useState(false);
    const [flipThreeDots, setFlipThreeDots] = useState(false);
    const [dropComment, setDropComment] = useState({});

    function handleFlip() {
        setIsFlipped(!isFlipped);
    }

    function handleFlipProgramme() {
        setIsFlipped(!isFlipped);
        setFlipProgramme(!flipProgramme);
    }

    function handleFlipThreeDots() {
        setIsFlipped(!isFlipped);
        setFlipThreeDots(!flipThreeDots);
    }

    function handleThreeDotsComment(event) {
        if (dropComment[event.target.id]) {
            setDropComment({ [event.target.id]: false });
        }
        else {
            setDropComment({ [event.target.id]: true });
        }
    }

    function handleFlipWhoLiked() {
        setIsFlipped(false);
        setFlipWhoLiked(false)
    }

    function handleMouseEnter() {
        setMouseEnter(true);
    }

    function handleMouseLeave() {
        setMouseEnter(false);
    }

    useEffect(() => {
        function handleResize() {
            setDimensions({
                height: window.innerHeight,
                width: window.innerWidth
            })
        }

        var timeout = false;
        window.addEventListener('resize', function () {
            clearTimeout(timeout);;
            timeout = setTimeout(handleResize, 200);
        });
    });

    async function handleLike() {
        const { data } = await API.likeProgramme({ programmeId: programme._id, userId: localStorage.getItem('id') });
        if (data.success) {
            window.location.reload();
        }
        else {
            alert(data.message);
        }
    }

    async function handleComment() {
        const { data } = await API.CommentProgramme({ programmeId: programme._id, userId: localStorage.getItem('id') });
        if (data.success) {
            window.location.reload();
        }
        else {
            alert(data.message);
        }
    }

    async function handleLiked() {
        const { data } = await API.isProgrammeLiked({ programmeId: programme._id, userId: localStorage.getItem('id') });
        if (data.success) {
            setLiked(data.liked);
        }
        else {
            alert(data.message);
        }
    }

    async function handleCommented() {
        const { data } = await API.isProgrammeCommented({ programmeId: programme._id, userId: localStorage.getItem('id') });
        if (data.success) {
            setCommented(data.commented);
        }
        else {
            alert(data.message);
        }
    }


    async function getLikes() {
        const { data } = await API.getProgrammeLikes({ programmeId: programme._id });
        if (data.success) {
            setLikes(data.likes);
        }
        else {
            alert(data.message);
        }
    }

    async function whoLiked() {
        const { data } = await API.whoLiked({ programmeId: programme._id });
        if (data.success) {
            setWhoLikedArray(data.whoLiked);
            setIsFlipped(true);
            setFlipWhoLiked(true);
        }
        else {
            alert(data.message);
        }
    }

    async function getProgrammeCreator() {
        const { data } = await API.getProgrammeCreator({ programmeId: programme._id });
        if (data.success) {
            setProgrammeCreator(data.creator);
        }
        else {
            alert(data.message);
        }
    }

    async function sendComment() {
        const { data } = await API.sendComment({ programmeId: programme._id, userId: localStorage.getItem('id'), comment: comment });
        if (data.success) {
            window.location.reload();
        }
        else {
            alert(data.message);
        }
    }

    async function getComments() {
        const { data } = await API.getComments({ programmeId: programme._id });
        if (data.success) {
            setWhoCommentedArray(data.comments)
        }
        else {
            alert(data.message);
        }
    }

    async function handleDeleteProgramme() {
        let { data } = await API.deleteProgramme({ programmeId: programme._id, createdBy: localStorage.getItem('id') });

        if (data.success) {
            window.location.reload();
        }
        else {
            alert(data.message);
        }
    }

    function handleEditProgramme(id) {
        window.location.href = `/programmeCreator?programmeId=${id}`;
    }

    function handleSignalerProgramme() {
        return null
    }

    function handleFlipCommentTrue() {
        setIsFlipped(true);
        setFlipComment(true);
    }

    function handleFlipCommentFalse() {
        setIsFlipped(false);
        setFlipComment(false);
    }

    useEffect(() => {
        handleLiked();
        handleCommented();
        getLikes();
        getProgrammeCreator();
        getComments();
        console.log("modeSombre : ", props.modeSombre)
    }, []);

    return (
        <div className="react-card">

            <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
                <div className="YOUR_FRONT_CCOMPONENT" style={props.modeSombre ? null : { color: "white" }}>

                    <div className={props.modeSombre ? "programme-card-dark" : "programme-card"} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        <Scrollbars>
                            <div className="programme-card-header">

                                <div style={dimensions.width > 850 ? { marginBottom: "40px" } : { marginBottom: "10px" }}>
                                    <div style={{ position: "relative" }}>
                                        <h1 onClick={handleFlipProgramme} style={{ marginBottom: "1rem", marginTop: "20px" }}>
                                            {programme.titre ? programme.titre : "Programme sans titre"}
                                        </h1>
                                        <img
                                            className={props.modeSombre ? "small-img questionDark" : "small-img"}
                                            src={require('../../images/icons/three-dots.webp')}
                                            alt='three-dots'
                                            onClick={handleFlipThreeDots}
                                            style={{ position: "absolute", right: "0", top: "0" }} />
                                    </div>

                                    <p onClick={handleFlipProgramme}>{programme.description ? programme.description : "/"} </p>
                                    <p onClick={handleFlipProgramme}> <i>{programme._id}</i> </p>
                                </div>

                                <div onClick={handleFlipProgramme} style={dimensions.width > 850 ? { marginBottom: "40px" } : { marginBottom: "10px" }}>
                                    <p>{programme.type}</p>
                                    <p>{programme.niveau}</p>
                                    <p>{programme.seancesSemaine} s / w</p>
                                    <p>{programme.duree}min max</p>
                                    {programme.materiel.map((materiel, index) => {
                                        if (materiel.value) {
                                            return <p>{materiel.value}</p>
                                        }
                                        else {
                                            if (index <= 3) {
                                                return <p style={{ overflow: "hidden", margin: "0" }}>{materiel.slice(0, 40)}</p>
                                            }
                                            if (index === 4) {
                                                return <p style={{ overflow: "hidden", margin: "0" }}>...</p>
                                            }
                                        }
                                    }
                                    )}
                                </div>

                                <i onClick={handleFlipProgramme} style={{ fontSize: "10px" }}>
                                    Cliquez sur le programme pour en savoir plus
                                </i>

                            </div>

                            <div className={
                                mouseEnter ?
                                    props.modeSombre ?
                                        "programme-card-profile-hover-dark"
                                        :
                                        "programme-card-profile-hover"
                                    :
                                    props.modeSombre ?
                                        "programme-card-profile-dark"
                                        :
                                        "programme-card-profile"
                            }>
                                <table className="basic-table">
                                    <col style={{ width: "35%" }} />
                                    <col style={{ width: "65%" }} />
                                    <tr>
                                        <td>
                                            <img
                                                className="profile-pic"
                                                src={programmeCreator.profilePic}
                                                alt="profile-pic"
                                                onClick={() => window.location.href = "/profil?id=" + programmeCreator._id}
                                            />
                                        </td>
                                        <td>
                                            <p style={{ margin: "auto", display: "inline-block" }}>
                                                <a className="programme-a" href={"/profil?id=" + programmeCreator._id}>{programmeCreator.fName} {programmeCreator.lName}</a>
                                            </p>
                                            <br />
                                            <p style={{ margin: "auto", display: "inline-block" }}>
                                                <a className="programme-a" href={"/profil?id=" + programmeCreator._id}>{programmeCreator._id}</a>
                                            </p>
                                        </td>
                                    </tr>
                                </table>


                                <table className="basic-table">
                                    <tr>
                                        <td>
                                            {liked ?
                                                <img
                                                    className="small-img"
                                                    src={require('../../images/icons/like-red.webp')}
                                                    onClick={handleLike}
                                                    alt='liked' />
                                                :
                                                <img
                                                    className="small-img"
                                                    src={require('../../images/icons/like.webp')}
                                                    onClick={handleLike}
                                                    alt='like' />
                                            }
                                        </td>
                                        <td>
                                            <p style={{ margin: "auto" }} className="hover-text" onClick={whoLiked}> {likes} </p>
                                        </td>
                                        <td>
                                            {commented ?
                                                <img className="small-img" src={require('../../images/icons/comment-red.webp')} onClick={handleFlipCommentTrue} alt='comment' />
                                                :
                                                <img className="small-img" src={require('../../images/icons/comment.webp')} onClick={handleFlipCommentTrue} alt='comment' />
                                            }
                                        </td>
                                        <td>
                                            <p style={{ margin: "auto" }} className="hover-text" onClick={handleFlipCommentTrue}> {whoCommentedArray.length} </p>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </Scrollbars>
                    </div >

                </div>











                <div className="YOUR_BACK_COMPONENT">
                    {flipWhoLiked ?
                        <div className={props.modeSombre ? "programme-card-dark" : "programme-card"} onClick={handleFlipWhoLiked}>
                            {whoLikedArray.length > 0 ?
                                whoLikedArray.map((user, index) => {
                                    return (
                                        <table className="basic-table" style={index === 0 ? { marginTop: "20px" } : null}>
                                            <col style={{ width: "20%" }} />
                                            <col style={{ width: "80%" }} />
                                            <tr>
                                                <td>
                                                    <img
                                                        className="profile-pic"
                                                        src={user.user.profilePic}
                                                        alt="profile-pic"
                                                        onClick={() => window.location.href = "/profil?id=" + user.user._id}
                                                    />
                                                </td>
                                                <td>
                                                    <p style={{ margin: "auto", display: "inline-block" }}>
                                                        <a className="programme-a" href={"/profil?id=" + user.user._id}>{user.user.fName} {user.user.lName}</a>
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>)
                                })
                                :
                                <div style={{ marginTop: "40px" }}>
                                    <p>Personne n'a aimé ce programme...</p>
                                    <p>Alors attention j'ai pas dis qu'il était nul hein juste que personne l'a liké voilà ça arrive</p>
                                    <p>De toute façon je vois pas pourquoi je devrais avoir à me justifier</p>
                                </div>}
                        </div>
                        :
                        null
                    }

                    {flipComment ?
                        <div className={props.modeSombre ? "programme-card-dark" : "programme-card"}>
                            <Scrollbars autoHide>

                                <div style={{ height: "1000px" }}>
                                    {whoCommentedArray.length > 0 ?
                                        whoCommentedArray.map((comment, index) => {
                                            return (
                                                <table className="comment-table" style={index === 0 ? { marginTop: "20px" } : null}>
                                                    <col style={{ width: "20%" }} />
                                                    <col style={{ width: "80%" }} />
                                                    <tr>
                                                        <td>
                                                            <img
                                                                className="profile-pic profile-pic-comment"
                                                                src={comment.user.profilePic}
                                                                alt="profile-pic"
                                                                onClick={() => window.location.href = "/profil?id=" + comment.user._id}
                                                            />
                                                        </td>
                                                        <td>
                                                            <div style={{ padding: "5%" }}>
                                                                <p onClick={handleFlipCommentFalse} style={{ margin: "auto", display: "inline-block", fontSize: "7px" }}>
                                                                    <a className="programme-a" href={"/profil?id=" + comment.user._id}>{comment.user.fName} {comment.user.lName}</a>
                                                                </p>

                                                                <img
                                                                    className={props.modeSombre ? "small-img questionDark" : "small-img"}
                                                                    src={require('../../images/icons/three-dots.webp')}
                                                                    alt='three-dots'
                                                                    id={comment._id}
                                                                    onClick={handleThreeDotsComment}
                                                                    style={{ position: "absolute", right: "0", top: "5px" }} />


                                                                <div className={dropComment[comment._id] ? "dropComment" + " " + "visible" : "dropComment" + " " + "not-visible"}
                                                                    aria-labelledby={comment._id}>
                                                                    <a className="" href="#">Modifier</a>
                                                                    <br />
                                                                    <a className="" href="#">Supprimer</a>
                                                                    <br />
                                                                    <a className="" href="#">Signaler</a>
                                                                    <br />
                                                                    <a className="" href="#">Repondre</a>
                                                                </div>


                                                                <br />
                                                                <p onClick={handleFlipCommentFalse} style={{ margin: "auto", display: "inline-block" }}>{comment.comment}</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </table>)
                                        })
                                        :
                                        <div>
                                            <button onClick={handleFlipCommentFalse} className="btn btn-dark large-margin-updown"
                                                style={props.modeSombre ? null : { borderColor: "#330000" }}>
                                                Retour au programme
                                            </button>
                                            <p> Tu seras le premier à commenter, c'est un privilège </p>
                                        </div>}
                                </div>


                                <div className='from-group row'>
                                    <input type='text' className='form-control col-10 comment'
                                        placeholder="Même ma grand-mère peut le faire"
                                        onChange={e => setComment(e.target.value)}
                                    />
                                    <img
                                        className="small-img col-2"
                                        src={require('../../images/icons/send-comment.webp')}
                                        alt='send'
                                        onClick={sendComment} />
                                </div>

                            </Scrollbars>
                        </div>
                        : null
                    }

                    {flipProgramme ?
                        <div className={props.modeSombre ? "programme-card-dark" : "programme-card"} onClick={handleFlipProgramme}>
                            <Scrollbars>
                                <div>
                                    {programme.programme[0].seances ?
                                        <div>
                                            {programme.programme.map((periodisation, indexPeriodisation) => {
                                                return (
                                                    <div>
                                                        <h1>Periodisation {indexPeriodisation + 1}</h1>
                                                        {periodisation.seances.map((seance, indexSeance) => {
                                                            return (
                                                                <div>
                                                                    <h2>Seance {indexSeance + 1}</h2>
                                                                    <div>
                                                                        {seance.exercices.map((exercice, index) => {
                                                                            return (
                                                                                <div>
                                                                                    <p>
                                                                                        Exercice {index + 1}: {writeExercice(exercice).exercice + ", "}
                                                                                        {writeExercice(exercice).categories[0] ?
                                                                                            writeExercice(exercice).categories
                                                                                            : null}
                                                                                    </p>
                                                                                    <p>
                                                                                        Series: {writeExercice(exercice).series}
                                                                                    </p>
                                                                                    <hr className='hr-serie'></hr>
                                                                                </div>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                    <p>Repos: {seance.jourDeRepos}j</p>
                                                                    {periodisation.seances.length > 1 ?
                                                                        indexSeance != periodisation.seances.length ?
                                                                            <hr className="hr-exercice" />
                                                                            : null
                                                                        : null}
                                                                </div>
                                                            )
                                                        })}
                                                        {periodisation.cycle ?
                                                            <p>Cycle: {periodisation.cycle}</p>
                                                            : null}
                                                        {programme.programme.length > 1 ?
                                                            indexPeriodisation != programme.programme.length ?
                                                                <hr className="hr-detail" />
                                                                : null
                                                            : null}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        : null}
                                </div>
                            </Scrollbars>
                        </div>
                        : null
                    }

                    {
                        flipThreeDots ?
                            <div className={props.modeSombre ? "programme-card-dark" : "programme-card"}>
                                <Scrollbars autoHide>
                                    <button className='btn btn-black large-margin-top mini-margin-bottom' onClick={handleFlipThreeDots}>
                                        Revenir au programme
                                    </button>

                                    <button className='btn btn-dark basic-margin-updown'
                                        style={props.modeSombre ? null : { borderColor: "#330000" }}
                                        onClick={() => handleEditProgramme(programme._id)}>
                                        Modifier le programme
                                    </button>

                                    <button className='btn btn-dark basic-margin-updown' onClick={handleDeleteProgramme}
                                        style={props.modeSombre ? null : { borderColor: "#330000" }}>
                                        Supprimer le programme
                                    </button>

                                    <button className='btn btn-dark basic-margin-updown' onClick={handleSignalerProgramme}
                                        style={props.modeSombre ? null : { borderColor: "#330000" }}>
                                        Signaler le programme
                                    </button>
                                </Scrollbars>
                            </div>
                            : null
                    }

                </div >
            </ReactCardFlip >

        </div >
    )
};

export default ProgrammeCard;