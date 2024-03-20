---
title: React Suspense in 2 minutes
description: very short, by-example intro to using React Suspense for data fetching
tags:
  - React
  - Suspense
  - hooks
date: 2023-11-03T12:00:00
---

# React Suspense in 2 minutes

[Suspense][suspense] can make async tasks easier to deal with. In general, anything involving a [Promise][promise] is async. One situation where async tasks come up a lot is data fetching.

Let's start with a simple example **without** using Suspense. We can use the [SWR library][swr] to hit the Weather.gov API:

```tsx
import useSWR from 'swr';
import {useEffect} from 'react';

const endpoint = `https://api.weather.gov/stations/KSEA/observations/latest`;
const fetcher = (url: string) => fetch(url).then((response) => response.json());

export default function App() {
  return <MyComponent />;
}

function MyComponent() {
  const {data, isLoading, error} = useSWR(endpoint, fetcher);

  useEffect(() => {
    if (data && !isLoading && !error) {
      // just an example
      console.log(data);
    }
  }, [data, isLoading, error]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error!</div>;
  }
  return (
    <div>Temperature in Seattle: {data.properties.temperature.value}°C</div>
  );
}
```

[View in sandbox](https://codesandbox.io/s/fetch-no-suspense-3wm39p?file=/src/App.tsx)

Notice how there's a lot of fanfare just to access `data`! Before we access it, we always have to make sure it's in the right state (not loading, and not errored). With Suspense, we can rewrite the same example like this:

```tsx
import useSWR from 'swr';
import {Suspense, useEffect} from 'react';
import {ErrorBoundary} from 'react-error-boundary';

const endpoint = `https://api.weather.gov/stations/KSEA/observations/latest`;
const fetcher = (url: string) => fetch(url).then((response) => response.json());

export default function App() {
  return (
    <ErrorBoundary fallback={<div>Error!</div>}>
      <Suspense fallback={<div>Loading...</div>}>
        <MyComponent />
      </Suspense>
    </ErrorBoundary>
  );
}

function MyComponent() {
  const {data} = useSWR(endpoint, fetcher, {suspense: true});

  useEffect(() => console.log(data), [data]);

  return (
    <div>Temperature in Seattle: {data.properties.temperature.value}°C</div>
  );
}
```

[View in sandbox](https://codesandbox.io/s/fetch-suspense-nv8vs8?file=/src/App.tsx)

There's less noise there!

In the first example, we had to write out what to do in order. If loading, show a loading screen; if an error occurred, show an error screen. With Suspense, we say "show this for any errors" and "show that if anything is loading". It's more _declarative_. Here we're using an [error boundary][error boundary] (provided by [react-error-boundary][react-error-boundary]) and the [`<Suspense>` component][suspense]. Any errors or loading states that happen inside `<MyComponent>` are taken care of.

In my experience, this can be really helpful in simplifying component logic. Hooks _must_ be called unconditionally. In the first example, that means we can't just move the `useEffect()` after the loading and error checks. I find myself repeating conditionals to check the state of the data in each hook call. Suspense can eliminate a lot of extra `if` statements.

Another great feature is that it can combine any number of loading states at a single `<Suspense>` boundary. That means that child components can do data fetching on their own. Then, there's just one loading indicator and no jank as each child loads.

Looking for a deeper dive into Suspense? Check out [DIY Suspense in React](/blog/diy-suspense-in-react).

[suspense]: https://react.dev/reference/react/Suspense
[swr]: https://swr.vercel.app/
[promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[error boundary]: https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
[react-error-boundary]: https://github.com/bvaughn/react-error-boundary
