<template>
    <div class="secondary-stat-block row">
        <secondary-stat trait="defense"/>
        <secondary-stat trait="speed"/>
        <secondary-stat editable label="HP" max="maxHP" trait="hp"/>
        <secondary-stat editable trait="wounds"/>
    </div>
</template>

<script setup>
import SecondaryStat from "./SecondaryStat.vue";
</script>

<style scoped>
.secondary-stat-block {
    border-top: 1px solid #eb0;
    border-bottom: 1px solid #eb0;
    justify-content: space-evenly;
    margin: 1rem;
    padding: 1rem;
}

@media only screen and (max-width: 900px) {
    .secondary-stat-block {
        flex-direction: column;
    }
}

</style>