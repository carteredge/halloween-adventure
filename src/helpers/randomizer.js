export function randomListItem(list) {
    return list[Math.floor(Math.random() * list.length)];
}

export function randomlySelectSubset(data, count) {
    const dataClone = [...data];
    const results = [];
    for (let i = 0; i < count; i++) // if dataClone.length === 0
        results.push(dataClone.splice(Math.floor(Math.random() * dataClone.length), 1)[0]);
    return results;
}

export function randomlySelectSubsetByWeights(data, count, weights, runAfter) {
    const dataClone = [...data];
    const results = [];
    const weightsClone = [...weights];
    for (let i = 0; i < count; i++) {
        const item = weightedRandomListItem(dataClone, weightsClone);
        const index = dataClone.indexOf(item);
        results.push(item);
        dataClone.splice(index, 1);
        weightsClone.splice(index, 1);
        if (typeof runAfter === "function") {
            runAfter(results, dataClone, weightsClone);
        }
    }
    return results;
}

export function weightedRandomListItem(list, weights) {
    let idx = 0;
    let p = Math.random() * weights.reduce((p1, p2) => p1 + p2);
    while (p > 0) {
        if (p < weights[idx])
            return list[idx];
        p -= weights[idx]; idx++;
    }
}