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
import { setsToSeance } from "../../utils/sets";
import Loader from "../../components/Loader";

const Session = () => {
  const [step, setStep] = useState(1);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedName, setSelectedName] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedExercices, setSelectedExercices] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [selectedExercice, setSelectedExercice] = useState({
    exercice: { name: { fr: '' }, _id: '' },
    categories: [],
    sets: []
  });
  const [selectedCategoryType, setSelectedCategoryType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSets, setSelectedSets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingExerciceIndex, setEditingExerciceIndex] = useState(null);

  useEffect(() => {
    if (!selectedSession) return;

    setLoading(true);

    if (selectedSession.value !== 'new') {
      // Fetch the selected session from the API
      API.getSeanceSets({ userId: localStorage.getItem("id"), seanceId: selectedSession._id })
        .then(response => {
          const selectedSessionSets = response.data.sets; // Adjust if needed
          setsToSeance(selectedSessionSets, selectedSession.name, selectedSession.date).then(seance => {
            setSelectedName(selectedSession.name);
            setSelectedExercices(seance.exercices);
            setStep(3);
            setLoading(false);
          }
          );
        })
        .catch(error => {
          console.error('Error fetching selected session or sets:', error);
        });
    }
    else {
      setSelectedName('');
      setSelectedExercices([]);
      setStep(2);
      setLoading(false);
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
      exercice: exercice,
      categories: [],
      sets: []
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
      exercice: { name: { fr: '' }, _id: '' },
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
    console.log(`Séance terminée: ${JSON.stringify({
      selectedSession,
      selectedName,
      selectedDate,
      selectedExercices
    })}`);
    // Optionally reset or redirect to another page
  };

  const handleExerciceClick = (index) => {
    const exercice = selectedExercices[index];
    if (!exercice) {
      setSelectedType('');
      setSelectedExercice({
        exercice: { name: { fr: '' }, _id: '' },
        categories: [],
        sets: []
      });
      setSelectedSets([]);
      setEditingExerciceIndex(null);
    }
    else {
      setSelectedType(exercice.exerciceType);
      setSelectedExercice({
        exercice: exercice.exercice,
        categories: exercice.categories,
        sets: exercice.sets
      });
      setSelectedSets(exercice.sets);
      setEditingExerciceIndex(index);
    }
    setSelectedCategoryType('');
    setSelectedCategory('');
    setStep(4); // Set step to exercice choice
  };


  const handleSearchExercice = (exercice) => {
    API.getExerciceType({ id: exercice.type })
      .then((response) => {
        const exerciceTypeName = response.data.exerciceTypeReturned.name.fr;
        setSelectedType(exerciceTypeName);

        const newExercice = {
          ...selectedExercice,
          exercice: exercice
        };
        setSelectedExercice(newExercice);
        setStep(6);
      })
      .catch((error) => {
        console.error('Error during exercise search:', error);
      });
  };

  const handleSearchCategory = (categoryName) => {
    let selectedCategory;  // Declare a variable to hold the category

    API.getCategory({ name: categoryName })
      .then((response) => {
        selectedCategory = response.data.categoryReturned; // Store the category
        return API.getCategorieType({ id: selectedCategory.type }); // Use the stored category
      })
      .then((response) => {
        const categoryType = response.data.categorieTypeReturned;
        setSelectedCategoryType(categoryType);

        const newExercice = {
          ...selectedExercice,
          categories: [...selectedExercice.categories, selectedCategory] // Add the stored category to the categories array
        };
        setSelectedExercice(newExercice);
        setStep(6);
      })
      .catch((error) => {
        console.error('Error during category search:', error);
      });
  }


  useEffect(() => {
    console.log("index", editingExerciceIndex);
  }, [editingExerciceIndex]);

  useEffect(() => {
    console.log("selectedExercices", selectedExercices);
  }, [selectedExercices]);


  if (loading) {
    return <div className="page-container">
      <NavigBar location="session" />
      <div className="content-wrap">
        <Loader />
      </div>
      <Footer />
    </div>
  }

  const handleNewExercice = () => {
    setSelectedType('');
    setSelectedExercice({
      exercice: { name: { fr: '' }, _id: '' },
      categories: [],
      sets: []
    });
    setSelectedCategoryType('');
    setSelectedCategory('');
    setSelectedSets([]);
    setEditingExerciceIndex(null);
    setStep(4);
  }

  const handleGoToCategories = () => {
    setSelectedExercice({
      ...selectedExercice,
      categories: []
    })
    setStep(6);
  }

  const handleFavorite = (exercice, categories) => {
    setSelectedExercice({
      exercice: exercice,
      categories: categories.map(category => ({ _id: category.category._id, name: category.category.name })),
      sets: []
    });
    setStep(8);
  }

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
            handleNameClick={() => setStep(2)}
            onNewExercice={handleNewExercice}
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
            <ExerciceTypeChoice onNext={handleNextExerciceTypeChoice} onBack={() => setStep(3)} onDelete={(index) => handleOnDeleteExercice(index)} onSearch={(exerciceName) => handleSearchExercice(exerciceName)} index={editingExerciceIndex} onGoToSeries={() => setStep(8)} exercice={selectedExercice} onGoToCategories={handleGoToCategories} onFavorite={handleFavorite} />
          )}
          {step === 5 && (
            <ExerciceChoice selectedType={selectedType} onNext={handleNextExerciceChoice} onBack={() => setStep(4)} index={editingExerciceIndex} exercice={selectedExercice} />
          )}
          {step === 6 && (
            <CategoryTypeChoice onNext={handleNextCategoryTypeChoice} onSkip={() => setStep(8)} onBack={() => setStep(5)} index={editingExerciceIndex} onSearch={(categoryName) => handleSearchCategory(categoryName)} exercice={selectedExercice} />
          )}
          {step === 7 && (
            <CategoryChoice selectedType={selectedCategoryType} onNext={handleNextCategoryChoice} onBack={() => setStep(6)} index={editingExerciceIndex} exercice={selectedExercice} />
          )}
          {step === 8 && (
            <SetsChoice
              onAddSet={handleAddSet}
              onBack={() => setStep(7)}
              onNext={handleNextExercice}
              editingSets={selectedExercices ? selectedExercices[editingExerciceIndex] ? selectedExercices[editingExerciceIndex].sets : [] : []}
              exercice={selectedExercice}
            />
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Session;
