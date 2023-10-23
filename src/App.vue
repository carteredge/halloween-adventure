<template>
    <nav>
        Character Menu
    </nav>

    <div>
        Settings Menu
    </div>

    <header>
        <img src="/pumpkin.png" />
        <h1>Halloween Adventure 2023</h1>
    </header>

    <main>
        <CharacterSheet />
        <button @click="randomCharacter">Random Character</button>
    </main>
</template>

<script>
import useCharacterStore from "./stores/character";
import useDataStore from "./stores/data";
import CharacterSheet from "./components/CharacterSheet/CharacterSheet.vue";
import { randomlySelectSubset } from "./helpers/randomizer";

export default {
    data() {
        return {
            character: useCharacterStore(),
            dataStore: useDataStore(),
        };
    },
    components: {
        CharacterSheet,
    },
    methods: {
        getRandomSkillSubset(skillParents, key) {
            console.log(skillParents, key);
            let parentData = skillParents.map(skillParent =>
                skillParent[`${key}s`].map(skillSlug => ({
                    parent: skillParent.slug,
                    slug: skillSlug
                }))).flat();
            console.log("parentData", parentData);
            console.log(parentData.filter((skillData, index) =>
                    index === parentData.findIndex(data => data.slug === skillData.slug)));
            parentData = parentData.filter((skillData, index) =>
                index === parentData.findIndex(data => data.slug === skillData.slug)) // use only first in list to insure uniqueness
                .map(data => {
                    console.log("map data", data);
                    const skillData = {
                        parent: data.parent,
                    };
                    console.log("dataStore skills", this.dataStore.data[`${key}s`]);
                    console.log(this.dataStore.data[`${key}s`]
                        .find(skill => skill.slug === data.slug));
                    skillData[key] = this.dataStore.data[`${key}s`]
                        .find(skill => skill.slug === data.slug);
                    return skillData;
                });
            console.log("parents", parentData);
            const skills = randomlySelectSubset(parentData, 3);
            console.log("skills", skills);

            return skills.map(skillData => console.log(skillData) || ({
                ...skillData[key],
                parent: skillData.parent,
            }));
        },
        randomCharacter() {
            const dice = [12, 10, 8, 6, 4];
            let traits = ["Braaains", "Guts", "Mayhem", "Murder", "Spookiness"];

            const archetypes = randomlySelectSubset(this.dataStore.data.archetypes, 3);
            // const archetypeNames = archetypes.sort((a0, a1) => a0.order - a1.order).map(a => a.name.replace("...", ""));

            this.character.archetypes = archetypes;

            const statCounts = {
                "Braaains": 0,
                "Guts": 0,
                "Mayhem": 0,
                "Murder": 0,
                "Spookiness": 0,
            };

            for (const archetype of archetypes) {
                statCounts[archetype.primaryTrait] += 2;
                statCounts[archetype.secondaryTrait] += 1;
            }

            traits = traits.sort((t1, t2) => {
                if (statCounts[t1] === statCounts[t2]) {
                    if (t1 === "Guts" && t2 !== "Guts")
                        return 1;
                    if (t1 !== "Guts" && t2 === "Guts")
                        return -1;
                    return Math.sign(0.5 - Math.random());
                }
                return statCounts[t2] - statCounts[t1];
            });

            for (let i = 0; i < traits.length; i++) {
                this.character[traits[i].toLowerCase()] = dice[i];
            }

            // let archetypeSpecializationData = archetypes.map(archetype =>
            //     archetype.specializations.map(archetypeSpecialization => ({
            //         parent: archetype.slug,
            //         slug: archetypeSpecialization
            //     }))).flat();
            // archetypeSpecializationData = archetypeSpecializationData.filter((slug, index) =>
            //     index === archetypeSpecializationData.findIndex(data => data.slug === slug))
            //     .map(data => ({
            //         parent: data.parent,
            //         specialization: this.dataStore.data.specializations
            //             .find(specialization => specialization.slug === data.specialization)
            //     }));
            // const specializations = randomlySelectSubset(archetypeSpecializationData, 3);

            // this.character.specializations = specializations.map(specializationData => ({
            //     ...specializationData.specialization,
            //     parent: specializationData.parent
            // }));

            const specializations =  this.getRandomSkillSubset(archetypes, "specialization");
            this.character.specializations = specializations;

            // let signatureSlugs = specializations.map(specialization => specialization.signatures).flat();
            // signatureSlugs = signatureSlugs.filter((slug, index) => index === signatureSlugs.indexOf(slug));
            // const signatures = randomlySelectSubset(this.dataStore.data.signatures.filter(signature => signatureSlugs.includes(signature.slug)), 3);
            const signatures = this.getRandomSkillSubset(specializations, "signature");
            this.character.signatures = signatures;
        }
    },
    mounted() {
        fetch("data.json")
            .then(response => response.json())
            .then(json => this.dataStore.data = json);
    },
}
</script>

<style scoped>
header
{
    line-height: 1.5;
}

.logo
{
    display: block;
    margin: 0 auto 2rem;
}

@media (min-width: 1024px)
{
    header
    {
        display: flex;
        place-items: center;
        padding-right: calc(var(--section-gap) / 2);
    }

    .logo
    {
        margin: 0 2rem 0 0;
    }

    header .wrapper
    {
        display: flex;
        place-items: flex-start;
        flex-wrap: wrap;
    }
}
</style>
