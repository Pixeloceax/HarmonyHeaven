# Commandes utiles Symfony:

`mettre à jour les dépendances:`

```
composer update
```

# Dans le .env :
ADMIN_PASSWORD=your_admin_password
ADMIN_EMAIL=your_admin_email

# Créer un compte sur discogs et aller sur https://www.discogs.com/fr/settings/developers, créer une application pour obtenir vos clés.
DISCOGS_CONSUMER_KEY=discogs_consumer_key
DISCOGS_CONSUMER_SECRET=discogs_consumer_secret

# Lancer serveur en http :
symfony serve --no-tls

# Générer les clés JWT :
php bin/console lexik:jwt:generate-keypair
# Dans le .env : 
###> lexik/jwt-authentication-bundle ###
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=your_jwt_passphrase
###< lexik/jwt-authentication-bundle ###
###> symfony/messenger ###
# Choose one of the transports below
###<> MESSENGER_TRANSPORT_DSN=amqp://guest:guest@localhost:5672/%2f/messages
###<> MESSENGER_TRANSPORT_DSN=redis://localhost:6379/messages
MESSENGER_TRANSPORT_DSN=doctrine://default?auto_setup=0
###< symfony/messenger ###
###> symfony/google-mailer ###
###<> Gmail SHOULD NOT be used on production, use it in development only.
MAILER_DSN=gmail://harmonyheaven.noreply@gmail.com:photnrvgxxkjtapc@default?verify_peer=0
###< symfony/google-mailer ###