<template>
    <div class="app-body" @click="closeMenus($event)">
        <alert 
            :open="this.alertIsOpen"
            @cancel="this.alertIsOpen=false"
            @confirm="this.deleteCharacter">{{ alertText }}</alert>
        <character-menu
            ref="characterMenu"
            :show-delete="this.character.id in this.allCharacters.characters"
            @delete="showDeleteWarning"
            @edit="editCharacter"
            @load="loadCharacter"
            @new="newCharacter"
            @random="randomCharacter"
            @save="saveCharacter"/>
        <!-- <settings-menu ref="settingsMenu"/> -->

        <header id="header">
            <img src="/pumpkin.png" />
            <h1>HALLOWEEN 2023</h1>
        </header>

        <main id="main">
            <CharacterEdit
                v-if="edit"
                @cancel="cancelEdit"
                @save="saveCharacter"/>
            <CharacterSheet v-else @change="onStatChange"/>
            <!-- <button @click="randomCharacter">Random Character</button> -->
        </main>
    </div>
</template>

<script>
// components
import Alert from "./components/Alert.vue";
import CharacterEdit from "./components/CharacterEdit/CharacterEdit.vue";
import CharacterMenu from "./components/Menus/CharacterMenu.vue";
import CharacterSheet from "./components/CharacterSheet/CharacterSheet.vue";
// import SettingsMenu from "./components/Menus/SettingsMenu.vue";

// data stores
import useAllCharacterStore from "./stores/allCharacters";
import useCharacterStore from "./stores/character";
import useDataStore from "./stores/data";

// other imports
import { randomListItem, randomlySelectSubset } from "./helpers/randomizer";


// TODO: Prevent characters if every archetype has "..."

export default {
    data() {
        return {
            alertIsOpen: false,
            alertText: "",
            allCharacters: useAllCharacterStore(),
            character: useCharacterStore(),
            idOfCharacterToBeDeleted: "",
            cookie: "",
            cookieData: {},
            dataStore: useDataStore(),
            shelvedCharacter: {},
            edit: false,
        };
    },

    components: {
        Alert,
        CharacterEdit,
        CharacterMenu,
        CharacterSheet,
        // SettingsMenu,
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
            this.character.$patch(this.shelvedCharacter);
        },

        closeMenus() {
            this.$refs.characterMenu.closeMenu();
            // this.$refs.settingsMenu.closeMenu();
        },

        deleteCharacter() {
            this.alertIsOpen = false;
            if (this.character.id === this.idOfCharacterToBeDeleted) {
                this.resetCharacterData();
                this.resetCharacterData(); // second call ensures that the shelved character is also an unmade character with a preset ID
            } // TODO: else check shelved character
            delete this.allCharacters.characters[this.idOfCharacterToBeDeleted];
            this.allCharacters.saveToCookie();
        },

        editCharacter() {
            this.shelveCharacter();
            this.edit = true;
            this.closeMenus();
        },

        getCharacterData() {
            const characterData = {};
            for (const key in this.dataStore.data.DEFAULT_CHARACTER_STATE) {
                if (typeof this.character[key] === 'object') {
                    if (Array.isArray(this.character[key]))
                        characterData[key] = [ ...this.character[key] ];
                    else
                        characterData[key] = { ...this.character[key] };
                } else {
                    characterData[key] = this.character[key];
                }
            }
            
            return characterData;
        },

        loadCharacter(id) {
            this.character.$patch(this.allCharacters.characters[id]);
            this.edit = false;
            this.closeMenus();
        },

        newCharacter() {
            this.resetCharacterData();
            this.edit = true;
            this.closeMenus();
        },

        onStatChange(event) {
            this.character[event.target.id] = isNaN(event.target.value) ? event.target.value : Number(event.target.value);
            (this.character.id in this.allCharacters.characters) && this.saveCharacter();
        },

        randomCharacter() {
            this.resetCharacterData();
            this.character.name = `${randomListItem(this.dataStore.data.names.first)} ${randomListItem(this.dataStore.data.names.last)}`;
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

            this.randomizeInventory();

            this.character.recalculateStats();

            this.closeMenus();
        },

        randomizeInventory() {
            const traits = ["murder", "mayhem", "braaains", "spookiness"];
            const traitValues = traits.map(trait => this.character[trait]);
            const maxValue = Math.max(...traitValues);
            const highestTrait = traits[traitValues.findIndex(value => value === maxValue)];
            const allWeapons = this.dataStore.data.items.filter(item => item.damage);
            let traitWeapons;
            let weaponChoice;
            switch (highestTrait) {
                case "murder":
                    traitWeapons = allWeapons.filter(weapon =>
                        !weapon.properties.includes("light") &&
                        !weapon.properties.includes("brainy") &&
                        !weapon.properties.includes("spooky"));
                    weaponChoice = {...randomListItem(traitWeapons)};
                    this.character.inventory.push(weaponChoice);
                    if (!weaponChoice.properties.includes("heavy")) {
                        const shield = {...this.dataStore.getItemBySlug("shield", "items") };
                        this.character.inventory.push(shield);
                    }
                    break;
                case "mayhem":
                    traitWeapons = allWeapons.filter(weapon =>
                        weapon.properties.includes("light") ||
                        !weapon.properties.includes("ranged"));
                    weaponChoice = {...randomListItem(traitWeapons)};
                    this.character.inventory.push(weaponChoice);
                    if (weaponChoice.properties.includes("light"))
                        weaponChoice.count = 2;
                    break;
                case "braaains":
                    traitWeapons = allWeapons.filter(weapon =>
                        weapon.properties.includes("brainy"));
                    weaponChoice = {...randomListItem(traitWeapons)};
                    this.character.inventory.push(weaponChoice);
                    break;
                case "spookiness":
                    traitWeapons = allWeapons.filter(weapon =>
                        weapon.properties.includes("spooky"));
                    weaponChoice = {...randomListItem(traitWeapons)};
                    this.character.inventory.push(weaponChoice);
                    break;
            }

            for (const item of this.character.inventory) {
                item.equipped = true;
            }
        },

        resetCharacterData() {
            this.shelveCharacter();
            this.character.$patch(this.dataStore.data.DEFAULT_CHARACTER_STATE);
            this.character.archetypes = [];
            this.character.inventory = [];
            this.character.specializations = [];
            this.character.signatures = [];
            this.character.setID();
        },

        saveCharacter() {
            this.allCharacters.characters ??= {};
            this.allCharacters.characters[this.character.id] = this.getCharacterData();
            this.allCharacters.saveToCookie();
            this.edit = false;
        },

        shelveCharacter() {
            this.shelvedCharacter = this.getCharacterData();
        },

        showDeleteWarning() {
            this.idOfCharacterToBeDeleted = this.character.id;
            this.alertText = `You are about to permanently delete ${this.allCharacters.characters[this.character.id].name}. Is this OK?`;
            this.alertIsOpen = true;
        },

        testData() {
            let toDoCount = 0;
            // let previousArchetype = "";
            // let previousSignature = "";
            // let previousSpecialization = "";
            const archetypes = [...this.dataStore.data.archetypes];
            for (const archetype of archetypes) {
                const specializationSlugs = archetype.specializations;
                if (specializationSlugs?.length < 3) {
                    toDoCount += (3 - archetype.specializations.length) * 9;
                    console.warn(`Archetype "${archetype.name}" only has ${specializationSlugs.length} specializations.`);
                }
                // if (archetype.name < previousArchetype) {
                //     toDoCount++;
                //     console.warn(`Archetype ${archetype.name} is out of alphabetical order.`);
                // }
                // previousArchetype = archetype.name;
                for (const specializationSlug of specializationSlugs) {
                    const specialization = this.dataStore.data.specializations.find(spec => spec.slug === specializationSlug);
                    if (!specialization) {
                        toDoCount++;
                        console.error(`Specialization not found with slug ${specializationSlug} for archetype ${archetype.name}`);
                    } else {
                        if (specialization.signatures.length < 3) {
                            toDoCount += (3 - specialization.signatures.length) * 3;
                            console.warn(`Specialization "${specialization.name}" only has ${specialization.signatures.length} signatures.`);
                        }
                        // if (specialization.name < previousSpecialization) {
                        //     toDoCount++;
                        //     console.warn(`Specialization ${specialization.name} is out of alphabetical order.`);
                        // }
                        // previousSpecialization = specialization.name;
                        for (const signatureSlug of specialization.signatures) {
                            const signature = this.dataStore.data.signatures.find(sgn => sgn.slug === signatureSlug);
                            if (!signature) {
                                toDoCount++;
                                console.error(`Signature not found with slug ${signatureSlug} for specialization ${specialization.name} and archetype ${archetype.name}`);
                            } else {
                                // if (signature.name < previousSignature) {
                                //     toDoCount++;
                                //     console.warn(`Signature ${signature.name} is out of alphabetical order.`);
                                // }
                                // previousSignature = signature.name;
                                if (!signature.description || signature.description === "Description") {
                                    toDoCount++;
                                    console.warn(`Signature ${signature.name} requires description.`);
                                }
                                if (!signature.type) {
                                    toDoCount++;
                                    console.warn(`Signature ${signature.name} is missing type.`);
                                }
                            }
                        }
                    }
                }
            }
            console.warn(`TODO Items: ${toDoCount}`);
        },
    },

    mounted() {
        fetch("data.json")
        .then(response => response.json())
        .then(json => {
            this.dataStore.data = json;
            this.testData();
            // TODO: Reload last active character.
            this.allCharacters.loadFromCookie(this.dataStore);
            this.resetCharacterData();
            this.resetCharacterData(); // second call ensures that the shelved character is also an unmade character with a preset ID
        });
    },
}
</script>

<style scoped>
.app-body {
    display: flex;
    flex-direction: column;
    place-content: center stretch;
    height: 100vh;
    overflow: hidden;
    padding: 2rem;
}

.app-body > * {
    flex: 0 1;
}

#header {
    display: flex;
    flex-direction: row;
    flex: 0 0 100px;
    line-height: 1.5;
    margin: 0 auto;
    place-items: center stretch;
    white-space: nowrap;
}

header img {
    margin: 0 1rem 0 auto;
    box-shadow: 0 0 16px #408;
    border-radius: 50%;
}

header h1 {
    font-size: 2rem;
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
