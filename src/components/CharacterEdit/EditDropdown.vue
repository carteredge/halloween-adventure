<template>
    <label>
        <select v-model="value" @change="updateCharacter">
            <slot></slot>
        </select>
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
label {
    display: block;
}
</style>