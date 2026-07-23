# Web Interface Guidelines Audit

## Structure and semantics

- A single current-task `h1` is rendered per formal step.
- Lesson progress is exposed through a labeled progressbar.
- Diagram parts remain real Korean text in onset, vowel, optional lower-region,
  and assembled-syllable reading order.
- Split questions are grouped and described without requiring drag input.
- Korean targets use Korean text and remain unchanged across interface
  languages.

## Keyboard and focus

- Navigation, answers, builder parts, Split options, audio, retry, and
  completion are native controls.
- All visible controls have at least a 44px target.
- Same-step engine re-renders restore focus locally with `preventScroll`.
- True step changes focus the new learning card.
- `:focus-visible` uses a visible outline and does not rely on color alone.
- Escape keeps formal state intact and returns focus to a stable exit control.

## Feedback and answer privacy

- Correct and incorrect states combine text, border, and background.
- Feedback sits next to the exercise it explains.
- Before answering, no adapter attribute, accessible label, or visible state
  reveals a correct answer.
- The adapter displays only correctness already computed by the formal engine.

## Responsive and language behavior

- Mobile margins remain compact and the approved Classic Focus desktop width
  cap protects line length.
- English, Vietnamese, Japanese, and Chinese can wrap without truncating Korean
  targets or shrinking text below the approved scale.
- No horizontal overflow was observed at 390, 430, 768, or 1440px.

## Motion and network

- Motion is limited to short state transitions.
- Reduced-motion removes nonessential transitions without hiding information.
- Audio controls resolve only exact approved local files.
- TTS, external runtime resources, external API calls, and paid requests are
  absent.
