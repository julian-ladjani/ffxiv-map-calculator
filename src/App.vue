<template>
  <v-app>

    <v-main>
        <navigation :title='title' @changePage="page => this.currentPage = page"/>
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

  data: () => ({
    console: console,
    currentPage: "MapPage"
  }),
  computed: {
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
