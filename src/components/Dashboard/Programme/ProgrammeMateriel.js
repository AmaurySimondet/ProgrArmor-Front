import TypeBarres from "./../Categories/TypesBarres";

let ProgrammeMateriel = []


ProgrammeMateriel.push(
    { id: "materiel", className: "select-title", label: 'Categories simplifiées', value: 'title', name: "Materiel" },
    { id: "materiel", label: 'Aucun materiel', value: 'Aucun materiel', name: "Materiel" },
    { id: "materiel", label: 'Haltères / élastiques', value: 'Haltères / élastiques', name: "Materiel" },
    { id: "materiel", label: 'Barre de traction / dips / anneaux, haltères / élastiques', value: 'Barre de traction / dips / anneaux, haltères / élastiques', name: "Materiel" },
    { id: "materiel", label: 'Rack, barre et poids', value: 'Rack, barre et poids', name: "Materiel" },
    { id: "materiel", label: 'Salle de musculation avec machines', value: 'Salle de musculation avec machines', name: "Materiel" },
    { id: "materiel", label: '', value: 'title', name: "Materiel" },
    { id: "materiel", label: '', value: 'title', name: "Materiel" },
    { id: "materiel", label: '', value: 'title', name: "Materiel" },
    { id: "materiel", className: "select-title", label: 'Choix de materiel spécifique', value: 'title', name: "Materiel" },
)

TypeBarres.forEach(obj => {
    if (obj.label !== "/ (défaut)") {
        ProgrammeMateriel.push({ ...obj, name: "Materiel spécifique" });
    }
})

export default ProgrammeMateriel;