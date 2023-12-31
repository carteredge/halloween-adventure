<template>
    <alert
        :open="this.alertIsOpen"
        ok-only
        @confirm="this.alertIsOpen = false">{{ alertText }}</alert>
    <header>
        <h1>{{ this.character.getTitle() }}</h1>
    </header>
    <div class="main">
        <div class="menu-item" :key="archetype.slug" v-for="archetype in dataStore.data.archetypes">
            <expander :animation-height="200">
                <select-button
                    :count="character.archetypes.length"
                    label="Archetype"
                    :max="3"
                    :selected="isSelected(archetype.slug, 'archetypes')"
                    @select="addArchetype(archetype)"
                    @unselect="character.removeArchetype(archetype)"/>
                <h2 class="name">{{ archetype.name }}</h2>
                <template v-slot:contents>
                    <div class="contents">
                        <div
                            :key="specialization.slug"
                            v-for="specialization in dataStore.getItemsBySlugs(archetype.specializations, 'specializations')">
                            <h3 class="name">{{ specialization.name }}</h3>
                            <p class="subtitle">Specialization</p>
                                <div
                                    class="indent" 
                                    :key="signature.slug"
                                    v-for="signature in dataStore.getItemsBySlugs(specialization.signatures, 'signatures')">
                                    <h4>{{ signature.name }}</h4> <p class="subtitle">Signature</p>
                                    <p>({{ signature.type === "Passive" ? "" : "d12" }} {{ signature.trait }} {{ signature.type }}) <span v-html="convertMD(signature.description)"></span></p>
                                </div>
                        </div>
                        <select-button
                            :count="character.archetypes.length"
                            label="Archetype"
                            :max="3"
                            :selected="isSelected(archetype.slug, 'archetypes')"
                            @select="addArchetype(archetype)"
                            @unselect="character.removeArchetype(archetype)"/>
                    </div>
                </template>
            </expander>
        </div>
    </div>
    <footer>
        <div class="subtitle">{{ character.archetypes?.length ?? 0 }} of 3 Archetypes selected</div>
        <button
            :disabled="continueIsDisabled"
            @click="$emit('continue')">Continue</button>
    </footer>
</template>

<script>
// components
import Alert from "../Alert.vue";
import Expander from "../Expander.vue";
import SelectButton from "./SelectButton.vue";
// data stores
import useCharacterStore from "../../stores/character";
import useDataStore from "../../stores/data";
// other
import { convertMD } from "../../helpers/markdown";

export default {
    components: {
        Alert,
        Expander,
        SelectButton,
    },
    computed: {
        continueIsDisabled() {
            return this.character.archetypes.length < 3 ||
                this.character.archetypes.every(archetype => archetype.name.includes("..."));
        },
    },
    data() {
        return {
            alertIsOpen: false,
            alertText: "",
            character: useCharacterStore(),
            dataStore: useDataStore(),
        };
    },
    emits: [ "continue" ],
    methods: {
        addArchetype(archetype) {
            if (this.character.archetypes?.length === 2 &&
                [...this.character.archetypes, archetype].every(archetype => archetype.name.includes("..."))) {
                this.alertText = "You must choose at least one archetype that does not include \"...\" in the name.";
                this.alertIsOpen = true;
            } else {
                this.character.addArchetype(archetype);
            }
        },
        convertMD,
        isSelected(slug, itemType) {
            return this.character[itemType].some(item => item.slug === slug);
        },
    },
}
</script>

<style scoped>
footer {
    background-color: #222;
    border-top: 1px solid #960;
    bottom: 0;
    display: flex;
    flex-direction: column;
    height: 5rem;
    left: 0;
    place-content: center center;
    position: absolute;
    right: 0;
    width: auto;
}

footer button {
    margin: auto;
}

footer .subtitle {
    margin: 0.5rem auto;
}

h1
{
    font-size: 1.5rem;
}

h2
{
    font-size: 1.2rem;
    font-weight: 800;
    height: 36px;
}

h3
{
    margin-top: 1rem;
    font-size: 1.2rem;
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
}

.contents .select-button {
    align-self: flex-end;
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

.main {
    margin-bottom: 4rem;
}

.menu-item
{
    display: flex;
    flex-direction: column;
    place-content: start start;
}

</style>