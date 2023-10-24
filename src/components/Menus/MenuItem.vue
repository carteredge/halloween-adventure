<template>
    <li>
        <button @click="onclick">
            <slot></slot>
        </button>
    </li>
</template>

<script>
export default {
    props: {
        onclick: {
            type: Function,
            required: false,
        }
    }
}
</script>

<style scoped>
button {
    border-left: 0 transparent none;
    border-right: 0 transparent none;
    border-radius: 0;
    font-weight: 800;
    width: 100%;
}

button:hover {
    background-color: #315;
}

li {
    list-style: none;
    margin: 0;
}
</style>