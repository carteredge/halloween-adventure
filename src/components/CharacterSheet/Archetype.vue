<template>
    <div>
        <div class="archetype-block">
            <div class="row">
                <div class="die">
                    <img class="desc-die" src="d8.png"/>
                    d8
                </div>
                <h3>{{ character.archetypes[index]?.name ?? "" }}</h3>
            </div>
            <p class="small">ARCHETYPE</p>
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
            <p class="small">SPECIALIZATION</p>
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
                        <p class="description">{{ signature.description }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import useCharacterStore from "../../stores/character";

export default {
    computed: {
        specializations() {
            const specializations = [...this.character.specializations];
            return specializations.filter(specialization => this.character.archetypes[this.index].slug === specialization.parent);
            // const specializations = [...this.character.specializations];
            // const archetypes = [...this.character.archetypes];
            // return specializations
            //     .filter(specialization => archetypes
            //         .map(archetype => archetype.specializations)
            //         .findIndex(archetypeSpecializations =>
            //             archetypeSpecializations.includes(specialization.slug)) === this.index);
        },
    },
    data() {
        return {
            character: useCharacterStore(),
        }
    },
    methods: {
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

.sign-block {
    margin-left: 2rem;
}

.small {
    color: #760;
    font-size: 0.7rem;
    margin: 0 2rem 0rem 2rem;
}

.spec-block {
    margin-left: 1rem;
}

.spec-block h3 {
    font-size: 1.0rem;
}
</style>