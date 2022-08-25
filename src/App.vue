<template>
  <v-app width="100vw">
    <div v-if="loading == false">
      <transition
        name="fade"
        mode="out-in"
      >
        <router-view />
      </transition>
    </div>
    <v-row
      v-else
      height="100%"
      align="center"
      justify="center"
      class="fill-height"
    >
      <spring-spinner
        :size="40"
        color="primary"
      />
    </v-row>
  </v-app>
</template>
<script>
import store from './store';

import { SpringSpinner } from 'epic-spinners'
export default {
  components: {
    SpringSpinner
  },

  data() {
    return {
      loading: true,
    }
  },

  mounted () {
    setTimeout(() => { this.loading = false }, 2 * 1000)

    this.$router.beforeEach((to, from, next) => {
      this.loading = true
      next()
    })

    this.$router.afterEach(() => {
      setTimeout(() => { this.loading = false }, 1 * 1000)
    })

    if(this.access != "Bearer null") {
      store
        .dispatch('verifyToken')
        .then(() => {
          const access = store.state.accessToken
          store
            .dispatch('getUserBasicDetails', { access })

          if(this.$route.name != "Home" && this.$route.name == "login") {
            this.$router.push('/home')
          }
        })
        .catch(() => {
          store.commit('setAllToDefault')
          this.$router.push('/login')
        })
    }
    else
      this.$router.push('/login')
  },
  computed: {
    access() {
      console.log(store.state.accessToken)
      return store.state.accessToken
    }
  }
}

</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition-duration: 3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>

