# Convention de codage

## Langues utilisées

- Les commentaires peuvent etre écrits en français ou en anglais. Par contre, le choix de la langue doit être consistant dans votre travail.
- Le code en lui-même doit être écrit en anglais pour pouvoir être consistant avec les librairies et frameworks utilisées par le projet et, donc, dans votre travail.
- Vos message de commit doivent être écrit en français.
- Le nom de vos features (aka le nom de la branche de feature ou de fix, etc) doit être en français sans lettres accentuées, remplacé celles-ci par l'équivalent sans accents.

## Conventions de codage / linting

### Serveur API REST ExpressJS

Le projet serveur ExpressJS utilise les règles défini dans le [fichier de configuration](../server/.eslintrc.yml) d'[ESLint](https://eslint.org/). Avant de committer votre travail veuillez vous assurer, avec les outils nécessaire, du respect de ces normes.

Si une règle est modifié par moi [ComradeNixco](https://github.com/ComradeNixco), ou par toute autres personnes préalablement accepté à le faire (et dont le nom sera ajouté ici à une liste), celle-ci se retrouvera dans un fichier de configuration d'eslint.
Pour plus d'informations, consulté le [fichier de configuration ESLint](../server/.eslintrc.yml).

### Application cliente Angular 6

Le projet client Angular 6 utilise les règles par défaut de [TSLint](https://palantir.github.io/tslint/rules/). Si des règles sont modifiés (voir la section "Serveur API REST ExpressJS"), les règles modifiées seront présentes dans le fichier de configuration approprié.

Avant de committer, veuiller vous assurer du respect de ces règles à l'aide des outils appropriés.