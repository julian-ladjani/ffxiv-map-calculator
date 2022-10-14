<template>
  <v-container fluid>
    <div class="fill-height">
      <v-btn
          block
          prepend-icon="mdi-plus"
          color="primary"
          v-on:click='openModal("")'
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
          Prix
        </th>
        <th class="text-button"></th>
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
              prefix="Gils"
              type="number"
              hide-details
              single-line
              variant="solo"
              density="compact"
              :model-value="item.price"
              @update:modelValue="setItemPrice(item.id, $event)"
          />
        </td>
        <td>
          <v-btn icon="mdi-close" variant="plain" color="error" v-on:click="removeItem(item.id)"/>
        </td>
      </tr>
      </tbody>
    </v-table>
    <ItemSearchModal :displayed="modalDisplayed" @closeItemModal='modalDisplayed = false'></ItemSearchModal>
  </v-container>
</template>

<script>
import ItemSearchModal from "../components/ItemSearchModal.vue";
import store from "../store/index.js";

export default {
  name: 'ItemPage',
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
    openModal(id) {
      this.modalDisplayed = true
    },
    removeItem(id) {
      store.dispatch("removeItem", id)
    },
    setItemPrice(id, price) {
      let fixedPrice = price
      if (isNaN(price) || price.length > 0 || price < 0) {
        fixedPrice = 0
      } else {
        fixedPrice = parseInt(price)
      }
      store.dispatch("setItemPrice", { id: id, price: fixedPrice })
    }
  },
  computed: {
    items() {
      return this.$store.state.items
    },
  }
}
</script>
