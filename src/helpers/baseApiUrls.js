export let baseApiURLS
const base_url = 'http://192.168.1.77:8000/api/v1/'

const urls = {
  getToken: base_url + "account/login",
  refreshToken: base_url + 'api/token/refresh/',
  verifyToken: base_url + 'api/token/verify/',
  logout: base_url + 'logout/',

  basicpersonaldetails: base_url + 'account/basicpersonaldetails/',
  classroom: base_url + 'classroom/',
  deleteProfileImage: base_url + 'account/deleteprofileimage/',
  getPersonalInformation: base_url + 'account/personal_information/',
  setPersonalInformation: base_url + 'account/personal_information/',
  home: base_url,
  changepassword: base_url + 'account/changepassword/',
  profileImage: base_url + 'account/profileimage/',
}

export default {
  urls
}

