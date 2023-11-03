<template>
    <div class="stat-block">
        <stat trait="Murder" :die="character.murder"/>
        <stat trait="Mayhem" :die="character.mayhem"/>
        <stat trait="Guts" :die="character.guts"/>
        <stat trait="Braaains" :die="character.braaains"/>
        <stat trait="Spookiness" :die="character.spookiness"/>
    </div>
</template>

<script>
// components
import Stat from "./Stat.vue";
// data stores
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
@media only screen and (max-width: 900px) {
    .stat-block {
        border-bottom: 1px solid #eb0;
        border-top: 1px solid #eb0;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        margin: 0.5rem;
    }

    .stat-block * {
        margin: 1rem;
    }
}
</style>