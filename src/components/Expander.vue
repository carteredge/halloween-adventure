<template>
    <button
        class="expander-item"
        aria-label="expand"
        @click="toggleExpand()">
        <slot></slot>
        <span :class="`expander ${isExpanded(archetype.slug) ? 'open' : ''} ${isTransition(archetype.slug) ? 'transition' : ''}`">
            &#x25b6;
        </span>
    </button>
    <div :class="`expander-contents ${isExpanded(archetype.slug) ? 'open' : ''} ${isTransition(archetype.slug) ? 'transition' : ''}`">
        <div v-if="isExpanded(archetype.slug)">
            <slot name="contents"></slot>
        </div>
    </div>
</template>

<script>
import useDataStore from '../../stores/data';

export default {
    data() {
        return {
            data: useDataStore().data,
            open: false,
            transition: false,
        };
    },
    methods: {
        toggleExpand() {
            this.transition = true;
            setTimeout(() => {
                this.transition = false;
                this.open = !this.open;
            }, 100);
        },
    },
}
</script>

<style scoped>
.expander {
    color: #960;
    transition: transform 0.1s;
}

.expander.open, .expander.transition {
    transform: rotate(90deg);
}

.expander-item {
    border-left: 0 none transparent;
    border-right: 0 none transparent;
    border-radius: 0;
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.expander-contents {
    display: flex;
    flex-direction: column;
    height: 0;
    padding: 0.5rem;
    transition: height 0.1s ease-in;
}

.expander-contents.open {
    height: 100%;
}

.expander-contents.transition, .expander-contents.transition.open {
    height: 150px; /* ADJUST WHEN ADDITIONAL FORMATTING IS APPLIED TO THE SUBLIST ITEMS */
}
</style>