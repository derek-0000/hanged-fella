export class HangedFella {
  private answerMap = new Map<
    string,
    { positions: Set<number>; guessed: boolean }
  >();
  won = false;
  guessProgress = "";
  attemptCount = 0;

  constructor(answer: string, progress?: string, attemptCount?: number) {
    if (attemptCount) this.attemptCount = attemptCount;
    const normalizedAnswer = answer.trim().toLowerCase();
    for (let i = 0; i < normalizedAnswer.length; i++) {
      const answerCharacter = normalizedAnswer[i];
      const currentCharacter = this.answerMap.get(answerCharacter);
      if (!currentCharacter) {
        this.answerMap.set(answerCharacter, {
          positions: new Set([i]),
          guessed: false,
        });
      } else {
        this.answerMap.set(answerCharacter, {
          positions: new Set([...currentCharacter.positions, i]),
          guessed: false,
        });
      }
    }

    if (progress && progress !== "") {
      this.guessProgress = progress;
      return;
    }

    this.guessProgress = answer.replace(/\S/g, "_");
  }

  updateProgress(guess: string): {
    result: "guessed" | "incorrect" | "won" | "loss";
    progress: string;
    attemptCount?: number;
  } {
    const normalizedGuess = guess.trim().toLowerCase();
    const currentGuess = this.answerMap.get(normalizedGuess);

    if (currentGuess) {
      for (const [character, characterStatus] of this.answerMap.entries()) {
        if (character === normalizedGuess) {
          this.answerMap.set(character, {
            positions: characterStatus.positions,
            guessed: true,
          });
          for (const pos of characterStatus.positions) {
            this.guessProgress =
              this.guessProgress.substring(0, pos) +
              character +
              this.guessProgress.substring(pos + 1);
          }
        }
      }

      if (!this.guessProgress.includes("_")) {
        this.won = true;
        return {
          result: "won",
          progress: this.guessProgress,
        };
      }

      return {
        result: "guessed",
        progress: this.guessProgress,
      };
    } else {
      this.attemptCount += 1;

      if (this.attemptCount >= 6) {
        return {
          result: "loss",
          progress: this.guessProgress,
          attemptCount: this.attemptCount,
        };
      }

      return {
        result: "incorrect",
        progress: this.guessProgress,
        attemptCount: this.attemptCount,
      };
    }
  }
}
