import React from "react";
import SessionPostChild from "../pages/session/SessionPostChild";
import { stringToDate } from "../utils/dates";
import { useWindowDimensions } from "../utils/useEffect";

const backgroundColors = ["#9C005D", "#9C1B00", "#9B0000", "#8B009C", "#9C3600"];

const DisplaySeancesPost = (props) => {
    const { width } = useWindowDimensions();

    return (
        <div className='basic-flex popInElement' style={{ flexDirection: 'column', gap: '40px', alignItems: 'center' }}>
            {props.seances && props.seances.length > 0 ? (
                props.seances.map((seance, index) => (
                    <div className="session-post" style={
                        width < 400 ? { padding: '5px', margin: "20px 0 0 0" } :
                            width < 550 ? { padding: '10px', margin: "20px 10px 0 10px" } :
                                { padding: '20px', margin: "20px 20px 0 20px" }}>
                        <SessionPostChild
                            key={seance._id}
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
                <div>Aucune séances</div>
            )}
        </div>
    )
}

export default DisplaySeancesPost;