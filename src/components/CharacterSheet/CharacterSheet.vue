<template>
    <div class="column">
        <div class="character-header">
            <title-block/>
            <stat-block/>
        </div>
        <tab-box>
            <template v-slot:stats>
                <secondary-stat-block/>
            </template>
            <template v-slot:basics>
                <basics/>
            </template>
            <template v-slot:skills>
                <archetype :index="0" v-if="character.archetypes?.length"/>
                <archetype :index="1" v-if="character.archetypes?.length > 1"/>
                <archetype :index="2" v-if="character.archetypes?.length > 2"/>
                <div class="button-row">
                    <randomize-button
                        label="Skills and Traits"
                        thing="skills"
                        @randomize="$emit('randomize', $event)"/>
                    <randomize-button
                        :disabled="!character.archetypes.length"
                        label="One Specialization"
                        thing="one-specialization"
                        @randomize="$emit('randomize', $event)"/>
                    <randomize-button
                        :disabled="!character.specializations.length"
                        label="One Signature"
                        thing="one-signature"
                        @randomize="$emit('randomize', $event)"/>
                </div>
            </template>
            <template v-slot:inventory>
                <inventory v-if="character.inventory?.length"/>
                <randomize-button
                    :disabled="!character.archetypes?.length"
                    :title="character.archetypes?.length ? '' : 'Please select or randomize Skills before randomizing inventory.'"
                    thing="inventory"
                    @randomize="$emit('randomize', $event)"/>
            </template>
        </tab-box>
    </div>
</template>

<script>
//components
import Archetype from "./Archetype.vue";
import Basics from "./Basics.vue";
import Inventory from "./Inventory.vue";
import RandomizeButton from "../RandomizeButton.vue";
import SecondaryStatBlock from "./SecondaryStatBlock.vue";
import StatBlock from "./StatBlock.vue";
import TabBox from "../TabBox.vue";
import TitleBlock from "./TitleBlock.vue";
// data stores
import useCharacterStore from "../../stores/character";

export default {
    components: {
        Archetype,
        Basics,
        Inventory,
        RandomizeButton,
        SecondaryStatBlock,
        StatBlock,
        TabBox,
        TitleBlock,
    },
    data() {
        return {
            character: useCharacterStore(),
        }
    },
    emits: ["randomize"],
}
</script>

<style scoped>
.character-header {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
}

@media only screen and (max-width: 900px) {
    .character-header {
        flex-direction: column;
    }
}
</style>