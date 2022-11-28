# ./webclient

This folder is a part of our apps monorepo and consists of our react powered web app.


## Installation

First, you need to ensure that Node.js is up and running on your system.


## Development

Our web app bootstrapped with [React](https://reactjs.org/) and [Next.js](https://nextjs.org/) as its main components. You can follow their manual pages to troubleshoot or development.

Also, its design system heavily uses [PostCSS](https://postcss.org) and [Tailwind CSS](https://tailwindcss.com/), you may want to check their reference manuals also.


## Getting Started

First, install modules for core layer and the web client:

```bash
cd ../core
yarn

cd ../webclient
yarn
```

run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Testing The Re-order Feature

To test the re-order feature, first you need to follow the above sections then after you run the command `npm run dev` and open `http://localhost3000` you should navigate to the demo dasboard. In the dashboard you will see four different charts which are draggable from the bottom right icon that is visible on hover state.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
