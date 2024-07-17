import { React } from "react";

function PriseDeNoteHiddenText() {

    function copyToClipboard() {
        const text = "Epopée de la force \n" +
            "12/05/1998 \n" +
            "120 \n" +
            "\n" +
            "Echauffements:\n" +
            "Dislocation d'épaule, {resistance; moyen; tension=10} : 3x10x0 \n" +
            "\n" +
            "Exercices:\n" +
            "Squat, pistol, pieds surrelevés, barre olympique : 3x1x20 [4min] \n" +
            "Developpé couché, sur banc, haltères : 1x1x100 [4min], 1x1x105 [3min], 0x1x110 [5min], 1x1x107.5 \n" +
            "Tractions, {assistance; 5; mesure=5} : 3x10x0 \n" +
            "Curl - Biceps, barre EZ, assis: 4x12x40 [1min] \n" +
            "Front Lever, full : 1x20secx0 \n" +
            "\n" +
            "Details:\n" +
            "Manque de sommeil \n" +
            "Trop chaud "

        navigator.clipboard.writeText(text);
    }

    return (
        <div className="hidden-text">
            <strong> C'est quoi la prise de note rapide ? </strong> <br />
            <br />
            On est tous d'accord, écrire une séance en mode normal c'est fastidieux, surtout la toute première fois <br />
            Mais tu sais bien que ProgrArmor est l'outil ultime de tracking, on ne va pas se contenter du mode normal <br />
            En prise de note rapide, tu vas écrire ta séance plus ou moins comme tu le ferais dans tes notes de téléphone <br />
            Sauf qu'ici notre programme va générer tout seul la séance à partir des notes et tu pourras bénéficier de tous les autres avantages du site <br />
            <br />
            <strong> Ok je suis bouillant maintenant alors on fait comment ? </strong> <br />
            <br />
            Je vais te donner le formalisme et ensuite un exemple pour que tu comprennes bien. <br />
            Tes notes doivent être écrites comme suit : <br />
            <br />
            Nom de la séance  <br />
            Date de la séance écrite comme suit : jj/mm/aaaa <br />
            Ton poids en kg (juste le chiffre) <br />
            <br />
            Echauffements: (écrit ceci si tu notes un ou plusieurs échauffements) <br />
            Exercice (- muscle), catégorie (, catégorie ,... ) : nombre de sériesxnombre de répétitions(si c'est un temps noter sec juxtaposé)xcharge en kg [temps de repos entre les séries + min (optionnel)], (répétable à l'infini)<br />
            (tu peux répéter autant de fois que tu veux) <br />
            <br />
            Exercices: (écrit ceci si tu notes un ou plusieurs exercices) <br />
            Exercice (- muscle), catégorie (, catégorie ,... ) : nombre de sériesxnombre de répétitions(si c'est un temps noter sec juxtaposé)xcharge en kg [temps de repos entre les séries + min (optionnel)], (répétable à l'infini)<br />
            (tu peux répéter autant de fois que tu veux) <br />
            <br />
            Details: (écrit ceci si tu notes un ou plusieurs détails) <br />
            Detail <br />
            (tu peux répéter autant de fois que tu veux) <br />
            <br />
            Pour la catégorie elastique c'est plus compliqué, tu dois écrire (à la place de catégorie) : <br />
            {'{resistance ou assistance; "poids" elastique ou épaisseur; mesure=mesure en kg de la tension} (si tu as mesuré)'} <br />
            {'{resistance ou assistance; "poids" elastique ou épaisseur; tension=tension en m estimée} (sinon)'} <br />
            <br />
            <strong> Exemple </strong> <br />
            <br />
            Epopée de la force <br />
            12/05/1998 <br />
            120 <br />
            <br />
            Echauffements: <br />
            {"Dislocation d'épaule, {resistance; moyen; tension=10} : 3x10x0"} <br />
            <br />
            Exercices: <br />
            Squat, pistol, pieds surrelevés, barre olympique : 3x1x20 [4min] <br />
            Developpé couché, sur banc, haltères : 1x1x100 [4min], 1x1x105 [3min], 0x1x110 [5min], 1x1x107.5 <br />
            Tractions, {"{assistance; 5; mesure=5}"} : 3x10x0 <br />
            Curl - Biceps, barre EZ, assis: 4x12x40 [1min] <br />
            Front Lever, full : 1x20secx0 <br />
            <br />
            Details: <br />
            Manque de sommeil <br />
            Trop chaud <br />
            <br />
            <strong className="clickOnMe" onClick={copyToClipboard}> {"---> Cliques sur moi pour copier l'exemple <--"} </strong> <br />
            <br />
            <i> {"Cliques à nouveau sur l'icone"} <img className="myDIV" src={require('../../images/icons/icons8-question-mark-96.webp')} alt="?" /> {"pour faire disparaître ce bandeau d'information"} </i>
        </div>
    )
}

export default PriseDeNoteHiddenText;