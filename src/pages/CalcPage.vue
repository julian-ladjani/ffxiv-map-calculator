<template>
  <v-container fluid>
    <v-row items="center">
      <v-col cols="12">
        <v-tabs
            fixed-tabs
            background-color="indigo-darken-2"
            v-model="tab"
        >
          <v-tab value="players">Joueurs</v-tab>
          <v-tab value="maps">Cartes</v-tab>
          <!--<v-tab value="global">Global</v-tab>-->
        </v-tabs>
      </v-col>
    </v-row>
    <div v-for="user in Object.values(calc.users)" v-if="tab === 'players'" style="width: 100%">
      <v-row>
        <v-col>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ user.name }}</span>
            </v-card-title>
            <v-card-text>
              <span class="text-body-1" v-if="Object.values(user.maps).length <= 0">Ce joueur n'était pas présent pendant cette session</span>
              <v-table v-else>
                <thead>
                <tr>
                  <th class="text-left">
                    Nom ({{ Object.values(user.maps).length }} carte(s))
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
                    Gain (réel)
                  </th>
                  <th class="text-left">
                    A donner
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr
                    v-for="map in user.maps"
                    :key="map.id"
                >
                  <td>{{ map.name }}</td>
                  <td>{{ map.totalItemGain }} gils</td>
                  <td>{{ map.totalGilsGain }} gils</td>
                  <td>{{ map.totalGain }} gils</td>
                  <td>{{ map.totalTax }} gils</td>
                  <td>{{ map.totalGain - map.totalTax }} gils</td>
                  <td>{{ map.needToGive }} gils</td>
                </tr>
                <tr>
                  <td>Total</td>
                  <td>{{ user.totalItemGain }} gils</td>
                  <td>{{ user.totalGilsGain }} gils</td>
                  <td>{{ user.totalGain }} gils</td>
                  <td>{{ user.totalTax }} gils</td>
                  <td>{{ user.totalGain - user.totalTax }} gils</td>
                  <td>{{ user.needToGive }} gils</td>
                </tr>
                </tbody>
              </v-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-spacer style="height: 8px"/>
    </div>
    <div v-for="map in Object.values(calc.maps)" v-if="tab === 'maps'" style="width: 100%">
      <v-row>
        <v-col>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ map.name }}</span>
            </v-card-title>
            <v-card-text>
              <v-table>
                <thead>
                <tr>
                  <th class="text-left">
                    #
                  </th>
                  <th class="text-left">
                    Nombre d'items
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
                    Gain (réel)
                  </th>
                  <th class="text-left">
                    A donner
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>{{ map.nbPlayer }} joueur(s)</td>
                  <td>{{ map.nbItems }} item(s)</td>
                  <td>{{ map.totalItemGain }} gils</td>
                  <td>{{ map.totalGilsGain }} gils</td>
                  <td>{{ map.totalGain }} gils</td>
                  <td>{{ map.totalTax }} gils</td>
                  <td>{{ map.totalGain - map.totalTax }} gils</td>
                  <td>{{ map.needToGive }} gils</td>
                </tr>
                <tr>
                  <td>Par joueur</td>
                  <td>{{ map.nbPlayer <= 0 ? 0 : parseFloat((map.nbItems / map.nbPlayer).toFixed(precision)) }} item(s)</td>
                  <td>{{ map.itemGainPerUser }} gils</td>
                  <td>{{ map.gilsGainPerUser }} gils</td>
                  <td>{{ map.totalGainPerUser }} gils</td>
                  <td>{{ map.totalTaxPerUser }} gils</td>
                  <td>{{ map.totalGainPerUser - map.totalTaxPerUser }} gils</td>
                  <td>{{ map.needToGivePerUser }} gils</td>
                </tr>
                </tbody>
              </v-table>
              <span class="text-body-1" v-if="map.nbPlayer > 0">Joueurs: {{ map.users.map(user => user.name).join(', ') }}</span>
              <span class="text-body-1" v-else>Il n'y a aucun joueur sur cette carte</span>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-spacer style="height: 8px"/>
    </div>
  </v-container>
</template>

<script>
import store from "../store/index.js";

export default {
  name: 'CalcPage',
  components: {},
  created() {
    //store.dispatch("searchItem", "test").then(console.log)
  },
  data: () => ({
    console: console,
    tab: null,
  }),
  methods: {
    onLanguageChange(language) {
      if (language === 'en')
        window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
      if (language === 'I like trains')
        window.open("https://www.youtube.com/watch?v=hHkKJfcBXcw")
    }
  },
  computed: {
    calc() {
      return this.$store.getters.getGainJson
    },
    tax() {
      return this.$store.state.settings.tax
    },
    precision() {
      return this.$store.state.settings.precision
    },
  }
}
</script>
