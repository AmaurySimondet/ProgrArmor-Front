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
import SessionSummary from "./SessionSummary";
import SessionProgressBar from "./SessionProgressBar";

const Session = () => {
  const [step, setStep] = useState(1);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedName, setSelectedName] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [selectedExercise, setSelectedExercise] = useState({
    exercise: '',
    categories: [],
    sets: []
  });
  const [selectedCategoryType, setSelectedCategoryType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSets, setSelectedSets] = useState([]);
  const [editingExerciseIndex, setEditingExerciseIndex] = useState(null);

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
    let newExercise = {
      ...selectedExercise,
      exercise: exercise
    };
    setSelectedExercise(newExercise);
    setStep(6);
  };

  const handleNextCategoryTypeChoice = (categoryType) => {
    setSelectedCategoryType(categoryType);
    setStep(7);
  };

  const handleNextCategoryChoice = (category) => {
    let newExercise = {
      ...selectedExercise,
      categories: [...selectedExercise.categories, category]
    };
    setSelectedExercise(newExercise);
    setStep(6); // Loop back to choosing the next category type
  };

  const handleAddSet = (set) => {
    let newExercise = {
      ...selectedExercise,
      sets: set
    };
    setSelectedExercise(newExercise);
    setStep(8);
  };

  const handleNextExercise = (sets) => {
    const newExercise = {
      ...selectedExercise,
      sets: sets
    };
    if (editingExerciseIndex !== null) {
      const updatedExercises = [...selectedExercises];
      updatedExercises[editingExerciseIndex] = newExercise;
      setSelectedExercises(updatedExercises);
      setEditingExerciseIndex(null);
    } else {
      setSelectedExercises([...selectedExercises, newExercise]);
    }
    setSelectedType('');
    setSelectedExercise({
      exercise: '',
      categories: [],
      sets: []
    });
    setSelectedCategoryType('');
    setSelectedCategory('');
    setSelectedSets([]);
    setStep(4);
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

  const handleExerciseClick = (index) => {
    const exercise = selectedExercises[index];
    setSelectedType("");
    setSelectedExercise({
      exercise: '',
      categories: [],
      sets: []
    });
    setSelectedCategoryType('');
    setSelectedCategory("");
    setSelectedSets([]);
    setEditingExerciseIndex(index);
    setStep(4);
  };

  return (
    <div>
      <div className="page-container">
        <NavigBar location="session" />
        <div className="content-wrap">
          <SessionProgressBar
            selectedName={selectedName}
            selectedDate={selectedDate}
            selectedExercises={selectedExercises}
          />
          <SessionSummary
            selectedName={selectedName}
            selectedDate={selectedDate}
            selectedExercises={selectedExercises}
            selectedExercise={selectedExercise}
            handleExerciseClick={handleExerciseClick}
            onFinish={handleFinish}
          />
          {step === 1 && (
            <SeanceChoice onNext={handleNextSeanceChoice} onMoreChoices={handleMoreChoices} />
          )}
          {step === 2 && (
            <SeanceNameChoice onNext={handleNextNameChoice} onBack={() => setStep(1)} />
          )}
          {step === 3 && (
            <SeanceDateChoice onNext={handleNextDateChoice} onBack={() => setStep(2)} />
          )}
          {step === 4 && (
            <ExerciseTypeChoice onNext={handleNextExerciseTypeChoice} onBack={() => setStep(3)} />
          )}
          {step === 5 && (
            <ExerciseChoice selectedType={selectedType} onNext={handleNextExerciseChoice} onBack={() => setStep(4)} />
          )}
          {step === 6 && (
            <CategoryTypeChoice onNext={handleNextCategoryTypeChoice} onSkip={() => setStep(8)} onBack={() => setStep(5)} />
          )}
          {step === 7 && (
            <CategoryChoice selectedType={selectedCategoryType} onNext={handleNextCategoryChoice} onBack={() => setStep(6)} />
          )}
          {step === 8 && (
            <SetsChoice
              onAddSet={handleAddSet}
              onBack={() => setStep(7)}
              onNext={handleNextExercise}
            />
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Session;
