---
title: please care for your types
description: a really dramatic reflection on typescript
tags:
  - types
date: 2024-06-11T12:00:00
---

# please care for your types

In the past, there was no type system for Javascript. But now we have Typescript. I used to think that there was a tradeoff between plain old Javascript and Typescript, which you had to consider for any particular project. This is not true. There is no decision to make. Your types must be your prized possession, and the JavaScript merely the plumbing to funnel data from one type to another. Care for your types. Because taking shortcuts will hurt you in less time than it takes you to run your CI build.

Here's the punchline: strong typing means that your code will do what it says it does. You can take this and run with it, for example: not having strong typing means that your code will not do what it says it does. Your code will not do what it says it does, and you will be paralyzed with fear at the smallest code change. Merging to main will spark a pang of adrenaline in your chest. You will be haunted by the alerts, and the bug reports, and the jira tickets and incident reviews and the zoom call with someone who just doesn't understand that it could have all been prevented if anyone had objected to that @ts-ignore.

Types are a secret language. Hover over a variable and your editor reveals all forms it will ever take, at any instant in time. An if statement narrows its possibilities. A function reshapes it. Another produces something new. When you write types, you speak to the life of data. In a few words you lay out the shape of an object, and the compiler flows its types, like water from a spring, into every variable in the deepest reaches of your codebase. You say what you need and what you will do in return. You can chisel out types which are concrete, faithfully representing that blob of JSON. Or you can speak into existence a whole world of meanings and promises; ideas that exist only in the ephemeral realm of the compiler, fulfilling their purpose in your editor and then vanishing the instant your bundles are emitted. When you learn to read the language, you gain meaning from code that could never be expressed so perfectly in words, and would instantly be outdated regardless.

Types are a curse. If you are fluent in types, you will eventually find bugs. And then you will find a pattern of bugs. And you will grow old and weary realizing that they could simply have never existed. You will spend a month repairing half of the confidently incorrect types emitted by a compiler that's doing its best with an "as any" hammered out in two seconds. As you work through a harrowing refactor, you will thoughtfully inspect the tangled machine in front of you. You will do your best to write truer types; to leave the code better than you found it. But you will make mistakes. You will begin to feel that you live in a brittle house. You will lament the fact that code can't be moved and massaged under the guidance of strong types. You will be sad that someone didn't think to be kind to their types.

Types aren't an afterthought to be bolted onto your code, and that means practicing them takes more than an afterthought as well. But it's worth learning how to care for your types. When the code is unfamiliar and the deadline is yesterday, you might find that the types care for you back. 
