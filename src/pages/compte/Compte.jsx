import { React, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import NavigBar from "../../components/NavigBar.jsx";
import { COLORS } from "../../utils/constants.js";
import DisplaySeancesPost from "../../components/DisplaySeancesPost.jsx";
import API from "../../utils/API.js";
import { MiniLoader } from "../../components/Loader.jsx";
import CompteStats from "./CompteStats.jsx";
import Stats from "../../components/Stats.jsx";
import apiCalls from "../../utils/apiCalls";
import { useWindowDimensions } from "../../utils/useEffect";
import Followers from "./Followers.jsx";
import { getUserById } from "../../utils/user";
import ModifyProfile from './ModifyProfile.jsx';
import { uploadToS3 } from "../../utils/s3Upload.js";
import ProfilePic from "../../components/profilePic.jsx";
import AppFooter from "../../components/AppFooter.jsx";

function Compte() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('activeTab') || 'seances');
  const [loadingUser, setLoadingUser] = useState(true);
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [stats, setStats] = useState(null);
  const { width } = useWindowDimensions();
  const [animationClass, setAnimationClass] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [userImages, setUserImages] = useState(null);
  const [showModifyProfile, setShowModifyProfile] = useState(false);
  const [seanceNames, setSeanceNames] = useState([]);
  const [selectedSeanceName, setSelectedSeanceName] = useState(null);
  const [coach, setCoach] = useState(false);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingSeanceNames, setLoadingSeanceNames] = useState(true);
  const [loadingImages, setLoadingImages] = useState(true);

  useEffect(() => {
    // Trigger animation when the value changes
    setAnimationClass("popInElement");

    // Remove the class after the animation is complete
    const timeout = setTimeout(() => setAnimationClass(""), 300); // Match the animation duration
    return () => clearTimeout(timeout);
  }, [user?.followers?.length]); // Run the effect whenever the value changes

  // Modified tab change handler
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams(params => {
      params.set('activeTab', tab);
      return params;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user data
        setLoadingUser(true);
        getUserById(searchParams.get('id')).then(userData => {
          setUser(userData);
          setLoadingUser(false);
        });
        getUserById(localStorage.getItem('id')).then(setCurrentUser);

        // Get seance names
        setLoadingSeanceNames(true);
        API.getSeanceNames({ userId: searchParams.get('id') }).then(response => {
          const uniqueNames = new Set(response.data.seanceNames.map(seance => seance.name));
          setSeanceNames(Array.from(uniqueNames));
          setLoadingSeanceNames(false);
        });

        // Get stats
        setLoadingStats(true);
        const statsRes = await API.getStats(searchParams.get('id'));
        const favoriteExercices = await apiCalls.buildFavoriteExercices(statsRes.data.stats.topExercices.topExercices);
        const formattedStats = {
          seances: statsRes.data.stats.seances || 0,
          topExercices: favoriteExercices ? favoriteExercices.map(ex => ({
            ...ex,
            fullName: ex.categories.length > 0 ?
              `${ex.exercice.name.fr} - ${ex.categories.map(cat => cat.category.name.fr).join(', ')}` :
              `${ex.exercice.name.fr}`
          })) : [],
          prs: statsRes.data.stats.prs || 0,
          favoriteDay: statsRes.data.stats.favoriteDay || 'N/A'
        };
        setStats(formattedStats);
        setLoadingStats(false);

        // Get user images
        const imagesRes = await API.getUserImages(searchParams.get('id')).then(response => {
          setUserImages(response.data.images);
          setLoadingImages(false);
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        // Reset loading states on error
        setLoadingUser(false);
        setLoadingStats(false);
        setLoadingSeanceNames(false);
      }
    };

    fetchData();
  }, []);

  // Add useEffect to handle initial scroll
  useEffect(() => {
    if (searchParams.get('activeTab')) {
      // Small delay to ensure content is rendered
      setTimeout(() => {
        document.querySelector('.tab-container')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  }, []); // Run only on initial mount

  const handleFollowToggle = async () => {
    const isCurrentlyFollowing = currentUser.following.includes(searchParams.get('id'));

    if (isCurrentlyFollowing) {
      const confirmUnfollow = window.confirm("Etes vous sur de vouloir ne plus suivre ?");
      if (!confirmUnfollow) return;
    }

    try {
      if (isCurrentlyFollowing) {
        // Unfollow logic
        await API.unfollowUser({
          userId: localStorage.getItem('id'),
          unfollowingId: searchParams.get('id')
        });
        setCurrentUser(prevUser => ({
          ...prevUser,
          following: prevUser.following.filter(id => id !== searchParams.get('id'))
        }));
        setUser(prevUser => ({
          ...prevUser,
          followers: prevUser.followers.filter(id => id !== searchParams.get('id'))
        }));
      } else {
        // Follow logic
        await API.followUser({
          userId: localStorage.getItem('id'),
          followingId: searchParams.get('id')
        });
        setCurrentUser(prevUser => ({
          ...prevUser,
          following: [...(prevUser.following || []), searchParams.get('id')]
        }));
        setUser(prevUser => ({
          ...prevUser,
          followers: [...(prevUser.followers || []), searchParams.get('id')]
        }));
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  const handleShare = async () => {
    try {
      const baseText = `Découvrez le profil de ${user?.fName} ${user?.lName} sur ProgArmor ! 💪\n`
      if (window.navigator.share) {
        // Use native share on mobile devices that support it (including iOS)
        await window.navigator.share({
          title: `${baseText}`,
          url: window.location.href
        });
      } else {
        // Fallback for desktop or devices without share API
        const textArea = document.createElement('textarea');
        textArea.value = `${baseText}\n${window.location.href}`;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);

        const button = document.querySelector('.share-btn');
        const currentButton = button.cloneNode(true);
        button.style.backgroundColor = '#4CAF50';  // Green color
        button.innerHTML = width > 700 ? 'Copié !' : '✓';

        // Reset button after 2 seconds
        setTimeout(() => {
          button.style.backgroundColor = '';
          button.innerHTML = currentButton.innerHTML;
        }, 2000);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setImageUploading(true);

      // First upload to S3 directly
      const uploadResult = await uploadToS3(file, localStorage.getItem('id'));

      // Then record in MongoDB
      await API.uploadPP(uploadResult, localStorage.getItem('id'));

      await getUserById(localStorage.getItem('id')).then(setUser); // Refresh user data to show new image
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Erreur lors du téléchargement de l'image");
    } finally {
      setImageUploading(false);
    }
  };

  const UserInfo = () => {
    if (loadingUser) {
      return <MiniLoader />;
    }
    return (
      <div style={{ display: 'flex', alignItems: 'center', margin: '20px', gap: '20px' }}>
        <div style={{ position: 'relative' }}>
          {user?._id === localStorage.getItem('id') && (
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          )}
          <div style={{ position: 'relative' }}>
            <ProfilePic user={user} imageUploading={imageUploading} onClick={() => {
              if (user?._id === localStorage.getItem('id')) {
                document.getElementById('imageUpload').click();
                return;
              }
              window.location.href = `/compte?id=${user._id}`;
            }} />
            {imageUploading && user?._id === localStorage.getItem('id') && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '30px',
                height: '30px',
                border: '3px solid #f3f3f3',
                borderTop: '3px solid #3498db',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }} />
            )}
          </div>
          {user?._id === localStorage.getItem('id') && !imageUploading && (
            <div style={{
              position: 'absolute',
              bottom: '5px',
              right: '5px',
              backgroundColor: 'white',
              borderRadius: '50%',
              padding: '5px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              cursor: 'pointer'
            }}
              onClick={() => document.getElementById('imageUpload').click()}
            >
              <img
                src={require('../../images/icons/camera.webp')}
                alt="upload"
                style={{ width: '20px', height: '20px' }}
              />
            </div>
          )}
        </div>
        <h2>{user?.fName} {user?.lName}</h2>
      </div>
    )
  }


  const UserActions = () => {
    if (loadingUser) {
      return <MiniLoader />;
    }
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 20px' }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div>
            Abonnés<br />
            <a href={`/compte?id=${user._id}&tab=followers`} className={animationClass} style={{ fontWeight: 'bold' }}>
              {user?.followers?.length}
            </a>
          </div>
          <div>
            Abonnements<br />
            <a href={`/compte?id=${user._id}&tab=followings`} style={{ fontWeight: 'bold' }}>{user?.following?.length}</a>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn btn-white share-btn"
            onClick={handleShare}
            style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <>
              <img
                src={require('../../images/icons/share.webp')}
                alt="share"
                style={{
                  width: '20px',
                  height: '20px',
                  transition: 'filter 0.2s',
                  ':hover': {
                    filter: 'invert(1)'
                  }
                }}
              />
              {width > 700 ? 'Partager' : null}
            </>
          </button>
          {searchParams.get('id') !== localStorage.getItem('id') &&
            <button
              className={`btn ${currentUser?.following?.includes(searchParams.get('id'))
                ? "btn-white follow-btn following"
                : "btn-black follow-btn not-following"}`}
              style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
              onClick={handleFollowToggle}
            >
              {currentUser?.following?.includes(searchParams.get('id')) ? 'Ne Plus Suivre' : 'Suivre'}
            </button>
          }
          {searchParams.get('id') === localStorage.getItem('id') &&
            <button
              className="btn btn-black"
              style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
              onClick={() => setShowModifyProfile(true)}
            >
              <>
                <img
                  src={require('../../images/icons/write.webp')}
                  alt="edit"
                  style={{
                    width: '20px',
                    height: '20px',
                    transition: 'filter 0.2s',
                    ':hover': {
                      filter: 'invert(1)'
                    }
                  }}
                />
                {width > 700 ? 'Modifier' : null}
              </>
            </button>}
          {searchParams.get('id') === localStorage.getItem('id') && (
            <button
              className="btn btn-danger"
              style={{ backgroundColor: '#DF4F5F' }}
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('id');
                window.location.href = '/';
              }}
            >
              <>
                <img
                  src={require('../../images/icons/se-deconnecter.webp')}
                  alt="edit"
                  style={{
                    width: '20px',
                    height: '20px',
                    transition: 'filter 0.2s',
                    ':hover': {
                      filter: 'invert(1)'
                    }
                  }}
                />
                {width > 700 ? 'Déconnexion' : null}
              </>
            </button>
          )}
        </div>
      </div>
    )
  }


  const Tabs = () => {
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }} className="tab-container" >
        <ul className="tabs" role="navigation" style={{ listStyle: 'none', padding: 0, display: 'flex', justifyContent: 'center' }}>
          <li className={activeTab === 'seances' ? 'selected' : ''}>
            <a className="tab" onClick={() => handleTabChange('seances')}>
              <img src={require('../../images/icons/write.webp')} alt="seances" style={{ width: '20px', height: '20px', filter: 'invert(1)' }} />
              {width > 700 ? ' Séances' : null}
            </a>
          </li>
          <li className={activeTab === 'statistiques' ? 'selected' : ''}>
            <a className="tab" onClick={() => handleTabChange('statistiques')}>
              <img src={require('../../images/icons/chart.webp')} alt="statistiques" style={{ width: '20px', height: '20px', filter: 'invert(1)' }} />
              {width > 700 ? ' Statistiques' : null}
            </a>
          </li>
          {localStorage.getItem('id') === searchParams.get('id') || coach ? (
            <li className={activeTab === 'coaching' ? 'selected' : ''}>
              <a className="tab" onClick={() => handleTabChange('coaching')}>
                <img src={require('../../images/icons/coach.webp')} alt="coach" style={{ width: '20px', height: '20px', filter: 'invert(1)' }} />
                {width > 700 ? ' Coaching' : null}
              </a>
            </li>
          ) : null}
        </ul>
      </div>
    )
  }

  const UserImages = () => {
    if (loadingImages) {
      return (
        <div id="header-photos">
          <div style={{
            height: '312px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MiniLoader />
          </div>
        </div>
      );
    }

    const handleImageClick = (imageUrl) => {
      window.open(imageUrl, '_blank');
    };

    return (
      <div id="header-photos">
        <ul className="profile-image-grid" style={{
          gridTemplateColumns: userImages.length < 4 ? `repeat(${userImages.length}, 1fr)` : 'repeat(4, 1fr)',
          height: width > 700 ? '250px' : '150px'
        }}>
          {userImages?.slice(0, 4).map((image, index) => (
            <li key={image._id} style={{
              height: '100%',
              position: 'relative'
            }}>
              <div
                role="button"
                onClick={() => handleImageClick(image.cloudfrontUrl)}
                tabIndex="0"
                style={{
                  cursor: 'pointer',
                  position: 'relative',
                  height: '100%',
                  width: '100%'
                }}
              >
                <div className="profile-image-container"
                  style={{
                    backgroundImage: `url(${image.cloudfrontUrl})`,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div >
    );
  };

  const SeanceNameSelector = () => {
    if (loadingSeanceNames) {
      return <MiniLoader />;
    }
    return (
      <div style={{ margin: '20px 0', display: 'flex', justifyContent: 'center' }}>
        <select
          value={selectedSeanceName}
          onChange={(e) => setSelectedSeanceName(e.target.value === 'all' ? null : e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            backgroundColor: 'white',
            minWidth: '200px'
          }}
        >
          <option value="all">Toutes les séances</option>
          {seanceNames.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>
    );
  };

  const CoachingSection = () => {
    const programs = [
      {
        title: "Programme Débutant",
        description: "Parfait pour commencer la musculation en toute sécurité",
        duration: "3 mois",
        price: "49€/mois"
      },
      {
        title: "Programme Intermédiaire",
        description: "Pour progresser et atteindre de nouveaux objectifs",
        duration: "4 mois",
        price: "69€/mois"
      },
      {
        title: "Suivi Premium",
        description: "Accompagnement personnalisé et suivi hebdomadaire",
        duration: "6 mois",
        price: "99€/mois"
      }
    ];

    const nutritionalPlans = [
      {
        title: "Plan Nutritionnel Débutant",
        description: "Pour commencer la musculation en toute sécurité",
        duration: "3 mois",
        price: "49€/mois"
      },
      {
        title: "Plan Nutritionnel Intermédiaire",
        description: "Pour progresser et atteindre de nouveaux objectifs",
        duration: "4 mois",
        price: "69€/mois"
      }
    ]


    const testimonials = [
      {
        user: {
          fname: "Thomas",
          lname: "Dewitte",
          profilePic: "https://via.placeholder.com/150"
        },
        text: "Excellent coach, très à l'écoute et professionnel !",
        rating: 5
      },
      {
        user: {
          fname: "Marie",
          lname: "Leroy",
          profilePic: "https://via.placeholder.com/150"
        },
        text: "Grâce à son programme, j'ai atteint mes objectifs en 4 mois.",
        rating: 5
      }
    ];

    const coach = null
    // const coach = {
    //   name: "John Doe",
    //   description: "Coach certifié en musculation et nutrition sportive",
    //   experience: "5 ans de coaching personnalisé",
    //   certifications: ["BPJEPS AGFF mention D", "Certification en nutrition sportive"],
    //   speciality: "Musculation & Remise en forme",
    //   meanRating: 4.5
    // }

    return (
      <div>
        {coach ?
          <div className="popInElement coaching-section" style={{ padding: '20px' }}>
            {/* Présentation */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ borderBottom: '2px solid #000', paddingBottom: '10px' }}>💪 Présentation</h3>
              <div style={{ marginTop: '20px' }}>
                <p><strong>Spécialité:</strong> {coach.speciality}</p>
                <p><strong>Expérience:</strong> {coach.experience}</p>
                <p><strong>Certifications:</strong></p>
                <ul>
                  {coach.certifications.map((certification, index) => (
                    <li key={index}>{certification}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Programmes */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ borderBottom: '2px solid #000', paddingBottom: '10px' }}>🎯 Programmes</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
                {programs.map((program, index) => (
                  <div className="coaching-div" key={index} style={{
                    padding: '20px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    backgroundColor: 'white'
                  }}>
                    <h4>{program.title}</h4>
                    <p>{program.description}</p>
                    <p><strong>Durée:</strong> {program.duration}</p>
                    <p><strong>Tarif:</strong> {program.price}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Plans nutritionnels */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ borderBottom: '2px solid #000', paddingBottom: '10px' }}>🍏 Plans Nutritionnels</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
                {nutritionalPlans.map((plan, index) => (
                  <div className="coaching-div" key={index} style={{
                    padding: '20px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    backgroundColor: 'white'
                  }}>
                    <h4>{plan.title}</h4>
                    <p>{plan.description}</p>
                    <p><strong>Durée:</strong> {plan.duration}</p>
                    <p><strong>Tarif:</strong> {plan.price}</p>
                  </div>
                ))}
              </div>
            </div>


            {/* Témoignages */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ borderBottom: '2px solid #000', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>⭐ Avis</span>
                <span style={{ fontSize: '0.9em' }}>
                  {coach.meanRating ? `${coach.meanRating}/5 ⭐` : ''}
                </span>
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
                {testimonials.map((testimonial, index) => (
                  <div className="coaching-div" key={index} style={{
                    padding: '20px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    backgroundColor: 'white'
                  }}>
                    <p>{"⭐".repeat(testimonial.rating)}</p>
                    <p style={{ fontStyle: 'italic' }}>"{testimonial.text}"</p>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginTop: '15px',
                    }}>
                      <ProfilePic user={testimonial.user} size="32px" onClick={() => window.open(`/compte?id=${testimonial.user._id}`, '_blank')} />
                      <p style={{
                        margin: 0,
                        fontSize: '0.9em',
                        fontWeight: 500,
                        cursor: 'pointer'
                      }} onClick={() => window.open(`/compte?id=${testimonial.user._id}`, '_blank')} className="clickable">
                        {testimonial.user.fname} {testimonial.user.lname}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Boutons d'action */}
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
              <button className="btn btn-black">
                📅 Prendre RDV
              </button>
              <button className="btn btn-white">
                ✉️ Message
              </button>
            </div>
          </div>
          :


          <div style={{ display: 'flex', justifyContent: 'center', margin: "40px", flexDirection: 'column', alignItems: 'center' }} className="popInElement">
            <i style={{ fontStyle: 'italic', fontSize: '0.8em', marginBottom: '20px' }}>Seul vous pouvez voir cette section</i>
            <button className="btn btn-black" disabled>
              <img src={require('../../images/icons/coach.webp')} alt="coach" style={{ width: '20px', height: '20px' }} />
              <span style={{ fontSize: '0.8em' }}>Devenir coach</span>
            </button>
          </div>
        }
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: COLORS.PAGE_BACKGROUND }}>
      <div className="page-container">
        <NavigBar location="session" />

        <div className="content-wrap popInElement">
          {searchParams.get('tab') === 'followers' ? (
            <Followers user={user} title="Abonnés de" dataKey="followers" />
          ) : searchParams.get('tab') === 'followings' ? (
            <Followers user={user} title="Abonnements de" dataKey="following" />
          ) : (
            <div>
              <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ position: 'relative' }}>
                  {userImages?.length > 0 ?
                    <UserImages user={user} />
                    : null
                  }
                  <div style={{ marginTop: userImages?.length > 0 ? '-28px' : '0' }}>
                    <UserInfo user={user} />
                  </div>
                </div>

                <UserActions user={user} />

                <CompteStats stats={stats} />

                <Tabs />

                {/* Render active tab component */}
                {activeTab === 'statistiques' && (
                  loadingStats ? <MiniLoader /> : <Stats stats={stats} userId={searchParams.get('id')} />
                )}
                {activeTab === 'seances' &&
                  <div>
                    <SeanceNameSelector />
                    <DisplaySeancesPost
                      userId={searchParams.get('id')}
                      seanceName={selectedSeanceName}
                    />
                  </div>
                }
                {activeTab === 'coaching' && <CoachingSection />}
              </div>
            </div>
          )}
        </div>

        <AppFooter />
      </div>
      {showModifyProfile && (
        <ModifyProfile
          user={user}
          onClose={() => setShowModifyProfile(false)}
        />
      )}
    </div >
  );
};

export default Compte