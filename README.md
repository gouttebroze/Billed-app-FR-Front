
## L'architecture du projet :
Ce projet, dit frontend, est connecté à un service API backend que vous devez aussi lancer en local.

Le projet backend se trouve ici: https://github.com/OpenClassrooms-Student-Center/Billed-app-FR-back

## Organiser son espace de travail :
Pour une bonne organization, vous pouvez créer un dossier bill-app dans lequel vous allez cloner le projet backend et par la suite, le projet frontend:

Clonez le projet backend dans le dossier bill-app :
```
$ git clone https://github.com/OpenClassrooms-Student-Center/Billed-app-FR-Back.git
```

```
bill-app/
   - Billed-app-FR-Back
```

Clonez le projet frontend dans le dossier bill-app :
```
$ git clone https://github.com/OpenClassrooms-Student-Center/Billed-app-FR-Front.git
```

```
bill-app/
   - Billed-app-FR-Back
   - Billed-app-FR-Front
```

## Comment lancer l'application en local ?

### étape 1 - Lancer le backend :

Suivez les indications dans le README du projet backend.

### étape 2 - Lancer le frontend :

Allez au repo cloné :
```
$ cd Billed-app-FR-Front
```

Installez les packages npm (décrits dans `package.json`) :
```
$ npm install
```

Installez live-server pour lancer un serveur local :
```
$ npm install -g live-server
```

Lancez l'application :
```
$ live-server
```

Puis allez à l'adresse : `http://127.0.0.1:8080/`


## Comment lancer tous les tests en local avec Jest ?

```
$ npm run test
```

## Comment lancer un seul test ?

Installez jest-cli :

```
$npm i -g jest-cli
$jest src/__tests__/your_test_file.js
```

## Comment voir la couverture de test ?

`http://127.0.0.1:8080/coverage/lcov-report/`

## Comptes et utilisateurs :

Vous pouvez vous connecter en utilisant les comptes:

### administrateur : 
```
utilisateur : admin@test.tld 
mot de passe : admin
```
### employé :
```
utilisateur : employee@test.tld
mot de passe : employee
```

--------------------------------------------------------

## NOTES

### isDone

* fix bug sur le trie des notes (imp ds dossible `./containers` & non `./views`)

* tests unit & inte pr bills & NewBills

* test GET pr BILLS

* test POST pr NewBILLS

* parcours Employé pr tests E2E

### Liste termes utilisé par JEST

* cadre test avec BDD: 
   describe->Given-When-Then
      -->test->It should...
         ---> expect().to  // étant attendu("Valeurs à tester").to...(use a Jest matcher (methodes utilisé par Jest pr matcher le(s) valeurs attendues avec celles retournées))

* expect, 
* **Fonctions simulées**
      
      * voir doc.[Jest](https://jestjs.io/fr/docs/mock-functions)
   
      * *...permettent de tester les liens entre le code en effaçant l'implémentation réelle d'une fonction, en capturant les appels à la fonction (et les paramètres passés dans ces appels), en capturant les instances des fonctions constructrices lorsqu'elles sont instanciées avec new, et en permettant la configuration des valeurs de retour au moment du test*.

      * *Il existe deux façons de simuler des fonctions* : 
         - *soit en créant une fonction simulée à utiliser dans le code de test*, 
         - *soit en écrivant une simulation manuelle pour remplacer une dépendance du module*.

      * Utilisation d'une fonction simulée

* objet Jest 

### List ISSUES avec code correspondant

