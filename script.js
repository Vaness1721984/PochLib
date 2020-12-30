var urlString = 'https://www.googleapis.com/books/v1/volumes?q=';
var intitle = document.getElementById("title");
var inauthor = document.getElementById("author");
var printType = 'books';
var apiKey = '&key=AIzaSyDayz0L9d9KbYEU17fcqMJ6dU8UDIkJXhQ';

document.getElementById("Btn_Add").addEventListener("click", function() {
	document.getElementById("Btn_Add").hidden=true;
	document.getElementById("form").hidden=false;
}, false);

document.getElementById("Btn_Cancel").addEventListener("click", function() {
	document.getElementById("Btn_Add").hidden=false;
	document.getElementById("content").hidden=false;
	document.getElementById("form").hidden=true;
	document.getElementById("results").hidden=true;
}, false);

document.getElementById("Btn_Search").addEventListener("click", function() {
	if (intitle.value === '' || inauthor.value === '') {
	document.getElementById("results").hidden=true;
	document.getElementById("content").hidden=false;	
	} else {
	document.getElementById("results").hidden=false;
	document.getElementById("content").hidden=true;
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
				/* "Si pas de résultats"*/
				if(data.totalItems === 0){
				console.log("Aucun livre n'a été trouvé")
				document
				.querySelector(".results").insertAdjacentHTML("afterbegin", "Aucun livre n'a été trouvé");}
				else {
		console.log(data.items);
		const html = data.items.map(googleBooks => {
			let title = googleBooks.volumeInfo.title;
			let id = googleBooks.id;
			let author = typeof googleBooks.volumeInfo.authors === 'undefined' ? 'Information manquante' : googleBooks.volumeInfo.authors[0];
			let desc = typeof googleBooks.volumeInfo.description === 'undefined' ? 'Information manquante' : googleBooks.volumeInfo.description.substring(0,199);
			let img = googleBooks.volumeInfo.imageLinks === undefined ? 'img/unavailable.png' : `${googleBooks.volumeInfo.imageLinks.thumbnail}`;

			return `
			<p class="bookTitle">Titre : ${title} </p>
			<p class="bookId">Id : ${id} </p>
			<p class="bookAuthor" >Auteur : ${author} </p>
			<p class="bookDesc" >Description : ${desc} </p>
			<p class="bookImg" ><img src="${img}" height="200" alt="${googleBooks.volumeInfo.title}" </p>
			`;
		})
		.join("");
	console.log(html)
	document
	.querySelector(".grid-container").insertAdjacentHTML("afterbegin",html );
	}	
})
	.catch(error =>{
		console.log(error);
	})
}
});