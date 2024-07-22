import { React, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import NavigBar from "../../components/NavigBar";
import Footer from "../../components/Footer";
import SeanceChoice from "./SeanceChoice";
import SeanceNameChoice from "./SeanceNameChoice";

const Session = () => {
  const [step, setStep] = useState(1);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedName, setSelectedName] = useState('');

  const handleNextSeanceChoice = (session) => {
    setSelectedSession(session);
    setStep(2);
  };

  const handleMoreChoices = () => {
    // Logique pour afficher plus de choix
    alert('Plus de choix à venir...');
  };

  const handleNextNameChoice = (name) => {
    setSelectedName(name);
    // Aller à l'étape suivante ou enregistrer la séance
    alert(`Séance choisie: ${selectedSession.name}, Nom: ${name}`);
  };

  const handleBackToSeanceChoice = () => {
    setStep(1);
  };

  return (
    <div>
      <div className="page-container">
        <NavigBar location="session" />
        <div className="content-wrap">
          {step === 1 && (
            <SeanceChoice onNext={handleNextSeanceChoice} onMoreChoices={handleMoreChoices} />
          )}
          {step === 2 && (
            <SeanceNameChoice onNext={handleNextNameChoice} onBack={handleBackToSeanceChoice} />
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Session;
