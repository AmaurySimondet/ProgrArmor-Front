import axios from "axios";

const headers = {
  "Content-Type": "application/json"
};

const defaultConfig = {
  headers: headers,
  credentials: 'include',
  withCredentials: true
};

const burl = process.env.REACT_APP_BACKEND_URL;

export default {

  //LOGIN SIGNUP
  login: function (email, password) {
    return axios.post(`${burl}/user/login`, { email, password }, defaultConfig);

  },
  signup: function (send) {
    return axios.post(`${burl}/user/signup`, send, defaultConfig);

  },
  verifyToken: function (send) {
    return axios.post(`${burl}/user/verifyToken`, send, defaultConfig);

  },
  facebook: function () {
    return axios.get(`${burl}/user/auth/facebook`, defaultConfig)

  },
  facebookAuthenticate: function () {
    return axios.get(`${burl}/user/auth/facebook/authenticate`, defaultConfig)

  },
  google: function () {
    return axios.get(`${burl}/user/auth/google`, defaultConfig)

  },
  googleAuthenticate: function () {
    return axios.get(`${burl}/user/auth/google/authenticate`, defaultConfig)

  },
  isAuth: async function () {
    if (localStorage.getItem("token") !== null) {
      const result = await axios.post(`${burl}/user/verifyToken`, { token: localStorage.getItem("token") }, defaultConfig);
      //        console.log(result)
      if (result.data.success === true) {
        return true
      }
    }
    return false;

  },
  logout: function () {
    return axios.get(`${burl}/user/logout`, defaultConfig);

  },




  //NIVEAU
  getNiveau: function (send) {
    return axios.post(`${burl}/user/getNiveau`, send, defaultConfig);
  },





  //USER
  getUser: function (id) {
    return axios.post(`${burl}/user/getUser`, id, defaultConfig);
  },
  getUsers: function () {
    return axios.get(`${burl}/user/getUsers`, defaultConfig);
  },
  getStats: function (userId) {
    return axios.get(`${burl}/user/userStats`, { ...defaultConfig, params: { userId } });
  },
  followUser: function (send) {
    return axios.post(`${burl}/user/followUser`, send, defaultConfig);
  },
  unfollowUser: function (send) {
    return axios.post(`${burl}/user/unfollowUser`, send, defaultConfig);
  },



  // AWS
  uploadPP: (formData) => {
    return axios.post(`${burl}/user/aws/upload-pp`, formData, {
      ...defaultConfig,
      headers: {
        ...headers,
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  uploadSeancePhoto: (formData) => {
    return axios.post(`${burl}/user/aws/upload-seance-photo`, formData, {
      ...defaultConfig,
      headers: {
        ...headers,
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  getPhotos: function (userId, seanceDate, seanceName) {
    return axios.get(`${burl}/user/aws/get-seance-photos`, {
      ...defaultConfig,
      params: {
        userId,
        seanceDate,
        seanceName
      }
    });
  },
  getPhotosBySeanceId: function (seanceId) {
    return axios.get(`${burl}/user/aws/get-seance-photos-by-id`, {
      ...defaultConfig,
      params: {
        seanceId
      }
    });
  },
  deleteSeancePhoto: function (photoUrl) {
    return axios.delete(`${burl}/user/aws/delete-seance-photo`, {
      ...defaultConfig,
      params: {
        photoUrl
      }
    });
  },
  getUserImages: function (userId) {
    return axios.get(`${burl}/user/aws/images/${userId}`, defaultConfig);
  },





  //SEANCES
  getSeanceNames: function (send) {
    return axios.get(`${burl}/user/seance/names`, { ...defaultConfig, params: send });
  },
  getLastSeance: function (send) {
    return axios.get(`${burl}/user/seance/last`, { ...defaultConfig, params: send });
  },
  getSeance: function (send) {
    return axios.get(`${burl}/user/seance`, { ...defaultConfig, params: send });
  },
  getSeances: function (send) {
    return axios.get(`${burl}/user/seances`, { ...defaultConfig, params: send });
  },
  createSeance: function (send) {
    return axios.post(`${burl}/user/createSeance`, send, { ...defaultConfig, params: send });
  },
  deleteSeance: function (send) {
    return axios.delete(`${burl}/user/deleteSeance`, {
      ...defaultConfig,
      params: send,
      data: send
    });
  },
  updateSeance: function (send) {
    return axios.put(`${burl}/user/updateSeance`, send, { ...defaultConfig, params: send });
  },


  //NOTIFICATIONS
  getNotifications: function (send) {
    return axios.get(`${burl}/user/notifications`, {
      ...defaultConfig,
      params: send
    });
  },
  markNotificationAsRead: function (send) {
    return axios.put(`${burl}/user/notifications/read`, send, defaultConfig);
  },





  // SEANCE SETS
  getSeanceSets: function (send) {
    return axios.get(`${burl}/user/sets`, { ...defaultConfig, params: send });
  },
  getTopExercices: function (send) {
    return axios.get(`${burl}/user/topExercices`, { ...defaultConfig, params: send });
  },
  createSet: function (send) {
    return axios.post(`${burl}/user/createSet`, send, { ...defaultConfig, params: send });
  },
  getPRs: function (send) {
    return axios.get(`${burl}/user/pr`, { ...defaultConfig, params: send });
  },
  getTopFormat: function (send) {
    return axios.get(`${burl}/user/topFormat`, { ...defaultConfig, params: send });
  },
  deleteSeanceSets: function (send) {
    return axios.delete(`${burl}/user/deleteSets`, {
      ...defaultConfig,
      params: send,
      data: send
    });
  },



  // EXERCICE TYPES
  getExerciceTypes: function (send) {
    return axios.get(`${burl}/user/exerciceTypes`, {
      ...defaultConfig, params: send
    });
  },
  getExerciceType: function (send) {
    return axios.get(`${burl}/user/exerciceType`, {
      ...defaultConfig, params: send
    });
  },



  // EXERCICES
  getExercices: function (send) {
    return axios.get(`${burl}/user/exercices`, {
      ...defaultConfig, params: send
    });
  },

  getExercice: function (send) {
    return axios.get(`${burl}/user/exercice`, {
      ...defaultConfig, params: send
    });
  },

  getCombinations: function (send) {
    return axios.get(`${burl}/user/combinations`, {
      ...defaultConfig, params: send
    });
  },



  // CATEGORIES TYPES
  getCategoryTypes: function (send) {
    return axios.get(`${burl}/user/categorietypes`, {
      ...defaultConfig, params: send
    });
  },
  getCategorieType: function (send) {
    return axios.get(`${burl}/user/categorietype`, {
      ...defaultConfig, params: send
    });
  },


  // CATEGORIES
  getCategories: function (send) {
    return axios.get(`${burl}/user/categories`, {
      ...defaultConfig, params: send
    });
  },
  getCategory: function (send) {
    return axios.get(`${burl}/user/category`, {
      ...defaultConfig, params: send
    });
  },


  //COMPTE
  modifyUser: function (send) {
    return axios.post(`${burl}/user/modifyUser`, send, defaultConfig);

  },
  resetPassword: function (send) {
    return axios.post(`${burl}/user/resetPassword`, send, defaultConfig);

  },
  reguScore: function (send) {
    return axios.post(`${burl}/user/reguScore`, send, defaultConfig);

  },







  //PROGRAMMES
  createProgramme: function (send) {
    return axios.post(`${burl}/user/createProgramme`, send, defaultConfig);
  },

  getProgrammes: function (send) {
    send.id = localStorage.getItem("id")
    return axios.post(`${burl}/user/getProgrammes`, send, defaultConfig);
  },

  deleteProgramme: function (send) {
    return axios.post(`${burl}/user/deleteProgramme`, send, defaultConfig);
  },

  getProgrammesByUser: function (send) {
    return axios.post(`${burl}/user/getProgrammesByUser`, send, defaultConfig);

  },

  getProgramme: function (send) {
    return axios.post(`${burl}/user/getProgramme`, send, defaultConfig);

  },

  likeProgramme: function (send) {
    return axios.post(`${burl}/user/likeProgramme`, send, defaultConfig);

  },

  getProgrammeLikes: function (send) {
    return axios.post(`${burl}/user/getProgrammeLikes`, send, defaultConfig);

  },

  isProgrammeLiked: function (send) {
    return axios.post(`${burl}/user/isProgrammeLiked`, send, defaultConfig);

  },

  isProgrammeCommented: function (send) {
    return axios.post(`${burl}/user/isProgrammeCommented`, send, defaultConfig);

  },

  whoLiked: function (send) {
    return axios.post(`${burl}/user/whoLiked`, send, defaultConfig);

  },

  getProgrammeCreator: function (send) {
    return axios.post(`${burl}/user/getProgrammeCreator`, send, defaultConfig);

  },

  whoCommented: function (send) {
    return axios.post(`${burl}/user/whoCommented`, send, defaultConfig);

  },

  sendComment: function (send) {
    return axios.post(`${burl}/user/sendComment`, send, defaultConfig);

  },

  getComments: function (send) {
    return axios.post(`${burl}/user/getComments`, send, defaultConfig);

  },
};