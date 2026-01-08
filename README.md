# Slack Hanged Fella

Hanged Fella is a game where one player picks a word that another player has to guess by guessing letter by letter. Each incorrect guess ads a body part to a hanged fella. You win by guessing the word or loose when the hanged fella is completed

This Slack app allows members of the workspace to play hanged fella with others.

## Commands

The base command to interact with the app is `/hangedfella` and the app provides multiple actions to interact with a game session.

- `/hangedfella start $word` - Starts and stores a new game session for users to make guesses on. The `$word` argument is the word the players have to guess to win. This command also returns the `$gameId` which is necessary to make guesses on a specific game.

- `/hangedfella guess $gameId $letter` - This command makes a guess on a game session and returns a `success`, `incorrect`, `already guessed`, `win` or `lose` response.

## How to use

Hanged Fella is open source so, clone the repository or download the release and host the application however fits you the best.
