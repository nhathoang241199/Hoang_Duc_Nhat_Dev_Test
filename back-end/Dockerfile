# Sử dụng hình ảnh Node.js chính thức làm base image
FROM node:18-alpine

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Copy file package.json và package-lock.json (nếu có) vào thư mục làm việc
COPY package*.json ./

# Cài đặt các phụ thuộc
RUN npm install

# Copy toàn bộ mã nguồn của dự án vào container
COPY . .

# Build dự án
RUN npm run build

# Mở cổng để ứng dụng có thể truy cập
EXPOSE 3001

# Khởi động ứng dụng
CMD ["npm", "run", "start:prod"]
