# Plan des tests

* composant `Bills.js`

      + plan de test:

        - GIVEN: Etant connecté en tant qu'employé
        - WHEN: Qd j clicque sur l'icône de l'oeil,
        - THEN: Alors, une modale s'ouvre

        ------
        - GIVEN: Etant connecté en tant qu'employé
        - WHEN: Qd je suis sur la page des notes de frais,
        - THEN: l'icone de notes de frais ds le layout vertical (ou la sidebar), devrait être mis en avant...

        ------
        - GIVEN: Etant connecté en tant qu'employé
        - WHEN: 
        - THEN: les notes de frais doivent être triés par ordre anti-chronologique

        ------
        - GIVEN: Etant connecté en tant qu'employé
        - WHEN: Qd je suis sur la page de notes de frais & que je click sur le btn pr créer une nouvelle note de frais...
        - THEN: ... doit appeler la méthode handleClickNewBill au click.. (test si methode est bien appeler)

        ------
        - GIVEN: Etant connecté en tant qu'employé
        - WHEN: 
        - THEN: ça doit rendre 1 page `newBill`

        ------
        - GIVEN: Etant connecté en tant qu'employé
        - WHEN: 
        - THEN: doit rendre 1 page `newBill

          ------
        - GIVEN: Etant connecté en tant qu'employé
        - WHEN: 
        - THEN: ça doit rendre 1 page `newBill`

                ------
        - GIVEN: Etant connecté en tant qu'employé
        - WHEN: 
        - THEN: ça doit rendre 1 page `newBill`

                ------
        - GIVEN: Etant connecté en tant qu'employé
        - WHEN: sd j suis sur la page des notes de frais, mais en chargement...
        - THEN: doit s afficher le composant `loading`

                ------
        - GIVEN: Etant connecté en tant qu'employé
        - WHEN: qd j suis sur la page des notes de frais, mais recevant des erreur depuis le back-end de l'appli....
        - THEN: 1 erreur doit être reçu...

        // test integration - GET

          -> todo


* composant `NewBill.js`