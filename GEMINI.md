# Kesari Royale React Project

This project is a React-based e-commerce platform for Kesari Royale, featuring a traditional Bilona Ghee brand.

## Project Structure

- `src/components/`: Reusable UI components (Header, Footer, CartDrawer).
- `src/pages/`: Main page views (Home, Shop, Craft, Reports, Blogs, Contact, Cart).
- `src/context/`: React context for global state (Cart).
- `src/data/`: Static data for products, blogs, reports, etc.
- `src/index.css`: Main stylesheet (currently very large, ~4000 lines).

## Tech Stack

- React 19
- Vite
- React Router (Installed but not yet utilized in `App.jsx`)

## Conventions

- **Routing:** Currently uses a custom `useState` router in `App.jsx`. Plan to migrate to `react-router-dom`.
- **Styling:** Primarily uses global CSS in `index.css`. Modularization is recommended.
- **Data:** Static data files are used for content.

## Pending Tasks

- [ ] Migrate `App.jsx` to use `react-router-dom`.
- [ ] Refactor `index.css` into modular CSS files.
- [ ] Enhance mobile responsiveness for the category marquee.
- [ ] Implement real cart persistence (e.g., localStorage).
- [ ] Add unit tests for context and key components.
