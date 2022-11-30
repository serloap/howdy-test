<template>
  <div>
    <h1>Sprout Travel Challenge</h1>
    <FilterForm @set-filtered-trips="setFilteredTrips" />
    <TripList :trips="filteredTrips.value" :isDirty="isDirty" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, ref,
} from 'vue';
import { useStore } from 'vuex';
import {
  Trip,
} from '@/types';
import TripList from '@/components/TripList.vue';
import FilterForm from '@/components/FilterForm.vue';

export default defineComponent({
  name: 'HomeView',
  components: {
    TripList,
    FilterForm,
  },
  setup() {
    const store = useStore();

    store.dispatch('fetchExampleApiData');

    const filteredTrips = reactive({
      value: new Array<Trip>(),
    });

    const isDirty = ref(false);

    const setFilteredTrips = (_filteredTrips: Trip[], setIsDirty = true) => {
      if (setIsDirty) {
        isDirty.value = true;
      }

      filteredTrips.value = _filteredTrips;
    };

    return {
      isDirty,
      filteredTrips,
      setFilteredTrips,
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h1 {
  font-size: 24px !important;
}
</style>
