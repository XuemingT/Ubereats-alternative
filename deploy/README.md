# Deployment

1. Copy `.env.example` to `.env` and replace every password with a strong unique value.
2. From the repository root, run `docker compose --env-file deploy/.env -f deploy/docker-compose.yml up --build -d`.
3. Open the frontend on port 80. RabbitMQ management is on port 15672.

The Compose file starts PostgreSQL, RabbitMQ, Redis, Config Server, order/product/discount/accounting/payment/delivery services, and the frontend. PostgreSQL, RabbitMQ, and Redis have readiness checks. Do not expose database, Redis, or RabbitMQ ports publicly in a production firewall. Put the frontend behind TLS termination (for example, Caddy, Nginx, or a cloud load balancer), and keep `.env` out of Git.
