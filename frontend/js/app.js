let app = {

    apiRootUrl: 'http://localhost:8080',

    init: function() {
        console.log('app.init()');

        // On appelle la méthode s'occupant d'ajouter les EventListener sur les éléments déjà dans le DOM
        app.addAllEventListeners();

        // On appelle la méthode s'occupant de charger tous les jeux vidéo
        app.loadVideoGames();
    },
    addAllEventListeners: function() {
        // On récupère l'élément <select> des jeux vidéo
        selectElm = document.getElementById('videogameId');
        // On ajoute l'écouteur pour l'event "change", et on l'attache à la méthode app.handleVideogameSelected
        selectElm.addEventListener('change', app.handleVideogameSelected)

        // On récupère le bouton pour ajouter un jeu vidéo
        let addVideogameButtonElement = document.getElementById('btnAddVideogame');
        // On ajoute l'écouteur pour l'event "click"
        addVideogameButtonElement.addEventListener('click', app.handleClickToAddVideogame);
        console.log(selectElm);
        // TODO
    },

    handleVideogameSelected: function(evt) {
        console.log('handleVideogameSelected')
        // Récupérer la valeur du <select> (id du videogame)
        let videoGamesSelected = evt.currentTarget;
        let gameSelected = videoGamesSelected.value;
        console.log('je suis le jeu video : ' +gameSelected);
        // Vider le contenu de div#review
        let divReview = document.getElementById('review').textContent = '';
        // charger les données pour ce videogame
        let fetchOptions = {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
        };

        // On déclanche la requête HTTP  videogames/{id}/reviews
        fetch(app.apiRootUrl + '/videogames/' + gameSelected + '/reviews', fetchOptions)
        .then(
            function(response) {
            return response.json();
        })
        .then(function(singleGame) {

            console.log('Reviews de mon jeu via le singleGame : ', singleGame);
        
            // Ajouter dans le DOM

            app.createNewGameIntoDOM(singleGame);

            console.log(singleGame);
        });               
            
    },

    createNewGameIntoDOM: function(singleGame, gameSelected) {

        // Dupliquer la template #reviewTemplate et personnaliser son contenu avec les données

        let newVideoTemplateElement = document.getElementById('reviewTemplate');
        let newVideoElement = newVideoTemplateElement.content.cloneNode(true).querySelector('.reviewContainer');
        
        console.log(singleGame[0].author);

                
        newVideoElement.querySelector('.reviewAuthor').textContent = singleGame[0].author;
        newVideoElement.querySelector('.reviewPublication').textContent = singleGame[0].publication_date;
        newVideoElement.querySelector('.reviewTitle').textContent = singleGame[0].title;
        newVideoElement.querySelector('.reviewDisplay').textContent = singleGame[0].display_note;
        newVideoElement.querySelector('.reviewGameplay').textContent = singleGame[0].gameplay_note;
        newVideoElement.querySelector('.reviewScenario').textContent = singleGame[0].scenario_note;
        newVideoElement.querySelector('.reviewLifetime').textContent = singleGame[0].lifetime_note;
        newVideoElement.querySelector('.reviewText').textContent = singleGame[0].text;

        let videogameContainer = document.querySelector('#review');
        videogameContainer.prepend(newVideoElement);

    },

    handleClickToAddVideogame: function(evt) {
        // https://getbootstrap.com/docs/4.4/components/modal/#modalshow
        // jQuery obligatoire ici
        $('#addVideogameModal').modal('show');
    },
    loadVideoGames: function() {
        // Charger toutes les données des videogames
            // Ajouter une balise <option> par videogame

            let fetchOptions = {
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache'
            };

            fetch(app.apiRootUrl + '/videogames', fetchOptions)

            .then(function(response) {
                return response.json();
            })

            .then(function(videogameList) {

                for(let i =0; i< videogameList.length; i++) {
                    let singleVideogame = videogameList[i];

                    app.createOptionVideoGame(singleVideogame.name);
                }
            });
    },

    createOptionVideoGame: function(name) {
        //id="videogameId"
        let optionElement = newOptionElement;
        newOptionElement.querySelector('#option').textContent = name;

        let newOption = document.getElementById('videoGameId');
        
        newOption.prepend(optionElement);
    },
};

document.addEventListener('DOMContentLoaded', app.init);