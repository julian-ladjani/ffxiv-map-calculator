<template>
  <v-app>

    <v-main>
      <navigation :title='title' @changePage="page => this.currentPage = page"/>
      <v-banner v-if="version?.newVersion !== null && version?.newVersion?.name !== version?.currentVersion" icon="mdi-update">
        <span class="text-h6">Une mise à jour est disponible</span>
        <v-banner-text>
          Votre programme n'est plus à jour (v{{ version.currentVersion }}). <br/>
          Cliquez sur le bouton "Mettre à jour" pour le mettre à jour vers la version: v{{ version.newVersion.name }}.<br/>
        </v-banner-text>
        <v-banner-actions>
          <v-btn v-on:click="openUrl(version.newVersion.html_url)">Mettre à jour</v-btn>
        </v-banner-actions>
      </v-banner>
      <MapPage v-if='currentPage === "MapPage"'/>
      <UserPage v-if='currentPage === "UserPage"'/>
      <ItemPage v-if='currentPage === "ItemPage"'/>
      <SettingPage v-if='currentPage === "SettingPage"'/>
      <CalcPage v-if='currentPage === "CalcPage"'/>
    </v-main>
  </v-app>
</template>

<script>
import MapPage from './pages/MapPage.vue'
import Navigation from './components/Navigation.vue'
import UserPage from './pages/UserPage.vue'
import ItemPage from "./pages/ItemPage.vue";
import SettingPage from "./pages/SettingPage.vue";
import CalcPage from "./pages/CalcPage.vue";
import store from "./store/index.js";

export default {
  name: 'App',

  components: {
    CalcPage,
    SettingPage,
    Navigation,
    ItemPage,
    MapPage,
    UserPage,
  },

  created() {
    store.dispatch('getVersion').then(version => {
      this.version = version
    }).catch(error => {
      console.error(error)
    })
  },
  data:
      () => ({
        version: null,
        console: console,
        currentPage: "MapPage"
      }),
  methods: {
    openUrl(url) {
      store.dispatch('openUrl', { url: url, close: true })
    },
  },
  computed:
      {
        title() {
          if (this.currentPage === "MapPage") {
            return "Cartes"
          }
          if (this.currentPage === "UserPage") {
            return "Utilisateurs"
          }
          if (this.currentPage === "ItemPage") {
            return "Items"
          }
          if (this.currentPage === "SettingPage") {
            return "Paramètres"
          }
          if (this.currentPage === "CalcPage") {
            return "Calculs"
          }
        }
      }
}
</script>
