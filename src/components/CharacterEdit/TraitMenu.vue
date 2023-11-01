<template>
    <div class="trait-menu">
        <h2>Traits</h2>
        <p>Assign d4, d6, d8, d10, and d12 each to one of the following:</p>
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
    </div>
</template>

<script>
import useCharacterStore from "../../stores/character";
import DiceDropdown from "./DiceDropdown.vue";
export default {
    components: {
        DiceDropdown,
    },
    data() {
        return {
            character: useCharacterStore(),
            dice: [ 4, 6, 8, 10, 12 ],
            selectedDice: [],
            value: [ "", "", "", "", "", ],
        }
    },
    methods: {
        setDice(index, event) {
            this.value[index] = Number(event.target.value);
            this.selectedDice = this.value.filter(v => v);
        }
    },
    mounted() {
        this.value = [
        this.character.murder,
            this.character.mayhem,
            this.character.guts,
            this.character.braaains,
            this.character.spookiness];
        this.selectedDice = [
            this.character.murder,
            this.character.mayhem,
            this.character.guts,
            this.character.braaains,
            this.character.spookiness];
    },
}
</script>

<style scoped>
.trait-menu {
    border: 1px solid #eb0;
    border-radius: 0.5rem;
    margin: 1rem auto 1rem 1rem;
    padding: 0.5rem;
    width: 400px;
}
</style>