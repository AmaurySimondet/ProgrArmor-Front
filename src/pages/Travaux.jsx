import { React, useState, useEffect } from "react";
import Footer from "../components/Footer.jsx";
import NavigBar from "../components/NavigBar.jsx"
import API from "../utils/API.js";
import { COLORS } from "../utils/colors.js";

function Travaux() {
  const [user, setUser] = useState()

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
    getUser();
  }, []);

  return (
    <div style={{ backgroundColor: COLORS.PAGE_BACKGROUND }}>
      <div className="page-container">
        <NavigBar location="travaux" />




        {/* PAGE CONTENT */}
        <div className="content-wrap">

          <div className="Travaux-div">
            <h1>Oups !</h1>
            <p>
              <img className="travaux-icon" src={require('../images/icons/icons8-man-construction-worker-48.webp')} alt="miguel" />
              <br />
              Miguel fait encore chauffer la betonnière pour cette page ! Reviens plus tard...
              <br />
              <img className="travaux-icon" src={require('../images/icons/icons8-brick-48.webp')} alt="brique" />
            </p>
          </div>



        </div>


        <Footer />
      </div>
    </div>
  );
};

export default Travaux;