<template>
    <button
        :class="`expander-item ${quiet ? 'quiet' : ''}`"
        aria-label="expand"
        @click="toggleExpand()">
        <slot></slot>
        <span
            :class="`expander ${expanded ? 'open' : ''} ${transition ? 'transition' : ''}`">
            &#x25b6;
        </span>
    </button>
    <div
        :class="`expander-contents ${expanded ? 'open' : ''}`"
        :style="{ height: height }">
        <div v-if="expanded">
            <slot name="contents"></slot>
        </div>
    </div>
</template>

<script>
import useDataStore from '../stores/data';

export default {
    data() {
        return {
            data: useDataStore().data,
            height: 0,
            expanded: false,
            transition: false,
        };
    },
    methods: {
        toggleExpand() {
            this.transition = true;
            this.height = `${this.animationHeight}px`;
            setTimeout(() => {
                this.transition = false;
                this.expanded = !this.expanded;
                this.height = this.expanded ? 'auto' : 0;
            }, this.expanded ? 10 : 100);
        },
    },
    props: {
        animationHeight: {
            type: Number,
            required: false,
            default: 200,
        },
        quiet: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
}
</script>

<style scoped>
.expander {
    color: #960;
    margin: auto 0 auto auto;
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
    place-content: center flex-start;
    width: 100%;
}

.expander-item.quiet {
    border: 0 none transparent;
    background-color: #111;
}

.expander-contents {
    /* height: 0; */
    padding: 0;
    transition: height 0.1s ease-in;
}

.expander-contents.open {
    /* height: 100%; */
    padding: 0.5rem;
}

/* .expander-contents.transition, .expander-contents.transition.open {
    height: 150px;
} */
</style>