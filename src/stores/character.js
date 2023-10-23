// import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

const useCharacterStore = defineStore('character', {
  state: () => ({
    archetypes: [],
    braaains: "",
    defense: 5,
    guts: "",
    hp: 10,
    injuries: 0,
    maxHP: 10,
    mayhem: "",
    murder: "",
    signatures: [],
    speed: 5,
    specializations: [],
    spookiness: "",
  })
});

export default useCharacterStore;