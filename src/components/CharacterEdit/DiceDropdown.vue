<template>
    <edit-dropdown
        :property="property"
        type="number"
        @change="onChange">
        <option value="">&nbsp;</option>
        <option :disabled="isDisabled[0]" value="4">d4</option>
        <option :disabled="isDisabled[1]" value="6">d6</option>
        <option :disabled="isDisabled[2]" value="8">d8</option>
        <option :disabled="isDisabled[3]" value="10">d10</option>
        <option :disabled="isDisabled[4]" value="12">d12</option>
    </edit-dropdown>
</template>

<script>
// components
import EditDropdown from "./EditDropdown.vue";
// data stores
import useCharacterStore from "../../stores/character";

export default {
    components: {
        EditDropdown,
    },
    computed: {
        isDisabled() {
            return [4, 6, 8, 10, 12].map(d => this.disabledDice.includes(d) && this.value !== d);
        },
    },
    data() {
        return {
            character: useCharacterStore(),
            value: "",
        }
    },
    methods: {
        onChange(event) {
            this.value = Number(event.target.value);
        },
    },
    mounted() {
        this.value = this.character[this.property];
    },
    props: {
        disabledDice: {
            type: Array,
            required: false,
            default() { return []; },
        },
        property: {
            type: String,
            required: true,
        },
    },
}
</script>