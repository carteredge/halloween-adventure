<template>
    <div id="app" @click="closeMenus($event)">
        <character-menu
            ref="characterMenu"
            @edit="editCharacter"
            @new="newCharacter"/>
        <settings-menu ref="settingsMenu"/>

        <header>
            <img src="/pumpkin.png" />
            <h1>HALLOWEEN</h1>
        </header>

        <main>
            <CharacterEdit
                v-if="edit"
                @cancel="cancelEdit"
                @save="saveCharacter"/>
            <CharacterSheet v-else/>
            <button @click="randomCharacter">Random Character</button>
        </main>
    </div>
</template>

<script>
// components
import CharacterEdit from "./components/CharacterEdit/CharacterEdit.vue";
import CharacterMenu from "./components/Menus/CharacterMenu.vue";
import CharacterSheet from "./components/CharacterSheet/CharacterSheet.vue";
import SettingsMenu from "./components/Menus/SettingsMenu.vue";
// data stores
import useCharacterStore from "./stores/character";
import useDataStore from "./stores/data";
// other imports
import { randomlySelectSubset } from "./helpers/randomizer";

export default {
    data() {
        return {
            character: useCharacterStore(),
            dataStore: useDataStore(),
            edit: false,
        };
    },

    components: {
        CharacterEdit,
        CharacterMenu,
        CharacterSheet,
        SettingsMenu,
    },

    methods: {
        getRandomSkillSubset(skillParents, key) {
            let parentData = skillParents.map(skillParent =>
                skillParent[`${key}s`].map(skillSlug => ({
                    parent: skillParent.slug,
                    slug: skillSlug
                }))).flat();
            parentData = parentData.filter((skillData, index) =>
                index === parentData.findIndex(data => data.slug === skillData.slug)) // use only first in list to insure uniqueness
                .map(data => {
                    const skillData = {
                        parent: data.parent,
                    };
                    skillData[key] = this.dataStore.data[`${key}s`]
                        .find(skill => skill.slug === data.slug);
                    return skillData;
                });
            const skills = randomlySelectSubset(parentData, 3);

            return skills.map(skillData => ({
                ...skillData[key],
                parent: skillData.parent,
            }));
        },

        cancelEdit() {
            this.edit = false;
            // TODO: Restore previous character state
        },

        closeMenus() {
            this.$refs.characterMenu.closeMenu();
            this.$refs.settingsMenu.closeMenu();
        },

        editCharacter() {
            // TODO: Save character state
            this.edit = true;
            this.closeMenus();
        },

        newCharacter() {
            // TODO: Save character state
            this.character.$patch(this.dataStore.data.DEFAULT_CHARACTER_STATE);
            this.edit = true;
        },

        randomCharacter() {
            const dice = [12, 10, 8, 6, 4];
            let traits = ["Braaains", "Guts", "Mayhem", "Murder", "Spookiness"];

            const activeArchetypes = this.dataStore.data.archetypes.filter(archetype => archetype.isActive);
            const archetypes = randomlySelectSubset(activeArchetypes, 3).sort((a0, a1) => a0.order - a1.order);
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

            const specializations =  this.getRandomSkillSubset(archetypes, "specialization");
            this.character.specializations = specializations;

            const signatures = this.getRandomSkillSubset(specializations, "signature");
            this.character.signatures = signatures;
        },

        saveCharacter() {
            // TODO: Save character

        },

        testData() {
            const archetypes = [...this.dataStore.data.archetypes];
            for (const archetype of archetypes) {
                const specializationSlugs = archetype.specializations;
                for (const specializationSlug of specializationSlugs) {
                    const specialization = this.dataStore.data.specializations.find(spec => spec.slug === specializationSlug);
                    if (!specialization) {
                        console.error(`Specialization not found with slug ${specializationSlug} for archetype ${archetype.name}`);
                    } else {
                        for (const signatureSlug of specialization.signatures) {
                            const signature = this.dataStore.data.signatures.find(sgn => sgn.slug === signatureSlug);
                            if (!signature)
                                console.error(`Signature not found with slug ${signatureSlug} for specialization ${specialization.name} and archetype ${archetype.name}`);
                        }
                    }
                }
            }
        },
    },

    mounted() {
        fetch("data.json")
            .then(response => response.json())
            .then(json => {
                this.dataStore.data = json;
                this.testData();
                this.character.$patch(this.dataStore.data.DEFAULT_CHARACTER_STATE);
            });
        },
}
</script>

<style scoped>
header {
    display: flex;
    flex-direction: row;
    line-height: 1.5;
    margin: auto;
    place-items: center;
}

header img {
    margin: 0 1rem 0 auto;
    box-shadow: 0 0 16px #408;
    border-radius: 50%;
}

header h1 {
    font-size: 4rem;
    font-style: italic;
    font-weight: 800;
    margin: 0 auto 0 1rem;
    text-shadow: 0px 0px 16px #808;
}

@media (min-width: 1024px)
{
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
