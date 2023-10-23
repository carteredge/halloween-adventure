import { defineStore } from 'pinia'

const useDataStore = defineStore('data', { state: () => ({ data: {} }) });

export default useDataStore;
