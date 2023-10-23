<template>
    <div>
        <div class="character-header">
            <title-block/>
            <stat-block/>
        </div>
        <secondary-stat-block/>
        <archetype :index="0"/>
        <archetype :index="1"/>
        <archetype :index="2"/>
    </div>
</template>

<script setup>
import Archetype from "./Archetype.vue";
import SecondaryStatBlock from "./SecondaryStatBlock.vue";
import StatBlock from "./StatBlock.vue";
import TitleBlock from "./TitleBlock.vue";
</script>

<style scoped>
.character-header {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
}
</style>