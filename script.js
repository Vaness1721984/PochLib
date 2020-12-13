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
	document.getElementById("results").hidden=false;
	document.getElementById("content").hidden=true;
}, false);




var urlString = 'https://www.googleapis.com/books/v1/volumes?q=';
var intitle = document.getElementById("title");
var inauthor = document.getElementById("author");
var apiKey = '&key=AIzaSyDayz0L9d9KbYEU17fcqMJ6dU8UDIkJXhQ';


document.getElementById("Btn_Search").addEventListener("click",function fetchData() {
	var url = urlString + intitle.value + '+inauthor:' + inauthor.value + apiKey;
	fetch (url)
	.then(response => {
		console.log(response);
		if(!response.ok){
			throw Error("ERROR");
		}
		return response.json();
	})
	.then(data => {
		console.log(data.items);
		const html = data.items.map(googleBooks => {
			return `
			<p>Titre : ${googleBooks.volumeInfo.title} </p>
			<p>Id : ${googleBooks.id} </p>
			<p>Auteur : ${googleBooks.volumeInfo.authors} </p>
			<p>Description : ${googleBooks.volumeInfo.description} </p>
			<p><img src="${googleBooks.volumeInfo.imageLinks.thumbnail}" alt="${googleBooks.volumeInfo.title}" </p>
			`;
		})
		.join("");
	console.log(html);
	document
	.querySelector("#results").insertAdjacentHTML("afterbegin", html);
	})
	.catch(error =>{
		console.log(error);
	})
});