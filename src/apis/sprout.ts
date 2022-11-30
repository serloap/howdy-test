import { ExampleApiResponse } from '@/types';
import Axios from 'axios';
// IMPORTANT: To be used when the API fails with 429 because it's from a free account with a max # of requests per day.
import EXAMPLE_DATA from '@/assets/example-data.json';

const SPROUT_EXAMPLE_URL = 'https://sprout-backend-example.free.beeceptor.com/sprout/example';

export const getFlights = async () => {
  try {
    return EXAMPLE_DATA;

    // Using axios because I like how it works, however using fetch would be easy too.
    const { data } = await Axios.get<ExampleApiResponse>(SPROUT_EXAMPLE_URL);

    return data;
  } catch (err) {
    console.log('Error getting Sprout example api: ', err); // eslint-disable-line no-console

    return EXAMPLE_DATA;
  }
};
