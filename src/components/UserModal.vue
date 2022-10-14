<template>
  <v-dialog v-model="displayed" max-width="50%" v-on:click:outside='close()'>
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ title }}</span>
      </v-card-title>
      <v-card-text>
        <v-container fluid>
          <v-row>
            <v-text-field
                label="Nom*"
                required
                ref="currentName"
                v-model="currentName"
            />
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="blue-darken-1"
            text
            @click="close()"
        >
          Fermer
        </v-btn>
        <v-btn
            color="blue-darken-1"
            text
            @click="save()"
        >
          Enregistrer
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import logo from '../assets/logo.svg'
import store from "../store/index.js";

export default {
  name: 'UserModal',
  created() {
    //store.dispatch("searchItem", "test").then(console.log)
  },
  destroyed() {
    this.$emit("closeUserModal")
  },
  emits: ["closeUserModal"],
  props: {
    displayed: Boolean,
    id: String
  },
  data: () => ({
    console: console,
    currentId: String,
    currentName: ""
  }),
  computed: {
    title() {
      if (this.currentId.length > 0)
        return "Modifier le joueur"
      else
        return "Ajouter un joueur"
    }
  },
  methods: {
    close() {
      this.$emit("closeUserModal")
    },
    save() {
      let currentId = this.currentId
      let currentName = this.currentName
      if (currentName.length === 0)
        return
      store.dispatch("setUser", {id: currentId, name: currentName})
      this.$emit("closeUserModal")
    }
  },
  watch: {
    displayed: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal === false)
          return
        let id = this.id
        if (id === undefined)
          return
        this.currentId = id
        if (id.length >= 0) {
          let user = store.getters.getUser(id)
          this.currentName = user === undefined ? "" : user.name
        }
      }
    }
  }
}
</script>
