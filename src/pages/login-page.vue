<template>
  <v-row
    justify="center"
    align="center"
  >
    <v-col
      cols="12"
      sm="6"
      md="6"
      lg="3"
    >
      <v-hover
        v-slot="{ hover }"
      >
        <v-card
          :elevation="hover? 24 :2"
        >
          <v-card-title>
            <v-container>
              <v-row
                align="center"
                justify="center"
              >
                Sign in with
              </v-row>
              <v-row
                align="center"
                justify="center"
                class="mt-5"
              >
                <v-btn
                  text
                  class="mr-2"
                >
                  <v-icon class="mr-3">
                    mdi-google
                  </v-icon>
                  Google
                </v-btn>
                <v-btn text>
                  <v-icon class="mr-5">
                    mdi-github
                  </v-icon>
                  Github
                </v-btn>
              </v-row>
            </v-container>
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-container>
              <v-row
                align="center"
                justify="center"
              >
                Or, sign in with credentials
              </v-row>
              <v-form
                ref="form"
                v-model="valid"
                lazy-validation
                class="pa-3"
              >
                <v-text-field
                  v-model="username"
                  :rules="usernameRules"
                  label="Username"
                  required
                  prepend-icon="mdi-account-circle-outline"
                  clearable
                />
                <v-text-field
                  v-model="password"
                  :rules="passwordRules"
                  label="Password"
                  required
                  prepend-icon="mdi-account-key-outline"
                  clearable
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show1 ? 'text' : 'password'"
                  @click:append="show1 = !show1"
                />
                <v-checkbox
                  v-model="checkbox"
                  label="Remember me"
                />
                <v-btn
                  :disabled="!valid"
                  color="success"
                  @click="validate"
                >
                  Submit
                </v-btn>
              </v-form>
            </v-container>
          </v-card-text>
        </v-card>
      </v-hover>
    </v-col>
    <v-dialog
      v-model="loading"
      hide-overlay
      persistent
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          Please stand by
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0 mt-5"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="fetchingResources"
      hide-overlay
      persistent
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          <div>
            Logged in
          </div>
          Fetching Resources
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0 mt-5"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      persistent
      v-model="errorDialog"
      max-width="400"
    >
      <v-card>
        <v-toolbar
          color="red darken-3"
          dark
        >
          Error
        </v-toolbar>
        <v-card-text class="mt-5">
          Credentials Donot match to our record on database.
        </v-card-text>
        <v-card-actions>
          <v-btn
            @click="errorDialog = false"
            text
            color="primary"
          >
            Close
          </v-btn>
          <v-spacer />
          <v-btn
            @click="validate()"
            text
            color="red"
            :disabled="loading"
          >
            Retry
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      persistent
      v-model="inactiveErrorDialog"
      max-width="60vw"
    >
      <v-card>
        <v-toolbar
          color="red darken-3"
          dark
        >
          Error
        </v-toolbar>
        <v-card-text class="mt-5">
          This user is not active according to our records.
          Contact the administrative department.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            @click="pushHome()"
            text
            color="primary"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>

import store from '../store';

export default {
  data: () => ({
    fetchingResources: false,
    valid: true,
    name: "login-page",
    password: "",
    passwordRules: [(v) => !!v || "Password is required"],
    username: "",
    usernameRules: [
      (v) => !!v || "Username is required",
      // (v) => /.+@.+\..+/.test(v) || "Username must be valid",
    ],
    show1: false,
    checkbox: false,
    loading: false,
    errorDialog: false,
  }),

  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        setTimeout(this.login, 1000)
      }
    },
    login(){
      if (this.checkbox) {
        const save = true
        store
          .commit('saveTokenOrNot', { status: save })
      } else {
        const save = false
        store
          .commit('saveTokenOrNot', { status: save })
      }
      
      store
        .dispatch('login', {
            username: this.username,
            password: this.password
          })
        .then(() => {
          this.loading = false
          if(!store.state.userInactive) {
            this.fetchingResources = true
            if(store.state.authStatus === 'success') {
              store
                .dispatch('fetchToken',{
                username: this.username,
                password: this.password
              })
                .then(() => {
                  this.fetchingResources = false
                  this.$router.push('/home')
                })
                .catch(() => {
                  this.fetchingResources = false
                })
            }
          }
        })
        .catch(() => {
          this.loading = false
          this.errorDialog = true
          this.isError = true
        })
    },
    pushHome () {
      this.$router.push('/about')
    },
  },
  mounted () {
    this.isError = false
    this.loading = false
    this.fetchingResources = false
    console.log('login page mounted')
    console.log(store);
  },
};
</script>
