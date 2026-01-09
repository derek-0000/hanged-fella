type TextType = "mrkdwn" | "plain_text";
type Block = [content: string, type: TextType];
type Blocks = Block[];

export class SlackResponse {
  static generateResponse(
    callback: (responses: AppResponses) => Blocks,
    type: "in_channel" | "ephemeral" = "in_channel"
  ) {
    const blocks = callback(APP_RESPONSES);

    return {
      response_type: type,
      blocks: blocks.map(([content, textType]) => ({
        type: "section",
        text: { type: textType, text: content },
      })),
    };
  }
}

type AppResponses = {
  createGameSuccess: (
    gameId: string,
    user: string,
    guessProgress: string
  ) => Blocks;
  shareGameSuccess: (
    gameId: string,
    user: string,
    guessProgress: string
  ) => Blocks;
  alreadyGuessed: (guess: string) => Blocks;
  wrongGuess: (guess: string, attempt: number) => Blocks;
  successfulGuess: (guess: string, progress: string) => Blocks;
  won: (answer: string) => Blocks;
  loss: (answer: string) => Blocks;
  createGameError: Blocks;
  genericError: Blocks;
  help: Blocks;
  alreadyWon: Blocks;
};

export const APP_RESPONSES: AppResponses = {
  won: (answer: string) => [
    [
      `:trophy: Congratulations! You've won the game! The answer was *"${answer}"*.`,
      "mrkdwn",
    ],
  ],
  createGameSuccess: (gameId: string, user: string, progress: string) => [
    [`*You have created a game of Hanged Fella!*`, "mrkdwn"],
    [`▶️ Game ID: ${gameId}`, "plain_text"],
    [`▶️ Progress: ${progress}`, "plain_text"],
    [`_Share this game with_ /hf-share ${gameId}`, "mrkdwn"],
  ],
  shareGameSuccess: (gameId: string, user: string, progress: string) => [
    [`*${user} has invited you to play Hanged Fella!*`, "mrkdwn"],
    [`▶️ Game ID: ${gameId}`, "plain_text"],
    [`▶️ Progress: ${progress}`, "plain_text"],
    [`_Send a guess with:_ /hf-guess ${gameId} $guess`, "mrkdwn"],
  ],
  createGameError: [
    [
      ":warning: There was an error creating the game. Please try again later.",
      "mrkdwn",
    ],
  ],
  successfulGuess: (guess: string, progress: string) => [
    [`The letter *"${guess}"* is in the answer! :tada:`, "mrkdwn"],
    [`▶️ Progress: ${progress}`, "plain_text"],
  ],
  wrongGuess: (guess: string, attempt: number) => [
    [`:x: The letter *"${guess}"* is not in the answer!`, "mrkdwn"],
    [HANGED_FELLAS[attempt], "mrkdwn"],
  ],
  alreadyGuessed: (guess: string) => [
    [`You have already guessed: *\"${guess}\"!*`, "mrkdwn"],
  ],
  genericError: [["An unexpected error occurred.", "mrkdwn"]],
  help: [
    ["*Hanged Fella*", "mrkdwn"],
    [
      "`/hf-start $answer` - Start a new game session with the specified answer.",
      "mrkdwn",
    ],
    [
      "`/hf-guess $gameId $guess` - Submit a letter guess for the specified game.",
      "mrkdwn",
    ],
    ["`/hf-help` - Display this help message.", "mrkdwn"],
    [
      "_App developed by [eternal_garden](https://github.com/derek-0000)_",
      "mrkdwn",
    ],
  ],
  alreadyWon: [
    [
      ":trophy: This game has already been won! Start a new game to play again.",
      "mrkdwn",
    ],
  ],
  loss: (answer: string) => [
    [
      `:skull_and_crossbones: You've lost the game! The correct answer was *"${answer}"*. Better luck next time!`,
      "mrkdwn",
    ],
    [HANGED_FELLAS[5], "mrkdwn"],
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
