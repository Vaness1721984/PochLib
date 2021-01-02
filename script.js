var urlString = 'https://www.googleapis.com/books/v1/volumes?q=';
var intitle = document.getElementById("title");
var inauthor = document.getElementById("author");
var printType = 'books';
var apiKey = '&key=AIzaSyDayz0L9d9KbYEU17fcqMJ6dU8UDIkJXhQ';




document.getElementById("Btn_Add").addEventListener("click", function() {
	document.getElementById("Btn_Add").hidden=true;
	document.getElementById("myform").hidden=false;
}, false);


let inputs = document.querySelectorAll('input');

document.getElementById("Btn_Cancel").addEventListener("click", function () {
	document.getElementById("Btn_Add").hidden=false;
	document.getElementById("content").hidden=false;
	document.getElementById("myform").hidden=true;
	inputs.forEach(input =>input.value = '');
	document.getElementById("results").hidden=true;
}, false);


document.getElementById("Btn_Search").addEventListener("click", function() {
	if (intitle.value === '' || inauthor.value === '') {
	document.getElementById("results").hidden=true;
	document.getElementById("content").hidden=false;	
	} else {
	document.getElementById("results").hidden=false;
	document.getElementById("content").hidden=false;
}}, false);



document.getElementById("Btn_Search").addEventListener("click",function fetchData() {
	var url = urlString + intitle.value + '+inauthor:' + inauthor.value + '&printType=' + printType + apiKey;
    if (intitle.value === '' || inauthor.value === '') {
		alert("Please enter a title and author before clicking on Search button");
    } else {
	fetch (url)
	.then(response => {
		console.log(response);
		if(!response.ok){
			throw Error("ERROR");
		}
		return response.json();
	})
	.then(data => {
				// Si pas de résultats afficher "Aucun livre n'a été trouvé" dans flexContainer2 //
				if(data.totalItems === 0){
				console.log("Aucun livre n'a été trouvé")
				document.querySelector(".flexContainer2").insertAdjacentHTML("afterbegin", "Aucun livre n'a été trouvé")
				// cacher div "resultOk" //
				document.getElementById("resultOk").hidden=true
				document.getElementById("noResult").hidden=false;
				}else {
					// cacher div "noResult"// 
		document.getElementById("resultOk").hidden=false
		document.getElementById("noResult").hidden=true		
		console.log(data.items);
		// Définition des variables API à récupérer //
		const html = data.items.map(googleBooks => {
			// Variable "Titre du Livre"//
			let title = googleBooks.volumeInfo.title;
			// Variable "Id du Livre" //
			let id = googleBooks.id;
			// Variable "Auteur du Livre" limité à un auteur si plusieurs auteurs si pas définie afficher "Information manquante"//
			let author = typeof googleBooks.volumeInfo.authors === 'undefined' ? 'Information manquante' : googleBooks.volumeInfo.authors[0];
			// Variable "Description du Livre" limitée à 200 caractères si pas définie afficher "Information manquante"//
			let desc = typeof googleBooks.volumeInfo.description === 'undefined' ? 'Information manquante' : googleBooks.volumeInfo.description.substring(0,199);
			// Variable "Image du Livre" si pas définie afficher image "Coming Soon" //
			let img = googleBooks.volumeInfo.imageLinks === undefined ? 'img/unavailable.png' : `${googleBooks.volumeInfo.imageLinks.thumbnail}`;
			// Création d'une div dynamique pour stocker les résultats avec une structure HTML //
			return `
			<div class="apiItem">
			<button id ="${id}" onclick="reply_click(this.id)"><i class="fas fa-bookmark"></i></button>
			<button hidden><i class="fas fa-trash" ></i></button>
			<p class="bookTitle">Titre : ${title} </p>
			<p class="bookId">Id : ${id} </p>
			<p class="bookAuthor" >Auteur : ${author} </p>
			<p class="bookDesc" >Description : ${desc} </p>
			<p class="bookImg" ><img src="${img}" height="200" width="141.41" alt="${googleBooks.volumeInfo.title}" </p>
			</div>
			`;

	
		})
		.join("");
		// Affichage des résultats selon HTML défini//
	console.log(html);
	// Si résultats retournés afficher les résultats dans div flexContainer3 //
	document
	.querySelector(".flexContainer3").insertAdjacentHTML("afterbegin",html );
	console.log(JSON.stringify(data.items));

}

		// Retrieve sessionStorage //
	/*document.getElementById("myBooks").innerHTML = sessionStorage.getItem("bookId");*/
	})

	// Affichage des erreurs avec console.log//
	.catch(error =>{
		console.log(error);
	})

	}
});

// Get Id on bookmark//
function reply_click(clicked_id)
{
	sessionStorage.setItem("bookId",clicked_id);
}




