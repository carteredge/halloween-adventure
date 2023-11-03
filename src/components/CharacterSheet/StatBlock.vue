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
    div {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }

    div * {
        margin: 1rem;
    }
}
</style>