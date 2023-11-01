<template>
    <div class="alert-container" v-if="open">
        <div class="alert">
            <slot></slot>
            <div class="button-container">
                <button @click="$emit('confirm')">OK</button>
                <button @click="$emit('cancel')">Cancel</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    emits: ["cancel", "confirm"],
    props: {
        open: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
}
</script>

<style scoped>
.alert-container {
    background-color: #11111188;
    bottom: 0;
    display: flex;
    left: 0;
    place-content: center space-around;
    position: absolute;
    right: 0;
    top: 0;
}

.alert {
    background-color: #222;
    border: 1px solid #960;
    border-radius: 1rem;
    height: 200px;
    margin: auto;
    max-height: 95vh;
    max-width: 95vw;
    overflow: hidden;
    padding: 1rem 1rem 1rem 1rem;
    position: relative;
    width: 300px;
}

button {
    margin: 0.5rem;
}

.button-container {
    bottom: 0;
    left: 0;
    margin: auto;
    position: absolute;
    right: 0;
    text-align: center;
}
</style>