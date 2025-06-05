<<<<<<< HEAD
# D0GzBotDB
Multipurpose Bot Dashboard.

A multi-purpose bot dashboard, revolutionizing bot management with a new age setup. Intuitive controls and effortless customization for every aspect of your bot and its integrations.

## Key Features

*   **Core Dashboard:**
    *   **Overview & Analytics:** Visual charts for bot command usage and Pokémon spawn/catch rates (mock data).
    *   **Bot Control Terminal:** (Mock) Interface to start/stop the bot and simulate command execution.
    *   **Global Settings:** Configure welcome/leaving messages, development mode, and (mock) API keys/bot tokens.
*   **Pokémon Integration Module:** (Example of a deep, feature-rich integration)
    *   **Spawn Configuration:** Multi-step wizard to define Pokémon spawn channels, timing, shiny chances, rosters, and rarity percentages.
    *   **User Management:** (Mock) View and manage registered users, their Pokémon, items, and gold.
    *   **Items & Shop Setup:** Configure item drop rates, quantities, cooldowns, and manage items available in the bot's shop with prices and stock.
    *   **Comprehensive Pokédex:** Browse Pokémon, view detailed stats, abilities, moves, evolution chains, and flavor text, powered by PokéAPI. Includes generation and type filtering.
    *   **CPU/AI Battler Setup:** Customize battle UI settings and configure AI opponents with specific Pokémon teams, difficulty levels, and rewards.
    *   **Event Scheduler:** Create and manage timed events like shiny boosts, spawn boosts, XP boosts, etc., with recurrence options.
*   **Twitch Integration Module:**
    *   **Twitch Account Connection:** (Mock) OAuth flow to connect a Twitch user account.
    *   **Stream Integration Settings:** Configure notifications for live streams, VOD link sharing, clip posting, Twitch chat mirroring to/from Discord, follower/subscriber alerts, raid alerts, and automatic subscriber role assignments.
*   **Discord Listener:**
    *   (Mock) Real-time feed simulating activity from selected Discord channels, including user messages and bot actions.
*   **UI Customization Engine:**
    *   **Theme & Layout Customization:** Adjust theme (light/dark/system), font size, layout density, and primary accent color.
    *   **Color Palette ("Colorfy"):** Define a custom color palette (primary, secondary, accent, background, text) for the dashboard with live preview.
    *   **Asset Management:** (Mock) Interface for "My Uploads" to manage custom icons, backgrounds, etc.
*   **Modern User Interface:**
    *   Clean, responsive design built with Tailwind CSS.
    *   Intuitive navigation with a collapsible sidebar.
    *   Dynamic light/dark mode support throughout the application.
    *   Consistent use of UI components like Cards, Buttons, Inputs, Selects, and Step Indicators.

## Tech Stack

*   **Frontend:** React 19, TypeScript
*   **Styling:** Tailwind CSS (loaded via CDN)
*   **Routing:** React Router v6 (using `HashRouter`)
*   **Icons:** Lucide React
*   **Charts:** Recharts
*   **Module System:** Native ES Modules with Import Maps (dependencies loaded via `esm.sh` CDN)

## Getting Started

This project is designed to run directly in a modern web browser that supports ES Modules and Import Maps.

1.  **Clone the repository (or ensure all files are in a single project folder):**
    ```bash
    # If you have Git setup:
    # git clone [your-repository-url]
    # cd [your-project-directory]
    ```
2.  **Open `index.html`:**
    Navigate to the project directory and open the `index.html` file in your preferred web browser.
3.  **Internet Connection:**
    An active internet connection is required as React, Tailwind CSS, and other dependencies are loaded from CDNs (`esm.sh`, `cdn.tailwindcss.com`).
4.  **API Keys & Sensitive Data (Important):**
    *   This dashboard, in its current version, primarily **mocks backend interactions**.
    *   **Discord Bot Token:** The field in "Dashboard" > "Settings" is for local development/testing convenience. **In a production environment, your Discord Bot Token MUST be kept secure on a server and NOT exposed in client-side code or `localStorage`.**
    *   **Google Gemini API Key (or other API Keys):** The "Test API Key" field in Settings is also for local testing and uses `localStorage`. Production API keys for services like Google Gemini must be managed securely on a backend server and accessed via authenticated API calls from the frontend to your backend. **Never embed production API keys directly in frontend code or store them in `localStorage` for a live application.**

## Project Structure

*   `index.html`: Main HTML entry point. Loads Tailwind CSS, defines import maps, and includes the main script.
*   `index.tsx`: Root TypeScript file that renders the React application.
*   `App.tsx`: Defines the main application layout (`Layout`) and all page routes using `react-router-dom`.
*   `constants.ts`: Centralized constants for navigation items, API base URLs, mock data, etc.
*   `types.ts`: TypeScript type definitions and interfaces used throughout the application.
*   `metadata.json`: Project metadata, potentially for platform integrations or PWAs.
*   `dashboard/layout/`: Contains core layout components:
    *   `Layout.tsx`: Main application shell (Sidebar + Header + Content).
    *   `Sidebar.tsx`: Navigation sidebar.
    *   `Header.tsx`: Top application header.
    *   `Terminal.tsx`: Mock terminal component.
    *   `constants.ts`: (Note: This file is largely redundant and should ideally be merged with/removed in favor of the root `constants.ts`).
*   `pages/`: Directory containing all page-level components, organized by feature:
    *   `dashboard/`: Settings page, Control Terminal page.
    *   `pokemon/`: Dashboard/Overview, Spawn Config, User Management, Pokedex, etc.
    *   `discord-listener/`: Discord activity feed page.
    *   `ui-customization/`: My Uploads, Customize, Colorfy, Connect User (Twitch) pages.
    *   `twitch/`: Twitch Integration Settings page.
*   `ui/`: Reusable UI components like `Button.tsx`, `Card.tsx`, `Input.tsx`, `Select.tsx`, `StepIndicator.tsx`, `ToggleSwitch.tsx`, `Textarea.tsx`.
*   `BotAnalysis.tsx`: Component for displaying bot analytics charts on the dashboard overview.
*   `useStepForm.ts`: Custom React hook for managing multi-step form logic.

## Future Enhancements

*   **Full Backend Integration:** Develop a secure backend (e.g., Node.js with Express) to:
    *   Handle live Discord bot operations.
    *   Securely manage and use API keys (Discord, Google Gemini, Twitch, etc.).
    *   Persist all configurations and user data in a database.
    *   Implement robust user authentication and authorization.
*   **Expanded Bot Integrations:** Add modules for other services or game integrations.
*   **Advanced UI Options:** More granular control over themes, layouts, and component styles.
*   **Internationalization (i18n):** Support for multiple languages.
*   **Real-time Collaboration:** Features for multiple admins to manage the bot.

## Contributing

Contributions are welcome! If you'd like to contribute, please fork the repository and submit a pull request. For major changes, please open an issue first to discuss what you would like to change.

*(Standard contribution guidelines would follow here)*

## License

*(Specify a license, e.g., MIT License)*

This project is licensed under the MIT License. See the `LICENSE` file for details.
=======
# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
>>>>>>> 85652cc (Initial commit of D0GzBot Dashboard project files)
