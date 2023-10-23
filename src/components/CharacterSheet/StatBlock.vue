<template>
    <div>
        <stat trait="Murder" :die="character.murder"/>
        <stat trait="Mayhem" :die="character.mayhem"/>
        <stat trait="Guts" :die="character.guts"/>
        <stat trait="Braaains" :die="character.braaains"/>
        <stat trait="Spookiness" :die="character.spookiness"/>
    </div>
</template>

<script>
import Stat from "./Stat.vue";

import useCharacterStore from "../../stores/character";

export default {
    components: {
        Stat
    },
    data() {
        return {
            character: useCharacterStore(),
        };
    },
}

</script>

<style scoped>
</style>