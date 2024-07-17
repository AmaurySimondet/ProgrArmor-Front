import axios from "axios";
const headers = {
  "Content-Type": "application/json"
};
const DEV = false;
const burl = DEV ? "http://localhost:8800" : "https://www.prograrmor.com";

function paramsToString(params) {
  let string = "";
  let keyArray = [];
  Object.keys(params).forEach(key => { keyArray.push(key) });
  Object.values(params).forEach((param, index) => {
    string = string + keyArray[index] + "=" + param
    if (index !== (Object.values(params).length - 1)) {
      string = string + "&"
    };
  })
  return string
}

export default {

  //LOGIN SIGNUP
  login: function (email, password) {
    return axios.post(`${burl}/user/login`, { email, password }, { headers: headers });

  },

  signup: function (send) {
    return axios.post(`${burl}/user/signup`, send, { headers: headers });

  },

  verifyToken: function (send) {
    return axios.post(`${burl}/user/verifyToken`, send, { headers: headers });

  },

  facebook: function () {
    return axios.get(`${burl}/user/auth/facebook`, { headers: headers })

  },

  facebookAuthenticate: function () {
    return axios.get(`${burl}/user/auth/facebook/authenticate`, { headers: headers })

  },

  google: function () {
    return axios.get(`${burl}/user/auth/google`, { headers: headers })

  },

  googleAuthenticate: function () {
    return axios.get(`${burl}/user/auth/google/authenticate`, { headers: headers })

  },

  isAuth: async function () {
    if (localStorage.getItem("token") !== null) {
      const result = await axios.post(`${burl}/user/verifyToken`, { token: localStorage.getItem("token") }, { headers: headers });
      //        console.log(result)
      if (result.data.success === true) {
        return true
      }
    }
    return false;

  },

  logout: function () {
    return axios.get(`${burl}/user/logout`, { headers: headers });

  },

  //NIVEAU
  getNiveau: function (send) {
    return axios.post(`${burl}/user/getNiveau`, send, { headers: headers });

  },

  //SESSION
  debutantform: function (send) {
    return axios.post(`${burl}/user/debutantform`, send, { headers: headers });

  },

  supprSeance: function (send) {
    return axios.post(`${burl}/user/supprSeance`, send, { headers: headers });

  },

  workouts: function (params) {
    let string = paramsToString(params);

    return axios.get(`${burl}/user/workouts?` + string, { headers: headers });

  },

  loadSeance: function (params) {
    let string = paramsToString(params);

    return axios.get(`${burl}/user/loadSeance?` + string + "&id=" + localStorage.getItem("id"), { headers: headers });

  },

  getUser: function (id) {
    return axios.post(`${burl}/user/getUser`, id, { headers: headers });

  },

  priseDeNote: function (send) {
    return axios.post(`${burl}/user/priseDeNote`, send, { headers: headers });

  },


  //COMPTE
  modifyUser: function (send) {
    return axios.post(`${burl}/user/modifyUser`, send, { headers: headers });

  },

  resetPassword: function (send) {
    return axios.post(`${burl}/user/resetPassword`, send, { headers: headers });

  },

  reguScore: function (send) {
    return axios.post(`${burl}/user/reguScore`, send, { headers: headers });

  },

  //PROGRAMMES
  createProgramme: function (send) {
    return axios.post(`${burl}/user/createProgramme`, send, { headers: headers });
  },

  getProgrammes: function (send) {
    send.id = localStorage.getItem("id")
    return axios.post(`${burl}/user/getProgrammes`, send, { headers: headers });
  },

  deleteProgramme: function (send) {
    return axios.post(`${burl}/user/deleteProgramme`, send, { headers: headers });
  },

  getProgrammesByUser: function (send) {
    return axios.post(`${burl}/user/getProgrammesByUser`, send, { headers: headers });

  },

  getProgramme: function (send) {
    return axios.post(`${burl}/user/getProgramme`, send, { headers: headers });

  },

  likeProgramme: function (send) {
    return axios.post(`${burl}/user/likeProgramme`, send, { headers: headers });

  },

  getProgrammeLikes: function (send) {
    return axios.post(`${burl}/user/getProgrammeLikes`, send, { headers: headers });

  },

  isProgrammeLiked: function (send) {
    return axios.post(`${burl}/user/isProgrammeLiked`, send, { headers: headers });

  },

  isProgrammeCommented: function (send) {
    return axios.post(`${burl}/user/isProgrammeCommented`, send, { headers: headers });

  },

  whoLiked: function (send) {
    return axios.post(`${burl}/user/whoLiked`, send, { headers: headers });

  },

  getProgrammeCreator: function (send) {
    return axios.post(`${burl}/user/getProgrammeCreator`, send, { headers: headers });

  },

  whoCommented: function (send) {
    return axios.post(`${burl}/user/whoCommented`, send, { headers: headers });

  },

  sendComment: function (send) {
    return axios.post(`${burl}/user/sendComment`, send, { headers: headers });

  },

  getComments: function (send) {
    return axios.post(`${burl}/user/getComments`, send, { headers: headers });

  },
};