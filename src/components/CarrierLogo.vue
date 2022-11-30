<template>
  <img v-if="source" class="flight__image" :src="source" :alt="altText" :aria-label="altText" />
</template>

<script lang="ts">
/* eslint-disable global-require */
import { defineComponent, computed } from 'vue';

const SOURCES: { [key: string] : any } = { // eslint-disable-line @typescript-eslint/no-explicit-any
  AA: require('@/assets/AA.jpeg'),
  AC: require('@/assets/AC.svg'),
  AM: require('@/assets/AM.png'),
  AS: require('@/assets/AS.jpeg'),
  DL: require('@/assets/DL.jpeg'),
  UA: require('@/assets/UA.png'),
};

export default defineComponent({
  name: 'FlightList',
  props: {
    code: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const altText = computed(() => `${props.name} logo`);
    const source = computed(() => SOURCES[props.code]);

    return {
      altText,
      source,
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
