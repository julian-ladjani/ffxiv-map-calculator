<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <span class="text-h5">Paramètres généraux</span>
      </v-card-title>
      <v-card-text>
        <v-select
            label="Langue"
            :items="['fr', 'en', 'I like trains']"
            :model-value="settings.language"
            @update:modelValue="onLanguageChanged($event)"
        ></v-select>
        <v-select
            label="Type de recherche d'item"
            :items="['wildcard', 'wildcard_plus', 'fuzzy', 'term', 'prefix', 'match', 'match_phrase', 'match_phrase_prefix', 'multi_match', 'query_string']"
            :model-value="settings.searchType"
            @update:modelValue="onSearchTypeChanged($event)"
        ></v-select>
        <span class="text-caption">En savoir plus sur: https://xivapi.com/docs/Search#search</span>
      </v-card-text>
    </v-card>
    <v-spacer style="height: 16px"/>
    <v-card>
      <v-card-title>
        <span class="text-h5">Paramètres de calculs</span>
      </v-card-title>
      <v-card-text>
        <v-text-field
            label="Taxes"
            prefix="%"
            type="number"
            required
            ref="tax"
            :model-value="settings.tax"
            @update:modelValue="onTaxChanged($event)"
        />
        <v-select
            label="Chiffres après la virgule (arrondis)"
            :items="[0, 1, 2 , 3]"
            :model-value="settings.precision"
            @update:modelValue="onPrecisionChanged($event)"
        ></v-select>
        <v-checkbox
            hide-details
            label="Doit payer les taxes si les gains (items) ne sont pas suffisant"
            :model-value="settings.payTaxIfItemGainIsNotEnough"
            @update:modelValue="onPayTaxIfItemGainIsNotEnoughChanged($event)"
        ></v-checkbox>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import ItemSearchModal from "../components/ItemSearchModal.vue";
import store from "../store/index.js";

export default {
  name: 'SettingPage',
  components: {
    ItemSearchModal
  },
  created() {
    //store.dispatch("searchItem", "test").then(console.log)
  },
  data: () => ({
    console: console,
    modalDisplayed: false
  }),
  methods: {
    onLanguageChanged(language) {
      if (language === 'en')
        window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
      if (language === 'I like trains')
        window.open("https://www.youtube.com/watch?v=hHkKJfcBXcw")
    },
    onPrecisionChanged(precision) {
      store.dispatch("setPrecision", precision)
    },
    onSearchTypeChanged(searchType) {
      store.dispatch("setSearchType", searchType)
    },
    onTaxChanged(tax) {
      if (isNaN(tax) || tax.length > 0 || tax < 0) {
        tax = 0
      } else {
        tax = parseInt(tax)
      }
      if (tax > 100)
        tax = 100
      store.dispatch("setTax", tax)
    },
    onPayTaxIfItemGainIsNotEnoughChanged(value) {
      store.dispatch("setPayTaxIfItemGainIsNotEnough", value === true)
    },
  },
  computed: {
    settings() {
      return this.$store.state.settings
    },
  }
}
</script>
