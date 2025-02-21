const randomBodybuildingEmoji = () => {
    const emojis = ['🏋️', '💪', '🦍', '🦾', '🏅', '🏋️‍♂️', '🏋️‍♀️', '🏆', '🔥', '🎯']
    return emojis[Math.floor(Math.random() * emojis.length)];
}

const randomBodybuildingEmojis = (count) => {
    return Array.from({ length: count }, () => randomBodybuildingEmoji());
}

const randomFoodEmoji = () => {
    const emojis = ['🍕', '🍔', '🍟', '🌭', '🍗', '🥗', '🥪', '🌮', '🍜', '🍝', '🍚', '🥘', '🥞', '🥖', '🥐', '🥨', '🥯', '🍳', '🥚', '🥓', '🧀', '🥩', '🥙', '🌯', '🍱', '🍲', '🥣', '🥗', '🍿', '🥫'];
    return emojis[Math.floor(Math.random() * emojis.length)];
}

const randomFoodEmojis = (count) => {
    return Array.from({ length: count }, () => randomFoodEmoji());
}

export { randomBodybuildingEmoji, randomBodybuildingEmojis, randomFoodEmoji, randomFoodEmojis };