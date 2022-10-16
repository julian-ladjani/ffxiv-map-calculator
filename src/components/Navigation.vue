<template>

  <v-app-bar prominent>
    <!--<v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>-->
    <v-toolbar-title>FFIV Calculateur de carte</v-toolbar-title>
    <v-toolbar-title>{{ title }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon v-on:click="toggleTheme()">
      <v-icon>mdi-theme-light-dark</v-icon>
    </v-btn>
  </v-app-bar>
  <v-navigation-drawer
          permanent
      >
        <v-list color="transparent">
          <v-list-item prepend-icon="mdi-map" title="Cartes" v-on:click='changePage("MapPage")'></v-list-item>
          <v-list-item prepend-icon="mdi-account-box" title="Joueurs" v-on:click='changePage("UserPage")'></v-list-item>
          <v-list-item prepend-icon="mdi-bag-personal" title="Items" v-on:click='changePage("ItemPage")'></v-list-item>
          <v-list-item prepend-icon="mdi-coffee" title="Calculs" v-on:click='changePage("CalcPage")'></v-list-item>
          <v-list-item prepend-icon="mdi-cogs" title="Paramètres" v-on:click='changePage("SettingPage")'></v-list-item>
        </v-list>

        <template v-slot:append>
          <div class="pa-2">
            <span v-on:click="store.dispatch('openUrl', 'https://github.com/julian-ladjani/ffxiv-map-calculator')" >Version {{ version }}.</span>
          </div>
        </template>
      </v-navigation-drawer>
</template>

<script>
import logo from '../assets/logo.svg'
import store from "../store/index.js";
import { useTheme } from 'vuetify'
import packageJson from "../../package.json"

let currentTheme;
export default {
  name: 'Navigation',
  emits: ["changePage"],
  created() {
    //store.dispatch("searchItem", "test").then(console.log)
  },
  setup() {
    currentTheme = useTheme()
  },
  props: {
    title: String
  },
  data: () => ({
    version: packageJson.version,
    store: store,
    console: console,
    currentTheme,
  }),
  methods: {
    changePage(page) {
      this.$emit('changePage', page)
    },
    toggleTheme() {
      let theme = currentTheme.global.current.value.dark ? 'light' : 'dark'
      currentTheme.global.name.value = theme
      store.dispatch("setTheme", theme)
    }
  }
}
</script>
