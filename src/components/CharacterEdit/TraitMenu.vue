<template>
    <dice-dropdown
        :disabled-dice="this.selectedDice"
        property="murder"
        @change="($event) => setDice(0, $event)"/>
    <dice-dropdown
        :disabled-dice="this.selectedDice"
        property="mayhem"
        @change="($event) => setDice(1, $event)"/>
    <dice-dropdown
        :disabled-dice="this.selectedDice"
        property="guts"
        @change="($event) => setDice(2, $event)"/>
    <dice-dropdown
        :disabled-dice="this.selectedDice"
        property="braaains"
        @change="($event) => setDice(3, $event)"/>
    <dice-dropdown
        :disabled-dice="this.selectedDice"
        property="spookiness"
        @change="($event) => setDice(4, $event)"/>
</template>

<script>
import DiceDropdown from "./DiceDropdown.vue";
export default {
    components: {
        DiceDropdown,
    },
    data() {
        return {
            dice: [ "d4", "d6", "d8", "d10", "d12" ],
            selectedDice: [],
            value: [ "", "", "", "", "", ],
        }
    },
    methods: {
        setDice(index, event) {
            this.value[index] = event.target.value;
            this.selectedDice = this.value.filter(v => v);
        }
    },
}
</script>