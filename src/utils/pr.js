// utils/pr.js
export const isPersonalRecord = async (set) => {
    // Simulate an API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Randomly return true or false to simulate PR status
    return Math.random() < 0.3; // 30% chance to be a PR
};
