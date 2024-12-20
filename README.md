# Bankist App 💸

Bankist is a minimal banking application that allows users to log in, view transaction history, check their balance, transfer money, request loans, and delete their accounts. This project is an interactive example of handling finances using basic operations with a simulated user interface, using JavaScript, HTML, and CSS.

---

## Features ✨

- **Login and Authentication** 🔐
  - Users can log in by entering their username and PIN.
  - Session automatically logs out after 2 minutes of inactivity, ensuring security.

- **Transaction Display** 📜
  - Displays transaction history with the type of transaction (deposit or withdrawal).
  - Shows transaction dates in a relative format (e.g., "Today", "Yesterday", "X days ago").

- **Balance Calculation** 💰
  - Calculates and displays the user's current balance in their local currency.

- **Income, Outcome, and Interest Summary** 📊
  - Shows total income, total outcome, and interest earned (if deposit > 1% of the total).

- **Money Transfer** 🔄
  - Users can transfer funds to other registered users if the balance is sufficient.
  - Transfers are immediately reflected in both the sender's and receiver's transaction history.

- **Loan Request** 🏦
  - Allows users to request a loan if they have a deposit worth at least 10% of the requested amount.
  - Loan amount is credited after a 3-second delay.

- **Account Deletion** 🗑️
  - Users can delete their account by entering their username and PIN.
  - Deletes the account from the list and hides the UI.

- **Sorting Transactions** 🔀
  - Users can sort transactions in ascending or descending order.

---

## Tech Stack 🛠️

- **HTML**: Structuring the user interface.
- **CSS**: Styling for a simple, responsive layout.
- **JavaScript**: Handles data processing, DOM manipulation, and core functionality.

---

## How It Works 🚀

### 1. Login
- Enter your username and PIN to log in.
- Your session is timed; if there’s no activity for 2 minutes, the app logs you out automatically.

### 2. Viewing Transactions
- Your transactions appear chronologically.
- Each transaction displays the date (relative to today) and type (deposit or withdrawal).

### 3. Balance Calculation
- Your balance updates in real-time as you make deposits, withdrawals, or transfers.
- The balance is formatted according to your account's currency and locale.

### 4. Money Transfers
- You can transfer funds to another user by entering their username and the transfer amount.
- The app checks if you have sufficient balance before completing the transfer.

### 5. Loan Request
- Enter the amount you'd like to request as a loan.
- A loan will only be approved if you have a deposit worth at least 10% of the requested amount.
- Once approved, the amount is added to your balance after a 3-second delay.

### 6. Account Deletion
- To delete your account, enter your username and PIN.
- If verified, your account is deleted, and you’re logged out of the app.

### 7. Sorting Transactions
- Click the sort button to toggle between sorting transactions in ascending or descending order.

---

## Code Overview 🔍

- **Account Data**: Stores account details like owner, movements (transactions), movement dates, currency, and locale.
- **UI Elements**: DOM elements are accessed through `querySelector` for dynamic updates.
- **Functions**:
  - `createUserNames`: Generates a username from the account owner’s initials.
  - `calcCurrDay`: Displays the current date and time in the user’s locale.
  - `calcLocalCurr`: Formats values according to the account’s currency and locale.
  - `displayMovements`: Displays and formats transaction history.
  - `calcCurrentBalance`: Calculates and updates the balance.
  - `calculateAccountStatus`: Calculates and displays income, outcome, and interest.
  - `updateUI`: Refreshes all relevant data when there’s a change in the account (login, transfer, loan, etc.).
  - `logOut`: Starts a countdown timer for automatic logout after inactivity.

---

## Getting Started 🌱

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/bankist-app.git
