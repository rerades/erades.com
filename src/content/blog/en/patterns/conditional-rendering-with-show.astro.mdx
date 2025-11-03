---
title: "Explicit Conditional Rendering"
description: "A functional and maintainable pattern for conditionally displaying UI fragments without overusing logical or ternary operators."
pubDate: 2025-07-28
categories:
  - design patterns
tags:
  - Astro
  - Functional UI
  - JSX
  - Components
  - patterns
draft: false
heroImage: /blog-placeholder-23.jpg
---

In JSX-based environments like Astro, conditionally rendering content blocks is a common task. But if you overuse ternaries or `&&`, the code ends up looking like a riddle.

This pattern proposes encapsulating visibility logic into a semantic and reusable component: `ShowWhen.astro`.

## The Problem

```astro
<section>
  {
    currentPage === 1 && (
      <div>
        <h2>{t(lang, "blogList.title")}</h2>
        <p>{t(lang, "blogList.description")}</p>
      </div>
    )
  }
</section>
```

This pattern is **functional, but opaque.** The `&&` requires understanding precedence and structure. Writing more complex or nested logic breaks it.

## The Solution:

We create a dedicated component to represent the _semantic intent_: display content if a condition is met.

### `components/ShowWhen.astro`

```astro
---
const { when, children } = Astro.props;
---

{when && children}
```

**As simple as that.** Any JSX block can now be explicitly shown or hidden.

## Usage Example

```astro
---
import ShowWhen from "~/components/ShowWhen.astro";
---

<section>
<ShowWhen when={currentPage === 1}>
    <div>
        <h2>{t(lang, "blogList.title")}</h2>
        <p>{t(lang, "blogList.description")}</p>
      </div>
</ShowWhen>
</section>
```

## Advantages

- ✅ **Readability**: The `when` prop conveys intent. No need to decode expressions.
- ✅ **Reusability**: Can be extended with logging, debug traces, or entry/exit animations.
- ✅ **Separation of concerns**: Visibility logic is abstracted away from the main markup.
- ✅ **Works in server components and layouts**: no side effects.

## Variants

We can combine this pattern with more structured alternatives:

```astro
<If condition={isLoading}>
  <Then>
    <Spinner />
  </Then>
  <Else>
    <Content />
  </Else>
</If>
```

While this adds more complexity, it can be useful in branched flows or when reusing declarative logic across multiple places.

## Conclusion

It's not just about making it work. It's about making the code communicate _what it's trying to do_.

The component encapsulates a common UI intention: **show something if a condition is met**.
