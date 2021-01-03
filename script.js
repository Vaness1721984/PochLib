// Initialization of API variables //
var urlString = 'https://www.googleapis.com/books/v1/volumes?q=';
var intitle = document.getElementById("title");
var inauthor = document.getElementById("author");
var printType = 'books';
var apiKey = '&key=AIzaSyDayz0L9d9KbYEU17fcqMJ6dU8UDIkJXhQ';


document.getElementById("Btn_Add").addEventListener("click", function() {
	document.getElementById("Btn_Add").hidden=true;
	document.getElementById("myform").hidden=false;
}, false);


document.getElementById("Btn_Cancel").addEventListener("click", function () {

	document.getElementById("Btn_Add").hidden=false;
	document.getElementById("content").hidden=false;
	document.getElementById("myform").hidden=true;
	document.getElementById("results").hidden=true;

// Delete input after clicking on Cancel Button //
	let inputs = document.querySelectorAll('input');
	inputs.forEach(input =>input.value = '');
	
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
				// If no book returned display "Aucun livre n'a été trouvé" in flexContainer2 //
				if(data.totalItems === 0){
				console.log("Aucun livre n'a été trouvé")
				document.querySelector(".flexContainer2").insertAdjacentHTML("afterbegin", "Aucun livre n'a été trouvé")
				// If no book returned hide div "resultOk" //
				document.getElementById("resultOk").hidden=true
				document.getElementById("noResult").hidden=false;
				}else {
					// If results return books hide div "noResult"// 
		document.getElementById("resultOk").hidden=false
		document.getElementById("noResult").hidden=true		
		console.log(data.items);
		// Definition of variable to retrieve with API //
		const html = data.items.map(googleBooks => {
			// Creation of a variable "Titre du Livre"//
			let title = googleBooks.volumeInfo.title;
			// Creation of a variable "Id du Livre" //
			let id = googleBooks.id;
			// Creation of a variable "Auteur du Livre" limited to 1 author max if no author available display "Information manquante"//
			let author = typeof googleBooks.volumeInfo.authors === 'undefined' ? 'Information manquante' : googleBooks.volumeInfo.authors[0];
			// Creation of a variable "Description du Livre" limited to 200 caracters if no description available display "Information manquante"//
			let desc = typeof googleBooks.volumeInfo.description === 'undefined' ? 'Information manquante' : googleBooks.volumeInfo.description.substring(0,199);
			// Creation of a variable "Image du Livre" if no thumnail available display image "Coming Soon" instead //
			let img = googleBooks.volumeInfo.imageLinks === undefined ? 'img/unavailable.png' : `${googleBooks.volumeInfo.imageLinks.thumbnail}`;
			// Creation of a dynamic div to store results with HTML structure//
			return `
			<div  class="apiItem" >
			<div class="test" id ="B${id}" ><button class="btn" id ="${id}" onclick="addToBookmark(this.id)" ><i class="fas fa-bookmark"></i></button></div>
			<div class="test" id ="T${id}" hidden><button class="btn" id ="${id}" onclick="addToTrash(this.id)"><i class="fas fa-trash"></i></button></div> 
			<p class="bookTitle">Titre : ${title} </p>
			<p class="bookId">Id : ${id} </p>
			<p class="bookAuthor" >Auteur : ${author} </p>
			<p class="bookDesc" >Description : ${desc} </p>
			<p class="bookImg" ><img src="${img}" height="200" width="141.41" alt="${googleBooks.volumeInfo.title}" </p>
			</div>
			`;

		})
		.join("");
		// Display results based on HTML//
	console.log(html);
	// If results exist display them in div flexContainer3 //
	document
	.querySelector(".flexContainer3").insertAdjacentHTML("afterbegin",html );

	}

})

	// Display errors in console.log//
	.catch(error =>{
		console.log(error);
	})

	}
});


// Add Item to Session Storage //
function addToBookmark(clicked_id)
{
	// Hide bookmark icon after click on bookmark icon//
	document.getElementById("B"+clicked_id).hidden = true;
	// Display trash icon after click on bookmark icon//
	document.getElementById("T"+clicked_id).hidden = false;

	var bookId = 
	{
		"BookId" : clicked_id,
	};
		// Check if a key has already been added to Session Storage //
if (clicked_id in sessionStorage){
	alert("Vous ne pouvez ajouter deux fois le même livre");
	} else {
	alert(clicked_id + " a été ajouté à la Poch\'liste");
			}
	sessionStorage.setItem(clicked_id,JSON.stringify(bookId));
}



// Remove Item from Session Storage //
function addToTrash(clicked_id)
{
	// Display bookmark icon after click on trash icon //
	document.getElementById("B"+clicked_id).hidden = false;
	// Hide trash icon after click on trash icon //
	document.getElementById("T"+clicked_id).hidden = true;
	var bookId = 
	{
		"Add_to_trash" : clicked_id,
	};
	if (clicked_id in sessionStorage){
		alert(clicked_id + " a été enlevé de la Poch\'liste");
		} else {
		alert(clicked_id + " a déjà été enlevé de la Poch\'liste");
				}
	sessionStorage.removeItem(clicked_id,JSON.stringify(bookId));
}





