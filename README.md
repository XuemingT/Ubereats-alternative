# 🍔 UberEats Alternative

A modern food delivery platform with microservices architecture, featuring React frontend and Spring Boot backend.

## 🚀 Features

- **Food Delivery Platform**: Complete restaurant and delivery management
- **Microservices Architecture**: Modular, scalable backend services
- **Modern Frontend**: React + TypeScript + Tailwind CSS
- **Real-time Processing**: RabbitMQ message queues for async communication
- **Database Integration**: PostgreSQL with Redis caching
- **Payment Processing**: Multiple payment methods support
- **Discount System**: Flexible discount code validation
- **Restaurant Management**: Menu and inventory tracking
- **Order Tracking**: Real-time order status updates

## 🏗️ Architecture

### Backend Services
- **Config Server** (Port 8888): Centralized configuration management
- **Order Service** (Port 8080): Food order creation and management
- **Restaurant Service** (Port 8082): Menu catalog and inventory management
- **Discount Service** (Port 8083): Promo code validation
- **Accounting Service** (Port 8081): Price calculation and billing
- **Payment Service**: Payment processing (planned)
- **Delivery Service**: Delivery tracking (planned)

### Frontend
- **React + TypeScript**: Modern, type-safe frontend
- **Tailwind CSS**: Utility-first styling
- **Axios**: HTTP client for API communication

## 🛠️ Tech Stack

### Backend
- Java 21
- Spring Boot 3.4+
- Spring Cloud Config
- Spring Data JPA
- RabbitMQ
- PostgreSQL
- Redis
- Maven

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Axios

### Infrastructure
- Docker & Docker Compose
- PostgreSQL
- Redis
- RabbitMQ

## 🚀 Quick Start

### Prerequisites
- Java 21+
- Node.js 18+
- Docker & Docker Compose
- Maven 3.8+

### Backend Setup

1. **Start Infrastructure Services**
   ```bash
   cd docker
   docker compose up -d
   ```

2. **Build and Run Services**
   ```bash
   # Build common module first
   mvn clean install -pl common
   
   # Start services in order
   mvn spring-boot:run -pl config-server
   mvn spring-boot:run -pl order-service
   mvn spring-boot:run -pl product-service
   mvn spring-boot:run -pl discount-service
   mvn spring-boot:run -pl accounting-service
   ```

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Access Application**
   - Frontend: http://localhost:5173
   - Backend APIs: http://localhost:8080

## 📡 API Endpoints

### Order Service
- `POST /order/payment` - Create new food order

### Restaurant Service
- `GET /product/price?ids=1,2,3` - Get menu item prices

### Discount Service
- `GET /discount?discount-code=SAVE10` - Validate promo code

## 🗄️ Database Schema

The system uses PostgreSQL with the following key entities:
- Restaurant menus with pricing and availability
- Food orders with status tracking
- Promo codes and validation
- Payment processing records
- Delivery tracking information

## 🔄 Message Flow

1. **Order Creation**: Customer → Order Service
2. **Menu Validation**: Order Service → Restaurant Service
3. **Pricing**: Accounting Service calculates totals
4. **Payment**: Integration with payment providers
5. **Delivery**: Order tracking and completion

## 🧪 Testing

### Backend Testing
```bash
# Run all tests
mvn test

# Run specific service tests
mvn test -pl order-service
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📦 Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
docker compose -f docker-compose.prod.yml up -d
```

### Manual Deployment
1. Build backend services
2. Deploy to application servers
3. Configure load balancers
4. Set up monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Xueming Tang**
- Email: tang.xuem@northeastern.edu
- GitHub: [@XuemingT](https://github.com/XuemingT)

## 🙏 Acknowledgments

This project is based on the original microservices architecture from [harchiki/order-management](https://github.com/harchiki/order-management) by Samet YILDIZ. The original project provided an excellent foundation for understanding Spring Boot microservices, RabbitMQ message queues, and distributed system architecture.

**Original Author**: Samet YILDIZ ([@harchiki](https://github.com/harchiki))
- Original Repository: [harchiki/order-management](https://github.com/harchiki/order-management)

### What's New in This Version:
- 🍔 **Rebranded as UberEats Alternative** - Food delivery platform focus
- ⚛️ **Added React Frontend** - Modern TypeScript + Tailwind CSS interface
- 🔄 **Enhanced API Integration** - Improved frontend-backend communication
- 📱 **Mobile-First Design** - Responsive food ordering experience
- 🎨 **Modern UI/UX** - Clean, intuitive user interface
- 🚀 **Production Ready** - Enhanced deployment and configuration

---

Built with ❤️ using modern microservices architecture