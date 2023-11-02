<template>
    <header>
        <h1>Choose Signatures</h1>
    </header>
    <div class="main">
        <div class="menu-item" :key="specialization.slug" v-for="specialization in character.specializations">
            <h2 class="name">{{ specialization.name }}</h2>
            <div :key="signature.slug"
                v-for="signature in dataStore.getItemsBySlugs(specialization.signatures, 'signatures')">
                <expander :animation-height="200">
                    <select-button
                        label="Signature"
                        :selected="isSelected(signature.slug, 'signatures')"
                        @select="character.addSignature(signature, specialization.slug, specialization.slug)"
                        @unselect="character.removeSignature(signature)"/>
                    <h3 class="name">{{ signature.name }}</h3>
                    <template v-slot:contents>
                        <div class="contents">
                            <p v-html="convertMD(signature.description)"></p>
                            <select-button
                                label="Signature"
                                :selected="isSelected(signature.slug, 'signatures', specialization.slug)"
                                @select="character.addSignature(signature, specialization.slug)"
                                @unselect="character.removeSignature(signature)"/>
                        </div>
                    </template>
                </expander>
            </div>
        </div>
    </div>
    <footer>
        <div class="subtitle">{{ character.signatures?.length ?? 0 }} of 3 Signatures selected</div>
        <div class="footer-buttons">
            <button @click="$emit('back')">Back</button>
            <button :disabled="character.signatures.length < 3" @click="$emit('continue')">Done</button>
        </div>
    </footer>
</template>


<script>
// components
import Expander from "../Expander.vue";
import SelectButton from "./SelectButton.vue";
// data stores
import useCharacterStore from "../../stores/character";
import useDataStore from "../../stores/data";
import { convertMD } from "../../helpers/markdown";

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
    emits: ["back", "continue"],
    methods: {
        convertMD,
        isSelected(slug, itemType, parentSlug) {
            return this.character[itemType].some(item => item.slug === slug && (!parentSlug || item.parent === parentSlug));
        },
    },
}
</script>

<style scoped>
footer
{
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

footer button:first-of-type
{
    margin: 0 1rem 0 auto;
}

footer button:last-of-type
{
    margin: 0 auto 0 1rem;
}

footer .subtitle
{
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

.contents .select-button
{
    align-self: flex-end;
}

.footer-buttons
{
    display: flex;
    flex-direction: row;
    justify-content: space-around;
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

.main
{
    margin-bottom: 4rem;
}

.menu-item
{
    display: flex;
    flex-direction: column;
    place-content: start start;
}
</style>