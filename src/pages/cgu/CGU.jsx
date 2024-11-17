import React from "react";
import NavigBar from "../../components/NavigBar.jsx";
import HomeHeader from "../../components/HomeHeader.jsx";

function CGU(props) {
    return (
        <div>
            {props.auth ? <NavigBar /> : <HomeHeader />}

            <h1 className="titre-CGU">Conditions Générales d'Utilisation</h1>

            <div className="text-CGU">
                <h2>1. Objet</h2>
                <p>Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de notre plateforme d'enregistrement de séances en ligne, de programmation personnalisée, et d'interactions sociales. En accédant à notre service, vous acceptez sans réserve les présentes CGU.</p>

                <h2>2. Inscription et Compte Utilisateur</h2>
                <ul>
                    <li>Pour accéder à l'ensemble de nos services, vous devez créer un compte en fournissant des informations exactes et complètes.</li>
                    <li>Vous êtes responsable du maintien de la confidentialité de votre identifiant et mot de passe, et de toutes les activités effectuées sous votre compte.</li>
                    <li>Vous vous engagez à ne pas partager votre compte avec des tiers ni à permettre à d'autres d'accéder à la plateforme via vos identifiants.</li>
                    <li>En cas d'accès non autorisé à votre compte, vous devez en informer immédiatement l'équipe d'assistance.</li>
                </ul>

                <h2>3. Utilisation du Service</h2>
                <ul>
                    <li>La plateforme est destinée à un usage personnel. Toute utilisation à des fins commerciales, illégales, ou contraires aux bonnes mœurs est strictement interdite.</li>
                    <li>Il est interdit de télécharger, reproduire, distribuer, modifier ou exploiter de quelque manière que ce soit les contenus disponibles sur la plateforme sans autorisation préalable.</li>
                    <li>Vous vous engagez à ne pas perturber le bon fonctionnement de la plateforme, notamment par l'utilisation de robots, scripts ou toute autre méthode automatisée.</li>
                </ul>

                <h2>4. Contenus et Interactions</h2>
                <ul>
                    <li>Les utilisateurs peuvent partager des contenus (texte, images, vidéos) et interagir entre eux via les fonctionnalités sociales de la plateforme.</li>
                    <li>Vous vous engagez à respecter les règles de conduite, notamment en ne publiant pas de contenus injurieux, diffamatoires, discriminatoires, ou portant atteinte aux droits des tiers.</li>
                    <li>La plateforme se réserve le droit de modérer ou de supprimer tout contenu non conforme aux présentes CGU.</li>
                </ul>

                <h2>5. Séances et Programmes</h2>
                <ul>
                    <li>La plateforme propose des outils pour suivre vos séances, gérer vos programmes d'entraînement, et analyser vos performances.</li>
                    <li>Les programmes peuvent être personnalisés selon vos besoins. Vous êtes responsable des choix effectués et de l'usage de ces informations.</li>
                    <li>La plateforme n'est pas responsable des éventuels dommages résultant d'une mauvaise application des recommandations fournies.</li>
                </ul>

                <h2>6. Responsabilité</h2>
                <ul>
                    <li>Nous faisons de notre mieux pour garantir un accès ininterrompu à notre service, mais des interruptions temporaires peuvent survenir en raison de mises à jour ou de maintenance.</li>
                    <li>La plateforme ne saurait être tenue responsable des pertes de données, des dommages liés à l'utilisation du service ou des interactions entre utilisateurs.</li>
                </ul>

                <h2>7. Données Personnelles</h2>
                <p>Les informations personnelles collectées lors de l'inscription et de l'utilisation de la plateforme sont traitées conformément à notre Politique de Confidentialité.</p>

                <h2>8. Modification des CGU</h2>
                <p>Nous nous réservons le droit de modifier ces CGU à tout moment. Les utilisateurs seront informés des mises à jour, et la poursuite de l'utilisation du service après ces modifications vaudra acceptation des nouvelles conditions.</p>

                <h2>9. Résiliation</h2>
                <p>Vous pouvez résilier votre compte à tout moment via les paramètres de votre profil. La plateforme se réserve le droit de suspendre ou de résilier un compte en cas de violation des présentes CGU.</p>

                <h2>10. Contact</h2>
                <p>Pour toute question ou demande d'assistance, vous pouvez contacter notre support client à l'adresse suivante : amaury.simondet@hotmail.com</p>
            </div>
        </div>
    );
}

export default CGU;
