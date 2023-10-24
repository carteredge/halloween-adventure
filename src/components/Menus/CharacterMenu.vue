<template>
    <side-menu
        button-icon="char-menu.png"
        side="left"
        ref="menu">
        <div class="side-menu-header">CHARACTERS</div>
        <menu-item @click="$emit('new')">New Character</menu-item>
        <menu-item @click="$emit('edit')">Edit Character</menu-item>
        <div class="menu-divider">&nbsp;</div>
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
