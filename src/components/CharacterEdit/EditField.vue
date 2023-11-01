<template>
    <label>
        <div class="input-wrapper" :style="{ maxWidth: `${width}px` }">
            <input
                :class="this.large ? 'large' : ''"
                :id="property"
                :type="type"
                v-model="value"
                @change="updateCharacter"/>
        </div>
        {{ label || toLabel(property) }}
    </label>
</template>

<script>
// data stores
import useCharacterStore from "../../stores/character";
// other imports
import { toLabel } from "../../helpers/text";

export default {
    data() {
        return {
            character: useCharacterStore(),
            value: "",
        }
    },
    methods: {
        toLabel,
        updateCharacter() {
            this.character[this.property] = this.value;
        }
    },
    mounted() {
        this.value = this.character[this.property]
    },
    props: {
        label: {
            type: String,
            required: false,
        },
        large: {
            type: Boolean,
            required: false,
            default: false,
        },
        property: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: false,
            default: "text",
        },
        width: {
            type: Number,
            required: false,
            default: 300,
        },
    },
}
</script>

<style scoped>
input {
    display: block;
    width: 100%;
    background-color: #111;
    border-left: 0 transparent none;
    border-right: 0 transparent none;
    border-top: 0 transparent none;
    border-bottom: 0 transparent none;
}

input.large {
    font-size: 2rem;
}

label {
    display: block;
}
</style>