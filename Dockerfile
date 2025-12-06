# Usamos una imagen ligera de PHP oficial
FROM php:8.2-cli

# 1. Instalar utilidades y el driver para PostgreSQL
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql

# 2. Instalar Composer (el gestor de paquetes)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 3. Preparar la carpeta de trabajo
WORKDIR /var/www/html
COPY . .

# 4. Instalar las librerías de tu proyecto
RUN composer install --no-dev --optimize-autoloader

# 5. Borrar el caché manualmente para que no busque 127.0.0.1
RUN rm -f bootstrap/cache/config.php

# 6. Dar permisos a las carpetas de almacenamiento
RUN chown -R www-data:www-data storage bootstrap/cache

# 7. El comando que arranca todo automáticamente
CMD bash -c "php artisan config:clear && php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=10000"