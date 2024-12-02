import { React, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import NavigBar from "../../components/NavigBar.jsx";
import Footer from "../../components/Footer.jsx";
import { COLORS } from "../../utils/colors.js";
import DisplaySeancesPost from "../../components/DisplaySeancesPost.jsx";
import PrSearch from "./PrSearch.jsx";
import PrTable from "./PrTable.jsx";
import API from "../../utils/API.js";
import Loader from "../../components/Loader.jsx";
import CompteStats from "./CompteStats.jsx";
import Stats from "../../components/Stats.jsx";
import apiCalls from "../../utils/apiCalls";
import { useWindowDimensions } from "../../utils/useEffect";

function Compte() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('seances');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const { width } = useWindowDimensions();

  // Tab change handler
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  async function getUser() {
    const { data } = await API.getUser({ id: searchParams.get('id') });
    if (data.success === false) {
      alert(data.message);
    } else {
      if (data.profile.modeSombre && data.profile.modeSombre === true) {
        // 👇 add class to body element
        document.body.classList.add('darkMode');
      }
      setUser(data.profile);
    };
  }

  useEffect(() => {
    getUser().then(() => {
      API.getStats(searchParams.get('id')).then(async res => {
        const favoriteExercices = await apiCalls.buildFavoriteExercices(res.data.stats.topExercices);
        const formattedStats = {
          seances: res.data.stats.seances || 0,
          topExercices: favoriteExercices ? favoriteExercices.map(ex => ({
            ...ex,
            fullName: ex.categories.length > 0 ?
              `${ex.exercice.name.fr} - ${ex.categories.map(cat => cat.category.name.fr).join(', ')}` :
              `${ex.exercice.name.fr}`
          })) : [],
          prs: res.data.stats.prs || 0,
          favoriteDay: res.data.stats.favoriteDay || 'N/A'
        };
        setStats(formattedStats);
      }).then(() => {
        setLoading(false);
      });
    });
  }, []);

  if (loading) {
    return <Loader />
  }

  return (
    <div style={{ backgroundColor: COLORS.PAGE_BACKGROUND }}>
      <div className="page-container">
        <NavigBar location="session" />

        <div className="content-wrap">


          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {/* USER INFO */}
            <div style={{ display: 'flex', alignItems: 'center', margin: '20px', gap: '20px' }}>
              <img
                className="icon-navbar"
                src={require('../../images/profilepic.webp')}
                alt='compte'
                style={{
                  borderRadius: "50%",
                  border: "1px solid black",
                  width: "100px",
                  height: "100px"
                }}
              />
              <h2>{user?.fName} {user?.lName}</h2>
            </div>

            {/* USER ACTIONS */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 20px' }}>
              <div style={{ display: 'flex', gap: '20px' }}>
                <div>
                  Abonnés<br />
                  <span style={{ fontWeight: 'bold' }}>0</span>
                </div>
                <div>
                  Abonnements<br />
                  <span style={{ fontWeight: 'bold' }}>0</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn btn-white" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  {searchParams.get('id') === localStorage.getItem('id') ? (
                    <>
                      <img src={require('../../images/icons/share.webp')} alt="share" style={{ width: '20px', height: '20px' }} />
                      {width > 700 ? 'Partager' : null}
                    </>
                  ) : 'Suivre'}
                </button>
                <button className="btn btn-black" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  {searchParams.get('id') === localStorage.getItem('id') ? (
                    <>
                      <img src={require('../../images/icons/write.webp')} alt="edit" style={{ width: '20px', height: '20px' }} />
                      {width > 700 ? 'Modifier' : null}
                    </>
                  ) : 'Message'}
                </button>
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
                      <img src={require('../../images/icons/se-deconnecter.webp')} alt="edit" style={{ width: '20px', height: '20px' }} />
                      {width > 700 ? 'Déconnexion' : null}
                    </>
                  </button>
                )}
              </div>
            </div>

            <CompteStats stats={stats} />
          </div>


          {/* Tabs navigation */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
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
              <li className={activeTab === 'other' ? 'selected' : ''}>
                <a className="tab" onClick={() => handleTabChange('other')}>
                  <img src={require('../../images/icons/three-dots.webp')} alt="other" style={{ width: '20px', height: '20px' }} />
                  {width > 700 ? ' Autre' : null}
                </a>
                <ul style={{ display: activeTab === 'other' ? 'block' : 'none', position: 'absolute', backgroundColor: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', borderRadius: '4px', padding: '8px 0' }}>
                  <div style={{ padding: '8px 16px', cursor: 'pointer' }} onClick={() => handleTabChange('prSearch')}>
                    Est-ce un PR ?
                  </div>
                  <div style={{ padding: '8px 16px', cursor: 'pointer' }} onClick={() => handleTabChange('prTable')}>
                    Tableau PR
                  </div>
                </ul>
              </li>
            </ul>
          </div>

          {/* Render active tab component */}
          {activeTab === 'statistiques' && <Stats stats={stats} userId={searchParams.get('id')} />}
          {activeTab === 'prSearch' && <PrSearch />}
          {activeTab === 'prTable' && <PrTable />}
          {activeTab === 'seances' && <DisplaySeancesPost userId={searchParams.get('id')} />}
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Compte