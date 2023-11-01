<template>
    <ul>
        <li
            class="item"
            :key="item.slug"
            v-for="item of character.inventory">
            <button
                class="item-button sneaky-parent"
                @click="openItemDescription(item)">
                <img class="thumb" :src="`items/${item.slug}.png`"/>
                <div class="main-listing">{{ item.name }} {{ item.blurb ? `&mdash; ${item.blurb}` : "" }}</div>
                <label :class="`item-count ${ item.count === 1 ? 'sneaky' : ''}`" @click="$event.stopPropagation()"> &times;
                    <div class="input-wrapper">
                        <input
                            aria-label="Item count"
                            class="count"
                            placeholder="count"
                            type="text"
                            :value="item.count ?? '1'"
                            @change="updateItemCount(item, $event)"/>
                    </div>
                </label>
                <div class="sub-listing">
                    <select-button
                        label="Equip"
                        :selected="isEquipped(item.slug, 'inventory')"
                        @select="character.equip(item.slug)"
                        @unselect="character.unequip(item.slug)"/>
                </div>
            </button>
        </li>
    </ul>
    <modal
        :open="itemDescriptionOpen"
        size="small"
        @close="closeItemDescription">
        <img class="description-image" :src="`items/${modalItem.slug}.png`"/>
        <h1>{{ modalItem.name }}</h1>
        <p>{{ modalItem.description }}</p>
    </modal>
</template>

<script>
// components
import Modal from "../Modal.vue";
import SelectButton from "../CharacterEdit/SelectButton.vue";

// data stores
import useCharacterStore from "../../stores/character";

export default {
    components: {
        Modal,
        SelectButton,
    },
    data() {
        return {
            character: useCharacterStore(),
            itemDescriptionOpen: false,
            modalItem: {},
        }
    },
    methods: {
        closeItemDescription() {
            this.itemDescriptionOpen = false;
        },
        isEquipped(slug, itemType) {
            return this.character[itemType].some(item => item.slug === slug && item.equipped);
        },
        openItemDescription(item) {
            this.modalItem = item;
            this.itemDescriptionOpen = true;
        },
    },
}
</script>

<style scoped>
li {
    list-style: none;
}

li button {
    border-radius: 0;
    border-style: solid;
    height: 100%;
    width: 100%;
}

.sneaky-parent:hover .count,
.sneaky-parent:focus .count,
.sneaky-parent:focus-within .count,
.sneaky-parent:active .count {
    background-color: #222;
}

.count {
    background-color: #111;
    font-size: 1.3rem;
    text-align: center;
    transition: background-color 0.2s;
    width: 3rem;
}

.input-wrapper:after {
	min-width: 0rem;
    width: 0;
}

.input-wrapper:hover:after,
.input-wrapper:focus-within:after {
	width: 100%;
}

.description-image {
    float: left;
    height: 100px;
    margin: 0 1rem 1rem 0;
    width: 100px;
}

.expander-description {
    display: flex;
    flex-direction: row;
    place-content: flex-start flex-start;
}

.item-button {
    background-color: #111;
    border: 0 none transparent;
    border-radius: 0.25rem;
    display: flex;
    flex-direction: row;
    margin: 0.25rem;
    padding: 0.25rem 1rem;
}

button:hover .main-listing {
    text-decoration: underline;
}

.main-heading, .main-listing {
    flex: 1 1 100%;
    font-size: 1.2rem;
    justify-self: flex-start;
    text-align: left;
}

.heading, .sub-listing {
    flex: 0 1 8rem;
    font-size: 0.8rem;
    width: 8rem;
}

label.item-count {
    display: flex;
    flex-direction: row;
    font-size: 1.3rem;
}

.heading:last-of-type {
    margin-right: 28px;
}

.thumb {
    height: 32px;
    margin-right: 0.5rem;
    width: 32px;
}
</style>