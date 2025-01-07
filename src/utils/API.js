import axios from "axios";
const headers = {
  "Content-Type": "application/json"
};
const burl = process.env.REACT_APP_BACKEND_URL;

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





  //USER
  getUser: function (params) {
    return axios.get(`${burl}/user/getUser`, { headers: headers, params: params });
  },
  getUsers: function (params) {
    return axios.get(`${burl}/user/getUsers`, {
      headers: headers, params: {
        page: params.page,
        limit: params.limit
      }, data: params
    });
  },
  getStats: function (userId) {
    return axios.get(`${burl}/user/userStats`, { headers: headers, params: { userId } });
  },
  followUser: function (send) {
    return axios.post(`${burl}/user/followUser`, send, { headers: headers });
  },
  unfollowUser: function (send) {
    return axios.post(`${burl}/user/unfollowUser`, send, { headers: headers });
  },



  // AWS
  uploadPP: (uploadResult, userId) => {
    return axios.post(`${burl}/user/aws/record-pp`, {
      uploadResult,
      userId
    }, { headers: headers });
  },
  uploadSeancePhoto: (uploadResult, seanceDate, seanceName, userId) => {
    return axios.post(`${burl}/user/aws/record-seance-photo`, {
      uploadResult,
      seanceDate,
      seanceName,
      userId
    }, { headers: headers });
  },
  getPhotos: function (userId, seanceDate, seanceName) {
    return axios.get(`${burl}/user/aws/get-seance-photos`, {
      headers: headers,
      params: {
        userId,
        seanceDate,
        seanceName
      }
    });
  },
  getPhotosBySeanceId: function (seanceId) {
    return axios.get(`${burl}/user/aws/get-seance-photos-by-id`, {
      headers: headers,
      params: {
        seanceId
      }
    });
  },
  deleteSeancePhoto: function (photoUrl) {
    return axios.delete(`${burl}/user/aws/delete-seance-photo`, {
      headers: headers,
      params: {
        photoUrl
      }
    });
  },
  getUserImages: function (userId) {
    return axios.get(`${burl}/user/aws/images/${userId}`, {
      headers: headers
    });
  },





  //SEANCES
  getSeanceNames: function (send) {
    return axios.get(`${burl}/user/seance/names`, { headers: headers, params: send });
  },
  getLastSeance: function (send) {
    return axios.get(`${burl}/user/seance/last`, { headers: headers, params: send });
  },
  getSeance: function (send) {
    return axios.get(`${burl}/user/seance`, { headers: headers, params: send });
  },
  getSeances: function (send) {
    return axios.get(`${burl}/user/seances`, { headers: headers, params: send });
  },
  createSeance: function (send) {
    return axios.post(`${burl}/user/createSeance`, send, { headers: headers, params: send });
  },
  deleteSeance: function (send) {
    return axios.delete(`${burl}/user/deleteSeance`, {
      headers: headers,
      params: send,
      data: send
    });
  },
  updateSeance: function (send) {
    return axios.put(`${burl}/user/updateSeance`, send, { headers: headers, params: send });
  },


  //NOTIFICATIONS
  getNotifications: function (send) {
    return axios.get(`${burl}/user/notifications`, {
      headers: headers,
      params: send
    });
  },
  markNotificationAsRead: function (send) {
    return axios.put(`${burl}/user/notifications/read`, send, {
      headers: headers
    });
  },
  bulkMarkNotificationAsRead: function (send) {
    return axios.put(`${burl}/user/notifications/bulk-read`, send, {
      headers: headers
    });
  },
  deleteNotification: function (send) {
    return axios.delete(`${burl}/user/notifications/delete`, {
      data: send,
      headers: headers,
    });
  },
  bulkDeleteNotifications: function (send) {
    return axios.delete(`${burl}/user/notifications/bulk-delete`, {
      data: send,  // Send the payload here
      headers: headers
    });
  },





  // SEANCE SETS
  getSeanceSets: function (send) {
    return axios.get(`${burl}/user/sets`, { headers: headers, params: send });
  },
  getTopExercices: function (send) {
    return axios.get(`${burl}/user/topExercices`, { headers: headers, params: send });
  },
  createSet: function (send) {
    return axios.post(`${burl}/user/createSet`, send, { headers: headers, params: send });
  },
  getPRs: function (send) {
    return axios.get(`${burl}/user/pr`, { headers: headers, params: send });
  },
  getTopFormat: function (send) {
    return axios.get(`${burl}/user/topFormat`, { headers: headers, params: send });
  },
  deleteSeanceSets: function (send) {
    return axios.delete(`${burl}/user/deleteSets`, {
      headers: headers,
      params: send,
      data: send
    });
  },



  // EXERCICE TYPES
  getExerciceTypes: function (send) {
    return axios.get(`${burl}/user/exerciceTypes`, {
      headers: headers, params: send
    });
  },
  getExerciceType: function (send) {
    return axios.get(`${burl}/user/exerciceType`, {
      headers: headers, params: send
    });
  },



  // EXERCICES
  getExercices: function (send) {
    return axios.get(`${burl}/user/exercices`, {
      headers: headers, params: send
    });
  },

  getExercice: function (send) {
    return axios.get(`${burl}/user/exercice`, {
      headers: headers, params: send
    });
  },

  getCombinations: function (send) {
    return axios.get(`${burl}/user/combinations`, {
      headers: headers, params: send
    });
  },



  // CATEGORIES TYPES
  getCategoryTypes: function (send) {
    return axios.get(`${burl}/user/categorietypes`, {
      headers: headers, params: send
    });
  },
  getCategorieType: function (send) {
    return axios.get(`${burl}/user/categorietype`, {
      headers: headers, params: send
    });
  },


  // CATEGORIES
  getCategories: function (send) {
    return axios.get(`${burl}/user/categories`, {
      headers: headers, params: send
    });
  },
  getCategory: function (send) {
    return axios.get(`${burl}/user/category`, {
      headers: headers, params: send
    });
  },


  //COMPTE
  modifyUser: function (send) {
    return axios.post(`${burl}/user/modifyUser`, send, { headers: headers });

  },
  resetPassword: function (send) {
    return axios.post(`${burl}/user/resetPassword`, send, { headers: headers });

  },


  // WEATHER
  getWeather: function (send) {
    return axios.get(`${burl}/user/weather`, { headers: headers, params: send });
  },

  // ADMIN
  getRouteStats: function (send) {
    return axios.get(`${burl}/user/admin/route-stats`, { headers: headers, params: send });
  },
  getInscriptionStats: function (send) {
    return axios.get(`${burl}/user/admin/inscription`, { headers: headers, params: send });
  },

  // REACTIONS & COMMENTS
  getSeanceReactions: function (seanceId) {
    return axios.get(`${burl}/user/seance/${seanceId}/reactions`, {
      headers: headers,
      params: {
        userId: localStorage.getItem('id') // Assuming you store userId in localStorage
      }
    });
  },

  updateSeanceReaction: function (seanceId, reactionType, commentId, seanceUser) {
    return axios.post(`${burl}/user/seance/${seanceId}/reactions`, {
      userId: localStorage.getItem('id'),
      reaction: reactionType,
      commentId: commentId,
      seanceUser: seanceUser
    }, { headers: headers });
  },

  getSeanceComments: function (seanceId) {
    return axios.get(`${burl}/user/seance/${seanceId}/comments`, {
      headers: headers,
      params: {
        userId: localStorage.getItem('id')
      }
    });
  },

  postSeanceComment: function (seanceId, text, seanceUser) {
    return axios.post(`${burl}/user/seance/${seanceId}/comments`, {
      userId: localStorage.getItem('id'),
      text,
      seanceUser: seanceUser
    }, { headers: headers });
  },
};
