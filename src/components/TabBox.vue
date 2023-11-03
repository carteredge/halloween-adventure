<template>
    <div class="tab-box">
        <div class="tab-row">
            <button
                :class="this.activeSlot === slot ? 'active' : ''"
                :key="slot"
                v-for="slot in Object.keys($slots)"
                @click="this.activeSlot = slot">
                {{ toLabel(slot) }}
            </button>
        </div>
        <div class="tab-menu-container">
            <button
                aria-label="Change view"
                class="tab-menu-hamburger"
                title="Change view"
                v-if="!menuOpen"
                @click="toggleMenu">
                <img src="/hamburger-menu.png"/>
                {{ toLabel(activeSlot) }}
            </button>
            <div class="tab-menu" v-else>
                <button
                    :class="activeSlot === slot ? 'active' : ''"
                    :key="slot"
                    v-for="slot in Object.keys($slots)"
                    @click="changeSlot(slot)">
                    {{ toLabel(slot) }}
                </button>
            </div>
        </div>
        <div>
            <slot :name="activeSlot"></slot>
        </div>
    </div>
</template>

<script>
// other
import { toLabel } from "../helpers/text";

export default {
    data() {
        return {
            activeSlot: Object.keys(this.$slots)[0],
            menuOpen: false,
        }
    },
    methods: {
        changeSlot(slot) {
            console.log(slot);
            this.activeSlot = slot;
            this.menuOpen = false;
        },
        toLabel,
        toggleMenu() {
            this.menuOpen = !this.menuOpen;
        },
    },
}
</script>

<style scoped>
button {
    background-color: #111;
    border: 2px solid transparent;
    border-radius: 0.5rem 0.5rem 0 0;
    cursor: pointer;
    display: block;
    flex: 1;
    font-size: 1.1rem;
    font-weight: 800;
    margin: 0.2rem 0.5rem 0 0.5rem;
}

button.active {
    border-bottom: 2px solid #eb0;
}

.tab-box {
    bottom: 0;
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    overflow: hidden;
    width: 800px;
}

.tab-menu-container {
    display: none;
}

.tab-menu-container button {
    display: flex;
    place-content: center flex-start;
    width: 80vw;
}

.tab-menu-hamburger {
    height: 52px;
}

.tab-menu-hamburger img {
    margin: 0 1rem;
}

.tab-row {
    display: flex;
    flex-direction: row;
    flex: 0 1 42px;
    align-items: space-evenly;
}

.tab-box > *:nth-child(2) {
    flex: 1 1 100%;
    overflow: auto;
    padding: 1rem;
}

@media only screen and (max-width: 900px) {
    .tab-box {
        width: 100vw;
    }
}

@media only screen and (max-width: 600px) {
    .tab-row {
        display: none;
    }

    .tab-menu-container {
        display: block;
    }
}
</style>