# Sử dụng môi trường Node.js bản 18
FROM node:18-slim

# Tạo thư mục làm việc trong container
WORKDIR /app

# Copy file cấu hình thư viện vào trước
COPY package*.json ./

# Cài đặt các thư viện cần thiết
RUN npm install

# Copy toàn bộ code còn lại vào container
COPY . .

# Mở cổng 3000 để truy cập web
EXPOSE 3000

# Lệnh khởi chạy ứng dụng
CMD ["node", "server.js"]