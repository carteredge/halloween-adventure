<template>
    <div class="trait-block row">
        <div class="trait-score column">
            <img :src="`${trait.toLowerCase()}.png`"/>
            <h3 class="trait-label">{{ trait }}</h3>
        </div>
        <h3 class="trait" :id="trait">{{ character[trait.toLowerCase()] ?? "?" }}</h3>
    </div>
</template>

<script>
import useCharacterStore from "../../stores/character";

export default {
    data() {
        return {
            character: useCharacterStore(),
        };
    },
    props: {
        trait: {
            type: String,
            required: true,
        },
    },
}
</script>

<style scoped>
.trait {
    font-size: 2.5rem;
}
</style>