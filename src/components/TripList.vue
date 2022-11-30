<template>
  <div v-if="!isDirty && !trips.length" class="trip-list__message trip-list__message--disclaimer">
    Please change the filter options above...
    <br />
    <br />
    Disclaimer: The data structure returned by the endpoint only has full journeys from Austin to Atlanta and viceversa.
    That's why the data was transformed to allow trips from one or more segments of a full journey.
    Also joining of 2 or more journeys is being done to allow more origin-destination pairs.
    The total duration of the trips is calculated with the dates because the duration from segments and layovers is not consistent with the dates.
    <br />
    <br />
    PS: Some small unit tests can be tested running npm run test:unit
  </div>
  <div v-if="isDirty && !trips.length" class="trip-list__message trip-list__message--error text-danger">
    No flights found for the current search.
  </div>
  <div v-else-if="trips.length">
    <div class="trip-list__message">
      <b>{{trips.length}} flights found:</b>
    </div>
    <ul class="trip-list">
      <TripElement v-for="(trip, index) in trips" :key="index" :trip="trip" />
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import {
  Trip,
} from '@/types';
import TripElement from './TripElement.vue';

export default defineComponent({
  name: 'TripList',
  props: {
    isDirty: {
      type: Boolean,
      required: false,
    },
    trips: {
      type: Array as PropType<Array<Trip>>,
      required: true,
    },
  },
  components: {
    TripElement,
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.trip-list__message {
  margin-top: 20px;

  &--disclaimer {
    font-family: monospace;
  }

  &--error {
    text-align: center;
  }
}

.trip-list {
  background-color: #ededed;
  margin: 20px 0;
  padding: 10px 5px;
  border-radius: 15px;
}
</style>
