# NL to ER Diagram

This is a web application that takes a natural language description and generates a corresponding Entity-Relationship (ER) diagram. The project is composed of a client-side (React) and a server-side (Node.js/Express) component.

## Technologies Used

### Frontend (Client)

* **React:** Used for building the user interface.
* **ERCanvas:** A custom component to render the ER diagram using SVG.
* **EnglishInput:** A component for user input.
* **Utils:** Includes utilities for parsing ER data from the server and exporting the generated diagram as SVG or PNG.

### Backend (Server)

* **Node.js/Express:** A lightweight server to handle API requests.
* **Gemini API:** A generative AI model used to parse the natural language input and convert it into a structured JSON format representing the ER diagram.
* **dotenv:** Manages environment variables, such as the `GEMINI_API_KEY`.
* **node-fetch:** Used to make API calls to the Gemini service.
* **cors:** Enables cross-origin resource sharing for communication between the client and server.

---

## Setup and Installation

Follow these steps to get the project running on your local machine.

### Step 1: Install Dependencies

You'll need to install dependencies for both the client and server.

1.  **Navigate to the client directory and install dependencies:**
    ```bash
    cd client
    npm install
    ```
2.  **Navigate to the server directory and install dependencies:**
    ```bash
    cd ../server
    npm install
    ```

### Step 2: Configure the Gemini API Key

The server needs an API key to communicate with the Gemini model.

1.  **Obtain a Gemini API key** from Google AI Studio.
2.  **Create a `.env` file** in the `server` directory.
3.  **Add your API key** to the `.env` file in the following format:
    ```
    GEMINI_API_KEY=your_api_key_here
    ```

### Step 3: Run the Application

You need to run both the server and the client simultaneously.

1.  **Start the server:** Open a terminal, navigate to the `server` directory, and run:
    ```bash
    npm start
    ```
    The server will start on `http://localhost:5000`.

2.  **Start the client:** Open a new terminal window, navigate to the `client` directory, and run:
    ```bash
    npm start
    ```
    The application will open in your browser at `http://localhost:3000`.

You can now use the application to describe an ER diagram in plain English and see it generated visually.
