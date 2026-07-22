# Nikigo Learn V4 Playwright validation

## Scope

- Prototype only: `artifacts/nikigo-learn-v4-brilliant-inspired`
- Viewports: 390×844, 768×1024, 1440×1024
- Languages: 简体中文, English, Tiếng Việt, 日本語
- States: K0 path, K1 path, current module, completed module, available module, Lesson 6 gate, module detail

## Results

- 390px horizontal overflow: none in all four languages (`scrollWidth === clientWidth === 390`).
- Text clipping in headings, paragraphs and controls: none detected in all four languages.
- Stage tabs: two real stages only; current stage includes a visible text label and `aria-selected`.
- Keyboard: selected Stage receives focus; Left/Right/Home/End change Stage and preserve focus.
- Module detail: URL preserves `stage` and `module`; browser back and in-page return restore the Stage path state.
- One strongest action: exactly one `.primary-action` on each K0/K1 Stage path fixture.
- Lesson 6: freely visible in detail as `音频准备中` with `进入预览`; module reports `3/4 · 当前可完成内容已学完` and `1课音频准备中`.
- Reduced motion: media query matches; smooth scrolling is disabled and transitions reduce to effectively zero duration.
- Console errors: 0.
- Failed network requests: 0.
- External network requests: 0.
- Generated asset requests: local files only.

## Notes

- Fixtures exist only to demonstrate the isolated prototype. They are not wired to production state or course completion.
- The prototype's lesson actions announce that no formal lesson is opened.
- The Nikigo five-item navigation is preserved; non-Learn items are intentionally inert in this isolated page.
