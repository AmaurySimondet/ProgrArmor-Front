import { React, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import NavigBar from "../../components/NavigBar.jsx";
import Footer from "../../components/Footer.jsx";
import { COLORS } from "../../utils/colors.js";
import DisplaySeancesPost from "../../components/DisplaySeancesPost.jsx";
import PrSearch from "./PrSearch.jsx";
import PrTable from "./PrTable.jsx";
import API from "../../utils/API.js";
function Compte() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('seances');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Tab change handler
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  async function getUser() {
    const { data } = await API.getUser({ id: localStorage.getItem("id") });
    if (data.success === false) {
      alert(data.message);
    } else {
      console.log(data.profile);
      if (data.profile.modeSombre && data.profile.modeSombre === true) {
        // 👇 add class to body element
        document.body.classList.add('darkMode');
      }
      setUser(data.profile);
    };
  }

  useEffect(() => {
    getUser().then(() => {
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ backgroundColor: COLORS.PAGE_BACKGROUND }}>
      <div className="page-container">
        <NavigBar location="session" />

        <div className="content-wrap">
          {/* USER INFO */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px' }}>
            <div className='basic-flex' style={{ gap: '20px', alignItems: 'center' }}>
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
              <div>
                <h2>{user?.fName} {user?.lName}</h2>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-white" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                {searchParams.get('id') === localStorage.getItem('id') ? (
                  <>
                    <img src={require('../../images/icons/share.webp')} alt="share" style={{ width: '20px', height: '20px' }} />
                    Partager
                  </>
                ) : 'Suivre'}
              </button>
              <button className="btn btn-black" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                {searchParams.get('id') === localStorage.getItem('id') ? (
                  <>
                    <img src={require('../../images/icons/write.webp')} alt="edit" style={{ width: '20px', height: '20px' }} />
                    Modifier
                  </>
                ) : 'Message'}
              </button>
              {searchParams.get('id') === localStorage.getItem('id') && (
                <button
                  className="btn btn-danger"
                  style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                  onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('id');
                    window.location.href = '/';
                  }}
                >
                  Déconnexion
                </button>
              )}
            </div>
          </div>

          {/* Tabs navigation */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ul className="tabs" role="navigation" style={{ listStyle: 'none', padding: 0, display: 'flex', justifyContent: 'center' }}>
              <li className={activeTab === 'seances' ? 'selected' : ''}>
                <a className="tab" onClick={() => handleTabChange('seances')}>
                  Séances
                </a>
              </li>
              <li className={activeTab === 'prSearch' ? 'selected' : ''}>
                <a className="tab" onClick={() => handleTabChange('prSearch')}>
                  Recherche PR
                </a>
              </li>
              <li className={activeTab === 'prTable' ? 'selected' : ''}>
                <a className="tab" onClick={() => handleTabChange('prTable')}>
                  Tableau PR
                </a>
              </li>
            </ul>
          </div>

          {/* Render active tab component */}
          {activeTab === 'prSearch' && <PrSearch />}
          {activeTab === 'prTable' && <PrTable />}
          {activeTab === 'seances' && <DisplaySeancesPost userId={localStorage.getItem('userId')} />}
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Compte