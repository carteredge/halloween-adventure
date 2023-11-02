<template>
    <div
        class="skill-page"
        v-if="character.archetypes[index]">
        <div class="archetype-block">
            <div class="row">
                <div class="die">
                    <img class="desc-die" src="d8.png"/>
                    d8
                </div>
                <h3>{{ character.archetypes[index]?.name ?? "" }}</h3>
            </div>
            <p class="skill-type">ARCHETYPE</p>
        </div>
        <div
            class="spec-block"
            :key="specialization.slug"
            v-for="specialization in specializations">
            <div>
            <div class="row">
                <div class="die">
                    <img class="desc-die" src="d10.png"/>
                    d10
                </div>
                <h3 class="specialization">{{ specialization.name }}</h3>
            </div>
            <p class="skill-type">SPECIALIZATION</p>
            </div>
            <div
                class="sign-block"
                :key="signature.slug"
                v-for="signature in getSignatures(specialization.slug)">
                <div class="row top">
                    <span class="die">
                        <img class="desc-die" src="d12.png"/>
                        d12
                    </span>
                    <div>
                        <h4 class="signature">
                            {{ signature.name }}
                        </h4>
                        <p class="small">({{ signature.trait ? `${signature.trait} ` : "" }}{{ signature.type }})</p>
                        <p class="description" v-html="convertMD(signature.description)"></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// data stores
import useCharacterStore from "../../stores/character";
// other
import { convertMD } from "../../helpers/markdown";

export default {
    computed: {
        specializations() {
            const specializations = [...this.character.specializations];
            return specializations.filter(specialization =>
                this.character.archetypes[this.index].slug === specialization.parent);
        },
    },
    data() {
        return {
            character: useCharacterStore(),
        }
    },
    methods: {
        convertMD,
        getSignatures(specializationSlug) {
            const signatures = [...this.character.signatures];
            return signatures.filter(signature => signature.parent === specializationSlug);
        },
    },
    props: {
        index: {
            type: Number,
            required: true,
        },
    },
}
</script>

<style scoped>
h3, h4 {
    font-weight: 800;
    margin: 0 0.5rem;
    line-height: 1;
    /* border-bottom: 1px solid #eb0; */
    text-shadow: 0px 0px 3px #808;
}

.archetype-block h3 {
    font-size: 1.2rem;
}

.description {
    margin: 0 0 0 1.5rem;
}

.row {
    align-items: flex-start;
}

.sign-block {
    margin-left: 2rem;
}

.small {
    color: #a70;
    font-size: 0.75rem;
    margin-left: 1rem;
}

.skill-page {
    padding: 0 1rem;
}

.skill-type {
    color: #a70;
    font-size: 0.75rem;
    margin: -1rem 2rem 0.5rem 2rem;
}

.spec-block {
    margin-left: 1rem;
}

.spec-block h3 {
    font-size: 1.0rem;
}
</style>