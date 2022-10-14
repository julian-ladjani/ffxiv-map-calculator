<template>
  <v-dialog v-model="displayed" scrollable width="100%" height="100%" v-on:click:outside='close()'>
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ modalTitle }}</span>
      </v-card-title>
      <v-card-text>
        <v-container fluid>
          <v-row>
            <v-col cols="12">
              <h4 style="padding-bottom: 8px">Paramètres généraux de la carte</h4>
            </v-col>
          </v-row>
          <v-row>
            <v-text-field
                label="Nom*"
                required
                ref="name"
                v-model="currentMap.name"
            />
          </v-row>
          <v-row>
            <v-text-field
                label="Gain par utilisateur"
                prefix="Gils"
                type="number"
                ref="singleUserProfit"
                v-model="currentMap.singleUserProfit"
            />
          </v-row>
          <v-row>
            <v-select
                label="Niveau"
                :items="[50, 60, 70, 80, 90]"
                ref="level"
                v-model="currentMap.level"
            ></v-select>
          </v-row>
          <v-row>
            <v-checkbox
                label="Inclure dans les calculs"
                ref="active"
                v-model="currentMap.includeInCalculation"
            />
          </v-row>
          <v-row>
            <v-col cols="12">
              <h4 style="padding-bottom: 8px">Attributs</h4>
            </v-col>
          </v-row>
          <v-row items="center">
            <v-col cols="12">
              <v-tabs
                  fixed-tabs
                  background-color="indigo-darken-2"
                  v-model="tab"
              >
                <v-tab value="players">Joueurs</v-tab>
                <v-tab value="items">Items</v-tab>
              </v-tabs>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-spacer height="16px"></v-spacer>
            </v-col>
          </v-row>
          <v-row v-if='tab === "players"'>
            <v-card variant="tonal" width="100%" height="100%">
              <v-card-text>
                <div class="fill-height">
                  <v-btn
                      block
                      prepend-icon="mdi-plus"
                      color="primary"
                      v-on:click='openUserModal("")'
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
                    <th class="text-left">Présent</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr
                      v-for="user in users"
                      :key="user.id"
                  >
                    <td v-on:click="openUserModal(user.id)">{{ user.name }}</td>
                    <td>
                      <v-checkbox
                          hide-details
                          v-model="currentMap.users"
                          :value="user.id"
                      ></v-checkbox>
                    </td>
                  </tr>
                  </tbody>
                </v-table>
                <UserModal :id="userModalUserId" :displayed="userModalDisplayed"
                           @closeUserModal='userModalDisplayed = false'
                ></UserModal>
              </v-card-text>
            </v-card>
          </v-row>
          <v-row v-if='tab === "items"'>
            <v-card variant="tonal" width="100%" height="100%">
              <v-card-text>
                <div class="fill-height">
                  <v-btn
                      block
                      prepend-icon="mdi-plus"
                      color="primary"
                      v-on:click='openItemModal("")'
                  >
                    Ajouter un item
                  </v-btn>
                </div>
                <v-table>
                  <thead>
                  <tr>
                    <th class="text-button"></th>
                    <th class="text-left">
                      ID
                    </th>
                    <th class="text-left">
                      Nom
                    </th>
                    <th class="text-left">
                      Nombre
                    </th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr
                      v-for="item in items"
                      :key="item.id"
                  >
                    <td>
                      <v-avatar :image="item.icon"></v-avatar>
                    </td>
                    <td>{{ item.id }}</td>
                    <td>{{ item.name }}</td>
                    <td>
                      <v-text-field
                          type="number"
                          hide-details
                          single-line
                          :ref="'item-count-' + item.id"
                          variant="solo"
                          density="compact"
                          :model-value="this.mapItems.find(mapItem => mapItem.id === item.id)?.count ?? 0"
                          @update:modelValue="setItemCount(item.id, $event)"
                      />
                    </td>
                  </tr>
                  </tbody>
                </v-table>
                <ItemSearchModal :displayed="itemSearchModalDisplayed"
                                 @closeItemModal='itemSearchModalDisplayed = false'></ItemSearchModal>
              </v-card-text>
            </v-card>
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
          Sauvegarder
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import logo from '../assets/logo.svg'
import store from "../store/index.js";
import Map from "../models/Map.js";
import dayjs from 'dayjs';
import 'dayjs/locale/fr'
import UserModal from "./UserModal.vue";
import ItemSearchModal from "./ItemSearchModal.vue";
import MapItem from "../models/MapItem.js";

export default {
  name: 'MapModal',
  components: {UserModal, ItemSearchModal},
  created() {
    //dayjs.updateLocale('fr')
    dayjs.locale('fr')
  },
  destroyed() {
    this.$emit("closeMapModal")
  },
  emits: ["closeMapModal"],
  props: {
    displayed: Boolean,
    id: String
  },
  data: () => ({
    // User modal
    userModalUserId: "",
    userModalDisplayed: false,
    // Item search modal
    itemSearchModalDisplayed: false,
    // Current modal
    tab: null,
    console: console,
    currentId: String,
    currentMap: null,
  }),
  computed: {
    modalTitle() {
      if (this.currentId.length > 0)
        return "Modifier la carte"
      else
        return "Ajouter une carte"
    },
    items() {
      return this.$store.state.items
    },
    mapItems() {
      return this.items.map(item => {
        let mapItem = this.currentMap.items.find(itemInMap => itemInMap.id === item.id)
        if (mapItem !== undefined)
          return mapItem
        return new MapItem(item.id, 0)
      })
    },
    users() {
      return this.$store.state.users
    }
  },
  methods: {
    openUserModal(id) {
      this.userModalUserId = id
      this.userModalDisplayed = true
    },
    openItemModal(id) {
      this.itemSearchModalDisplayed = true
    },
    setItemCount(id, count) {
      if (isNaN(count) || count.length > 0 || count < 0) {
        count = 0
      } else {
        count = parseInt(count)
      }
      let mapItems = this.currentMap.items.filter(item => item.id !== id)
      mapItems.push(new MapItem(id, count))
      this.currentMap.items = mapItems
    },
    /*setUserIsInMap(id, member) {
      if (member === true) {
        if (this.currentMap.users.some(user => user === id))
          this.currentMap.users = this.currentMap.users + [id]
      } else {
        this.currentMap.users = this.currentMap.users.filter(user => user === id)
      }
    },*/
    close() {
      this.$emit("closeMapModal")
    },
    save() {
      if (this.currentMap === null || this.currentMap === undefined)
        return
      store.dispatch("setMap", this.currentMap)
      this.$emit("closeMapModal")
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
        let map = undefined
        if (id.length >= 0) {
          map = store.getters.getMap(id)
        }
        if (map === undefined) {
          map = new Map("Carte du " + dayjs(new Date()).format("DD MMMM YYYY à HH:mm"))
        }
        this.currentMap = map
      }
    }
  }
}
</script>
