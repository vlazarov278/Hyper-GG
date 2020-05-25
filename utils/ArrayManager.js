const getRandomElement = (items) => {
    return items[Math.floor(Math.random() * items.length)];
};

const randomIntFromInterval = (min, max) => { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
};

const removeDuplicated = (array) => {
    var set = new Set();
    array.forEach(element => {
        set.add(element);
    });
    return Array.from(set);
}

module.exports = {
    getRandomElement,
    randomIntFromInterval,
    removeDuplicated
}