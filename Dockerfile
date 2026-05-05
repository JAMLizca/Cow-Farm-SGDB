FROM php:8.3-apache

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    zip \
    && docker-php-ext-install pdo pdo_mysql zip

# Activar mod_rewrite de Apache
RUN a2enmod rewrite

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copiar proyecto
COPY . /var/www/html

WORKDIR /var/www/html

# Instalar Laravel dependencias
RUN composer install --no-dev --optimize-autoloader

# Permisos
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Apache config para Laravel
RUN sed -i 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/000-default.conf

EXPOSE 80
