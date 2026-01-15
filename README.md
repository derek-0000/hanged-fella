# Slack Hanged Fella

<img width="729" height="393" alt="image" src="https://github.com/user-attachments/assets/e0a11097-8d17-4cb1-a1f5-33c935dc0f9e" />


Hanged Fella is a game where one player picks a word that another player has to guess by guessing letter by letter. Each incorrect guess adds a body part to a hanged fella. You win by guessing the word or loose when the hanged fella is completed

This Slack app allows members of the workspace to play hanged fella with others.

## Commands

- `/hf-create $word` - Creates and stores a new game session for users to make guesses on. The `$word` argument is the word the players have to guess to win. This command also returns the `$gameId` which is necessary to make guesses on a specific game.
- `/hf-share $gameId` - Shares a game session for other players to make guesses on.
- `/hf-guess $gameId $word` - Makes a guess on a game session and returns a `success`, `incorrect`, `already guessed`, `win` or `lose` response.
- `/hf-help` - Returns usefull information about `Hanged Fella` 

## How to use

Hanged Fella is open source so, clone the repository or download the latest release and host the application however fits you the best.
