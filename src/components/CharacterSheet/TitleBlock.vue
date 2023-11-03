<template>
    <div id="title">
        <h1>
            <p class="small">Attack of the</p>
            {{ archetypeText[0] }}
            {{ archetypeText[1] }}
            {{ archetypeText[2] }}
            <div v-if="character.name">
                <p class="small bottom">...Named </p>
                <span>{{ character.name }}</span>
            </div>
            <div v-else>
                <p class="small bottom">With no Name</p>
            </div>
        </h1>
    </div>
</template>

<script>
// data stores
import useCharacterStore from "../../stores/character";
import useDataStore from "../../stores/data";

export default {
    computed: {
        archetypeText() {
            if (this.character.archetypes?.length) {
                const archetypes = [...this.character.sortArchetypes()];
                return archetypes.map(a => a.name.replace("...", ""));
            }
            return [ "?", "?", "?" ];
        },
    },
    data() {
        return {
            character: useCharacterStore(),
            dataStore: useDataStore(),
        }
    },
}
</script>

<style scoped>
#title {
    padding: 2.5rem 1rem 2.5rem 1rem;
    transform: skewX(15deg);
    max-width: 400px;
}

h1 {
    font-weight: 800;
    margin: 0 auto;
    text-shadow: 0px 0px 8px #80f;
    text-transform: uppercase;
    transform: skew(-10deg, -10deg);
}

.bottom {
    margin-top: 2rem;
}
.small {
    color: #eb0;
    font-size: 1rem;
}
</style>