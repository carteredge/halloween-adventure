import { defineStore } from "pinia"

const useDataStore = defineStore("data", {
    state: () => ({ data: {} }),
    actions: {
        getItemBySlug(slug, itemType) {
            return this.data[itemType].find(item => item.slug === slug);
        },
        getItemsBySlugs(slugs, itemType) {
            return slugs.map((slug) => this.getItemBySlug(slug, itemType));
        },
    },
});

export default useDataStore;
