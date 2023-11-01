<template>
    <div class="trait-block row">
        <div class="trait-score column">
            <img :src="`${trait.toLowerCase()}.png`"/>
            <h3 class="trait-label">{{ label || toLabel(trait) }}</h3>
        </div>
        <div class="input-wrapper" v-if="editable">
            <input
                :class="`trait ${scaleColor} ${max ? 'smaller' : ''}`"
                :id="trait"
                type="text"
                :value="character[trait] ?? '?'"/>
        </div>
        <h3
            :class="`trait ${scaleColor} ${max ? 'smaller' : ''}`"
            :id="trait"
            v-else>{{ character[trait] ?? "?" }}</h3>
        <h3
            :class="`trait ${max ? 'smaller' : ''} last`"
            :id="trait"
            v-if="max">/&nbsp;{{ character[max] ?? "?" }}</h3>
    </div>
</template>

<script>
// data stores
import useCharacterStore from "../../stores/character";
// other
import { toLabel } from "../../helpers/text";

export default {
    computed: {
        scaleColor() {
            if (this.trait === "injuries")
                return ["green", "yellow", "yellow", "yellow", "yellow", "red"][Math.min(this.character[this.trait], 5)];
            return ["red", "yellow", "green", "green"][Math.ceil(this.character[this.trait] / this.character[this.max] * 4) - 1];
        },
    },
    data() {
        return {
            character: useCharacterStore(),
        };
    },
    methods: {
        toLabel,
    },
    props: {
        editable: {
            type: Boolean,
            required: false,
            default: false,
        },
        label: {
            type: String,
            required: false,
            default: "",
        },
        max: {
            type: String,
            required: false,
            default: "",
        },
        trait: {
            type: String,
            required: true,
        },
    },
}
</script>

<style scoped>
h3 {
    text-align: center;
}

h3.smaller, input.smaller {
    font-size: 2rem;
    max-width: 3rem;
}

input {
    background-color: #111;
    text-align: center;
    /* cursor: pointer; */
}

.input-wrapper:after {
	min-width: 0rem;
    width: 0;
}

.input-wrapper:hover:after,
.input-wrapper:focus-within:after {
	width: 100%;
}

.last {
    margin-right: 0.5rem;
}

.trait {
    font-size: 2.5rem;
    width: 4rem;
}

.trait.red {
    color: #d00;
}

.trait.yellow {
    color: #eb0;
}
</style>