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