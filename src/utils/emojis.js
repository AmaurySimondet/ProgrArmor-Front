const randomBodybuildingEmoji = () => {
    const emojis = ['🏋️', '💪', '🦍', '🦾', '🏅', '🏋️‍♂️', '🏋️‍♀️', '🏆', '🔥', '🎯']
    return emojis[Math.floor(Math.random() * emojis.length)];
}

export { randomBodybuildingEmoji };