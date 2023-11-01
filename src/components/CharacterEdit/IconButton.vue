<template>
    <button
        :aria-label="label"
        class="icon-button"
        :disabled="disabled"
        :title="label">
        <img
            alt=""
            :src="src"/>
    </button>
</template>

<script>
export default {
    props: {
        disabled: {
            type: Boolean,
            required: false,
            default: false,
        },
        label: {
            type: String,
            required: false,
            default: "",
        },
        src: {
            type: String,
            required: true,
        },
    },
}
</script>

<style scoped>
.icon-button {
    border-radius: 50%;
    height: 36px;
    margin: 0 0.5rem 0 0;
    padding: 0;
    position: relative;
    width: 36px;
}

/* .icon-default {
    position: absolute;
    top: 0;
    left: 0;
} */
</style>