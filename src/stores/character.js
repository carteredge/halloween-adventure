import { defineStore } from 'pinia'

const useCharacterStore = defineStore('character', {
    state: () => ({
        archetypes: [],
        braaains: 0,
        defense: 5,
        guts: 0,
        hp: 10,
        id: "",
        injuries: 0,
        inventory: [],
        maxHP: 10,
        mayhem: 0,
        murder: 0,
        name: "",
        signatures: [],
        speed: 5,
        specializations: [],
        spookiness: 0
    }),
    actions: {
        addArchetype(archetype) {
            if (this.archetypes.length >= 3 || this.archetypes.some((a) => a.slug === archetype.slug))
                return;
            this.archetypes.push({ ...archetype });
            this.sortArchetypes();
            this.recalculateStats();
        },
        addSignature(signature, parentSlug) {
            if (this.signatures.some((s) => s.slug === signature.slug))
                return;
            this.signatures.push({ ...signature, parent: parentSlug });
            this.recalculateStats();
        },
        addSpecialization(specialization, parentSlug) {
            if (this.specializations.some(s => s.slug === specialization.slug))
                return;
            this.specializations.push({ ...specialization, parent: parentSlug });
            this.recalculateStats();
        },
        equip(itemSlug) {
            this.inventory.find(item => item.slug === itemSlug).equipped = true;
        },
        getSkillStatChange(stat) {
            return (this.archetypes.reduce((t, a) => t + (a[stat] ?? 0), 0) +
                this.specializations.reduce((t, s) => t + (s[stat] ?? 0), 0) +
                this.signatures.reduce((t, s) => t + (s[stat] ?? 0), 0)) +
                this.inventory.reduce((t, i) => t + (i.equipped && i[stat] || 0), 0);
        },
        getTitle() {
            return this.archetypes
                .sort((a0, a1) => a0.order - a1.order)
                .map((a) => a.name.replace('...', ''))
                .join(' ');
        },
        recalculateStats() {
            this.defense = 5 + this.getSkillStatChange('defense');
            this.maxHP = 10 + this.getSkillStatChange('maxHP');
            this.speed = 5 + this.getSkillStatChange('speed');
            // TODO: equipment
        },
        removeArchetype(archetype) {
            // TODO: Warn about removing specializations/signatures
            this.archetypes.splice(this.archetypes.findIndex(a => archetype.slug === a.slug), 1);
            const archetypeSlugs = this.archetypes.map(a => a.slug);
            this.specializations = this.specializations.filter(specialization =>
                archetypeSlugs.includes(specialization.parent));
            const specializationSlugs = this.specializations.map(specialization => specialization.slug);
            this.signatures = this.signatures.filter(signature =>
                specializationSlugs.includes(signature.parent));
            this.recalculateStats();
        },
        removeSignature(signature) {
            this.signatures.splice(this.signatures.findIndex(s => signature.slug === s.slug), 1);
            this.recalculateStats();
        },
        removeSpecialization(specialization) {
            this.specializations.splice(this.specializations.findIndex(s => specialization.slug === s.slug), 1);
            const specializationSlugs = this.specializations.map(specialization => specialization.slug);
            this.signatures = this.signatures.filter(signature =>
                specializationSlugs.includes(signature.parent));
            this.recalculateStats();
        },
        setID() {
            this.id = `${new Date().getTime().toString(36)}-${Math.random().toString(36).split('.')[1]}`;
        },
        sortArchetypes() {
            this.archetypes = this.archetypes.sort((a0, a1) => a0.order - a1.order);
            return this.archetypes;
        },
        unequip(itemSlug) {
            this.inventory.find(item => item.slug === itemSlug).equipped = false;
        },
    }
})

export default useCharacterStore
