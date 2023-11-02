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
        <a
            class="corner-button right"
            href="rules.html"
            target="_blank"
            title="Rules">?</a>

        <header id="header">
            <img src="/pumpkin.png" />
            <h1>HALLOWEEN 2023</h1>
        </header>

        <main id="main">
            <CharacterEdit
                v-if="edit"
                @cancel="cancelEdit"
                @save="saveCharacter"/>
            <CharacterSheet
                v-else
                @change="onStatChange"
                @randomize="onRandomize"/>
            <!-- <button @click="randomCharacter">Random Character</button> -->
        </main>

        <footer>
            <a href="credits.html" target="_blank">License and Credits</a>
        </footer>
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
import {
    randomListItem,
    randomlySelectSubset,
    randomlySelectSubsetByWeights
} from "./helpers/randomizer";


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
    },

    methods: {
        getRandomSkillSubset(skillParents, key, traits) {
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
                    if (key === "specialization") {
                        skillData.weight = skillData[key].signatures.reduce((t, s) =>
                            t + [0, 0, 5, 15, 20][(traits[this.dataStore.getItemBySlug(s, "signatures").primaryTrait.toLowerCase()] ?? 12) / 2 - 2], 0) / skillData[key].signatures.length;
                    } else {
                        skillData.weight = [0, 0, 5, 15, 20][(traits[skillData[key].primaryTrait.toLowerCase()] ?? 12) / 2 - 2];
                    }
                    return skillData;
                });
            const skills = randomlySelectSubsetByWeights(parentData, 3, parentData.map(data => data.weight));

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

        onRandomize(thing) {
            console.log("randomize", thing);
            switch(thing) {
                case "skills":
                    this.randomizeSkillsAndTraits();
                    break;
                case "inventory":
                    this.randomizeInventory();
                    break;
                case "character":
                default:
                    this.randomCharacter();
                    break;
            }
        },

        onStatChange(event) {
            this.character[event.target.id] = isNaN(event.target.value) ? event.target.value : Number(event.target.value);
            (this.character.id in this.allCharacters.characters) && this.saveCharacter();
        },

        randomCharacter() {
            this.resetCharacterData();

            this.character.name = `${randomListItem(this.dataStore.data.names.first)} ${randomListItem(this.dataStore.data.names.last)}`;
            this.randomizeArchetypes();
            this.randomizeTraits();
            this.randomizeSpecializationsAndSignatures();
            this.randomizeInventory();

            this.character.recalculateStats();

            this.closeMenus();
        },

        randomizeArchetypes() {
            const activeArchetypes = this.dataStore.data.archetypes.filter(archetype => archetype.isActive);
            let archetypes;
            do {
                archetypes = randomlySelectSubset(activeArchetypes, 3).sort((a0, a1) => a0.order - a1.order);
            } while (archetypes.every(archetype => archetype.name.includes("...")));
            this.character.archetypes = archetypes;
        },

        randomizeInventory() {
            const availableItems = this.dataStore.data.items.filter(i =>
                (!i.required || this.character.archetypes.some(a => a.slug === i.required))
                    && !this.character.inventory.some(ii => ii.slug === i.slug));
            const traits = ["murder", "mayhem", "braaains", "spookiness"];
            const traitValues = traits.map(trait => this.character[trait]);
            const maxValue = Math.max(...traitValues);
            let weaponChoice;
            let traitWeapons;
            
            if (this.character.archetypes.some(a => a.slug === "chainsaw-wielding")) {
                weaponChoice = {...this.dataStore.getItemBySlug("chainsaw", "items")};
                weaponChoice.count = 1;
                this.character.inventory.push(weaponChoice);
            } else if(this.character.archetypes.some(a => a.slug === "heavy-metal")) {
                weaponChoice = {...this.dataStore.getItemBySlug("electric-guitar", "items")};
                weaponChoice.count = 1;
                this.character.inventory.push(weaponChoice);
            } else {
                const highestTrait = traits[traitValues.findIndex(value => value === maxValue)];
                const allWeapons = availableItems.filter(item => item.damage);
            
                switch (highestTrait) {
                    case "murder":
                        traitWeapons = allWeapons.filter(weapon =>
                            !weapon.properties.includes("light") &&
                            !weapon.properties.includes("brainy") &&
                            !weapon.properties.includes("spooky"));
                        weaponChoice = {...randomListItem(traitWeapons)};
                        weaponChoice.count = 1;
                        this.character.inventory.push(weaponChoice);
                        if (!weaponChoice.properties.includes("heavy")) {
                            const shield = {...this.dataStore.getItemBySlug("shield", "items") };
                            shield.count = 1;
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
                        else
                            weaponChoice.count = 1;
                        break;
                    case "braaains":
                        traitWeapons = allWeapons.filter(weapon =>
                            weapon.properties.includes("brainy"));
                        weaponChoice = {...randomListItem(traitWeapons)};
                        weaponChoice.count = 1;
                        this.character.inventory.push(weaponChoice);
                        break;
                    case "spookiness":
                        traitWeapons = allWeapons.filter(weapon =>
                            weapon.properties.includes("spooky"));
                        weaponChoice = {...randomListItem(traitWeapons)};
                        weaponChoice.count = 1;
                        this.character.inventory.push(weaponChoice);
                        break;
                }
            }

            if (weaponChoice.properties.includes("thrown"))
                        weaponChoice.count = 5;

            const funSizeCandy = {...this.dataStore.getItemBySlug("fun-size-candy", "items")};

            funSizeCandy.count = 3;

            const nonWeaponEquipment = availableItems.filter(item => item.equippable && !item.damage);

            // TODO: Prevent multiple armors
            // TODO: Stack duplicate items

            const otherItems = randomlySelectSubsetByWeights(nonWeaponEquipment, 3 - this.character.inventory.length, nonWeaponEquipment.map(i => i.lootChance));

            this.character.inventory.push(...otherItems.map(i => ({ ...i, count: 1 })));
            this.character.inventory.push(funSizeCandy);

            for (const item of this.character.inventory) {
                item.equipped = item.equippable;
            }
            this.character.recalculateStats();
        },

        randomizeSpecializationsAndSignatures() {
            const traitWeights = {
                murder: this.character.murder,
                mayhem: this.character.mayhem,
                guts: this.character.guts,
                braaains: this.character.braaains,
                spookiness: this.character.spookiness,
            }

            const specializations =  this.getRandomSkillSubset(this.character.archetypes, "specialization", traitWeights);
            this.character.specializations = specializations;

            const signatures = this.getRandomSkillSubset(specializations, "signature", traitWeights);
            this.character.signatures = signatures;
        },

        randomizeSkillsAndTraits() {
            this.character.name = `${randomListItem(this.dataStore.data.names.first)} ${randomListItem(this.dataStore.data.names.last)}`;

            this.randomizeArchetypes();
            this.randomizeTraits();
            this.randomizeSpecializationsAndSignatures();
            this.character.recalculateStats();
        },

        randomizeTraits() {
            const dice = [12, 10, 8, 6, 4];
            let traits = ["Braaains", "Guts", "Mayhem", "Murder", "Spookiness"];

            const statCounts = {
                "Braaains": 0,
                "Guts": 0,
                "Mayhem": 0,
                "Murder": 0,
                "Spookiness": 0,
            };

            for (const archetype of this.character.archetypes) {
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
            const archetypes = [...this.dataStore.data.archetypes];
            for (const archetype of archetypes) {
                const specializationSlugs = archetype.specializations;
                if (specializationSlugs?.length < 3) {
                    toDoCount += (3 - archetype.specializations.length) * 9;
                    console.warn(`Archetype "${archetype.name}" only has ${specializationSlugs.length} specializations.`);
                }

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

                        for (const signatureSlug of specialization.signatures) {
                            const signature = this.dataStore.data.signatures.find(sgn => sgn.slug === signatureSlug);
                            if (!signature) {
                                toDoCount++;
                                console.error(`Signature not found with slug ${signatureSlug} for specialization ${specialization.name} and archetype ${archetype.name}`);
                            } else {
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
            // this.testData();
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

.corner-button.right {
    background-color: #518;
    border: 2px outset #eb0;
    border-radius: 8px;
    display: flex;
    font-size: 1.5rem;
    height: 36px;
    place-content: center center;
    position: absolute;
    right: 1rem;
    text-align: center;
    text-decoration: none;
    top: 1rem;
    width: 36px;
}

footer {
    border-top: 1px solid #960;
    color: #960;
    font-size: 0.8rem;
    padding: 0.5rem 0.5rem 0 0.5rem;
}

footer a {
    color: #960;
}

#header {
    border-bottom: 1px solid #eb0;
    display: flex;
    flex-direction: row;
    flex: 0 0 80px;
    line-height: 1.5;
    margin: 0.5rem auto;
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
