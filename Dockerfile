FROM richarvey/nginx-php-fpm:latest

COPY . .

# Configuración para Laravel
ENV SKIP_COMPOSER 0
ENV WEBROOT /var/www/html/public
ENV PHP_ERRORS_STDERR 1
ENV COMPOSER_ALLOW_SUPERUSER 1

# Instalar dependencias
RUN composer install --no-dev --optimize-autoloader

# Permisos
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Esto borra cualquier configuración vieja pegada
RUN php artisan config:clear
RUN php artisan cache:clear