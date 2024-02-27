import seedrandom from 'seedrandom';


const riddles = [
    {
        "riddle": "What's orange and sounds like a parrot?",
        "answer": "A carrot"
    },
    {
        "riddle": "What has a neck but no head?",
        "answer": "A bottle"
    },
    {
        "riddle": "What is full of holes but still holds water?",
        "answer": "A sponge"
    },
    {
        "riddle": "What gets wetter as it dries?",
        "answer": "A towel"
    },
    {
        "riddle": "What has words but never speaks?",
        "answer": "A book"
    },
    {
        "riddle": "What has keys but can't open locks?",
        "answer": "A piano app"
    },
    {
        "riddle": "What can you catch but not throw?",
        "answer": "A glitch"
    },
    {
        "riddle": "I wake you up but have no voice. What am I?",
        "answer": "An alarm notification"
    },
    {
        "riddle": "What has a screen but can't watch movies?",
        "answer": "A broken smartphone"
    },
    {
        "riddle": "What's always running but has no legs?",
        "answer": "A music streaming app"
    }
];
export const randomRiddle = (seed) => {
    const rng = seedrandom(seed);
    const randomIndex = Math.floor(rng() * riddles.length);
    return riddles[randomIndex];
}
