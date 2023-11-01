<template>
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
                    @select="character.addArchetype(archetype)"
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
                                    <p>({{ signature.type === "Passive" ? "" : "d12" }} {{ signature.trait }} {{ signature.type }}) {{ signature.description }}</p>
                                </div>
                        </div>
                        <select-button
                            :count="character.archetypes.length"
                            label="Archetype"
                            :max="3"
                            :selected="isSelected(archetype.slug, 'archetypes')"
                            @select="character.addArchetype(archetype)"
                            @unselect="character.removeArchetype(archetype)"/>
                    </div>
                </template>
            </expander>
        </div>
    </div>
    <footer>
        <div class="subtitle">{{ character.archetypes?.length ?? 0 }} of 3 Archetypes selected</div>
        <button
            :disabled="character.archetypes.length < 3"
            @click="$emit('continue')">Continue</button>
    </footer>
</template>

<script>
// components
import Expander from "../Expander.vue";
import SelectButton from "./SelectButton.vue";
// data stores
import useCharacterStore from "../../stores/character";
import useDataStore from "../../stores/data";

export default {
    components: {
        Expander,
        SelectButton,
    },
    data() {
        return {
            character: useCharacterStore(),
            dataStore: useDataStore(),
        };
    },
    emits: [ "continue" ],
    methods: {
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
    height: 4rem;
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
    margin: 0 auto;
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