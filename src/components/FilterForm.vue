<template>
  <div class="filter-form">
    <div class="filter-form__airports">
      <div>
        <label class="form-label" for="origin">
          Origin
          <select class="form-select" id="origin" v-model="selectedOrigin">
            <option value="">Select an option...</option>
            <option v-for="airport in originAirports" :key="airport.code" :value="airport.code">
              {{airport.name}}
            </option>
          </select>
        </label>
      </div>
      <div>
        <label class="form-label" for="destination">
          Destination
          <select class="form-select" id="destination" v-model="selectedDestination">
            <option value="">Select an option...</option>
            <option v-for="airport in destinationAirports" :key="airport.code" :value="airport.code">
              {{airport.name}}
            </option>
          </select>
        </label>
      </div>
    </div>
    <div>
      <fieldset>
        <legend>Airlines</legend>
          <div class="form-check" v-for="[key, name] in Object.entries(carriers)" :key="key">
            <label class="form-check-label" :for="key">
              <input class="form-check-input" type="checkbox" name="newsletter" :id="key" :value="key" v-model="selectedCarriers.value" />
              {{name}}
            </label>
          </div>
        </fieldset>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, reactive, watchEffect, computed,
} from 'vue';
import {
  Trip, FlightOption, Carriers, Airports,
} from '@/types';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'FilterForm',
  emits: [
    'setFilteredTrips',
  ],
  setup(__, { emit }) {
    const store = useStore();

    const airports = computed<Airports>(() => store.state.airports);
    const carriers = computed<Carriers>(() => store.state.carriers);
    const flights = computed<FlightOption[]>(() => store.state.flights);

    const selectedOrigin = ref('');
    const selectedDestination = ref('');
    const selectedCarriers = reactive({
      value: new Array<string>(),
    });

    const originAirports = computed(() => Object.values(airports.value)
      .filter(({ code }) => (!selectedDestination.value ? true : code !== selectedDestination.value)));

    const destinationAirports = computed(() => Object.values(airports.value)
      .filter(({ code }) => (!selectedOrigin.value ? true : code !== selectedOrigin.value)));

    // Join journeys' segments to allow -longer- trips that cover part of one or more journeys.
    const joinedSegmentsPerFlight = computed(() => flights.value.map(({ journeys }) => journeys.map(({ segments }) => segments).flat()));

    watchEffect(() => {
      // Clear list when no origin or no destination is selected.
      if (!selectedOrigin.value || !selectedDestination.value) {
        emit('setFilteredTrips', [], false);

        return;
      }

      /**
       * Find segments from the flight options (merging its journeys) that allow a trip from the origin to the destination place
       * PS: [Array].forEach or [Array].map(etc => trip?).filter(value => value) could be another option...
       */
      const trips: Trip[] = joinedSegmentsPerFlight.value.reduce((_trips, segments) => {
        const originIndex = segments.findIndex(({ originPlace }) => originPlace.code === selectedOrigin.value);

        // No flight found that matches the selected origin, skip...
        if (originIndex === -1) {
          return _trips;
        }

        const destinationIndex = segments.findIndex(({ destinationPlace }) => destinationPlace.code === selectedDestination.value);

        // Ensure flight to destination is the same from origin or after some stopovers.
        if (destinationIndex === -1 || destinationIndex < originIndex) {
          return _trips;
        }

        const tripSegments = segments.slice(originIndex, destinationIndex + 1);

        // Filter by airline/carrier (all segments must match one of the selectedCarriers elements, if any)
        if (selectedCarriers.value.length) {
          const areAllSegmentsInSelectedCarriers = tripSegments
            .every(({ marketingAirline }) => selectedCarriers.value.includes(`${marketingAirline}`));

          if (!areAllSegmentsInSelectedCarriers) {
            return _trips;
          }
        }

        const trip = {
          segments: tripSegments,
        };

        // Add trip to list. [Array].push could be used too
        return [..._trips, trip];
      }, new Array<Trip>());

      emit('setFilteredTrips', trips);
    });

    return {
      carriers,
      originAirports,
      destinationAirports,
      selectedOrigin,
      selectedDestination,
      selectedCarriers,
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.filter-form {
  border: 1px solid lightgray;
  border-radius: 10px;
  padding: 15px;

  &__airports {
    display: flex;
    margin-bottom: 10px;

    div {
      flex-grow: 1;

      &:first-child {
        margin-right: 10px;
      }
    }

    label {
      width: 100%;
    }
  }

  legend {
    font-size: unset;
  }
}
</style>
