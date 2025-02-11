import React, { useEffect, useState, useRef } from "react";
import NavigBar from "../../components/NavigBar";
import Footer from "../../components/Footer";
import SeanceChoice from "./SeanceChoice";
import SeanceNameChoice from "./SeanceNameChoice";
import SeanceDateChoice from "./SeanceDateChoice";
import ExerciceTypeChoice from "./ExerciceTypeChoice";
import CategoryTypeChoice from "./CategoryTypeChoice";
import SetsChoice from "./SetsChoice";
import SessionSummary from "./SessionSummary";
import SessionProgressBar from "./SessionProgressBar";
import API from "../../utils/API";
import { setsToSeance, addPrToSets } from "../../utils/sets";
import { Loader } from "../../components/Loader";
import SessionPost from "./SessionPost";
import { COLORS } from "../../utils/constants";
import Alert from "../../components/Alert";
import { useSearchParams } from 'react-router-dom';
import { verifySession } from "../../utils/seance";
import AppFooter from "../../components/AppFooter";

const Session = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedName, setSelectedName] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedExercices, setSelectedExercices] = useState([]);
  const [selectedExercice, setSelectedExercice] = useState({
    exercice: { name: { fr: '' }, _id: '' },
    categories: [],
    sets: []
  });
  const [loading, setLoading] = useState(false);
  const [editingExerciceIndex, setEditingExerciceIndex] = useState(null);
  const myElementRef = useRef(null);
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({ message, type });
  };

  const handleClose = () => {
    setAlert(null);
  };

  const scrollToElement = () => {
    myElementRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    if (!selectedSession || selectedSession.fromUrl) return;

    setLoading(true);
    let sessionId = selectedSession._id;

    const fetchSessionData = async () => {
      try {
        if (selectedSession.value === "last") {
          const response = await API.getLastSeance({ userId: localStorage.getItem("id") });
          sessionId = response.data.lastSeance._id;
        }

        if (selectedSession.value !== 'new') {
          const response = await API.getSeanceSets({ userId: localStorage.getItem("id"), seanceId: sessionId });
          const selectedSessionSets = response.data.sets;
          const seance = await setsToSeance(selectedSessionSets, selectedSession.name, selectedSession.date);
          setSelectedName(selectedSession.name);
          const updatedExercices = await addPrToSets(searchParams.get('id'), seance.exercices, null, null);
          setSelectedExercices(updatedExercices);

          if (selectedSession.value === "params") {
            setSelectedDate(selectedSession.date);
            setStep(7);
          } else {
            setStep(3);
          }
        } else {
          setSelectedName('');
          setSelectedExercices([]);
          setStep(2);
        }
      } catch (error) {
        console.error('Error fetching selected session or sets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();
  }, [selectedSession]);

  const handleNextSeanceChoice = (session) => {
    console.log('session', session);
    setSelectedSession(session);
    setStep(2);
    scrollToElement();
  };

  const handleNextNameChoice = (name) => {
    setSelectedName(name);
    setStep(3);
    scrollToElement();
  };

  const handleNextDateChoice = (date) => {
    setSelectedDate(date);
    if (editingExerciceIndex !== null) {
      setStep(7);
    }
    else {
      setStep(4);
    }
    scrollToElement();
  };

  const handleNextExerciceTypeChoice = (exercice) => {
    setSelectedExercice({
      exercice: exercice,
      categories: [],
      sets: []
    });
    setStep(5);
    scrollToElement();
  };

  const handleNextCategoryTypeChoice = (category) => {
    let newExercice = {
      ...selectedExercice,
      categories: [...selectedExercice.categories, category],
      sets: selectedExercice.sets || []
    };
    setSelectedExercice(newExercice);
    setStep(5); // Loop back to choosing the next category type
    scrollToElement();
  };

  const handleAddSet = (set) => {
    let newExercice = {
      ...selectedExercice,
      categories: selectedExercice.categories || [],
      sets: set
    };
    setSelectedExercice(newExercice);
    setStep(6);
    scrollToElement();
  };

  const handleNextExercice = (sets) => {
    const newExercice = {
      ...selectedExercice,
      categories: selectedExercice.categories || [],
      sets: sets
    };

    // Handle exercise replacement or addition
    const updateExercices = async () => {
      const finalExercices = await addPrToSets(searchParams.get('id'), selectedExercices, newExercice, editingExerciceIndex);
      setSelectedExercices(finalExercices);
    };
    updateExercices();

    // Reset the exercise state
    setSelectedExercice({
      exercice: { name: { fr: '' }, _id: '' },
      categories: [],
      sets: []
    });
    setEditingExerciceIndex(null);
    setStep(4);
    scrollToElement();
  };

  const handleOnDeleteExercice = (index) => {
    const updatedExercices = [...selectedExercices];
    updatedExercices.splice(index, 1);
    setSelectedExercices(updatedExercices);
    setSelectedExercice({
      exercice: { name: { fr: '' }, _id: '' },
      categories: [],
      sets: []
    });
    setEditingExerciceIndex(null);
    setStep(4);
  };

  const handleFinish = () => {
    const alert = verifySession(selectedSession, selectedName, selectedDate, selectedExercices);
    if (alert) {
      showAlert(alert.message, alert.type);
      return;
    }
    setStep(7);
  };

  const handleExerciceClick = (index) => {
    const exercice = selectedExercices[index];
    if (!exercice) {
      setSelectedExercice({
        exercice: { name: { fr: '' }, _id: '' },
        categories: [],
        sets: []
      });
      setEditingExerciceIndex(null);
    }
    else {
      setSelectedExercice({
        exercice: exercice.exercice,
        categories: exercice.categories,
        exerciceType: exercice.exerciceType,
        sets: exercice.sets
      });
      setEditingExerciceIndex(index);
    }
    setStep(6);
    scrollToElement();
  };


  const handleSearchCombination = (combination) => {
    setSelectedExercice({
      exercice: combination.exercice,
      categories: combination.category ? [combination.category] : [],
      sets: []
    });
    setStep(5);
    scrollToElement();
  }

  // Add this useEffect to load state from URL params on initial load
  useEffect(() => {
    const stateFromUrl = searchParams.get('state');

    if (stateFromUrl) {
      try {
        const parsedState = JSON.parse(decodeURIComponent(stateFromUrl));
        if (parsedState.selectedSession) {
          parsedState.selectedSession.fromUrl = true;
        }
        setStep(parsedState.step);
        setSelectedSession(parsedState.selectedSession);
        setSelectedName(parsedState.selectedName);
        setSelectedDate(parsedState.selectedDate);
        setSelectedExercices(parsedState.selectedExercices);
        setSelectedExercice(parsedState.selectedExercice);
        setEditingExerciceIndex(parsedState.editingExerciceIndex);
      } catch (error) {
        console.error('Error parsing state from URL:', error);
      }
    }
  }, []);

  // Add this useEffect to update URL when state changes
  useEffect(() => {
    const state = {
      step,
      selectedSession,
      selectedName,
      selectedDate,
      selectedExercices,
      selectedExercice,
      editingExerciceIndex
    };

    // Preserve existing params while updating state
    const currentParams = Object.fromEntries(searchParams.entries());
    setSearchParams({
      ...currentParams,
      state: encodeURIComponent(JSON.stringify(state))
    });
  }, [step, selectedSession, selectedName, selectedDate, selectedExercices, selectedExercice, editingExerciceIndex]);

  if (loading) {
    return <div className="page-container">
      <NavigBar location="session" />
      <div className="content-wrap">
        <Loader />
      </div>
      <AppFooter />
    </div>
  }

  const handleNewExercice = () => {
    setSelectedExercice({
      exercice: { name: { fr: '' }, _id: '' },
      categories: [],
      sets: []
    });
    setEditingExerciceIndex(null);
    setStep(4);
    scrollToElement();
  }

  const handleGoToCategories = () => {
    setSelectedExercice({
      ...selectedExercice,
      categories: []
    })
    setStep(5);
    scrollToElement();
  }

  const handleDeleteLastCategorie = () => {
    setSelectedExercice({
      ...selectedExercice,
      categories: selectedExercice.categories.slice(0, -1),
      sets: selectedExercice.sets || []
    })
    setStep(5);
    scrollToElement();
  }

  const handleFavorite = (exercice, categories) => {
    setSelectedExercice({
      exercice: exercice,
      categories: categories.map(category => ({ _id: category.category._id, name: category.category.name, type: category.category.type })),
      sets: []
    });
    if (categories.length === 0) {
      setStep(5);
    }
    else {
      setStep(6);
    }
    scrollToElement();
  }

  return (
    <div style={{ backgroundColor: COLORS.PAGE_BACKGROUND }}>
      <div className="page-container">
        <NavigBar location="session" />
        <div className="content-wrap">
          {step != 7 && (<div>
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
              handleExerciceClick={handleExerciceClick}
              onFinish={handleFinish}
              index={editingExerciceIndex}
              handleDateClick={() => { setStep(3); scrollToElement(); }}
              handleNameClick={() => { setStep(2); scrollToElement(); }}
              onNewExercice={handleNewExercice}
              onDragExercices={(reorderedExercices) => setSelectedExercices(reorderedExercices)}
              setEditingExerciceIndex={setEditingExerciceIndex}
            />
          </div>
          )}

          <div ref={myElementRef}></div>
          <div>
            {alert && (
              <Alert message={alert.message} type={alert.type} onClose={handleClose} />
            )}
          </div>

          {step === 1 && (
            <SeanceChoice onNext={handleNextSeanceChoice} />
          )}
          {step === 2 && (
            <SeanceNameChoice onNext={handleNextNameChoice} onBack={() => { setStep(1); scrollToElement() }} />
          )}
          {step === 3 && (
            <SeanceDateChoice onNext={handleNextDateChoice} onBack={() => { setStep(2); scrollToElement() }} />
          )}
          {step === 4 && (
            <ExerciceTypeChoice selectedName={selectedName} onNext={handleNextExerciceTypeChoice} onBack={() => { setStep(3); scrollToElement() }} onSearch={(combination) => handleSearchCombination(combination)} index={editingExerciceIndex} exercice={selectedExercice} onFavorite={handleFavorite} />
          )}
          {step === 5 && (
            <CategoryTypeChoice onNext={handleNextCategoryTypeChoice} onSkip={() => setStep(6)} onBack={() => { setStep(4); scrollToElement() }} index={editingExerciceIndex} exercice={selectedExercice} onDeleteCategories={handleGoToCategories} onDeleteLastCategorie={handleDeleteLastCategorie} />
          )}
          {step === 6 && (
            <SetsChoice
              selectedExercices={selectedExercices}
              onAddSet={handleAddSet}
              onBack={() => { setStep(5); scrollToElement() }}
              onNext={handleNextExercice}
              editingSets={selectedExercice?.sets || (selectedExercices?.[editingExerciceIndex]?.sets || null)}
              index={editingExerciceIndex}
              exercice={selectedExercice}
              onDelete={(index) => handleOnDeleteExercice(index)}
              onGoToCategories={handleGoToCategories}
              onGoToExerciceType={() => { setStep(4); scrollToElement() }}
            />
          )}
          {step === 7 && (
            <SessionPost
              seanceId={searchParams.get('id')}
              onBack={() => { setStep(4); scrollToElement() }}
              selectedName={selectedName}
              selectedDate={selectedDate}
              selectedExercices={selectedExercices}
              selectedExercice={selectedExercice}
              title={selectedSession.postTitle}
              description={selectedSession.description}
              seancePhotos={selectedSession.seancePhotos}
            />
          )}
        </div>
        <AppFooter />
      </div>
    </div>
  );
};

export default Session;
