<template>
    <side-menu
        button-icon="char-menu.png"
        side="left"
        ref="menu">
        <div class="side-menu-header">CHARACTERS</div>
        <menu-item @click="$emit('save')">Save Character</menu-item>
        <menu-item @click="$emit('new')">New Character</menu-item>
        <menu-item @click="$emit('random')">New Random Character</menu-item>
        <menu-item @click="$emit('edit')">Edit Character</menu-item>
        <menu-item v-if="showDelete" @click="$emit('delete')">Delete Character</menu-item>

        <div class="menu-divider"></div>
        <div class="side-menu-header">SAVED CHARACTERS</div>
        <menu-item
            :key="id"
            v-for="id in allCharacters.characters && Object.keys(allCharacters.characters)"
            @click="$emit('load', id)">
            {{ allCharacters.characters[id].name }}
        </menu-item>
    </side-menu>
</template>

<script>
// components
import MenuItem from "./MenuItem.vue";
import SideMenu from "./SideMenu.vue";
// data stores
import useAllCharactersStore from "../../stores/allCharacters";

export default {
    components: {
        MenuItem,
        SideMenu,
    },
    data() {
        return {
            allCharacters: useAllCharactersStore(),
        }
    },
    emits: ['delete', 'edit', 'load', 'new', 'random', 'save'],
    methods: {
        closeMenu() {
            this.$refs.menu.closeMenu();
        },
    },
    props: {
        showDelete: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
}
</script>
