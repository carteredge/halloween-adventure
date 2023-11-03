<template>
    <div class="main">
        <edit-field large property="name"/>
        <!-- <edit-field property="murder" :width="50"/> -->
        <trait-menu/>
        <archetype-menu @randomize="$emit('randomize', $event)"/>
        <inventory-menu @randomize="$emit('randomize', $event)"/>
        <div class="row">
            <button @click="$emit('cancel')">Cancel</button>
            <button @click="$emit('save')">Save Changes</button>
        </div>
    </div>
</template>

<script>
import ArchetypeMenu from "./ArchetypeMenu.vue";
import EditField from "./EditField.vue";
import InventoryMenu from "./InventoryMenu.vue";
import TraitMenu from "./TraitMenu.vue";

export default {
    components: {
        ArchetypeMenu,
        EditField,
        InventoryMenu,
        TraitMenu,
    },
    emits: [
        "cancel",
        "save"
    ],
}
</script>

<style scoped>
button:first-of-type {
    margin-left: auto;
}

button {
    display: block;
    margin: 1rem;
}

.main {
    overflow: auto;
    padding: 1rem 0.5rem;
    width: 800px;
}

@media only screen and (max-width: 900px) {
    .main {
        width: 100vw;
    }
}
</style>