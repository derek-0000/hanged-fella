export class SlackResponse {
  static generateResponse(
    callback: (responses: AppResponses) => Array<string>
  ) {
    const blocks = callback(APP_RESPONSES);

    return blocks.map((block) => ({
      type: "section",
      text: {
        type: "mrkdwn",
        text: block,
      },
    }));
  }
}

type AppResponses = {
  createGameSuccess: (
    gameId: string,
    user: string,
    guessProgress: string
  ) => Array<string>;
  alreadyGuessed: (guess: string) => Array<string>;
  createGameError: Array<string>;
  wrongGuess: (guess: string, attempt: number) => Array<string>;
  genericError: Array<string>;
  successfulGuess: (guess: string, progress: string) => Array<string>;
  wrongAction: Array<string>;
  help: Array<string>;
  won: (progress: string) => Array<string>;
  alreadyWon: Array<string>;
  loss: (answer: string) => Array<string>;
};

export const APP_RESPONSES: AppResponses = {
  won: (answer: string) => [
    `:trophy: Congratulations! You've won the game! The answer was *"${answer}"*.`,
  ],
  createGameSuccess: (gameId: string, user: string, guessProgress: string) => [
    `*${user} has sent you a game of Hanged Fella! Game ID: ${gameId}*`,
    `> Current Progress: ${guessProgress}`,
    `_Send an answer by using the \`/hangedfella answer ${gameId} "Your guess"\` command!_`,
  ],
  createGameError: [
    ":warning: There was an error creating the game. Please try again later.",
  ],
  successfulGuess: (guess: string, progress: string) => [
    `:tada: Great job! The letter *"${guess}"* is in the answer!`,
    `> Current Progress: ${progress}`,
  ],
  wrongGuess: (guess: string, attempt: number) => [
    `:x: The letter *"${guess}"* is not in the answer. Try again!`,
    HANGED_FELLAS[attempt],
  ],
  alreadyGuessed: (guess: string) => [
    `You have already guessed: *"${guess}"*. Try a different one!`,
  ],
  genericError: ["An unexpected error occurred. Please try again later."],
  wrongAction: [
    "Oomph!. This action does not exist. Use `/hangedfella help` to see available actions.",
  ],
  help: [
    "*Slack Hanged Man*",
    '`/hangedfella Start "answer"` - Start a new game session with the specified answer.',
    '`/hangedfella answer game_id "letter"` - Submit a letter guess for the specified game.',
    "`/hangedfella help` - Display this help message.",
    "_App developed by [eternal_garden](https://github.com/derek-0000)_",
  ],
  alreadyWon: [
    `:trophy: This game has already been won! Start a new game to play again.`,
  ],
  loss: (answer: string) => [
    `:skull_and_crossbones: You've lost the game! The correct answer was *"${answer}"*. Better luck next time!`,
    HANGED_FELLAS[6],
  ],
};

const HANGED_FELLAS = [
  ` +---+
  |     |
        |
        |
        |
        |
=========`,
  ` +---+
  |     |
  O     |
        |
        |
        |
=========`,
  ` +---+
  |     |
  O     |
  |     |
        |
        |
=========`,
  ` +---+
  |     |
  O     |
 /|     |
        |
        |
=========`,
  ` +---+
  |     |
  O     |
 /|\    |
        |
        |
=========`,
  ` +---+
  |     |
  O     |
 /|\    |
 /      |
        |
=========`,
  ` +---+
  |     |
  O     |
 /|\    |
 / \    |
        |
=========`,
];
