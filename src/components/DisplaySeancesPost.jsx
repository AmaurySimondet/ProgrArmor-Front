import { React, useState, useEffect, useRef, useCallback } from "react";
import SessionPostChild from "../pages/session/SessionPostChild";
import { stringToDate } from "../utils/dates";
import { useWindowDimensions } from "../utils/useEffect";
import { fetchSeancesData } from "../utils/seance";
import Loader from "./Loader";
import API from "../utils/API";
import { getUserById } from "../utils/user";

const backgroundColors = ["#9C005D", "#9C1B00", "#9B0000", "#8B009C", "#9C3600"];

const DisplaySeancesPost = (props) => {
    const { width } = useWindowDimensions();
    const [loading, setLoading] = useState(true);
    const [seances, setSeances] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const observer = useRef();

    useEffect(() => {
        setLoading(true);
        getUserById(localStorage.getItem('id')).then(setCurrentUser);
    }, []);

    // Last element callback for intersection observer
    const lastSeanceElementRef = useCallback(node => {
        if (loading) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    useEffect(() => {
        const fetchSeances = async () => {
            try {
                const followings = currentUser?.following?.length > 0 ? currentUser?.following?.join(',') + ',' + currentUser?._id : currentUser?._id;
                const response = await fetchSeancesData(props.userId || followings, page);
                setSeances(prev => [...prev, ...(response.seances || [])]);
                setHasMore(response.hasMore);
            } catch (error) {
                console.error('Error fetching seances:', error);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser) {
            if (page === 1) setLoading(true);
            fetchSeances();
        }
    }, [currentUser, page]);

    if (loading && page === 1) return <Loader />;

    return (
        <div className='basic-flex popInElement' style={{ flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
            {currentUser.following.length === 0 && props.dashboard && <h3 style={{ padding: "20px", margin: "0", fontWeight: "normal" }}>Tu ne suis personne pour le moment, donc on t'affiche tes propres séances... Pars stalker des athlètes !</h3>}
            {seances && seances.length > 0 ? (
                seances.map((seance, index) => (
                    <div
                        ref={index === seances.length - 1 ? lastSeanceElementRef : null}
                        className="session-post"
                        style={
                            width < 400 ? { padding: '5px', margin: "20px 0 0 0" } :
                                width < 550 ? { padding: '10px', margin: "20px 10px 0 10px" } :
                                    { padding: '20px', margin: "20px 20px 0 20px" }
                        }
                        key={seance._id}
                    >
                        <SessionPostChild
                            id={seance._id}
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
                            seancePhotos={seance.seancePhotos ? seance.seancePhotos : []}
                        />
                    </div>
                ))
            ) : (
                <div>Aucune séances</div>
            )}
            {loading && page > 1 && <Loader />}
        </div>
    )
}

export default DisplaySeancesPost;