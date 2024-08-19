import React, { useEffect, useState } from "react";
import NavigBar from "../../components/NavigBar";
import Footer from "../../components/Footer";
import SeanceChoice from "./SeanceChoice";
import SeanceNameChoice from "./SeanceNameChoice";
import SeanceDateChoice from "./SeanceDateChoice";
import ExerciceTypeChoice from "./ExerciceTypeChoice";
import ExerciceChoice from "./ExerciceChoice";
import CategoryTypeChoice from "./CategoryTypeChoice";
import CategoryChoice from "./CategoryChoice";
import SetsChoice from "./SetsChoice";
import SessionSummary from "./SessionSummary";
import SessionProgressBar from "./SessionProgressBar";
import API from "../../utils/API";

const Session = () => {
  const [step, setStep] = useState(1);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedName, setSelectedName] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedExercices, setSelectedExercices] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [selectedExercice, setSelectedExercice] = useState({
    exercice: '',
    categories: [],
    sets: []
  });
  const [selectedCategoryType, setSelectedCategoryType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSets, setSelectedSets] = useState([]);
  const [editingExerciceIndex, setEditingExerciceIndex] = useState(null);

  useEffect(() => {
    if (!selectedSession) return;

    if (selectedSession.value === 'last') {
      // Fetch the last session from the API
      API.getLastSeance({ userId: localStorage.getItem("id") })
        .then(response => {
          const lastSession = response.data.lastSeance; // Adjust if needed based on the API response structure
          setSelectedName(lastSession.name);

          // Fetch sets from the last session
          API.getSeanceSets({ userId: localStorage.getItem("id"), seanceId: lastSession._id })
            .then(response => {
              const lastSessionSets = response.data.sets; // Adjust if needed
            })
            .catch(error => {
              console.error('Error fetching last session or sets:', error);
            });
        })
      setStep(3);
    } else if (selectedSession.value !== 'new') {
      // Fetch the selected session from the API
      API.getSession({ userId: localStorage.getItem("id"), seanceName: selectedSession.value })
        .then(response => {
          const session = response.data; // Adjust if needed based on the API response structure
          setSelectedName(session.name);
          setSelectedDate(session.date);
          setSelectedExercices(session.exercices);
        })
        .catch(error => {
          console.error('Error fetching session:', error);
        });
    }
  }, [selectedSession]);


  useEffect(() => {
    console.log('selectedExercices', selectedExercices);
  }, [selectedExercices]);

  const handleNextSeanceChoice = (session) => {
    setSelectedSession(session);
    setStep(2);
  };

  const handleNextNameChoice = (name) => {
    setSelectedName(name);
    setStep(3);
  };

  const handleNextDateChoice = (date) => {
    setSelectedDate(date);
    setStep(4);
  };

  const handleNextExerciceTypeChoice = (type) => {
    setSelectedType(type);
    setStep(5);
  };

  const handleNextExerciceChoice = (exercice) => {
    let newExercice = {
      ...selectedExercice,
      exercice: exercice
    };
    setSelectedExercice(newExercice);
    setStep(6);
  };

  const handleNextCategoryTypeChoice = (categoryType) => {
    setSelectedCategoryType(categoryType);
    setStep(7);
  };

  const handleNextCategoryChoice = (category) => {
    let newExercice = {
      ...selectedExercice,
      categories: [...selectedExercice.categories, category]
    };
    setSelectedExercice(newExercice);
    setStep(6); // Loop back to choosing the next category type
  };

  const handleAddSet = (set) => {
    let newExercice = {
      ...selectedExercice,
      sets: set
    };
    setSelectedExercice(newExercice);
    setStep(8);
  };

  const handleNextExercice = (sets) => {
    const newExercice = {
      ...selectedExercice,
      sets: sets
    };
    if (editingExerciceIndex !== null) {
      const updatedExercices = [...selectedExercices];
      updatedExercices[editingExerciceIndex] = newExercice;
      setSelectedExercices(updatedExercices);
      setEditingExerciceIndex(null);
    } else {
      setSelectedExercices([...selectedExercices, newExercice]);
    }
    setSelectedType('');
    setSelectedExercice({
      exercice: '',
      categories: [],
      sets: []
    });
    setSelectedCategoryType('');
    setSelectedCategory('');
    setSelectedSets([]);
    setStep(4);
  };

  const handleOnDeleteExercice = (index) => {
    const updatedExercices = [...selectedExercices];
    updatedExercices.splice(index, 1);
    setSelectedExercices(updatedExercices);
    setEditingExerciceIndex(null);
  };

  const handleFinish = () => {
    alert(`Séance terminée: ${JSON.stringify({
      selectedSession,
      selectedName,
      selectedDate,
      selectedExercices
    })}`);
    // Optionally reset or redirect to another page
  };

  const handleExerciceClick = (index) => {
    const exercice = selectedExercices[index];
    setSelectedType("");
    setSelectedExercice({
      exercice: '',
      categories: [],
      sets: []
    });
    setSelectedCategoryType('');
    setSelectedCategory('');
    setSelectedSets([]);
    setEditingExerciceIndex(index);
    setStep(4); // Set step to exercice choice
  };


  const handleSearch = (exerciceName) => {
    API.getExercice({ name: exerciceName })
      .then((response) => {
        const exerciceTypeId = response.data.exerciceReturned.type;
        return API.getExerciceType({ id: exerciceTypeId });
      })
      .then((response) => {
        const exerciceTypeName = response.data.exerciceTypeReturned.name.fr;
        setSelectedType(exerciceTypeName);

        const newExercice = {
          ...selectedExercice,
          exercice: exerciceName
        };
        setSelectedExercice(newExercice);
        setStep(6);
      })
      .catch((error) => {
        console.error('Error during exercise search:', error);
      });
  };


  return (
    <div>
      <div className="page-container">
        <NavigBar location="session" />
        <div className="content-wrap">
          <SessionProgressBar
            selectedName={selectedName}
            selectedDate={selectedDate}
            selectedExercices={selectedExercices}
            selectedExercice={selectedExercice}
          />
          <SessionSummary
            selectedName={selectedName}
            selectedDate={selectedDate}
            selectedExercices={selectedExercices}
            selectedExercice={selectedExercice}
            handleExerciceClick={handleExerciceClick}
            onFinish={handleFinish}
            index={editingExerciceIndex}
            handleDateClick={() => setStep(3)}
          />
          {step === 1 && (
            <SeanceChoice onNext={handleNextSeanceChoice} />
          )}
          {step === 2 && (
            <SeanceNameChoice onNext={handleNextNameChoice} onBack={() => setStep(1)} />
          )}
          {step === 3 && (
            <SeanceDateChoice onNext={handleNextDateChoice} onBack={() => setStep(2)} />
          )}
          {step === 4 && (
            <ExerciceTypeChoice onNext={handleNextExerciceTypeChoice} onBack={() => setStep(3)} onDelete={(index) => handleOnDeleteExercice(index)} onSearch={(exerciceName) => handleSearch(exerciceName)} />
          )}
          {step === 5 && (
            <ExerciceChoice selectedType={selectedType} onNext={handleNextExerciceChoice} onBack={() => setStep(4)} />
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
              onNext={handleNextExercice}
            />
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Session;
