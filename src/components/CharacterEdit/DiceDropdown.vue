<template>
    <edit-dropdown
        :property="property"
        @change="onChange">
        <option value="">&nbsp;</option>
        <option :disabled="isDisabled[0]" value="d4">d4</option>
        <option :disabled="isDisabled[1]" value="d6">d6</option>
        <option :disabled="isDisabled[2]" value="d8">d8</option>
        <option :disabled="isDisabled[3]" value="d10">d10</option>
        <option :disabled="isDisabled[4]" value="d12">d12</option>
    </edit-dropdown>
</template>

<script>
import EditDropdown from './EditDropdown.vue';

export default {
    components: {
        EditDropdown,
    },
    computed: {
        isDisabled() {
            return ["d4", "d6", "d8", "d10", "d12"].map(d => this.disabledDice.includes(d) && this.value !== d);
        },
    },
    data() {
        return {
            value: "",
        }
    },
    methods: {
        onChange(event) {
            this.value = event.target.value;
        },
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