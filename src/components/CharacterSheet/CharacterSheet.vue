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
            <template v-slot:skills>
                <archetype :index="0"/>
                <archetype :index="1"/>
                <archetype :index="2"/>
            </template>
            <template v-slot:inventory>
                <inventory/>
            </template>
        </tab-box>
    </div>
</template>

<script setup>
import Archetype from "./Archetype.vue";
import Inventory from "./Inventory.vue";
import SecondaryStatBlock from "./SecondaryStatBlock.vue";
import StatBlock from "./StatBlock.vue";
import TabBox from "../TabBox.vue";
import TitleBlock from "./TitleBlock.vue";
</script>

<style scoped>
.character-header {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
}
</style>