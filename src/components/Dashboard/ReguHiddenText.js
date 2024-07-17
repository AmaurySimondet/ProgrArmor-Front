import React from "react";

function CategorieHiddenText() {
    return (
        <div className="hidden-text">
            <strong> Comment comprendre mon score de régularité ? </strong> <br />
            <br />
            La régularité est l'un des facteurs les plus importants pour ta progression. On pourrait même dire le plus important si la surcharge progressive n'existait pas <br />
            Ce score t'aideras à mieux percevoir ta régularité et ainsi, je l'espère, à t'améliorer. Tu pourras aussi comparer ce score avec celui de tes amis <br />
            <br />
            <strong> Mais c'est calculé comment ? </strong> <br />
            <br />
            Le score est obtenu en comparant le nombre de séances et le nombres de semaines sur la période ainsi qu'en analysant le nombre de semaines avec séance et  <br />
            les séries de séances consécutives <br />
            <br />
            <i> {"Cliques à nouveau sur l'icône"} <img className="myDIV" src={require('../../images/icons/icons8-question-mark-96.webp')} alt="?" /> {"pour faire disparaître ce bandeau d'information"} </i>
        </div>
    )
}

export default CategorieHiddenText;