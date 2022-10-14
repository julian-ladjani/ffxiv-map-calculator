<template>
  <v-dialog v-model="displayed" scrollable height="100%" width="100%" v-on:click:outside='close()'>
    <v-card>
      <v-card-title>
        <span class="text-h5">Ajout d'un item</span>
      </v-card-title>
      <v-card-text>
        <v-container fluid>
          <v-row>
            <v-text-field
                label="Rechercher un d'item"
                required
                variant="solo"
                bg-color="background"
                append-inner-icon="mdi-magnify"
                ref="query"
                :loading="loading"
                single-line
                v-model="query"
            />
          </v-row>
          <v-list>
            <v-list-item
                v-for="item in itemsData"
                :key="item.id"
                :value="item"
                active-color="primary"
                v-on:click="addItem(item)"
                avatar
            >
              <template v-slot:prepend>
                <v-avatar :image="item.icon"></v-avatar>
              </template>
              <v-list-item-title v-text='item.name +" "+"(id = "+item.id+")"'></v-list-item-title>
            </v-list-item>
          </v-list>
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
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import logo from '../assets/logo.svg'
import store from "../store/index.js";
import Item from "../models/Item.js"

export default {
  name: 'ItemSearchModal',
  created() {
    this.search("")
  },
  emits: ["closeItemModal"],
  props: {
    displayed: Boolean,
    id: String
  },
  data: () => ({
    console: console,
    query: "",
    loading: false,
    itemsData: []
  }),
  methods: {
    close() {
      this.query = ""
      this.$emit("closeItemModal")
    },
    addItem(item) {
      this.query = ""
      store.dispatch("addItem", item)
      this.$emit("closeItemModal")
    },
    search(query) {
      this.loading = true
      store.dispatch("searchItem", query).then(items => {
            this.itemsData = items
            this.loading = false
          }
      )
    }
  },
  watch: {
    query: function (query) {
      this.search(query)
    },
  }
}
</script>
