# Sử dụng Node.js làm base image
FROM node:18-alpine

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Copy file package.json và package-lock.json vào thư mục làm việc
COPY package*.json ./

# Cài đặt các phụ thuộc
RUN npm install --production --legacy-peer-deps

# Copy toàn bộ mã nguồn của dự án vào container
COPY . .

# Build ứng dụng
RUN npm run build

# Mở cổng để ứng dụng có thể truy cập
EXPOSE 3000

# Khởi động ứng dụng NextJS
CMD ["npm", "run", "start"]
