import { defineStore } from 'pinia'
import axios from 'axios'
import { API_URLS } from '../apis';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    tokenExpiry: null,
    returnUrl: null,
  }),
  getters: {
    isAuthenticated: state => !!state.user && new Date().getTime() < new Date(state.tokenExpiry).getTime(),
  },
  actions: {

    //=====Login Action=====
    async login(email, password) {
      try {
        // const API_URL = import.meta.env.VITE_API_URL;

        // console.log("BASE URL: ", API_URL);
        
        const response = await axios.post(API_URLS.LOGIN, { email, password });

        console.log("RESPONSE: ", response);

        this.user = response.data.results.user;
        this.token = response.data.results.token;
        this.tokenExpiry = response.data.results.expires_at;

        localStorage.setItem('authUser', JSON.stringify(this.user));
        localStorage.setItem('authToken', this.token);
        localStorage.setItem('tokenExpiry', this.tokenExpiry);

        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
      } catch (error) {
        console.log("Login failed: ", error);
        throw new Error(response.message);
      }
    },



    //=====Register Action=====
    async register(name, email, password) {
      try {
        const API_URL = import.meta.env.VITE_API_URL;

        console.log("BASE URL: ", API_URL);
        
        const response = await axios.post(API_URLS.REGISTER, { name, email, password });

        console.log("RESPONSE: ", response);
      } catch (error) {
        console.log("Login failed: ", error);
        throw new Error(response.message);
      }
    },


    //=====Logout Action=====
    logout() {
      this.user = null;
      this.token = null;
      this.tokenExpiry = null;

      localStorage.removeItem('authUser');
      localStorage.removeItem('authToken');
      localStorage.removeItem('tokenExpiry');

      delete axios.defaults.headers.common['Authorization'];
    },


        //=====Load Data From Local Storage Action=====
    loadUserFromStorage() {
      const user = localStorage.getItem('authUser');
      const token = localStorage.getItem('authToken');
      const tokenExpiry = localStorage.getItem('tokenExpiry');

      if (user && token && tokenExpiry && new Date().getTime() < new Date(tokenExpiry).getTime()) {
        this.user = JSON.parse(user);
        this.token = token;
        this.tokenExpiry = tokenExpiry;
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
      } else {
        this.logout();
      }
    },
  },
});


// export const useAuthStore = defineStore('auth', {
//   state: () => ({
//     user: null,
//     token: null,
//     returnUrl: null,
//   }),
//   getters: {
//     isAuthenticated: state => !!state.user,
//   },
//   actions: {
//     async login(email, password) {
//       try {
//         const API_URL = import.meta.env.VITE_API_URL;

//         console.log("BASE URL: ", API_URL)

//         const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });

//         console.log("RESPONSE: ", response);

//         this.user = response.data.results.user;
//         this.token = response.data.results.token;
//         localStorage.setItem('authUser', JSON.stringify(this.user));
//         localStorage.setItem('authToken', this.token);
//         axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
//       } catch (error) {
//         console.error("Login failed: ", error);
//         throw new Error('Login failed');
//       }
//     },
//     logout() {
//       this.user = null;
//       this.token = null;
//       localStorage.removeItem('authUser');
//       localStorage.removeItem('authToken');
//       delete axios.defaults.headers.common['Authorization'];
//     },
//     loadUserFromStorage() {
//       const user = localStorage.getItem('authUser');
//       const token = localStorage.getItem('authToken');
//       if (user && token) {
//         this.user = JSON.parse(user);
//         this.token = token;
//         axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
//       }
//     },
//   },
// });