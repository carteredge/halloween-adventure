<template>
    <label>
        <div class="input-wrapper" :style="{ maxWidth: `${width}px` }">
            <input
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
    background-color: #222;
    border-left: 0 transparent none;
    border-right: 0 transparent none;
    border-top: 0 transparent none;
    border-bottom: 0 transparent none;
}

label {
    display: block;
}

.input-wrapper:after, .select:after {
	border-bottom: 3px solid #eb0;
	content: '';
	display: block;
	min-width: 3rem;
	transition: 0.2s;
	width: 5%;
}

.input-wrapper:hover:after,
.input-wrapper:focus-within:after,
.select:hover:after,
.select:focus:after {
	width: 100%;
}
</style>