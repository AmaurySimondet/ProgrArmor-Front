import React, { useMemo } from 'react';
import { COLORS } from '../utils/constants';

const tips = [
    "Pour ajouter un minimum de poids sur vos barres, vous pouvez ajouter des sécurités (en général 200-400g).",
    "Faire des séries lentes peut augmenter la tension musculaire, mais attention à ne pas trop réduire le poids, sinon vous perdez en efficacité.",
    "Les disques olympiques ont souvent un poids légèrement variable (+/- 1-2%), pensez à les vérifier si vous cherchez une précision extrême.",
    "Les bandes élastiques peuvent ajouter de la résistance variable, idéale pour un travail explosif.",
    "Saviez-vous que le leg press sollicite davantage les fessiers si vos pieds sont positionnés en haut de la plateforme ?",
    "Le grip serré lors des tractions sollicite davantage les biceps que le grip large, qui cible plus le dos.",
    "La sueur ne fait pas maigrir, elle sert uniquement à réguler votre température corporelle, donc ne vous fiez pas aux « vêtements de sudation ».",
    "Le trap bar deadlift est souvent plus doux pour le bas du dos qu’un soulevé de terre classique.",
    "Un travail unilatéral (comme le split squat) peut permettre d’améliorer l’équilibre et de corriger des déséquilibres musculaires.",
    "Les poignées d'une machine guidée sont parfois amovibles et réglables, vérifiez-les pour maximiser votre confort et votre mouvement.",
    "Le temps sous tension idéal pour l’hypertrophie est d’environ 30 à 40 secondes par série.",
    "Le développé couché est un exercice qui sollicite beaucoup les pectoraux, mais aussi les triceps et les deltoïdes."
];
const fun = [
    "Le coach m’a dit : 'Aujourd'hui, c’est cardio et jambes.' Mais il a oublié de me dire que c’était aussi l’enfer.",
    "Hier, j’ai fait une pause pendant mon squat… ça fait maintenant 24 heures que je suis bloqué en bas."
]

const specific = [
    "Vous pouvez ajouter autant de détails que vous le souhaitez sur vos exercices, cela vous permettra de mieux différencier vos séances.",
]

const Loader = () => {
    const all = [...tips, ...fun, ...specific];
    const randomFact = useMemo(() => {
        const randomIndex = Math.floor(Math.random() * all.length);
        return all[randomIndex];
    }, []);

    return (
        <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', gap: '2rem', justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.PAGE_BACKGROUND }}>
            <div className="loader" style={{ width: '120px', height: '120px' }}></div>
            <p style={{ color: COLORS.TEXT, textAlign: 'center', maxWidth: '80%', fontStyle: 'italic' }}>
                {randomFact}
            </p>
        </div>
    );
};

const MiniLoader = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60px', width: '100%' }}>
            <div className="loader"></div>
        </div>
    );
};

export { Loader, MiniLoader };