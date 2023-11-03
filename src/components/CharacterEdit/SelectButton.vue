<template>
    <button
        :aria-label="selected ? (removeLabel || `Remove ${label}`.trim()) : (addLabel || `Add ${label}`.trim())"
        class="select-button"
        :disabled="!selected && max && count >= max"
        :title="selected ? (removeLabel || `Remove ${label}`.trim()) : (!max || count < max) ? (addLabel || `Add ${label}`.trim()) : `${count} of ${max} ${label ? label + 's ' : ''}already selected.`"
        @click="toggle($event)">
        <img
            :alt="`${label ?? ''} selected`"
            class="icon-default"
            src="yes.png"
            v-if="selected"/>
        <img
            class="icon-hover"
            :src="selected ? 'no.png' : 'yes.png'"/>
    </button>
</template>

<script>
export default {
    emits: [
        "select",
        "unselect"
    ],
    methods: {
        toggle(event) {
            event.stopPropagation();
            if (this.selected)
                this.$emit("unselect");
            else if (!this.max || this.count < this.max)
                this.$emit("select")
        },
    },
    props: {
        addLabel: {
            type: String,
            required: false,
            default: "",
        },
        count: {
            type: Number,
            required: false,
            default: 0,
        },
        label: {
            type: String,
            required: false,
            default: "",
        },
        max: {
            type: Number,
            required: false,
            default: 0,
        },
        removeLabel: {
            type: String,
            required: false,
            default: "",
        },
        selected: {
            type: Boolean,
            required: false,
            default: false,
        }
    },
}
</script>

<style scoped>
.select-button {
    border-radius: 50%;
    height: 36px;
    margin: 0 0.5rem 0 0;
    padding: 0;
    position: relative;
    width: 36px;
}

.icon-default, .icon-hover {
    position: absolute;
    top: 0;
    left: 0;
}

.select-button .icon-default {
    opacity: 1;
}

.select-button .icon-hover {
    opacity: 0;
}

.select-button:hover .icon-default {
    opacity: 0;
}

.select-button:hover .icon-hover {
    opacity: 1;
}

.select-button:disabled:hover .icon-hover {
    opacity: 0.5;
}
</style>