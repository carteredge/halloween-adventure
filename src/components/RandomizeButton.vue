<template>
    <button
        :disabled="disabled"
        :title="title"
        @click="$emit('randomize', thing)">
        <img src="/rolling-dice.png"/>
        <span>Randomize {{ label ? label : toLabel(thing)}}</span>
    </button>
</template>

<script>
// data stores
import useCharacterStore from "../stores/character";
// other
import { toLabel } from "../helpers/text";

export default {
    data() {
        return {
            character: useCharacterStore(),
        }
    },
    emits: ["randomize"],
    methods: {
        toLabel,
    },
    props: {
        disabled: {
            type: Boolean,
            required: false,
            default: false,
        },
        label: {
            type: String,
            required: false,
            default: "",
        },
        thing: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: false,
            default: "",
        },
    },
}
</script>

<style scoped>
button {
    display: flex;
    place-content: center center;
    margin: 2rem auto;
}

button span {
    font-size: 1.2rem;
    margin: auto auto auto 1rem;
}
</style>