<template>
    <div class="secondary-stat-block row">
        <secondary-stat trait="Defense"/>
        <secondary-stat trait="Speed"/>
        <secondary-stat trait="HP"/>
        <secondary-stat trait="Injuries"/>
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
</style>