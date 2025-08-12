Got it ✅
Here’s the **JavaScript/TypeScript Interactive Web Development Style Guide** rewritten fully in English, adapted from the Python style guide you shared.

---

# **Company X JavaScript / TypeScript Style Guide**

## 1. Introduction

This style guide defines the coding conventions for **JavaScript (and TypeScript)** interactive web development at Company X.
It is based on the **Airbnb JavaScript Style Guide**, with modifications tailored to our projects and team workflow.

---

## 2. Key Principles

- **Readability:** Code should be easily understood by all team members.
- **Maintainability:** Code should be easy to modify and extend.
- **Consistency:** Following consistent patterns improves collaboration and reduces errors.
- **Performance:** While readability is the priority, performance should not be ignored.

---

## 3. Modifications from Python PEP 8 Equivalents

### 📏 Line Length

- **Maximum line length:** 100 characters (including comments).
- Break long strings using template literals or concatenation when necessary.

---

### 🏗 Indentation

- **2 spaces** per indentation level (no tabs).
- Apply the same rule in JSX.

---

### 📦 Imports / Exports

- **Order:**

  1. Standard APIs / Node.js built-in modules
  2. External libraries (React, Lodash, etc.)
  3. Internal modules (relative imports)

- Separate each group with a blank line.
- Prefer **ES Modules (`import` / `export`)**.
- Sort imports alphabetically within each group.

---

### 📝 Naming Conventions

- **Variables, functions:** `camelCase` → `userName`, `totalCount`
- **Constants:** `UPPER_CASE` → `MAX_VALUE`, `API_BASE_URL`
- **Classes, React components:** `PascalCase` → `UserManager`, `PaymentForm`
- **Files/modules:** `kebab-case` → `user-utils.js`, `payment-service.ts`

---

### 📄 Comments

- Explain **why** the code exists, not just **what** it does.
- Use complete sentences, starting with a capital letter.
- Use `//` for single-line comments, and `/** */` for multi-line or JSDoc comments.

---

### 📚 Docstrings / JSDoc

- Use **JSDoc** for functions, classes, and complex logic.

```javascript
/**
 * Saves user data to the server.
 *
 * @param {Object} userData - The user information.
 * @param {string} userData.name - User's name.
 * @param {string} userData.email - User's email.
 * @returns {Promise<boolean>} True if save was successful.
 * @throws {Error} If the server request fails.
 */
async function saveUser(userData) {
  // Implementation here
}
```

---

### 🛡 Type Hints

- **Prefer TypeScript** for static type checking.
- When not using TypeScript, add type annotations via JSDoc.

---

### 📜 Commenting Rules

- Place comments above the block or function they describe.
- Avoid unnecessary comments for obvious code.

---

### 🐞 Logging

- Avoid `console.log` in production; use a centralized `logger` utility instead.
- Log levels: `debug`, `info`, `warn`, `error`.
- Include context in log messages.

---

### ⚠ Error Handling

- Use specific error types when possible.
- Wrap async calls in `try...catch` and provide user-friendly error messages.

```javascript
try {
  await fetchData();
} catch (err) {
  logger.error("Failed to fetch data", err);
  showErrorMessage("Please try again later.");
}
```

---

### 🛠 Tooling

- **Formatter:** Prettier (automatic code formatting).
- **Linter:** ESLint (based on Airbnb rules).
- **Type Checking:** TypeScript (strongly recommended).

---

### 📌 Example

```javascript
import React from "react";
import logger from "../utils/logger";
import { saveUser } from "../services/user-service";

/**
 * User registration form component.
 *
 * @returns {JSX.Element} The form element.
 */
function UserForm() {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const user = {
      name: formData.get("name"),
      email: formData.get("email"),
    };

    try {
      const success = await saveUser(user);
      if (success) {
        logger.info(`User saved: ${user.email}`);
        alert("Registration complete!");
      }
    } catch (err) {
      logger.error("Failed to save user", err);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" />
      <input name="email" placeholder="Email" type="email" />
      <button type="submit">Register</button>
    </form>
  );
}

export default UserForm;
```

---

If you want, I can also make a **one-page condensed “cheat sheet” version** of this so your dev team can keep it handy during coding sessions.
