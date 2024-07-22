import React, { useState } from "react";
import NavigBar from "../../components/NavigBar";
import Footer from "../../components/Footer";
import SeanceChoice from "./SeanceChoice";
import SeanceNameChoice from "./SeanceNameChoice";
import SeanceDateChoice from "./SeanceDateChoice";
import ExerciseTypeChoice from "./ExerciseTypeChoice";
import ExerciseChoice from "./ExerciseChoice";
import CategoryTypeChoice from "./CategoryTypeChoice";
import CategoryChoice from "./CategoryChoice";
import SetsChoice from "./SetsChoice";

const Session = () => {
  const [step, setStep] = useState(1);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedName, setSelectedName] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [selectedExercise, setSelectedExercise] = useState('');
  const [selectedCategoryType, setSelectedCategoryType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleNextSeanceChoice = (session) => {
    setSelectedSession(session);
    setStep(2);
  };

  const handleMoreChoices = () => {
    alert('Plus de choix à venir...');
  };

  const handleNextNameChoice = (name) => {
    setSelectedName(name);
    setStep(3);
  };

  const handleNextDateChoice = (date) => {
    setSelectedDate(date);
    setStep(4);
  };

  const handleNextExerciseTypeChoice = (type) => {
    setSelectedType(type);
    setStep(5);
  };

  const handleNextExerciseChoice = (exercise) => {
    setSelectedExercise(exercise);
    setStep(6);
  };

  const handleNextCategoryTypeChoice = (categoryType) => {
    setSelectedCategoryType(categoryType);
    setStep(7);
  };

  const handleNextCategoryChoice = (category) => {
    setSelectedCategory(category);
    setSelectedExercises([...selectedExercises, { type: selectedType, exercise: selectedExercise, categoryType: selectedCategoryType, category }]);
    setStep(4); // Loop back to choosing the next exercise type
  };

  const handleSkipCategories = () => {
    setSelectedExercises([...selectedExercises, { type: selectedType, exercise: selectedExercise }]);
    setStep(4); // Loop back to choosing the next exercise type
  };

  const handleBackToSeanceChoice = () => {
    setStep(1);
  };

  const handleBackToNameChoice = () => {
    setStep(2);
  };

  const handleBackToDateChoice = () => {
    setStep(3);
  };

  const handleBackToExerciseTypeChoice = () => {
    setStep(4);
  };

  const handleBackToExerciseChoice = () => {
    setStep(5);
  };

  const handleBackToCategoryTypeChoice = () => {
    setStep(6);
  };

  const handleBackToCategoryChoice = () => {
    setStep(7);
  };

  const handleNextSetChoice = () => {
    setStep(8);
  };

  const handleFinish = () => {
    alert(`Séance terminée: ${JSON.stringify({
      selectedSession,
      selectedName,
      selectedDate,
      selectedExercises
    })}`);
    // Optionally reset or redirect to another page
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
          {step === 3 && (
            <SeanceDateChoice onNext={handleNextDateChoice} onBack={handleBackToNameChoice} />
          )}
          {step === 4 && (
            <ExerciseTypeChoice onNext={handleNextExerciseTypeChoice} onBack={handleBackToDateChoice} />
          )}
          {step === 5 && (
            <ExerciseChoice selectedType={selectedType} onNext={handleNextExerciseChoice} onBack={handleBackToExerciseTypeChoice} />
          )}
          {step === 6 && (
            <CategoryTypeChoice onNext={handleNextCategoryTypeChoice} onSkip={handleSkipCategories} onBack={handleBackToExerciseChoice} />
          )}
          {step === 7 && (
            <CategoryChoice selectedType={selectedCategoryType} onNext={handleNextCategoryChoice} onSkip={handleSkipCategories} onBack={handleBackToCategoryTypeChoice} />
          )}
          {step === 8 && (
            <SetsChoice onBack={handleBackToCategoryChoice} onNext={handleNextSetChoice} onFinish={handleFinish} />
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Session;
