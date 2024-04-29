# Use a base image with PHP and Apache
FROM php:8.2-apache

# Install the necessary dependencies for Symfony
RUN apt-get update && apt-get install -y \
    libicu-dev \
    libpq-dev \
    libzip-dev \
    zlib1g-dev \
    unzip \
    wget \
    curl

# Install the necessary PHP extensions for Symfony
RUN docker-php-ext-install intl
RUN docker-php-ext-install pdo
RUN docker-php-ext-install pdo_mysql
RUN docker-php-ext-install zip

# Enable the Apache mod_rewrite module
RUN a2enmod rewrite

# Copy the application files into the container
COPY . /var/www/html

# Set the working directory
WORKDIR /var/www/html

# Install the Symfony project dependencies
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN composer install --no-scripts --no-autoloader

# Symfony CLI
RUN wget https://get.symfony.com/cli/installer -O - | bash
RUN mv /root/.symfony5/bin/symfony /usr/local/bin/symfony

# Generate autoloading files and assets
RUN composer dump-autoload --optimize
RUN php bin/console assets:install --symlink

RUN symfony console cache:clear --env=prod

EXPOSE 8000

CMD symfony server:start
