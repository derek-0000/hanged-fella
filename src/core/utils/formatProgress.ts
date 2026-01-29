export function formatProgress(progress: string): string {
  const words = progress.split(" ");
  if (words.length <= 1) return progress;

  let result = words[0];
  for (let i = 1; i < words.length; i++) {
    const prevComplete = !words[i - 1].includes("_");
    const currComplete = !words[i].includes("_");
    const separator = prevComplete || currComplete ? " " : "  ";
    result += separator + words[i];
  }
  return result;
}
