# Reusable Dynamic Filter Component System

A generic, configuration-driven data table and filter system designed to work seamlessly with any data schema.

---

## 🛠️ Technology Stack

This application is built with the following core dependencies:

*   **React (v19.2.6):** Leverages the latest React features for UI rendering.
*   **Material-UI (v9.0.1):** Provides the responsive design system, popovers, pagination, and input fields.
*   **Lucide React (v1.16.0):** Provides modern, clean iconography for table controls.
*   **Vite (v8.0.12):** Serves as the high-performance local development server and bundler.
*   **TypeScript (v6.0.2):** Core language providing robust type safety across all filter operations.
*   **Day.js (v1.11.20) / MUI Date Pickers (v9.2.0):** Drives date formatting, parsing, and calendar inputs.

---

## 📥 How to Clone and Run the Project

Follow these commands to get the application running locally:

### 1. Clone the Repository
```bash
git clone <repository-url>
cd edstruments-assignment
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open your browser and navigate to the address shown in the terminal (usually `http://localhost:5173`).

### 4. Build for Production
```bash
npm run build
```

---

## ⚙️ How to Use the Custom Table Component

The system is configuration-driven, meaning you can render a new table and filter system for any data schema by defining a column configuration. You do not need to edit any internal table or filter components.

### 1. Column Configuration
To define a table, you create an array of column settings. Each column supports these properties:
*   **Key:** The field identifier in your dataset (supports nested paths like `address.city` using dot-notation).
*   **Label:** The display name shown in table headers and filter overlays.
*   **Type:** The data type (`text`, `number`, `date`, `boolean`, `select`, `multiSelect`). This decides which operators (e.g., Equals, Between, In, Contains) and input controls (e.g., calendar pickers, checkmarked dropdowns) are rendered.
*   **Sortable / Filterable:** Boolean flags to enable or disable column-level sorting and popover filtering.
*   **Options:** List of key-value choices (used for select and multi-select filters).
*   **Format / Render:** Custom formatter or renderer functions for custom styling or text transformations.

### 2. The state hook (`useFilters`)
The project provides a custom hook `useFilters` that encapsulates all filtering, sorting, pagination, and file-exporting logic. You pass it:
1.  Your raw JSON array.
2.  Your column configuration array.

The hook returns the processed data (filtered, sorted, and paginated) along with pagination states, sort settings, active filters, and handler callbacks.

### 3. Rendering the Table
To display the table, you render the `<CustomTable />` component and pass it the data and handlers returned by the `useFilters` hook:
*   **columns:** Your column configuration array.
*   **data:** The paginated data rows.
*   **loading:** Boolean loading state indicator.
*   **title:** The text displayed at the top of the table.
*   **filters / onApplyFilter / onRemoveFilter / onClearFilters:** States and handler callbacks to build, apply, and clear filters.
*   **sort / onSort:** Active sorting state and click handlers.
*   **page / rowsPerPage / totalRows / onPageChange / onRowsPerPageChange:** Pagination states and handler callbacks.
*   **onExportCSV:** Download handler to trigger CSV extraction.

---

## 💾 State Persistence & Design Decisions

### 1. Local Storage Persistence
All active filters are automatically serialized and stored in the browser's `localStorage` whenever they are created, updated, or removed. This ensures that the user's active filter criteria are preserved across page refreshes and reloads.

### 2. Architectural Choices (Action-Driven vs. Keystroke-Driven)
> [!NOTE]
> I intentionally kept filtering action-driven instead of keystroke-driven because the assignment emphasized reusable architecture and filtering correctness more than UX optimization details like debounce behavior.
>
> Since filtering logic is already isolated in a pure filtering engine, adding debounced filtering later would only require changes at the input interaction layer, not in the core architecture.

