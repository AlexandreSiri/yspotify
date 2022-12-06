# YSpotify
Pour lancer le projet effectuer npm install
Créez un fichier .env contenant: les variables:
PORT (port ou l'on lance l'application)

SECRET(signature du token)


CLIENT_ID (client id du compte spotify)

CLIENT_SECRET (client secret du compte spotify)

REDIRECT= http://127.0.0.1:3012/users/logged (redirection de la requete pour recuperer le token de spotify) 



# Routes

Il y a 3 routes:

./users qui permet d'effectuer toutes les actions liées a l'utilisateur
./groups qui permet d'effectuer toutes les actions liées aux groupes
./api-docs swagger regroupant toutes les requetes

## Architectures

Il n'y a que l'index.js qui n'est pas dans le fichier src 
Dans le fichier src il y a plusieurs répertoires:
./bdd qui contient le fichier qui initialise la base de données en sqlite3
./middleware qui contient le fichier qui contient le middleware d'authentification
./model qui regroupe les models user, group et token
./routes qui contient les fichiers routes users et groupes
## Technologies utilisées

L'api a été faite en javascript a l'aide de nodejs et express.js
Les tokens sont des jsonwebtoken (jwt)
Le stockage est fait en sqlite et la bdd est stockée dans le fichier db.sqlite

## Projet
Projet disponible sur github: https://github.com/AlexandreSiri/yspotify
