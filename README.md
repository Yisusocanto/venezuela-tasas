# 💵 Dolar Venezuela

A full-stack web application that provides **real-time and historical official exchange rates** published by the **Banco Central de Venezuela (BCV)**. This project exclusively uses **official BCV rates** — no parallel or black-market rates — ensuring reliable and transparent currency information.

> [!IMPORTANT]
> All exchange rates displayed in this application are sourced directly from the **Banco Central de Venezuela (BCV)** official website. No third-party or unofficial rates are used.

---

## 📦 Monorepo Structure

This project is organized as a **monorepo** containing both the frontend and backend applications:

```
dolar-venezuela/
├── frontend/       # Next.js web application
├── backend/        # FastAPI REST API
└── README.md
```

---

## ✨ Features

- **Live Exchange Rates** — Displays the latest official BCV closing rates for multiple currencies (USD, EUR, TRY, RUB) against the Venezuelan Bolívar (VES).
- **Currency Calculator** — Instantly convert between foreign currencies and Bolívares using up-to-date official rates.
- **KPI Rate Cards** — At-a-glance summary cards for each tracked currency.
- **Historical Rate Search** — Look up the official exchange rate for any supported currency on a specific date.
- **Date Range Search** — Query exchange rate data across a custom date range.
- **Rate History Chart** — Interactive chart visualizing exchange rate trends over time.
- **Results Table** — Tabular view of search results with sorting and pagination.
- **Automated Daily Scraping** — The backend automatically scrapes the BCV website daily at a scheduled time to keep rates current.
- **Skeleton Loading States** — Smooth loading experience with skeleton placeholders while data is being fetched.
- **Responsive Design** — Fully responsive UI that adapts seamlessly to desktop, tablet, and mobile screens.

---

## 🖥️ Frontend

The frontend is a modern **Next.js** application built with **React 19** and **TypeScript**, leveraging Server Components for optimal performance and SEO.

### Tech Stack

| Technology                                      | Purpose                                                     |
| ----------------------------------------------- | ----------------------------------------------------------- | --- |
| [Next.js 16](https://nextjs.org/)               | React framework with App Router, Server Components, and SSR |     |
| [TypeScript](https://www.typescriptlang.org/)   | Type-safe JavaScript                                        |
| [Tailwind CSS 4](https://tailwindcss.com/)      | Utility-first CSS framework                                 |
| [HeroUI](https://www.heroui.com/)               | Modern React UI component library                           |
| [TanStack Query](https://tanstack.com/query)    | Async state management and data fetching                    |
| [TanStack Table](https://tanstack.com/table)    | Headless table with sorting and pagination                  |
| [Recharts](https://recharts.org/)               | Composable charting library for React                       |
| [React Hook Form](https://react-hook-form.com/) | Performant form handling                                    |
| [Zod](https://zod.dev/)                         | Schema validation                                           |
| [Axios](https://axios-http.com/)                | HTTP client                                                 |
| [Day.js](https://day.js.org/)                   | Lightweight date manipulation                               |
| [Lucide React](https://lucide.dev/)             | Icon library                                                |

### Getting Started

```bash
git clone https://github.com/Yisusocanto/venezuela-tasas.git
cd venezuela-tasas/frontend
pnpm install
pnpm dev
```

The app will be available at `http://localhost:3000`.

---

## ⚙️ Backend

The backend is an **asynchronous REST API** built with **FastAPI** that handles data scraping, storage, and serving of exchange rate data.

### Tech Stack

| Technology                                                       | Purpose                                          |
| ---------------------------------------------------------------- | ------------------------------------------------ |
| [FastAPI](https://fastapi.tiangolo.com/)                         | High-performance async Python web framework      |
| [SQLAlchemy](https://www.sqlalchemy.org/)                        | SQL toolkit and ORM for database operations      |
| [Alembic](https://alembic.sqlalchemy.org/)                       | Database migration management                    |
| [Pydantic](https://docs.pydantic.dev/)                           | Data validation and serialization via schemas    |
| [Beautiful Soup](https://www.crummy.com/software/BeautifulSoup/) | HTML parsing for web scraping the BCV website    |
| [APScheduler](https://apscheduler.readthedocs.io/)               | Async cron job scheduling for automated scraping |

### Architecture

The backend follows a **layered architecture** with clear separation of concerns:

```
backend/app/
├── api/            # Route handlers (controllers)
├── core/           # App configuration and settings
├── db/             # Database connection and session management
├── lib/            # Utilities (scraping cron job)
├── models/         # SQLAlchemy ORM models
├── repositories/   # Data access layer
├── schemas/        # Pydantic request/response schemas
├── services/       # Business logic layer
└── main.py         # App entry point and lifespan events
```

### Key Backend Features

- **Fully Asynchronous** — The entire backend runs asynchronously, from the web framework to the database driver and the scheduled scraping jobs.
- **Automated Scraping** — A cron job (powered by APScheduler) runs daily to scrape the latest exchange rates from the BCV official website.
- **Startup Sync** — On application startup, the scraper runs immediately to ensure the database is up-to-date before serving any requests.
- **RESTful API (v1)** — All endpoints are versioned under `/api/v1/` for maintainability.

### API Endpoints

| Method | Endpoint                                                                           | Description                                         |
| ------ | ---------------------------------------------------------------------------------- | --------------------------------------------------- |
| `GET`  | `/health`                                                                          | Health check                                        |
| `GET`  | `/api/v1/rates`                                                                    | Get latest rates for all currencies                 |
| `GET`  | `/api/v1/rates/{currency}/date/{date}`                                             | Get rate for a specific currency on a specific date |
| `GET`  | `/api/v1/rates/{currency}/history`                                                 | Get full rate history for a currency                |
| `GET`  | `/api/v1/rates/{currency}/rate_history_for_date_range?start_date=...&end_date=...` | Get rates within a date range                       |

### Getting Started

```bash
cd backend
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
fastapi dev app/main.py
```

The API will be available at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

---

## 🌐 Supported Currencies

| Code | Currency      | Country        |
| ---- | ------------- | -------------- |
| USD  | US Dollar     | United States  |
| EUR  | Euro          | European Union |
| TRY  | Turkish Lira  | Turkey         |
| RUB  | Russian Ruble | Russia         |

All rates are expressed as **currency/VES** (Venezuelan Bolívar).

---

## 🤝 How to Contribute

Contributions are welcome! If you want to improve the project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature (`git checkout -b feature/AmazingImprovement`).
3. Commit your changes (`git commit -m 'Adds an Amazing Improvement'`).
4. Push to your branch (`git push origin feature/AmazingImprovement`).
5. Open a Pull Request.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE.txt) file for more details.

---

## 📬 Contact

**Jesus Ocanto**

- **LinkedIn:** `www.linkedin.com/in/jesús-ocanto-447694220`
- **GitHub:** `https://github.com/Yisusocanto`
- **Email:** `yisusocanto1984@gmail.com`
