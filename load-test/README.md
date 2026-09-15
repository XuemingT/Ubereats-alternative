# Load test

Warm PostgreSQL, Redis, RabbitMQ, and all services before running `k6 run order-create.js`. The scenario sends 350 requests/second for two minutes and fails at p95 ≥180 ms or error rate ≥1%. Retain the JSON result with hardware, JVM flags, dataset size, and duration; this repository does not assert performance without that measured evidence.
