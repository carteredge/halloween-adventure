<template>
    <nav :class="`${open ? 'open' : 'closed'} ${side}`" @click="popBubble($event)">
        <ul v-if="open">
            <slot></slot>
        </ul>
        <button @click="openMenu" :title="title" v-else><img :src="buttonIcon"/></button>
    </nav>
</template>

<script>
export default {
    data() {
        return {
            open: false,
        };
    },
    methods: {
        closeMenu() {
            this.open = false;
        },
        popBubble(event) {
            event.stopPropagation();
        },
        openMenu() {
            this.open = true;
        },
    },
    props: {
        buttonIcon: {
            type: String,
            required: true,
        },
        side: {
            type: String,
            required: false,
            default: "left",
        },
        title: {
            type: String,
            required: false,
            default: "Menu",
        },
    },
}
</script>

<style scoped>
button {
    background-color: #518;
    padding: 0;
    height: 36px;
    width: 36px;
}

nav {
    padding: 0;
    position: absolute;
    top: 0;
    z-index: 10;
}

nav.left {
    left: 0;
}

nav.right {
    right: 0;
}

nav.closed {
    height: 50px;
    margin: 1rem;
    width: 50px;
}

nav.open {
    background-color: #222;
    border: 1px solid #eb0;
    bottom: 0;
    width: 300px;
}
</style>