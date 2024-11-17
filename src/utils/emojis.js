const randomBodybuildingEmoji = () => {
    const emojis = ['🏋️', '💪', '🦍', '🦾', '🏅', '🏋️‍♂️', '🏋️‍♀️', '🏆', '🔥', '🎯']
    return emojis[Math.floor(Math.random() * emojis.length)];
}

const randomBodybuildingEmojis = (count) => {
    return Array.from({ length: count }, () => randomBodybuildingEmoji());
}

export { randomBodybuildingEmoji, randomBodybuildingEmojis };