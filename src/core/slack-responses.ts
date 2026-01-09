export class SlackResponse {
  static generateResponse(
    callback: (responses: AppResponses) => Array<string>,
    type: "in_channel" | "ephemeral" = "in_channel"
  ) {
    const blocks = callback(APP_RESPONSES);

    const arrBlocks = blocks.map((block) => ({
      type: "section",
      text: {
        type: "mrkdwn",
        text: block,
      },
    }));

    return {
      response_type: type,
      blocks: arrBlocks,
    };
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
  help: Array<string>;
  won: (progress: string) => Array<string>;
  alreadyWon: Array<string>;
  loss: (answer: string) => Array<string>;
  shareGameSuccess: (
    gameId: string,
    user: string,
    guessProgress: string
  ) => Array<string>;
};

export const APP_RESPONSES: AppResponses = {
  won: (answer: string) => [
    `:trophy: Congratulations! You've won the game! The answer was *"${answer}"*.`,
  ],
  createGameSuccess: (gameId: string, user: string, guessProgress: string) => [
    `*You have created a game of Hanged Fella!*`,
    `> Game ID: ${gameId}`,
    `> Progress: ${guessProgress}`,
    `_Share this game with the_ /hf-share ${gameId} _command!_`,
  ],
  shareGameSuccess: (gameId: string, user: string, guessProgress: string) => [
    `*${user} has invited you to play Hanged Fella!*`,
    `> Game ID: ${gameId}`,
    `> Progress: ${guessProgress}`,
    `_Send a guess by using the_ /hf-guess ${gameId} $guess _command!_`,
  ],
  createGameError: [
    ":warning: There was an error creating the game. Please try again later.",
  ],
  successfulGuess: (guess: string, progress: string) => [
    `The letter *"${guess}"* is in the answer! :tada:`,
    `> Progress: ${progress}`,
  ],
  wrongGuess: (guess: string, attempt: number) => [
    `:x: The letter *"${guess}"* is not in the answer!`,
    HANGED_FELLAS[attempt],
  ],
  alreadyGuessed: (guess: string) => [
    `You have already guessed: *"${guess}"!*`,
  ],
  genericError: ["An unexpected error occurred."],
  help: [
    "*Hanged Fella*",
    "`/hf-start $answer` - Start a new game session with the specified answer.",
    "`/hf-guess $gameId $guess` - Submit a letter guess for the specified game.",
    "`/hf-help` - Display this help message.",
    "_App developed by (eternal_garden)[https://github.com/derek-0000]_",
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
  `+---+
  |     |
  O     |
        |
        |
        |
=========`,
  `+---+
  |     |
  O     |
  |     |
        |
        |
=========`,
  `+---+
  |     |
  O     |
 /|     |
        |
        |
=========`,
  `+---+
  |     |
  O     |
 /|\    |
        |
        |
=========`,
  `+---+
  |     |
  O     |
 /|\    |
 /      |
        |
=========`,
  `+---+
  |     |
  O     |
 /|\    |
 / \    |
        |
=========`,
];
