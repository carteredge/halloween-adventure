<template>
        <div>
            <!-- chosen archetypes -> choose specializations -->
        </div>
    <h1>Select an Archetype...</h1>
    <div
        class="menu-item"
        :key="archetype.slug"
        v-for="archetype in data.archetypes">
        <button
            class="menu-subitem"
            aria-label="expand"
            @click="toggleExpand(archetype.slug)">
            <h2 class="name">{{ archetype.name }}</h2>
            <span :class="`expander ${isExpanded(archetype.slug) ? 'open' : ''} ${isTransition(archetype.slug) ? 'transition' : ''}`">
                &#x25b6;
            </span>
        </button>
        <div :class="`menu-sublist ${isExpanded(archetype.slug) ? 'open' : ''} ${isTransition(archetype.slug) ? 'transition' : ''}`">
            <div v-if="isExpanded(archetype.slug)">
                <span class="header">Available Specializations</span>
                <div
                    :key="specialization.slug"
                    v-for="specialization in getItems(archetype.specializations, 'specializations')">
                    <button
                        class="menu-subitem"
                        aria-label="expand"
                        @click="toggleExpand(specialization.slug)">
                        <h3 class="name">{{ specialization.name }}</h3>
                        <span :class="`expander ${isExpanded(specialization.slug) ? 'open' : ''} ${isTransition(specialization.slug) ? 'transition' : ''}`">
                            &#x25b6;
                        </span>
                    </button>
                </div>
                <button class="item-action">Select Archetype</button>
            </div>
        </div>
    </div>
</template>

<script>
import useDataStore from '../../stores/data';

export default {
    data() {
        return {
            data: useDataStore().data,
            openItems: {},
            transitionItems: {},
        };
    },
    methods: {
        getItems(slugs, itemType) {
            return slugs.map(slug =>
                this.data[itemType].find(item => item.slug === slug));
        },
        isExpanded(slug) {
            return this.openItems[slug];
        },
        isTransition(slug) {
            return this.transitionItems[slug];
        },
        toggleExpand(slug) {
            this.transitionItems[slug] = true;
            setTimeout(() => {
                this.transitionItems[slug] = false;
                this.openItems[slug] = !this.openItems[slug];
            }, 100);
        },
    },
}
</script>

<style scoped>
h1 {
    font-size: 1.5rem;
}

h2 {
    font-size: 1.2rem;
}

.expander {
    color: #960;
    transition: transform 0.1s;
}

.expander.open, .expander.transition {
    transform: rotate(90deg);
}

.header {
    border-bottom: 1px solid #760;
    color: #960;
    width: 100%;
}

.item-action {
    width: auto;
    align-self: flex-end;
}

.menu-item {
    display: flex;
    flex-direction: column;
    place-content: start start;
}

.menu-subitem {
    border-left: 0 none transparent;
    border-right: 0 none transparent;
    border-radius: 0;
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.menu-sublist {
    display: flex;
    flex-direction: column;
    height: 0;
    padding: 0.5rem;
    transition: height 0.1s ease-in;
}

.menu-sublist.open {
    height: 100%;
}

.menu-sublist.transition, .menu-sublist.transition.open {
    height: 150px; /* ADJUST WHEN ADDITIONAL FORMATTING IS APPLIED TO THE SUBLIST ITEMS */
}
</style>