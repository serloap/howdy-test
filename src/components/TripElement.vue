<template>
  <li class="trip">
    <div class="trip__image">
      <CarrierLogo :name="carrierName" :code="carrierCode" />
    </div>
    <div class="trip__description">
      <div class="trip__origin">
        <div class="trip__airport">
          {{firstFlight?.originPlace.code}}
        </div>
        <div class="trip__date">
          {{getFormattedDate(firstFlight?.departureDateTime)}}
        </div>
      </div>
      <div class="trip__airline-and-stopovers">
        <div>
          {{carrierName}}
        </div>
        <div class="trip__horizontal-line"></div>
        <div>
          {{tripDuration}} - <span :class="{ 'text-danger': stops > 0 }">{{stopsDescription}}</span>
        </div>
      </div>
      <div class="trip__destination">
        <div class="trip__airport">
          {{lastFlight?.destinationPlace.code}}
        </div>
        <div class="trip__date">
          {{getFormattedDate(lastFlight?.arrivalDateTime)}}
        </div>
      </div>
    </div>
  </li>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { useStore } from 'vuex';
import {
  Trip,
} from '@/types';
import { getFormattedDate, getFormattedDuration } from '../utils';
import CarrierLogo from './CarrierLogo.vue';

export default defineComponent({
  name: 'TripElement',
  props: {
    trip: {
      type: Object as PropType<Trip>,
      required: true,
    },
  },
  components: {
    CarrierLogo,
  },
  setup(props) {
    const store = useStore();

    const firstFlight = computed(() => props.trip.segments[0]);

    const lastFlight = computed(() => props.trip.segments[props.trip.segments.length - 1]);

    const carrierCode = computed(() => firstFlight.value?.marketingAirline || '');

    const carrierName = computed(() => store.state.carriers[carrierCode.value]);

    const stops = computed(() => props.trip.segments.length - 1);

    const stopsDescription = computed(() => {
      if (stops.value === 0) {
        return 'nonstop';
      }

      return `${stops.value} stops`;
    });

    const tripDuration = computed(() => {
      const startDate = new Date(firstFlight.value?.departureDateTime);
      const endDate = new Date(lastFlight.value?.arrivalDateTime);

      return getFormattedDuration(endDate, startDate);
    });

    return {
      firstFlight,
      lastFlight,
      carrierCode,
      carrierName,
      stops,
      stopsDescription,
      tripDuration,
      getFormattedDate,
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.trip {
  display: flex;
  align-items: center;
  height: 75px;
  background-color: white;
  border-radius: 10px;
  padding-left: 15px;
  padding-right: 15px;
  margin: 10px;

  font-size: 13px;

  &__image {
    width: 40px;
    height: 40px;
    margin-right: 40px;
    border-radius: 5px;
  }

  &__description {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-grow: 1;
    font-weight: 500;
    color: #4c4c4c;
  }

  &__destination {
    text-align: right;
  }

  &__airport {
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 5px;
    color: black;
  }

  &__airline-and-stopovers {
    text-align: center;
  }

  &__horizontal-line {
    width: 170px;
    height: 4px;
    background-color: lightgray;
    border-radius: 2px;
  }
}
</style>
