<template>
    <div>
        <edit-field property="name"/>
        <!-- <edit-field property="murder" :width="50"/> -->
        <trait-menu/>
        <archetype-menu/>
        <button @click="$emit('cancel')">Cancel</button>
        <button @click="$emit('save')">Save Changes</button>
    </div>
</template>

<script>
import ArchetypeMenu from "./ArchetypeMenu.vue";
import EditField from "./EditField.vue";
import TraitMenu from "./TraitMenu.vue";

export default {
    components: {
        ArchetypeMenu,
        EditField,
        TraitMenu,
    },
    emits: [
        "cancel",
        "save"
    ],
}
</script>