<template>
    <div>
        <h1>Inventory</h1>
        <button class="modal-button" @click="openModal">Manage Inventory</button>
        <randomize-button
                thing="inventory"
                @randomize="this.$emit('randomize', $event)"/>
        <inventory/>
        <modal :open="modalIsOpen" @close="closeModal">
            <header>
                <h1>Inventory</h1>
            </header>
            <ul>
                <h2>
                    <div class="main-heading">NAME</div>
                    <div class="heading">COUNT</div>
                    <div class="heading">EQUIPPED</div>
                    <div class="heading">REMOVE</div>
                </h2>
                <li
                    class="item"
                    :key="item.slug"
                    v-for="item of character.inventory">
                    <expander :animation-height="50">
                        <div class="main-listing">{{ item.name }}</div>
                        <label class="sub-listing"> &times;
                            <div class="input-wrapper">
                                <input
                                    aria-label="Item count"
                                    class="count"
                                    placeholder="count"
                                    type="text"
                                    :value="item.count ?? '1'"
                                    @change="item.count = $event.target.value"/>
                            </div>
                        </label>
                        <div class="sub-listing">
                            <select-button
                                label="Equip"
                                :selected="equipped(item.slug, 'inventory')"
                                v-if="item.equippable"
                                @select="character.equip(item.slug)"
                                @unselect="character.unequip(item.slug)"/> <!-- TODO: Fix label (select-label, unselect-label), aria role -->
                        </div>
                        <div class="sub-listing">
                            <icon-button
                                label="Remove item"
                                src="trash-can.png"
                                @click="removeItem(item.slug)"/>
                        </div>
                        <template v-if="item.description" v-slot:contents>
                            <div class="expander-description">
                                <img
                                    class="expander-image"
                                    :src="`items/${item.slug}.png`"/>
                                {{ item.description }}
                            </div>
                        </template>
                    </expander>
                </li>
                <li class="add-item">
                    <edit-dropdown
                        property=""
                        @change="updateItemChoice">
                        <option
                            :key="item.slug"
                            :value="item.slug"
                            v-for="item in availableItems">
                            {{ item.name }} {{ item.blurb ? `&mdash; ${item.blurb}` : "" }}
                        </option>
                    </edit-dropdown>
                    <button class="item-action" @click="addItem">Add Item</button>
                </li>
            </ul>
        </modal>
    </div>
</template>

<script>
// components 
import EditDropdown from "./EditDropdown.vue";
import Expander from "../Expander.vue";
import IconButton from "./IconButton.vue";
import Inventory from "../CharacterSheet/Inventory.vue";
import Modal from "../Modal.vue";
import RandomizeButton from "../RandomizeButton.vue";
import SelectButton from "./SelectButton.vue";

// data stores
import useDataStore from "../../stores/data";
import useCharacterStore from "../../stores/character";

export default {
    components: {
        EditDropdown,
        Expander,
        IconButton,
        Inventory,
        Modal,
        RandomizeButton,
        SelectButton,
    },
    computed: {
        availableItems() {
            return this.dataStore.data.items.filter(i =>
                (!i.required || this.character.archetypes.some(a => a.slug === i.required))
                    && !this.character.inventory.some(ii => ii.slug === i.slug));
        },
    },
    data() {
        return {
            character: useCharacterStore(),
            dataStore: useDataStore(),
            itemDescriptionOpen: false,
            modalIsOpen: false,
            modalItem: {},
            selectedItemSlug: "",
        }
    },
    methods: {
        addItem() {
            this.selectedItemSlug &&
                this.character.inventory.push({
                    ...this.dataStore.getItemBySlug(
                        this.selectedItemSlug, "items"),
                    count: 1,
                    equipped: false,
                });
            this.selectedItemSlug = "";
            this.character.recalculateStats();
        },
        closeItemDescription() {
            this.itemDescriptionOpen = false;
        },
        closeModal() {
            this.modalIsOpen = false;
        },
        equipped(slug, itemType) {
            return this.character[itemType].some(item => item.slug === slug && item.equipped);
        },
        openModal() {
            this.modalIsOpen = true;
        },
        openItemDescription(item) {
            this.modalItem = item;
            this.itemDescriptionOpen = true;
        },
        removeItem(slug) {
            this.character.inventory.splice(this.character.inventory.findIndex(item => item.slug === slug), 1);
            this.character.recalculateStats();
        },
        updateItemChoice(value) {
            this.selectedItemSlug = value;
        },
        updateItemCount(item, event) {
            item.count = isNaN(event.target.value) ? 1 : Number(event.target.value);
        },
    },
}
</script>

<style scoped>
header {
    width: 100%;
}

li {
    list-style: none;
}

li button {
    border-radius: 0;
    border-style: solid;
    height: 100%;
    width: 100%;
}

ul h2 {
    display: flex;
    flex-direction: row;
    place-content: center flex-end;
}

.add-item {
    display: flex;
    flex-direction: row;
    margin: 2rem 0 0 0;
    place-content: center flex-start;
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

.modal .count {
    background-color: #333;
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
.expander-image {
    float: left;
    height: 50px;
    margin: 0 1rem 1rem 0;
    width: 50px;
}

.item-action, button button {
    border-radius: 8px;
    width: auto;
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

.modal-button {
    margin-bottom: 1rem;
}

.heading, .sub-listing {
    flex: 0 1 8rem;
    font-size: 0.8rem;
    width: 8rem;
}

label.sub-listing, label.item-count {
    display: flex;
    flex-direction: row;
    font-size: 1.3rem;
}

.heading:last-of-type {
    margin-right: 28px;
}
</style>