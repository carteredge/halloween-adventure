<template>
    <div>
        <h1>Character Skills</h1>
        <button @click="openSkillsModal">Choose Skills</button>
        <modal :open="modalIsOpen" @close="closeModal">
            <archetype-selection-page v-if="pageIndex === 0" @continue="nextPage"/>
            <specialization-selection-page v-if="pageIndex === 1" @back="previousPage" @continue="nextPage"/>
            <signature-selection-page v-if="pageIndex === 2" @back="previousPage" @continue="nextPage" />
        </modal>
        <archetype :index="0" v-if="character.archetypes?.length"/>
        <archetype :index="1" v-if="character.archetypes?.length > 1"/>
        <archetype :index="2" v-if="character.archetypes?.length > 2"/>
        <button
            v-if="!character.archetypes?.length"
            @click="$emit('randomize-skills')">
            <!-- {{ character.murder &&
                character.mayhem &&
                character.guts &&
                character.braaains &&
                character.spookiness ?
                'Randomize Skills' : 'Randomize Skills and Traits' -->
            Randomize Skills and Traits
        </button>
    </div>
</template>

<script>
// components
import Archetype from "../CharacterSheet/Archetype.vue";
import ArchetypeSelectionPage from "./ArchetypeSelectionPage.vue";
import Modal from "../Modal.vue";
import SignatureSelectionPage from "./SignatureSelectionPage.vue";
import SpecializationSelectionPage from "./SpecializationSelectionPage.vue";
// data stores
import useCharacterStore from "../../stores/character";
import useDataStore from "../../stores/data";

export default {
    components: {
        Archetype,
        ArchetypeSelectionPage,
        Modal,
        SignatureSelectionPage,
        SpecializationSelectionPage,
    },
    data() {
        return {
            character: useCharacterStore(),
            dataStore: useDataStore(),
            modalIsOpen: false,
            openItems: {},
            pageCount: 3,
            pageIndex: 0,
            transitionItems: {},
        };
    },
    emits: [
        "randomize-skills",
    ],
    methods: {
        closeModal() {
            this.modalIsOpen = false;
        },
        isSelected(slug, itemType) {
            return this.character[itemType].some(item => item.slug === slug);
        },
        nextPage() {
            if (this.pageIndex + 1 === this.pageCount) {
                this.closeModal();
                this.pageIndex = 0;
                return;
            }
            this.pageIndex++;
        },
        openSkillsModal() {
            this.modalIsOpen = true;
        },
        previousPage() {
            this.pageIndex--;
        },
    },
}
</script>

<style scoped>
button {
    margin: 0.5rem 0.5rem 1rem 0.5rem;
}

h1
{
    font-size: 1.5rem;
}

h2
{
    border-bottom: 1px solid #eb0;
    font-size: 1.2rem;
    font-weight: 800;
    height: 36px;
    text-align: left;
    width: 100%;
}

h3
{
    font-size: 1.1rem;
    font-weight: 800;
}

h4
{
    font-size: 1.05rem;
    font-weight: 800;
}

.contents
{
    display: flex;
    flex-direction: column;
    padding: 0 1rem;
}

.expander
{
    color: #960;
    transition: transform 0.1s;
}

.expander.open,
.expander.transition
{
    transform: rotate(90deg);
}

.item-action
{
    align-self: flex-end;
    font-size: 2rem;
    font-weight: 800;
    line-height: 0.8;
    height: 32px;
    margin: 0.5rem;
    padding: 0;
    text-align: center;
    width: 32px;
}

.list-icon-button {
    border-radius: 50%;
    height: 36px;
    width: 36px;
    padding: 0;
    position: relative;
}

.icon-check, .icon-trash {
    position: absolute;
    top: 0;
    left: 0;
}

.list-icon-button .icon-check {
    opacity: 1;
}

.list-icon-button .icon-trash {
    opacity: 0;
}

.list-icon-button:hover .icon-check {
    opacity: 0;
}

.list-icon-button:hover .icon-trash {
    opacity: 1;
}

.menu-item
{
    display: flex;
    flex-direction: column;
    place-content: start start;
}

.menu-subitem
{
    border-left: 0 none transparent;
    border-right: 0 none transparent;
    border-radius: 0;
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.menu-sublist
{
    display: flex;
    flex-direction: column;
    height: 0;
    padding: 0.5rem;
    transition: height 0.1s ease-in;
}

.menu-sublist.open
{
    height: 100%;
}

.menu-sublist.transition,
.menu-sublist.transition.open
{
    height: 150px;
    /* ADJUST WHEN ADDITIONAL FORMATTING IS APPLIED TO THE SUBLIST ITEMS */
}

.specialization-expander
{
    border-top: 0 none transparent;
}
</style>