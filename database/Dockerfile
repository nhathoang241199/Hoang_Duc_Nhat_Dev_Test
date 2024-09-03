# Sử dụng image chính thức của PostgreSQL làm base image
FROM postgres:13

# Thiết lập biến môi trường mặc định
ENV POSTGRES_USER=admin
ENV POSTGRES_PASSWORD=123456
ENV POSTGRES_DB=video_share_db

# Copy các file cấu hình tùy chỉnh (nếu có) vào container
# COPY ./path/to/your/custom/postgresql.conf /etc/postgresql/postgresql.conf
# COPY ./path/to/your/custom/init.sql /docker-entrypoint-initdb.d/

# Expose port 5432 để container có thể kết nối với PostgreSQL từ bên ngoài
EXPOSE 5432

# Entry point của container
# ENTRYPOINT ["docker-entrypoint.sh"]

# Khởi chạy PostgreSQL
CMD ["postgres"]
