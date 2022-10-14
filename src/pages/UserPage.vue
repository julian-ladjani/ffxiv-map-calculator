<template>
  <v-container fluid>
    <div class="fill-height">
      <v-btn
          block
          prepend-icon="mdi-plus"
          color="primary"
          v-on:click='openModal("")'
      >
        Ajouter un joueur
      </v-btn>
    </div>
    <v-table>
      <thead>
      <tr>
        <th class="text-left">
          Nom
        </th>
        <th class="text-left">
          Gain (items)
        </th>
        <th class="text-left">
          Gain (gils)
        </th>
        <th class="text-left">
          Gain (total)
        </th>
        <th class="text-left">
          Taxe ({{ tax }}%)
        </th>
        <th class="text-left">
          A donner
        </th>
        <th class="text-left">
          Cartes
        </th>
        <th class="text-button"></th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="user in users"
          :key="user.id"
      >
        <td v-on:click="openModal(user.id)">{{ user.name }}</td>
        <td v-on:click="openModal(user.id)">{{ calc.users[user.id].totalItemGain }} gils</td>
        <td v-on:click="openModal(user.id)">{{ calc.users[user.id].totalGilsGain }} gils</td>
        <td v-on:click="openModal(user.id)">{{ calc.users[user.id].totalGain }} gils</td>
        <td v-on:click="openModal(user.id)">{{ calc.users[user.id].totalTax }} gils</td>
        <td v-on:click="openModal(user.id)">{{ calc.users[user.id].needToGive }} gils</td>
        <td v-on:click="openModal(user.id)">{{ mapsCount.find(count => count.userId === user.id)?.mapCount ?? 0 }}</td>
        <td>
          <v-btn icon="mdi-close" variant="plain" color="error" v-on:click="removeUser(user.id)"/>
        </td>
      </tr>
      </tbody>
    </v-table>
    <UserModal :id="modalUserId" :displayed="modalDisplayed"
               @closeUserModal='modalDisplayed = false'
    ></UserModal>
  </v-container>
</template>

<script>
import UserModal from "../components/UserModal.vue";
import store from "../store/index.js";

export default {
  name: 'UserPage',
  components: {UserModal},
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
    removeUser(id) {
      store.dispatch("removeUser", id)
    }
  },
  computed: {
    users() {
      return this.$store.state.users
    },
    mapsCount() {
      return this.users.map(user => {
        return {
          userId: user.id,
          mapCount: this.$store.state.maps.filter(map => map.users.find(mapUser => mapUser === user.id) !== undefined).length ?? 0
        }
      })
    },
    calc() {
      return this.$store.getters.getGainJson
    },
    tax() {
      return this.$store.state.settings.tax
    }
  },
}
</script>
