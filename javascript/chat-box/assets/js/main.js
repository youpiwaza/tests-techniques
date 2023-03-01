console.log('/assets/js/main.js');

//! Roadmap
// * ✅ Récupérer l'ensemble des identifiants
//      ✅ Et les ranger
// * ✅ Ajouter un message
//      ✅ Aux deux chats
//      ✅ Attention propriétaire
// * ✅ Gestion du formulaire
// * ✅ Réponses suggérées
// * ✅ ~~Edition~~, suppression



/// ---


// *     Variables
//  Message courant, afin de pouvoir les éditer / supprimer
let identifiantPourMessage = 1;


// *     Récupérer l'ensemble des identifiants
// TexteS débuts de la conversation
const conversationsDebutHTML                        = document.querySelectorAll('.chat-conversation-start');
// console.log(conversationsDebutHTML);

// Conversations, ou seront ajoutées les bulles
const conversationsChatsHTML                        = document.querySelectorAll('.chat-conversation');
// console.log(conversationsChatsHTML);

// Conversations, dernier message reçu à
const conversationsTempsDepuisDernierMessageHTML    = document.querySelectorAll('.temps-depuis-dernier-message');
// console.log(conversationsTempsDepuisDernierMessageHTML);

// Conversations, réponses suggérées
const conversationsReponsesSuggereesHTML            = document.querySelectorAll('.suggested-responses');
// console.log(conversationsReponsesSuggereesHTML);

// Conversations, textes des formulaires
const conversationsFormTextInputHTML                = document.querySelectorAll('.form-input-message');
// console.log(conversationsFormTextInputHTML);

// Conversations, boutons des formulaires
const conversationsFormButtonSendHTML               = document.querySelectorAll('.form-send-button');
// console.log(conversationsFormButtonSendHTML);

// Conversations, formulaire, afin d'avoir une meilleure gestion
const conversationsFormHTML                         = document.querySelectorAll('.chat-footer');
// console.log(conversationsFormHTML);



// *    On range un peu mieux, dans des objets, puis dans un tableau
let conversations = Array();

//  On fait une jolie boucle en cas d'ajout futur d'autres chats

//  On récupère le nombre de chats
const conversationsHTML = document.querySelectorAll('.one-chat');

//  Pour chaque chat 🐈
for(let i = 0 ; i < conversationsHTML.length ; i++) {
    // On crée un objet conversation par chat afin de mieux s'y retrouver
    const conversation = {
        texteDuDebut                : conversationsDebutHTML[i]
        ,messages                   : conversationsChatsHTML[i]
        ,tempsDepuisDernierMessage  : conversationsTempsDepuisDernierMessageHTML[i]
        ,reponsesSuggerees          : conversationsReponsesSuggereesHTML[i]
        ,formulaireTexte            : conversationsFormTextInputHTML[i]
        ,formulaireBouton           : conversationsFormButtonSendHTML[i]
        ,formulaire                 : conversationsFormHTML[i]

        // Afin de nettoyer l'évènement
        ,tempsDepuisDernierMessageIntervalId  : null
    }
    // console.log(conversation);

    // On l'ajoute au tableau
    conversations.push(conversation);

    // On gère le clic sur le bouton
    //      ES5 bind afin de récupérer la conversation courante
    //          @see        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind
    //      Sinon alternative avec les data-attributes, auquels on passe l'identifiant du chat
    //          @see        https://developer.mozilla.org/fr/docs/Learn/HTML/Howto/Use_data_attributes
    //          Il y a un exemple avec le bouton de suppression
    
    // 👷 Optimisation du comportement du formulaire
    // conversation.formulaireBouton.addEventListener( 'click', onFormButtonSendClick.bind(conversation), false);
    conversation.formulaire.addEventListener( 'submit', onFormSubmit.bind(conversation), false );

    // * Gestion des réponses suggérées
    //      Gestion de l'affichage déplié ou non
    const reponsesSuggereesHeaderHTML = conversation.reponsesSuggerees.querySelector('.card-header');
    // console.log(reponsesSuggereesHeaderHTML);
    reponsesSuggereesHeaderHTML.addEventListener( 'click', onReponsesSuggereesHeaderClick.bind(conversation), false);

    //      Gestion des clics sur les boutons (évènements)
    const reponsesSuggereesBoutonsHTML = conversation.reponsesSuggerees.querySelectorAll('.suggested-responses-content button');
    // console.log(reponsesSuggereesBoutonsHTML);

    // Pour chacun des boutons
    for( let j = 0 ; j < reponsesSuggereesBoutonsHTML.length ; j++ ) {
        // On gère le clic
        reponsesSuggereesBoutonsHTML[j].addEventListener( 'click', onReponsesSuggereesBoutonsHTMLClick.bind(conversation), false);
    }
}
// console.log(conversations);

// * Confort utilisateur
//      On ajoute le focus sur le premier chat, il sera actif par défaut lors de l'arrivée sur la page
conversations[0].formulaireTexte.focus();



// * Ajouter un message
//      A quel chat auquel rajouter le message
//      Contenu du message
//          Est-il propriétaire ?
//      Masquer "Début de la conversation"
//      Mettre à jour le temps depuis le dernier message reçu
function ajouterMessage( chat, contenu, isProprietaire ) {

    // On masque le début de la conversation, en ajoutant une classe CSS à l'élément
    chat.texteDuDebut.classList.add('hidden');

    // On rajoute le message à la suite des autres
    // chat.messages.innerHTML = genererContenuDuMessage( contenu, isProprietaire);
    chat.messages.innerHTML += genererContenuDuMessage( contenu, isProprietaire );
}



// * Générer le message encapsulé dans le html qui va bieng
//      Vu que l'on a déjà généré le html, et ajusté le css, on copie colle simplement
//      Puis on remplace le contenu dynamique par les variables
function genererContenuDuMessage( contenu, isProprietaire ) {

    // return isProprietaire ? yep : nope;

    if(isProprietaire) {
        // TODO: 🌱 Bouton d'édition un peu la flemme :3
        return `
            <div class="chat-bubble chat-bubble-right position-relative" data-message-id="message-${ identifiantPourMessage }">

                <div class="chat-bubble-actions position-absolute top-0 end-0 me-1 mt-1">
                    <!--
                    <button class="btn-edit btn btn-light" data-edit-id="message-${ identifiantPourMessage }" disabled>
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    -->
                    <button class="btn-delete btn btn-light" data-delete-id="message-${ identifiantPourMessage }">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>

                <span class="chat-bubble-content">${ contenu }</span>
            </div>
        `;
    }
    else {
        return `
            <div class="chat-bubble disabled" data-message-id="message-${ identifiantPourMessage }">
                <span class="chat-bubble-content">${ contenu }</span>
            </div>
        `;
    }
}



// * Dernier message reçu > Gestion du timer
function affichageTimerDernierMessageRecu ( chat ) {
    // On affiche le temps depuis le dernier message reçu
    chat.tempsDepuisDernierMessage.classList.remove('hidden');

    // Si un timer existe déjà, on le supprime afin de le remplacer
    if(chat.intervalId !== null) {
        clearInterval(chat.tempsDepuisDernierMessageIntervalId);
    }

    // On réinitialise le chiffre
    const nombresHTML       = chat.tempsDepuisDernierMessage.querySelector('span');
    nombresHTML.innerHTML   = 1;

    // On crée un timer via setInterval, qui va mettre à jour toutes les secondes
    //      On stocke la valeur de retour afin de nettoyer après
    //      On passe le chat concerné en paramètre optionnel
    const intervalId = setInterval(mettreAJourTimerDernierMessageRecu, 1000, chat);
    chat.tempsDepuisDernierMessageIntervalId = intervalId;
}

// * Dernier message reçu > Gestion de l'affichage
function mettreAJourTimerDernierMessageRecu( chat ) {
    const nombresHTML       = chat.tempsDepuisDernierMessage.querySelector('span');
    // On n'oublie pas de convertir la chaîne de caractères, sinon on se retrouve avec 1111111 ;)
    nombresHTML.innerHTML   = parseInt(nombresHTML.innerHTML) + 1;
}



// * Gestion du formulaire
//      Envoi lors du clic sur le bouton
//          Réutiliser les données fournies
//          Envoi aux deux chats
//      Vider le champ texte

// function onFormButtonSendClick( event ) {
function onFormSubmit( event ) {
    // On ne recharge pas la page (suppression du comportement par défaut du formulaire html)
    event.preventDefault();

    // * On récupère le chat concerné, grâce à l'utilisation de bind lors de l'ajout de l'écouteur
    // console.log(this);
    const chat = this;

    // On récupère le texte dans le champ concerné, si il y en a
    // console.log(chat.formulaireTexte.value);
    let texteAEnvoyer = chat.formulaireTexte.value;

    // Ne pas envoyer de messages vides
    if(texteAEnvoyer === '') {
        texteAEnvoyer = "Si t'as rien à dire on va boire une bière 🍻";
    }

    // On envoie à tous les chats
    for(let i = 0 ; i < conversationsHTML.length ; i++) {

        // En faisant attention au propriétaire
        //      Note: Dans les vrais projet éviter les comparaisons d'objets haha
        if(conversations[i] == chat) {
            // console.log('yay');
            ajouterMessage( conversations[i], texteAEnvoyer, true );
        }
        else {
            // console.log('nope');
            ajouterMessage( conversations[i], texteAEnvoyer, false );

            // On active le timer pour le temps depuis le dernier message reçu
            affichageTimerDernierMessageRecu(conversations[i]);
        }
    }

    // On vide le champ texte du chat concerné
    chat.formulaireTexte.value = '';

    // Une fois le message généré, on met à jour l'identifiant
    //      Note : l'idenfiant est le même pour l'ensemble des chats auxquels le message sera envoyé
    identifiantPourMessage++;

    // Pour chaque message, on gère l'édition & la suppression
    // manageButtonsEdit();
    manageButtonsDelete();
}



// * Réponses suggérées
//      Affichage conditionnel / affichage déplié ou non
function onReponsesSuggereesHeaderClick() {
    // * On récupère le chat concerné, grâce à l'utilisation de bind lors de l'ajout de l'écouteur
    // console.log(this);
    const chat = this;

    // On affiche ou on masque ~bouton bascule
    //      On ajoute ou retire la classe CSS créée lors du front
    chat.reponsesSuggerees.classList.toggle('suggested-responses-hidden');
}

// * Affichage des messages suggérés
//      On réutilise la fonction d'ajout de message
function onReponsesSuggereesBoutonsHTMLClick( event ) {
    // * On récupère le chat concerné, grâce à l'utilisation de bind lors de l'ajout de l'écouteur
    // console.log(this);
    const chat = this;

    // On récupère le texte du bouton
    let texteAEnvoyer = event.target.innerHTML;

    // On envoie à tous les chats
    for(let i = 0 ; i < conversationsHTML.length ; i++) {

        // En faisant attention au propriétaire
        //      Note: ⚡️ Dans les vrais projet éviter les comparaisons d'objets, pour des raisons de performances
        if(conversations[i] == chat) {
            // console.log('yay');
            ajouterMessage( conversations[i], texteAEnvoyer, true );
        }
        else {
            // console.log('nope');
            ajouterMessage( conversations[i], texteAEnvoyer, false );

            // On active le timer pour le temps depuis le dernier message reçu
            affichageTimerDernierMessageRecu(conversations[i]);
        }
    }

    // Une fois le message généré, on met à jour l'identifiant
    //      Note : l'idenfiant est le même pour l'ensemble des chats auxquels le message sera envoyé
    identifiantPourMessage++;

    // Pour chaque message, on gère l'édition & la suppression
    // manageButtonsEdit();
    manageButtonsDelete();
}



// * Suppression de message
//      La fonction afin de mettre en place l'ensemble des comportements
function manageButtonsDelete() {

    // On récupère l'ensemble des boutons, présents à ce moment la
    //      On est obligés de mettre à jour la liste vu que des messages, et donc des boutons, sont ajoutés à la volée
    const btnsDeleteHTML = document.querySelectorAll('.btn-delete');
    console.log(btnsDeleteHTML);

    // Pour chaque bouton
    for(let i = 0 ; i < btnsDeleteHTML.length ; i++ ) {
        let bouton = btnsDeleteHTML[i];

        // On retire l'ensemble des écouteurs, afin d'éviter les doublons
        //      ~un clic sur le bouton > le message est ajouté plusieurs fois
        //      Cela permet aussi de "ramasser les miettes" (garbage collector)
        //          et ainsi d'éviter des problèmes de performances ou comportements erratiques
        //          en gros on "remet les comportements à zéro"
        bouton.removeEventListener('click', onBtnDeleteClick);

        // Et on les rajoute, un par bouton, de manière propre
        bouton.addEventListener('click', onBtnDeleteClick);
    }
}

// * Suppression de message
//      Gestion du clic
function onBtnDeleteClick() {
    // console.log(this);

    // 🚨 En HTML "data-delete-id", transformé en JS en "deleteId"
    // console.log(this.dataset.deleteId);
    const identifiantMessageASupprimer = this.dataset.deleteId;

    // On retire l'écouteur de ce bouton
    this.removeEventListener('click', onBtnDeleteClick);

    // Et on supprime les messages
    supprimerMessage( identifiantMessageASupprimer );

}

// * Suppression de message
//      On recherche les messages à supprimer, et on les retire / modifie
function supprimerMessage( identifiantMessageASupprimer ) {
    // Récupérer l'ensemble des messages ayant cet identifiant
    //  Il devrait y en avoir un par tchat
    //      @see        https://stackoverflow.com/a/62872204
    let messagesASupprimer = document.querySelectorAll(`[data-message-id="${ identifiantMessageASupprimer }"]`);
    console.log(`[data-message-id="message-${ identifiantMessageASupprimer }"]`);
    console.log(messagesASupprimer);

    // Et on les supprime
    for( let i = 0 ; i < messagesASupprimer.length ; i++) {
        // messagesASupprimer[i].remove();
        
        //      Attention, renvoie un tableau
        // let content = messagesASupprimer[i].getElementsByClassName('chat-bubble-content')[0];
        // console.log(content);
        // content.classList.add('text-black-50');
        // content.textContent = 'Message supprimé';

        // On peut également remplacer leurs contenus par "Message supprimé"
        messagesASupprimer[i].classList.add('disabled', 'text-black-50', 'bg-white');
        messagesASupprimer[i].innerHTML = `
            <span class="chat-bubble-content">Message supprimé</span>
        `;
    }
}
