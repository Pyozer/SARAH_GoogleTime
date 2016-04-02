Plugin Time pour S.A.R.A.H
==========================

Plugin pour avoir l'heure locale mais aussi l'heure d'une ville à l'étranger ou d'un petit pays
Ainsi vous pouvez demander "Jarvis quelle heure est il à Londres ?"

Le plugin nécessite tout d'abord Scribe .

Que vous pouvez trouver ici: https://github.com/tilleul/Sarah.Scribe

Prérequis
---------
- Sarah v4
- Le plugin Scribe
- Et ce plugin ;)

Installation
------------
- Copier le dossier time dans votre dossier "plugins" de Sarah
- Remplacez Jarvis dans time.xml par celui que vous utilisez (ex: Sarah, ...)

Comment ça marche ?
-------------------
- Démarrez S.A.R.A.H
- Allez sur la page https://127.0.0.1:4300 pour avoir la reconnaissance du Garbage via Google Chrome
- Vous n'avez plus qu'a demander par exemple: "Jarvis quelle heure est-il ?"
- Vous pouvez demander n'importe quel ville ou petit pays, comme l'angleterre par exemple. (les USA ne fonctionne pas vu que le pays possède plusieurs fusceau horaire)
- En faite, le plugin récupère seulement l'éventuel ville, et récupère le résultat que Google donne. Si il y a pas de ville alors il prend directement l'heure via Javascript.