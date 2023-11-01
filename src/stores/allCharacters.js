import * as cookie from "cookie";
import { defineStore } from "pinia"

const useAllCharactersStore = defineStore("allCharacters", {
    state: () => ({
        characters: {},
    }),
    actions: {
        loadFromCookie(dataStore) {
            const cookieData = cookie.parse(document.cookie).characters;
            
            if (!cookieData)
                return;

            const characterData = cookieData && JSON.parse(cookieData);
            for (const id of Object.keys(characterData)) {
                characterData[id].archetypes = dataStore.getItemsBySlugs(characterData[id].archetypes, 'archetypes');

                const specializations = [];

                for (const savedSpecialization of characterData[id].specializations) {
                    const specialization = dataStore.getItemBySlug(savedSpecialization.slug, 'specializations');
                    specialization.parent = savedSpecialization.parent;
                    specializations.push(specialization);
                }

                characterData[id].specializations = specializations;

                const signatures = [];

                for (const savedSignature of characterData[id].signatures) {
                    const signature = dataStore.getItemBySlug(savedSignature.slug, 'signatures');
                    signature.parent = savedSignature.parent;
                    signatures.push(signature);
                }

                characterData[id].signatures = signatures;

                const inventory = [];

                for (const savedItem of characterData[id].inventory) {
                    const item = dataStore.getItemBySlug(savedItem.slug, 'items');
                    item.count = savedItem.count;
                    item.equipped = savedItem.equipped;
                    inventory.push(item);
                }

                characterData[id].inventory = inventory;
            }
            this.characters = characterData;
        },
        saveToCookie() {
            const characterData = {};
            for (const id of Object.keys(this.characters)) {
                characterData[id] = { ...this.characters[id] };
                characterData[id].archetypes = characterData[id].archetypes.map(a => a.slug);
                characterData[id].specializations = characterData[id].specializations.map(s => ({ slug: s.slug, parent: s.parent }));
                characterData[id].signatures = characterData[id].signatures.map(s => ({ slug: s.slug, parent: s.parent }));
                characterData[id].inventory = characterData[id].inventory.map(i => ({ count: i.count, equipped: i.equipped, slug: i.slug }));
            }
            document.cookie = cookie.serialize(
                "characters",
                JSON.stringify(characterData),
                {
                    expires: new Date(new Date().getFullYear() + 100, new Date().getMonth(), new Date().getDate()),
                    sameSite: 'strict',
                });
        },
    }
});

export default useAllCharactersStore;