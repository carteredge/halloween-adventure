<template>
    <div class="modal-container" v-if="open">
        <div :class="`modal ${ size ? size : 'large' }`">
            <button
                aria-label="Close modal"
                class="close-button"
                @click="closeModal">
                &times;
            </button>
            <div class="scroll-container">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        closeModal() {
            this.$emit("close");
        },
    },
    props: {
        open: {
            type: Boolean,
            required: false,
            default: false,
        },
        size: {
            type: String,
            required: false,
            default: "large",
        },
    },
}
</script>

<style scoped>
.close-button {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
}
.modal-container {
    background-color: #11111188;
    bottom: 0;
    display: flex;
    left: 0;
    place-content: center space-around;
    position: absolute;
    right: 0;
    top: 0;
}

.modal {
    background-color: #222;
    border: 1px solid #960;
    border-radius: 1rem;
    margin: auto;
    max-height: 95vh;
    max-width: 95vw;
    overflow: hidden;
    padding: 2rem 1rem 1rem 1rem;
    position: relative;
    z-index: 20;
}

.modal.large {
    height: 1200px;
    width: 700px;
}

.modal.medium {
    height: 700px;
    width: 500px;
}

.modal.small {
    height: 300px;
    width: 500px;
}

.scroll-container {
    height: 100%;
    overflow: auto;
    padding: 1rem;
}
</style>