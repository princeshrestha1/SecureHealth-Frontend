<template>
  <div>
    <v-app-bar
      app
      dense
      color="primary lighten-1"
    >
      <v-toolbar
        dark
        color="primary lighten-1"
        width="100vw"
        flat
        dense
      >
        <v-toolbar-title to="/">
          Logo
        </v-toolbar-title>
        <v-spacer />
        <v-btn
          text
          title="Login"
          :disabled="login"
          to="/login"
        >
          <v-icon>
            mdi-account-key-outline
          </v-icon>
          <div>
            Login
          </div>
        </v-btn>
      </v-toolbar>
    </v-app-bar>
    <div style="margin-top: 100px; margin-bottom: 70px;">
      <transition
        name="fade"
        mode="out-in"
      >
        <router-view />
      </transition>
    </div>
    <v-footer
      padless
      absolute
    >
      <v-card
        color="primary"
        class="flex"
        text
        tile
      >
        <v-card-text class="py-2 text-center">
          @ {{ new Date().getFullYear() }} — <strong>Ayata Inc.</strong>
        </v-card-text>
      </v-card>
    </v-footer>
  </div>
</template>
<script>

export default {
  name: "AuthLayout",
  data() {
    return {
      year: new Date().getFullYear(),
      dialog: false,
      route: "",
      loading: true,
    };
  },
  beforeCreate () {
    setTimeout(() => { this.loading = false }, 2 * 1000)
    this.$router.beforeEach((to, from, next) => {
      this.loading = true
      next()
    })
    this.$router.afterEach(() => {
      setTimeout(() => { this.loading = false }, 2 * 1000)
    })
  },
  computed: {
    login() {
      let thisRoute = this.$route.name;
      return thisRoute == "login" ? true : false;
    },
  },
};
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.5s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>

