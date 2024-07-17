import API from "./API";
import { writeCategories, includesExercice } from "./WriteExercice";

async function getReguScore(id) {
    const { data } = await API.reguScore({ id: id });
    if (data.success === false) {
        console.log(data.message);
        return null;
    } else {
        console.log(data);
        return data;
    }
}

async function getPR(id) {
    const { data } = await API.workouts({ id: id, date: "", reforme: "true", nom: "", periode: "max", tri: "PDC (ordre décroissant)", repsFrom: "", repsTo: "", exerciceName: "title", exerciceMuscle: "title", exerciceOwnExercice: "" });
    if (data.success === false) {
        console.log("getPR", data.message);
        return null;
    } else {
        // console.log("getPR", data.seances);
        return (arrangePR(data.seances));
    };
}

function arrangePR(seances) {
    let PR = [];
    let PR13 = [];
    let PR36 = [];
    let PR612 = [];
    let PR12 = [];

    seances.forEach(seance => {
        let exercice = seance.exercices[0].exercice.name;
        if (seance.exercices[0].exercice.muscle) {
            exercice += " - " + seance.exercices[0].exercice.muscle;
        }
        if (seance.exercices[0].Categories && Object.values(seance.exercices[0].Categories).length > 0) {
            PR.push({
                exercice: exercice,
                categories: writeCategories(Object.values(seance.exercices[0].Categories)),
                reps: parseFloat(seance.exercices[0].Series[0].repsTime),
                charge: parseFloat(seance.exercices[0].Series[0].charge),
                percent: seance.exercices[0].Series[0].percent,
            });
        }
        else {
            PR.push({
                exercice: exercice,
                reps: parseFloat(seance.exercices[0].Series[0].repsTime),
                charge: parseFloat(seance.exercices[0].Series[0].charge),
                percent: seance.exercices[0].Series[0].percent,
            });
        }
    });

    // console.log(PR);

    PR.forEach(pr => {
        if (pr.reps <= 3 && pr.reps >= 1 && PR13.includes(pr) === false && includesExercice(PR13, pr.exercice) === false) {
            PR13.push(pr);
        }
        if (pr.reps >= 3 && pr.reps <= 6 && PR36.includes(pr) === false && includesExercice(PR36, pr.exercice) === false) {
            PR36.push(pr);
        }
        if (pr.reps >= 6 && pr.reps <= 12 && PR612.includes(pr) === false && includesExercice(PR612, pr.exercice) === false) {
            PR612.push(pr);
        }
        if (pr.reps >= 12 && PR12.includes(pr) === false && includesExercice(PR12, pr.exercice) === false) {
            PR12.push(pr);
        }
    });

    if (PR13.length > 2) {
        PR13 = PR13.slice(0, 2)
    }
    if (PR36.length > 2) {
        PR36 = PR36.slice(0, 2)
    }
    if (PR612.length > 2) {
        PR612 = PR612.slice(0, 2)
    }
    if (PR12.length > 2) {
        PR12 = PR12.slice(0, 2)
    }

    PR = { PR13: PR13, PR36: PR36, PR612: PR612, PR12: PR12 };

    return PR;
}

export { getReguScore, getPR, arrangePR };