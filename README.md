# Event manager UIC

## Teck stack

- React
- Tailwind
- Express.js
- Mongo.db

## TODOs

- implemnet qr code
  - admins generates the qr code from the serever
    - the server creates the qr code with the time stamps of when it was created and signs with its private key and sends it to the admin
  - the user scans the qr code and send it the server to verify
    - the server recives the qr code and time stamps of when it was scanned
    - the server unsigns it using its public key and then verify the difference of when it was scanned and when it was created
    - the server sends a conformation back to the user

- web scrape <https://today.uic.edu/events/>

- change org login to admin login (talk about it)

- ui for the user
  - dashboard (page)
    - rsvp events (section)
    - upcomming events (section)
    - button to scan the qr code
  - rsvp events (page)
    - contains list of events
  - upcomming events (page)
    - contains list of events
  - event (page)
    - description of the event
    - name of organiztion
    - time and location
    - rsvp button

- ui for the admin
  - admin dashboard
    - list of events
  - event (page)
    - description of the event (edit)
    - name of organiztion (edit)
    - time and location (edit)
    - show qr code for the user to scan

<!-- # React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
``` -->