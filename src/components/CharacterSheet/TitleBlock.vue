<template>
    <div id="title">
        <h1>
            <p class="small">Attack of the</p>
            {{ archetypeText[0] }}
            {{ archetypeText[1] }}
            {{ archetypeText[2] }}
        </h1>
    </div>
</template>

<script>
import useCharacterStore from "../../stores/character";
import useDataStore from "../../stores/data";

export default {
    computed: {
        archetypeText() {
            if (this.character.archetypes?.length) {
                const archetypes = [...this.character.archetypes];
                return archetypes.sort((a0, a1) => a0.order - a1.order).map(a => a.name.replace("...", ""));
            }
            return [ "?", "?", "?" ];
        },
    },
    data() {
        return {
            character: useCharacterStore(),
            dataStore: useDataStore,
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
    text-shadow: 0px 0px 8px #808;
    text-transform: uppercase;
    transform: skew(-10deg, -10deg);
}

.small {
    font-size: 1rem;
}
</style>