---
title: DIY Suspense in React
description: writing code that suspends to make your components feel synchronous
tags:
  - React
  - Suspense
  - hooks
date: 2023-10-16
---

# DIY Suspense in React

When I started learning the new features in [React 18][react 18], I was pretty interested in Suspense. Suspense lets authors build libraries that do asynchronous tasks, like fetching data, in a way that's easier for developers to use. Instead of having to track whether data is loading, developers can write components like the data is available instantly. It can serve a similar role to `async/await` in that it makes a Promise look synchronous.

The thing is, when I read [the React docs][react suspense docs], I only really learned how to use the `<Suspense>` component. `<Suspense>` is a wrapper component that displays a _fallback state_ (e.g. loading spinner) when any of its children _suspend_. But that doesn't tell me how to write something that suspends. It only tells me how to work with things that already suspend.

I think that the React team [doesn't intend][suspense in data frameworks] for you as a developer to write the code that _does the suspending_. Instead, they imagine that you'll use libraries which are already integrated with Suspense. In that case, all you need to do is handle the fallback states with the `<Suspense>` component. They likely have thought a lot about this.

But this isn't super satisfying to me—it feels like I've only seen half the API. So here's a very basic overview of the suspending part of it. Even if this has limited pracitcality, I think it's helped my mental model to understand the basics of how it works. Keep in mind that Suspense is based on promises, so you'll need to know how they work first.

## How to suspend

Let's create a function called `readHelloWorld()`. It will simulate data fetching by suspending for one second, then return the string "Hello world!". Here's how we'll use it:

```tsx
function MyComponent() {
  return <div>React says: {readHelloWorld()}</div>;
}

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyComponent />
    </Suspense>
  );
}
```

When we render `<MyPage>`, the result should be this:

1. The user sees a "Loading..." for one second
2. The loading indicator is replaced with: "React says: Hello world!"

Let's look at how we can implement `readHelloWorld`.

### Throw a promise

`readHelloWorld` is a getter function that suspends for a second before returning a value. By convention, we name it `read`—because it can suspend.

To suspend, we need a Promise that represents the thing we're waiting for. For this example, we'll create a Promise that resolves after a 1-second timeout:

```tsx
const helloWorldPromise = new Promise((resolve) => {
  setTimeout(() => {
    resolve('Hello world!');
  }, 1000);
});
```

Let's store the result when the promise resolves:

```tsx
let helloWorld;

helloWorldPromise.then((result) => {
  helloWorld = result;
});
```

Now, we can implement `readHelloWorld`:

```tsx
function readHelloWorld() {
  if (!helloWorld) {
    throw helloWorldPromise;
  }
  return helloWorld;
}
```

That's it!

Here's a [sandbox][simple sandbox] where you can try this out.

Let's walk through what happens during the first render:

1. `MyComponent` calls `readHelloWorld()`
1. `helloWorld` is undefined, so the function throws `helloWorldPromise`
1. React catches the promise at the nearest `<Suspense>`
1. The render did not complete, so the children are replaced with the`fallback`

Roughly a second passes and the promise resolves. Then:

1. React rerenders the children of the `<Suspense>` **from scratch**, as if they were remounted
1. `MyComponent` calls `readHelloWorld()` again
1. `helloWorld` contains the result, so the function returns normally and rendering completes

React treats thrown promises separately from thrown errors. Promises propagate to the nearest `<Suspense>` boundary, while errors propagate to the nearest [Error Boundary][error boundary], or are thrown if no error boundaries exist.

### TL;DR

To suspend, we throw a promise. The React tree is replaced with the fallback state at the nearest `<Suspense>` boundary. When the promise resolves, React rerenders the children of the `<Suspense>` boundary. This time, we don't throw the Promise, and the rendering completes.

## A more detailed example

The above example isn't very practical, because there's only one promise and one _resource_ being read: the helloWorld string. Below, I'll implement a simple Suspense wrapper for `fetch` with caching.

```tsx
const stationID = 'KSEA'; // Seattle
const endpoint = `https://api.weather.gov/stations/${stationID}/observations/latest`;

const promises = new Map<string, Promise<Response>>();
const results = new Map<string, any>();

const fetchJson = (url) => {
  // initiate the request and update the global stores
  let promise = promises.get(url);
  if (!promise) {
    promise = fetch(url);
    promise
      .then((response) => response.json())
      .then((json) => results.set(url, json));
    promises.set(url, promise);
  }

  // create a "resource" that can be read
  return {
    read() {
      const result = results.get(url);
      if (!result) {
        throw promise;
      }
      return result;
    },
  };
};

function MyComponent() {
  const result = fetchJson(endpoint); // fetching starts here
  const data = result.read(); // rendering suspends here
  const temperature = data.properties.temperature.value;

  return <div>The temperature now is {temperature}°C</div>;
}
```

And here's that as a [sandbox][detailed sandbox].

`fetchJson` fires off a request and returns a "resource" whose value can be `read` later. This is one pattern that separates the data fetching from suspending. This means that we could fetch multiple things at once before suspending. Or, we could fetch in a parent component and pass the resource through a `<Suspense>` boundary into a child.

Keep in mind that we need a data store outside of the `<Suspense>` boundary. We need to track when the data is available to decide whether to throw the promise. We can't track this inside a component that's suspending, because its state is reset when it suspends. Here, I just use a global `Map`. But, you could also pass the store down through a React context.

## Just use `use()`

**Note:** `use()` is currently only available in the canary release of React (18.3).

I mentioned how Suspense feels a bit like `await`. It makes a Promise look synchronous by interrupting rendering and restarting once the promise resolves. I also mentioned how the React team is a bit hesitant about people writing their own code that suspends.

Luckily, there's a cool upcoming hook called `use`. Yep, just `use`. It's very straightforward:

> `use` is a React Hook that lets you **read the value of a resource like a Promise** or context.
> —[the docs][use docs]

But it's actually more powerful than a hook, and closer to a regular function:

> Unlike all other React Hooks, `use` can be called within loops and conditional statements like `if`. Like other React Hooks, the function that calls use must be a Component or Hook.

To me, this looks like a Suspense-based `await`!

In both of our examples from before, we could simply `use()` the promises instead of suspending manually and dealing with state.

Here's the data fetching example rewritten with `use`:

```tsx
const promises = new Map<string, Promise<any>>();

const fetchJson = (url) => {
  let promise = promises.get(url);
  if (!promise) {
    promise = fetch(url).then((response) => response.json());
    promises.set(url, promise);
  }
  return promise;
};

function MyComponent() {
  const result = fetchJson(endpoint); // fetching starts here
  const data = use(result); // rendering suspends here
  const temperature = data.properties.temperature.value;

  return <div>The temperature now is {temperature}°C</div>;
}
```

And a [sandbox][use sandbox]

[react 18]: https://react.dev/blog/2022/03/29/react-v18
[react suspense docs]: https://react.dev/reference/react/Suspense
[suspense in data frameworks]: https://react.dev/blog/2022/03/29/react-v18#suspense-in-data-frameworks
[simple sandbox]: https://codesandbox.io/s/simple-suspense-z2xhgv
[detailed sandbox]: https://codesandbox.io/s/simple-data-fetching-2rl9jg
[use sandbox]: https://codesandbox.io/s/use-data-fetching-7f3cvh
[error boundary]: https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
[use docs]: https://react.dev/reference/react/use
