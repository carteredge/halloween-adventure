// import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

const useCharacterStore = defineStore('character', {
  state: () => ({
    archetypes: [],
    braaains: 0,
    defense: 5,
    guts: 0,
    hp: 10,
    injuries: 0,
    maxHP: 10,
    mayhem: 0,
    murder: 0,
    signatures: [],
    speed: 5,
    specializations: [],
    spookiness: 0,
  })
});

export default useCharacterStore;