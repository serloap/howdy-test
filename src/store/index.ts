import { createStore } from 'vuex';
import {
  Carriers, FlightOption, Airports, ExampleApiResponse,
} from '@/types';
import { getFlights } from '@/apis/sprout';

export const MUTATION_TYPES = {
  SET_AIRPORTS: 'SET_AIRPORTS',
  SET_CARRIERS: 'SET_CARRIERS',
  SET_FLIGHTS: 'SET_FLIGHTS',
};

interface IState {
  airports: Airports,
  carriers: Carriers,
  flights: FlightOption[],
}

export default createStore<IState>({
  state: {
    airports: {},
    carriers: {},
    flights: [],
  },
  getters: {
  },
  mutations: {
    [MUTATION_TYPES.SET_AIRPORTS](state, { airports }) {
      state.airports = airports;
    },
    [MUTATION_TYPES.SET_CARRIERS](state, { carriers }) {
      state.carriers = carriers;
    },
    [MUTATION_TYPES.SET_FLIGHTS](state, { flights }) {
      state.flights = flights;
    },
  },
  actions: {
    fetchExampleApiData({ commit }) {
      getFlights().then((response: ExampleApiResponse) => {
        const { carriers, options: flights } = response;

        const places = flights
          .map(({ journeys }) => journeys
            .map(({ segments }) => segments
              // Assume that there is no destination place that cannot be an origin.
              .map(({ originPlace }) => originPlace)))
          .flat(2); // Merge subarrays into a single array.

        const airports: Airports = Object.assign({}, ...places.map((place) => ({
          [place.code]: place, // Use airport code as key.
        })));

        commit({
          type: MUTATION_TYPES.SET_AIRPORTS,
          airports,
        });

        commit({
          type: MUTATION_TYPES.SET_CARRIERS,
          carriers,
        });

        commit({
          type: MUTATION_TYPES.SET_FLIGHTS,
          flights,
        });
      }).catch((err) => { console.log(err); });
    },
  },
  modules: {
  },
});
