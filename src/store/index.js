import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import baseApiURLS from '../helpers/baseApiUrls';

Vue.use(Vuex);
const getDefaultState = () => {
  return {    
    changePasswordError: '',
    tokenrefreshed: 0,
    accessToken: 'Bearer ' + localStorage.getItem('access') || '',
    authStatus: '',
    fullname: '',
    isAuthenticated: false,
    loginError: '',
    password: '',
    refreshToken: localStorage.getItem('refresh') || '',
    user_id: '',

    user: '',
    userInactive: '',
    user_addressLine1: '',
    user_addressLine2: '',
    user_city: '',
    user_classes: [],
    user_country: '',
    user_dob: '',
    user_drivingLicense: '',
    user_fname: '',
    user_gender: '',
    user_homePhone: '',
    user_joinedDate: '',
    user_lname: '',
    user_mname: '',
    user_citizenshipCard: '',
    user_phoneNumber: '',
    user_postalCode: '',
    user_privateEmail: '',
    user_profileImage: '',
    user_rfid: '',
    user_rollno: '',
    user_workPhone: '',
    username: '',
    isTeacher: false,

    status_personalInformation: false,

    students: [],

    visit_fullname: '',
    visit_user_fname: '',
    visit_user_lname: '',
    visit_user_mname: '',
    visit_user_id: '',
    visit_user_rfid: '',
    visit_user_phoneNumber:'',
    visit_user_rollno: '',
    visit_user_classes: '',
    visit_user_city: '',
    visit_user_country: '',
    visit_user_privateEmail: '',
    visit_username: '',
    visit_user: '',
    visit_user_gender: '',
    visit_user_dob: '',
    visit_user_drivingLicense: '',
    visit_user_citizenshipCard: '',
    visit_user_joinedDate: '',
    visit_user_postalCode: '',
    visit_user_workPhone: '',
    visit_user_homePhone: '',
    visit_user_addressLine1: '',
    visit_user_addressLine2: '',
    visit_user_profileImage: '',
    visit_average: 0,

    events: [],
    exportableAttendence: [],
    dummyHolder: 0,
    rangeStudents: [],
    saveTokenOrNotStatus: false
  }
}

export default new Vuex.Store({
  state: getDefaultState(),
  actions: {

    PunchIn({ state }) {
      var rfid = state.user_rfid
      console.log(rfid)

      return new Promise((resolve) => {
        axios({
          method: 'post',
          url: 'http://localhost:8000/attendence/',
          data: {
            rfid: rfid,
          }
        })
          .then((response) => {
            console.log(response)
            resolve()
          })
          .catch((error) => {
            console.log(error)
          })
      })
    },

    changePassword ({ commit }, { formData }) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'post',
          data: formData,
          url: baseApiURLS.urls.changepassword
        })
          .then((response) => {
            if (response.data.code === 401) {
              commit('setChangePasswordError', response.data)
              reject('error')
            } else {
              commit('dummydone')
              resolve()
            }
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    getRangeAttendence ({ commit }, { date, class_name }) {
      return new Promise((resolve) => {
        axios({
          method: 'post',
          url: baseApiURLS.urls.rangeAverageAttendence,
          data: {
            fromdate: date,
            class: class_name 
          }
        })
          .then((response) => {
            commit('setRangeStudents', response.data.details)
            resolve()
          })
      })
    },
    setRemarksForThis({ commit, state }, { rfid, date, remarks }) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'post',
          data: {
            rfid: rfid,
            date: date,
            remarks: remarks,
            id: state.visit_user_id
          },
          url: baseApiURLS.urls.setRemarksForThis
        })
          .then(() => {
            commit('dummydone')
            resolve()
          })
          .catch(()=> {
            reject()
          })
      })
    },
    getVisitAverage({ commit, state }) {
      let rfid = state.visit_user_rfid
      return new Promise((resolve, reject) => {
        axios({
          method: 'post',
          url: baseApiURLS.urls.getAverage,
          data: {
            rfid: rfid
          }
        })
          .then((response)=> {
            commit('setAverage', response.data)
            resolve()
          })
          .catch(()=>{
            reject()
          })
      })
    },
    getExportableAttendence({ commit, state }, { id }){
      const visitor_id = state.user_id
      const rfid = state.visit_user_rfid
      return new Promise((resolve, reject) => {
        axios({
          method: 'post',
          data: {
            id: id,
            rfid: rfid,
            visitor_id: visitor_id
          },
          url: baseApiURLS.urls.getExportableAttendence,
        })
          .then((response) => {
            commit('setExportableAttenndence', response.data)
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    getTodayAttendenceOfClassroom ({ commit }, { classroom }) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'post',
          url: baseApiURLS.urls.todayAttendence,
          data: {
            class: classroom
          }
        })
          .then((response) => {
            commit('setTodayAttendence', response.data)
            resolve()
          })
          .catch((error) => {
            console.log(error)
            reject('permisssion')
          })
      })
    },
    getFullEvents({ commit }, { rfid, start, end }) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'post',
          url: baseApiURLS.urls.getEvents,
          data: {
            rfid: rfid,
            start: start,
            end: end,
          }
        })
          .then((response) => {
            commit('setFullMonthEvents', response.data)
            resolve()
          })
        .catch((error) => {
          reject(error)
        })
      })
    },

    uploadAttendenceFile({ commit }, { file }){
      let form = new FormData()
      form.append('file', file.files[0])
      return new Promise((resolve, reject) => {
        axios({
          method: 'post',
          url: baseApiURLS.urls.attendenceFile,
          data: form,
          headers: {
            'Content-Type': `multipart/form-data; boundary=${form._boundary}`
          }
        })
        .then((response) => {
          if ( response.data.code === 200 ) {
            commit('setUploadFileDone')
            resolve()
          } else if (response.data.code === 401) {
            commit('uploadAttendenceFileError', response.data.message)
            reject('error')
          } else if (response.data.code === 400) {
            commit('uploadAttendenceFileError', response.data.message)
            reject('error')
          }
        })
        .catch(err => {
          reject(err)
        })
      })
    },

    uploadProfileImage({ commit, state }, { image }){
      let form = new FormData()
      form.append('id', state.user_id)
      form.append('image', image.files[0])
      return new Promise((resolve, reject) => {
        axios({
          method: 'post',
          url: baseApiURLS.urls.profileImage,
          data: form,
          headers: {
            'Content-Type': `multipart/form-data; boundary=${form._boundary}`
          }
        })
        .then((response) => {
          commit('changeProfileImage', response.data.link)
          resolve()
        })
        .catch(err => {
          reject(err)
        })
      })
    },
    deleteProfileImage() {
      return new Promise((resolve, reject) => {
        axios({
          method: 'post',
          url: baseApiURLS.urls.deleteProfileImage
        })
        .then(() => {
          resolve()
        })
        .catch(()=> {
          reject()
        })
      })
    },
    getStudentsFromClassroom ({ commit }, { class_name }) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'post',
          url: baseApiURLS.urls.classroom,
          data: {
            class: class_name
          }
        })
          .then((response) => {
            if(response.data.code === 200)
              commit('setStudentsFromClassroom', { response, class_name })
            else if(response.data.code === 401) {
              reject('permission')
            }
            resolve()
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    getProfileImage({ commit }){
      return new Promise((resolve, reject) => {
        axios({
          method: 'get',
          url: baseApiURLS.urls.profileImage
        })
        .then((response)=> {
          if(response) {
            commit('setProfileImageLink', response.data)
          }
          resolve()
        })
        .catch((err) => {
          reject(err)
        })
      })
    },
    login({ commit }, {username, password}){
      return new Promise((resolve, reject) => {
        axios({
          method: 'post',
          url: baseApiURLS.urls.login,
          data: {
            username: username,
            password: password
          }
        })
          .then(
            response => {
              if(response.data.code === 400){
                if(response.data.message == "Inactive User") {
                  commit('userInactive')
                  resolve()
                }
              } else if (response.data.code === 200) {
                commit(
                  'auth_success',
                  response.data.details.username
                )
                resolve()
              } else if (response.data.code === 401) {
                  commit("setLoginError", "Not valid Credentials");
                  localStorage.removeItem('access')
                  localStorage.removeItem('refresh')
                  delete axios.defaults.headers.common['Authorization']
                  reject("Not valid Credentials")
              }
            })
          .catch(
            err => {
              commit("setLoginError", err);
              localStorage.removeItem('access')
              localStorage.removeItem('refresh')
              delete axios.defaults.headers.common['Authorization']
              reject(err)
            }
          )
      });
    },
    getPersonalInformation({ commit }) {
      return new Promise((resolve) => {
        axios({
          method: 'get',
          url: baseApiURLS.urls.getPersonalInformation
        })
        .then(
          response => {
            commit('setPersonalInformation', response.data)
            resolve()
          })
        .catch(() => {
          commit('dummydone')
        })
      })
    },
    setPersonalInformation({ commit }, data) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'post',
          url: baseApiURLS.urls.setPersonalInformation,
          data: data
        })
          .then(() => {
            commit('dummydone')
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    fetchToken ({ commit }, {username, password}) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'post',
          url: baseApiURLS.urls.getToken,
          data: {
            username: username,
            password: password
          }
        })
          .then(
            response => {
              commit('setToken', response.data)
              resolve();
            })
          .catch(
            err => {
              localStorage.removeItem('access')
              localStorage.removeItem('refresh')
              delete axios.defaults.headers.common['Authorization']
              reject(err)
            }
          )
      });
    },
    refreshToken ({ commit }) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'post',
          url: baseApiURLS.urls.refreshToken,
          data: {
            refresh: localStorage.getItem('refresh')
          }
        })
          .then((response) => {
              commit('setToken', response.data)
              resolve(response.data);
            })
          .catch(
            err => {
              localStorage.removeItem('access')
              localStorage.removeItem('refresh')
              delete axios.defaults.headers.common['Authorization']
              reject(err)
            }
          )
      });
    },
    verifyToken (state) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'post',
          url: baseApiURLS.urls.verifyToken,
          data: {
            token: state.state.refreshToken
          }
        })
          .then(() => {
            resolve();
          })
          .catch(
            err => {
              localStorage.removeItem('access')
              localStorage.removeItem('refresh')
              delete axios.defaults.headers.common['Authorization']
              reject(err)
            }
          )
      });
    },
    logout({commit}){
      delete axios.defaults.headers.common['Authorization']
      localStorage.removeItem('access')
      localStorage.removeItem('refresh')
      return new Promise((resolve) => {
        resolve()
        commit('logout')
        commit('setAllToDefault')
      })
    },
    getUserBasicDetails({commit}, { access }) {
      return new Promise((resolve) => {
        axios({
          method: 'get',
          url: baseApiURLS.urls.basicpersonaldetails,
          headers: {
            'Authorization': access
          }
        })
          .then((response) => {
              if (response) {
                commit('setBasicPersonalDetails', response.data.details)
                resolve();
              }
            })
          .catch(() => {
            commit('dummydone')
          })
      })
    },
    visitStudentProfile ({ commit }, { id }) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'post',
          data: {
            student_id: id
          },
          url: baseApiURLS.urls.visitStudentProfile
        })
          .then((response) => {
            if(response.data.code === 200)
              commit('setVisitStudentProfile', response.data)
            else if (response.data.code === 400) {
              reject('error')
            }
            else if (response.data.code === 401) {
              commit('setVisitProfilePermissionDenied')
              reject('permission')
            }
            resolve()
          })
      })
    }
  },
  mutations: {
    saveTokenOrNot (state, { status } ) {
      state.saveTokenOrNotStatus = status
    },
    setRangeStudents (state, data) {
      state.rangeStudents = data
    },

    setChangePasswordError (state, data) {
      if (data.message) {
        state.changePasswordError = data.message
      } else {
        state.changePasswordError = `Validation doesnot match.<br /> The password must be 8 characters long containing atleast a Uppercase Letter, a Lowercase Letter, a number and a Symbol.`
      }
    },

    setTokenRefreshed (state, data) {
      state.tokenrefreshed = data
    },

    setAverage (state, data) {
      state.visit_average = data.average
    },

    dummydone(state) {
      state.dummyHolder = 1
    },

    setExportableAttenndence(state, data) {
      state.exportableAttendence = data.details
    },

    setFullMonthEvents(state, data) {
      state.events = data.details
    },

    setVisitStudentProfile(state, data) {
      if(data.details.mname) {
        state.visit_fullname = data.details.fname + ' ' + data.details.mname + ' ' + data.details.lname
      } else{
        state.visit_fullname = data.details.fname + ' ' + data.details.lname
      }
      state.visit_user_fname = data.details.fname
      state.visit_user_lname = data.details.lname
      state.visit_user_mname = data.details.mname
      state.visit_user_id = data.details.user_id
      state.visit_user_rfid = data.details.rfid
      state.visit_user_phoneNumber = data.details.phone_no
      state.visit_user_rollno = data.details.roll_no
      state.visit_user_classes = data.details.class
      state.visit_user_city = data.details.city
      state.visit_user_country = data.details.country
      state.visit_user_privateEmail = data.details.private_email
      state.visit_username = data.details.username
      state.visit_user = data.details.username
      state.visit_user_gender = data.details.gender
      state.visit_user_dob = data.details.dob
      state.visit_user_drivingLicense = data.details.driving_license
      state.visit_user_citizenshipCard = data.details.citizenship_card_no
      state.visit_user_joinedDate = data.details.date_joined
      state.visit_user_postalCode = data.details.postal_code
      state.visit_user_workPhone = data.details.work_phone
      state.visit_user_homePhone = data.details.home_phone
      state.visit_user_addressLine1 = data.details.addressline1
      state.visit_user_addressLine2 = data.details.addressline2
      state.visit_user_profileImage = data.details.image
    },

    setStudentsFromClassroom (state, {response, class_name}) {
      state.students = response.data[class_name]
    },

    setProfileImageLink(state, data) {
      state.user_profileImage = data.link
    },

    changeProfileImage(state, data) {
      state.user_profileImage = data
    },

    setPersonalInformation(state, data) {
      if(data.details.mname) {
        state.fullname = data.details.fname + ' ' + data.details.mname + ' ' + data.details.lname
      } else{
        state.fullname = data.details.fname + ' ' + data.details.lname
      }
      state.isTeacher = data.details.teacher[0]
      state.user_fname = data.details.fname
      state.user_lname = data.details.lname
      state.user_mname = data.details.mname
      state.user_id = data.details.user_id
      state.user_rfid = data.details.rfid
      state.user_phoneNumber = data.details.phone_no
      state.user_rollno = data.details.roll_no
      state.user_classes = data.details.class
      state.user_city = data.details.city
      state.user_country = data.details.country
      state.user_privateEmail = data.details.private_email
      state.username = data.details.username
      state.user = data.details.username
      state.user_gender = data.details.gender
      state.user_dob = data.details.dob
      state.user_drivingLicense = data.details.driving_license_no
      state.user_citizenshipCard = data.details.citizenship_card_no
      state.user_joinedDate = data.details.date_joined
      state.user_postalCode = data.details.postal_code
      state.user_workPhone = data.details.work_phone
      state.user_homePhone = data.details.home_phone
      state.user_addressLine1 = data.details.addressline1
      state.user_addressLine2 = data.details.addressline2
      
      state.status_personalInformation = true
    },

    setBasicPersonalDetails (state, data) {
      if(data.mname) {
        state.fullname = data.fname + ' ' + data.mname + ' ' + data.lname
      } else{
        state.fullname = data.fname + ' ' + data.lname
      }
      state.isTeacher = data.teacher[0]
      state.user_fname = data.fname
      state.user_lname = data.lname
      state.user_mname = data.mname
      state.username = data.username
      state.user = data.username
      state.user_classes = data.class
      state.user_rfid = data.rfid
      state.user_id = data.user_id
    }, 
    setLoginError (state, err){
      state.loginError = err
    },
    
    setToken(state, token){
      if(token.access && token.refresh){
        if (state.saveTokenOrNotStatus) {
          localStorage.setItem('access', token.access);
          localStorage.setItem('refresh', token.refresh);
        }

        state.accessToken = 'Bearer ' + token.access;
        state.refreshToken = token.refresh;
        axios.defaults.headers.common['Authorization'] = "Bearer " + token.access

      } else {
        if (state.saveTokenOrNotStatus) {
          localStorage.setItem('access', token.access);
        }

        state.accessToken = 'Bearer ' + token.access;
        axios.defaults.headers.common['Authorization'] = "Bearer " + token.access
      }

    },

    auth_success(state, user){
      state.authStatus = 'success'
      state.isAuthenticated = true
      state.user = user
    },

    setAllToDefault (state) {
      Object.assign(state, getDefaultState())
    },

    logout(state){
      state.authStatus = ''
      state.isAuthenticated = false
      state.refreshToken = ''
      state.accessToken = ''
    },

    userInactive (state) {
      state.userInactive = true
    },
  }
});

