# CIS-430 Movie Recommendation WebApp

Welcome to the **CIS-430 Movie Recommendation WebApp**! This application provides personalized movie recommendations based on user preferences, leveraging movie reviews and metadata analysis.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Clone the Repository](#clone-the-repository)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
  - [Starting the Backend Server](#starting-the-backend-server)
  - [Starting the Frontend Server](#starting-the-frontend-server)
- [Adding New Dependencies](#adding-new-dependencies)
  - [Backend Dependencies](#backend-dependencies)
  - [Frontend Dependencies](#frontend-dependencies)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Before you begin, ensure you have the following software installed:

- **Python 3.12 or higher**
- **Node.js 20.17 or higher**
- **npm 10.8 or higher** (comes with Node.js)
- **Git**

## Installation

### Clone the Repository

Clone this repository to your local machine:

```bash
git clone https://github.com/akaBryanYT/CIS-430-Movie-Recommendation-WebApp.git
```

Navigate to the project directory:

```bash
cd CIS-430-Movie-Recommendation-WebApp
```

### Backend Setup

1. **Navigate to the Backend Directory**

   ```bash
   cd backend
   ```

2. **Create a Virtual Environment**

   It's recommended to use a virtual environment to manage Python dependencies.

   ```bash
   python3 -m venv venv
   ```

3. **Activate the Virtual Environment**

   - On macOS/Linux:

     ```bash
     source venv/bin/activate
     ```

   - On Windows:

     ```bash
     venv\Scripts\activate
     ```

4. **Install Backend Dependencies**

   ```bash
   pip install -r requirements.txt
   ```

### Frontend Setup

1. **Navigate to the Frontend Directory**

   ```bash
   cd ../frontend
   ```

2. **Install Frontend Dependencies**

   ```bash
   npm install
   ```

## Running the Application

### Starting the Backend Server

1. **Ensure the Virtual Environment is Activated**

   If not already activated:

   - On macOS/Linux:

     ```bash
     cd backend
     source venv/bin/activate
     ```

   - On Windows:

     ```bash
     cd backend
     venv\Scripts\activate
     ```

2. **Run the Backend Server**

   ```bash
   python run.py
   ```

   The backend server will start on `http://localhost:5000`.

### Starting the Frontend Server

1. **Navigate to the Frontend Directory**

   ```bash
   cd ../frontend
   ```

2. **Run the Frontend Server**

   ```bash
   npm run dev
   ```

   The frontend application will be available at `http://localhost:3000`.

### Accessing the Application

Open your web browser and navigate to `http://localhost:3000` to use the Movie Recommendation WebApp.

## Adding New Dependencies

### Backend Dependencies

To add new Python packages to the backend:

1. **Activate the Virtual Environment**

   - On macOS/Linux:

     ```bash
     cd backend
     source venv/bin/activate
     ```

   - On Windows:

     ```bash
     cd backend
     venv\Scripts\activate
     ```

2. **Install the New Package**

   ```bash
   pip install package_name
   ```

3. **Update `requirements.txt`**

   ```bash
   pip freeze > requirements.txt
   ```

### Frontend Dependencies

To add new npm packages to the frontend:

1. **Navigate to the Frontend Directory**

   ```bash
   cd frontend
   ```

2. **Install the New Package**

   ```bash
   npm install package_name
   ```

   This will automatically update `package.json` and `package-lock.json`.

## Project Structure

```
CIS-430-Movie-Recommendation-WebApp/
├── .gitignore
├── LICENSE
├── README.md
├── backend/
│   ├── README.md
│   ├── requirements.txt
│   ├── run.py
│   ├── app/
│   │   ├── __init__.py
│   │   ├── routes.py
│   │   ├── utils.py
│   │   └── controllers/
│   │       ├── __init__.py
│   │       ├── data_loader.py
│   │       └── recommendation_engine.py
│   ├── tests/
│   │   ├── test_controllers.py
│   │   ├── test_routes.py
│   │   └── test_utils.py
│   └── venv/
│   │   # Virtual environment (ignored by version control)
├   └── data/
│       ├── processed/
│       └── raw/
│           ├── rotten_tomatoes_critic_reviews.csv
│           └── rotten_tomatoes_movies.csv
├── docs/
│   ├── api_documentation.md
│   ├── architecture.md
│   ├── Project Proposal.pptx
│   └── user_manual.md
├── frontend/
│   ├── .eslintrc.json
│   ├── .gitignore
│   ├── next-env.d.ts
│   ├── next.config.ts
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── README.md
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── node_modules/
│       # Node modules (ignored by version control)
│   ├── public/
│       └── images/
│   └── src/
│       ├── components/
│       │   ├── Footer.tsx
│       │   ├── Header.tsx
│       │   ├── LoadingSpinner.tsx
│       │   ├── MovieCard.tsx
│       │   ├── MovieList.tsx
│       │   ├── RecommendationList.tsx
│       │   ├── SearchBar.tsx
│       │   └── ThemeToggle.tsx
│       ├── pages/
│       │   ├── _app.tsx
│       │   ├── _document.tsx
│       │   ├── index.tsx
│       │   ├── recommendations.tsx
│       │   ├── search.tsx
│       │   └── movies/
│       │       └── [id].tsx
│       └── styles/
│           ├── globals.css
│           └── variables.module.css
├── scripts/
│   ├── fetch_metadata.py
│   └── setup_environment.py
```

## Contributing

We welcome contributions! To contribute:

1. **Fork the Repository**

2. **Create a New Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**

4. **Commit Your Changes**

   ```bash
   git commit -m "Add your commit message here"
   ```

5. **Push to Your Fork**

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**

   Submit your pull request for review.

## License

This project is licensed under the Apache 2.0 License. See the [LICENSE](LICENSE) file for details.
