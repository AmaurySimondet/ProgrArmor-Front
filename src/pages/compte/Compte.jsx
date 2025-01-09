import { React, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import NavigBar from "../../components/NavigBar.jsx";
import Footer from "../../components/Footer.jsx";
import { COLORS } from "../../utils/constants.js";
import DisplaySeancesPost from "../../components/DisplaySeancesPost.jsx";
import API from "../../utils/API.js";
import { Loader } from "../../components/Loader.jsx";
import CompteStats from "./CompteStats.jsx";
import Stats from "../../components/Stats.jsx";
import apiCalls from "../../utils/apiCalls";
import { useWindowDimensions } from "../../utils/useEffect";
import Followers from "./Followers.jsx";
import { getUserById } from "../../utils/user";
import ModifyProfile from './ModifyProfile.jsx';
import { uploadToS3 } from "../../utils/s3Upload.js";

function Compte() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('activeTab') || 'seances');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [stats, setStats] = useState(null);
  const { width } = useWindowDimensions();
  const [animationClass, setAnimationClass] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [userImages, setUserImages] = useState(null);
  const [showModifyProfile, setShowModifyProfile] = useState(false);

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
        getUserById(searchParams.get('id')).then(setUser);
        getUserById(localStorage.getItem('id')).then(setCurrentUser);

        // Get stats
        const statsRes = await API.getStats(searchParams.get('id'));
        const favoriteExercices = await apiCalls.buildFavoriteExercices(statsRes.data.stats.topExercices);
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

        // Get user images
        const imagesRes = await API.getUserImages(searchParams.get('id'));
        setUserImages(imagesRes.data.images);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
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

  if (loading) {
    return <Loader />
  }

  const UserInfo = () => {
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
            <img
              className="icon-navbar"
              src={user?.profilePic ? user?.profilePic : require('../../images/profilepic.webp')}
              alt='compte'
              style={{
                borderRadius: "50%",
                border: "1px solid white",
                width: "100px",
                height: "100px",
                opacity: imageUploading ? 0.5 : 1,
                cursor: user?._id === localStorage.getItem('id') ? 'pointer' : 'default'
              }}
              onClick={() => {
                if (user?._id === localStorage.getItem('id')) {
                  document.getElementById('imageUpload').click();
                }
              }}
            />
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
              className={`btn ${currentUser.following.includes(searchParams.get('id'))
                ? "btn-white follow-btn following"
                : "btn-black follow-btn not-following"}`}
              style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
              onClick={handleFollowToggle}
            >
              {currentUser.following.includes(searchParams.get('id')) ? 'Ne Plus Suivre' : 'Suivre'}
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
        </ul>
      </div>
    )
  }

  const UserImages = () => {
    if (!userImages) {
      return (
        <div id="header-photos">
          <div style={{
            height: '312px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            Chargement...
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
                {activeTab === 'statistiques' && <Stats stats={stats} userId={searchParams.get('id')} />}
                {activeTab === 'seances' && <DisplaySeancesPost userId={searchParams.get('id')} />}
              </div>
            </div>
          )}
        </div>

        <Footer />
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