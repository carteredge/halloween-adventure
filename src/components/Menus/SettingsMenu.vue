<template>
    <side-menu
        button-icon="hamburger-menu.png"
        side="right"
        ref="menu">
            <menu-item>Save</menu-item>
    </side-menu>
</template>

<script>
// components
import MenuItem from "./MenuItem.vue";
import SideMenu from "./SideMenu.vue";

export default {
    components: {
        MenuItem,
        SideMenu,
    },
    methods: {
        closeMenu() {
            this.$refs.menu.closeMenu();
        },
    },
}
</script>