function seanceContainErr(seance, programme = false) {
    let returnObj = { err: false, alertMessage: "" }

    if (programme === false) {
        if (!seance.nom.ancienNom || seance.nom.ancienNom === "title") {
            returnObj.err = true;
            returnObj.alertMessage = ("Donne un nom à ta séance pour t'en resservir plus tard !")

        }


        if (seance.date === '') {
            returnObj.err = true;
            returnObj.alertMessage = ("Et c'était quand ça ? tu m'as pas dis la date !")

        }

        if (seance.poids === '') {
            returnObj.err = true;
            returnObj.alertMessage = ("Tu pèses combien ? Pas de tricherie avec moi tu m'as pas donné ton poids !")

        }
    }

    if (seance.exercices.length === 0) {
        returnObj.err = true;
        returnObj.alertMessage = ("Ah bah super ta séance, y a aucun exo !")

    }

    console.log("exercices.length", seance.exercices.length)

    seance.exercices.forEach((exercice, index) => {
        if (Object.keys(exercice.Series).length === 0) {
            returnObj.err = true;
            returnObj.alertMessage = ("Faut avouer qu'un exercice sans série c'est pas commode (exercice " + (index + 1) + " " + exercice.exercice.name + ") !")
        }

        //serie manquant
        Object.values(exercice.Series).forEach(serie => {
            if (programme === false) {
                if (serie.repsTime === '' || serie.charge === '' || !serie.repsTime || !serie.charge && returnObj.err === false) {
                    returnObj.err = true;
                    returnObj.alertMessage = ("Une serie n'est pas remplie (exercice " + (index + 1) + " " + exercice.exercice.name + ") !")
                }
            } else {
                if (serie.repsTime === '' || !serie.repsTime && returnObj.err === false) {
                    returnObj.err = true;
                    returnObj.alertMessage = ("Une serie n'est pas remplie (exercice " + (index + 1) + " " + exercice.exercice.name + ") !")
                }
            }
        })

        //muscle manquant
        if (exercice.exercice.name === "Elevation" || exercice.exercice.name === "Curl" || exercice.exercice.name === "Extension" || exercice.exercice.name === "Abduction" || exercice.exercice.name === "Adduction" || exercice.exercice.name === "Press") {
            if (!exercice.exercice.muscle || exercice.exercice.muscle === "" || exercice.exercice.muscle === "title") {
                returnObj.err = true;
                returnObj.alertMessage = ("Tu ne m'as pas dis quelle muscle pour ton exercice " + (index + 1) + " " + exercice.exercice.name + " !")
            }
        }

        //name exercice titre
        if (exercice.exercice.name === "title") {
            returnObj.err = true;
            returnObj.alertMessage = ("Un titre n'est pas un exercice voyons (exercice " + (index + 1) + " " + exercice.exercice.name + ") !")
        }

        //name exo manquant
        if (!exercice.exercice.name || exercice.exercice.name === "") {
            returnObj.err = true;
            returnObj.alertMessage = ("Tu m'as pas donné le nom de ton exo petit cachottier (exercice " + (index + 1) + " " + exercice.exercice.name + ") !")
        }

        //catégorie manquant
        Object.values(exercice.Categories).forEach(categorie => {
            if (!categorie.name || categorie.name === '' || categorie.input === '' || !categorie.input || categorie.input === "title") {
                returnObj.err = true;
                returnObj.alertMessage = ("Une catégorie n'est pas remplie (exercice " + (index + 1) + " " + exercice.exercice.name + ") !")
            }
            if (categorie.name === 'Elastique') {
                if (categorie.utilisation === '' || !categorie.utilisation || categorie.utilisation === "title") {
                    returnObj.err = true;
                    returnObj.alertMessage = ("Et l'elastique il sert à quoi ? (exercice " + (index + 1) + " " + exercice.exercice.name + ") !")
                }
                if (categorie.estimation === '' || !categorie.estimation || Number.isNaN(parseFloat(categorie.estimation))) {
                    returnObj.err = true;
                    returnObj.alertMessage = ("Erreur de mesure élastique (exercice " + (index + 1) + " " + exercice.exercice.name + ") !")
                }
            }
        })
    });

    if (programme === false) {
        seance.echauffements.forEach((echauffement, index) => {
            if (Object.keys(echauffement.Series).length === 0) {
                returnObj.err = true;
                returnObj.alertMessage = ("Faut avouer qu'un echauffement sans série c'est pas commode (echauffement " + (index + 1) + " " + echauffement.echauffement.name + ") !")
            }

            //serie manquant
            Object.values(echauffement.Series).forEach(serie => {
                if (serie.repsTime === '' || serie.charge === '' || !serie.repsTime || !serie.charge && returnObj.err === false) {
                    returnObj.err = true;
                    returnObj.alertMessage = ("Une serie n'est pas remplie (echauffement " + (index + 1) + " " + echauffement.echauffement.name + ") !")
                }
            })

            //muscle echauffement
            if (echauffement.echauffement.name === "Elevation" || echauffement.echauffement.name === "Curl" || echauffement.echauffement.name === "Extension" || echauffement.echauffement.name === "Abduction" || echauffement.echauffement.name === "Adduction" || echauffement.echauffement.name === "Press") {
                if (!echauffement.echauffement.muscle || echauffement.echauffement.muscle === "" || echauffement.echauffement.muscle === "title") {
                    returnObj.err = true;
                    returnObj.alertMessage = ("Tu ne m'as pas dis quelle muscle pour ton echauffement " + (index + 1) + " " + echauffement.echauffement.name + " !")
                }
            }

            //name echauffement titre
            if (echauffement.echauffement.name === "title") {
                returnObj.err = true;
                returnObj.alertMessage = ("Un titre n'est pas un echauffement voyons (echauffement " + (index + 1) + " " + echauffement.echauffement.name + ") !")
            }

            //name echauffement manquant
            if (!echauffement.echauffement.name || echauffement.echauffement.name === "") {
                returnObj.err = true;
                returnObj.alertMessage = ("Tu t'echauffes en faisant rien ? (echauffement " + (index + 1) + " " + echauffement.echauffement.name + ") !")
            }

            //catégorie manquant
            Object.values(echauffement.Categories).forEach(categorie => {
                if (!categorie.name || categorie.name === '' || categorie.input === '' || !categorie.input || categorie.input === "title") {
                    returnObj.err = true;
                    returnObj.alertMessage = ("Une catégorie n'est pas remplie (echauffement " + (index + 1) + " " + echauffement.echauffement.name + ") !")
                }
                if (categorie.name === 'Elastique') {
                    if (categorie.utilisation === '' || !categorie.utilisation || categorie.utilisation === "title") {
                        returnObj.err = true;
                        returnObj.alertMessage = ("Et l'elastique il sert à quoi ? (echauffement " + (index + 1) + " " + echauffement.echauffement.name + ") !")
                    }
                    if (categorie.estimation === '' || !categorie.estimation || Number.isNaN(parseFloat(categorie.estimation))) {
                        returnObj.err = true;
                        returnObj.alertMessage = ("Erreur de mesure élastique (echauffement " + (index + 1) + " " + echauffement.echauffement.name + ") !")
                    }
                }
            })
        });

        seance.details.forEach((detail, index) => {
            if (!detail.name || detail.name === '' || detail.input === '' || !detail.input || detail.input === "title") {
                returnObj.err = true;
                returnObj.alertMessage = ("Ce n'est peut être qu'un détail, mais il est vide !");
            }
        });
    }

    console.log(returnObj)

    return returnObj;
}

function seancesContainErr(seances, programme = false) {
    let err = false;
    let alertMessage = '';
    seances.forEach(seance => {
        console.log("seanceContainErr", seanceContainErr(seance, programme))
        if (seanceContainErr(seance, programme).err === true) {
            err = true;
            alertMessage = seanceContainErr(seance, programme).alertMessage;
        }
    })
    return { err: err, alertMessage: alertMessage }
}

function programmeContainErr(programme) {
    let err = false;
    let alertMessage = '';

    if (programme.titre === "") {
        err = true;
        alertMessage = ("Veuillez donner un titre à votre programme !");
    } else if (programme.type.value === "" || programme.type.value === "titre") {
        err = true;
        alertMessage = ("Veuillez choisir un type de programme !");
    } else if (programme.niveau.value === "" || programme.niveau.value === "titre") {
        err = true;
        alertMessage = ("Veuillez choisir un niveau pour votre programme !");
    } else if (programme.duree === "0") {
        err = true;
        alertMessage = ("Veuillez choisir une durée max de séance pour votre programme !");
    } else if (programme.programme.length === 0) {
        err = true;
        alertMessage = ("Veuillez ajouter une périodisation à votre programme !");
    } else if (programme.materiel.length === 0) {
        err = true;
        alertMessage = ("Veuillez ajouter du matériel à votre programme !");
    } else {
        programme.programme.forEach(periodisation => {
            console.log("seancesContainErr", seancesContainErr(periodisation.seances, true))
            if (periodisation.seances.length === 0) {
                err = true;
                alertMessage = ("Veuillez ajouter des séances à chaque périodisation !");
                return { err: err, alertMessage: alertMessage };
            }
            if (periodisation.cycle === "") {
                err = true;
                alertMessage = ("Veuillez choisir un cycle pour chaque périodisation !");
                return { err: err, alertMessage: alertMessage };
            }
            if (seancesContainErr(periodisation.seances, true).err === true) {
                err = true;
                alertMessage = (seancesContainErr(periodisation.seances, true).alertMessage);
                return { err: err, alertMessage: alertMessage };
            }
        });
    }

    return { err: err, alertMessage: alertMessage };
}

export { seanceContainErr, seancesContainErr, programmeContainErr }