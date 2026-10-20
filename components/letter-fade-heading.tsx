"use client";

export function LetterFadeHeading({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const words = text.split(" ");
  const wordStartIndex = words.map(
    (_, wi) => words.slice(0, wi).reduce((acc, w) => acc + w.length, 0) + wi,
  );

  return (
    <h1 className={className} aria-label={text}>
      <span aria-hidden="true">
        {words.map((word, wordIndex) => (
          <span key={wordIndex}>
            <span className="inline-block whitespace-nowrap">
              {word.split("").map((char, charIndex) => {
                const delay = (wordStartIndex[wordIndex] + charIndex) * 0.018;
                return (
                  <span
                    key={charIndex}
                    className="inline-block animate-fade-up"
                    style={{ animationDelay: `${delay}s` }}
                  >
                    {char}
                  </span>
                );
              })}
            </span>
            {wordIndex < words.length - 1 ? " " : ""}
          </span>
        ))}
      </span>
    </h1>
  );
}
