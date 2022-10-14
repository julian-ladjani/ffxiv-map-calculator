<template>
  <v-container fluid>
    <div class="fill-height">
      <v-btn
          block
          prepend-icon="mdi-plus"
          color="primary"
          v-on:click='openModal("")'
      >
        Ajouter une carte
      </v-btn>
    </div>
    <v-table>
      <thead>
      <tr>
        <th class="text-left">
          Nom
        </th>
        <th class="text-left">
          Nombre d'items
        </th>
        <th class="text-left">
          Nombre de joueurs
        </th>
        <th class="text-button"></th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="map in maps"
          :key="map.id"
      >
        <td v-on:click="openModal(map.id)">{{ map.name }}</td>
        <td v-on:click="openModal(map.id)">{{ countItems(map.items) }}</td>
        <td v-on:click="openModal(map.id)">{{ map.users.length }}</td>
        <td><v-btn icon="mdi-close" variant="plain" color="error" v-on:click="removeMap(map.id)"/></td>
      </tr>
      </tbody>
    </v-table>
    <MapModal :id="modalUserId" :displayed="modalDisplayed"
               @closeMapModal='modalDisplayed = false'
    ></MapModal>
  </v-container>
</template>

<script>
import MapModal from "../components/MapModal.vue";
import store from "../store/index.js";

export default {
  name: 'MapPage',
  components: {MapModal},
  created() {
    //store.dispatch("searchItem", "test").then(console.log)
  },
  data: () => ({
    console: console,
    modalUserId: "",
    modalDisplayed: false
  }),
  methods: {
    openModal(id) {
      this.modalUserId = id
      this.modalDisplayed = true
    },
    countItems(items) {
      function add(accumulator, a) {
        return accumulator + a;
      }
      return items.map(item => item.count).reduce(add, 0)
    },
    removeMap(id) {
      store.dispatch("removeMap", id)
    }
  },
  computed: {
    maps() { return this.$store.state.maps }
  },
}
</script>
