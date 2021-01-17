// Initialization of API variables //
const urlString = "https://www.googleapis.com/books/v1/volumes";
const intitle = document.getElementById("title");
const inauthor = document.getElementById("author");
const printType = "books";
const apiKey = "&key=AIzaSyDayz0L9d9KbYEU17fcqMJ6dU8UDIkJXhQ";

document.getElementById("Btn_Add").addEventListener(
  "click",
  function () {
    document.getElementById("Btn_Add").hidden = true;
    document.getElementById("myform").hidden = false;
  },
  false
);

document.getElementById("Btn_Cancel").addEventListener(
  "click",
  function () {
    console.clear();
    document.getElementById("Btn_Add").hidden = false;
    document.getElementById("content").hidden = false;
    document.getElementById("myform").hidden = true;
    document.getElementById("results").hidden = true;

    // Delete input after clicking on Cancel Button //
    let inputs = document.querySelectorAll("input");
    inputs.forEach((input) => (input.value = ""));
  },
  false
);

document.getElementById("Btn_Search").addEventListener(
  "click",
  function () {
    if (intitle.value === "" || inauthor.value === "") {
      document.getElementById("results").hidden = true;
      document.getElementById("content").hidden = false;
    } else {
      document.getElementById("results").hidden = false;
      document.getElementById("content").hidden = false;
    }
  },
  false
);

document
  .getElementById("Btn_Search")
  .addEventListener("click", function fetchData() {
// clear the content of div results before fetching data
    document.getElementById("resultOk").innerHTML = "";
    document.getElementById("noResult").innerHTML = "";
      let url =
      urlString +
      "?q=" +
      intitle.value +
      "+inauthor:" +
      inauthor.value +
      "&printType=" +
      printType +
      apiKey;
    if (intitle.value === "" || inauthor.value === "") {
      alert("Please enter a title and author before clicking on Search button");
    } else {
      fetch(url)
        .then((response) => {
          console.log(response);
          if (!response.ok) {
            throw Error("ERROR");
          }
          return response.json();
        })
        .then(books => 
          showBooks(books.items)
          );
      }
    })

    showBooks = getBooks => {
      // If results exist display them in div flexContainer3 //
      const booksDiv = document.querySelector(".flexContainer3");
      // If no book returned display "Aucun livre n'a été trouvé" in flexContainer2
      if (typeof(getBooks) === 'undefined' ) {
        console.log("Aucun livre n'a été trouvé")
        document.querySelector(".flexContainer2").insertAdjacentHTML("afterbegin", "Aucun livre n'a été trouvé")
        // If no book returned hide div "resultOk"
        document.getElementById("resultOk").hidden=true;
				document.getElementById("noResult").hidden=false;
      } else {
        // If results return books hide div "noResult" 
        document.getElementById("resultOk").hidden=false ;
        document.getElementById("noResult").hidden=true	;
      console.log(getBooks);
      getBooks.forEach(book => {
      // Definition of variable to retrieve with API
      // Creation of a variable "Titre du Livre"
        let title = book.volumeInfo.title;
      // Creation of a variable "Id du Livre"
        let id = book.id;
        // Creation of a variable "Auteur du Livre" limited to 1 author max if no author available display "Information manquante"
        let author = typeof book.volumeInfo.authors === 'undefined' ? 'Information manquante' : book.volumeInfo.authors[0];
        // Creation of a variable "Description du Livre" limited to 200 caracters if no description available display "Information manquante"
        let desc = typeof book.volumeInfo.description === 'undefined' ? 'Information manquante' : book.volumeInfo.description.substring(0,199);
        // Creation of a variable "Image du Livre" if no thumnail available display image "Coming Soon" instead
        let img = book.volumeInfo.imageLinks === undefined ? 'img/unavailable.png' : `${book.volumeInfo.imageLinks.thumbnail}`;
        // Creation of a dynamic div to store results with HTML structure
        let bookElement = document.createElement('div');
        bookElement.className = 'apiItem';
        bookElement.innerHTML = 
        `
        <div class="test" id ="B${id}" ><button class="btn" id ="${id}" onclick="addToBookmark(this.id)" ><i class="fas fa-bookmark"></i></button></div>
        <p class="bookTitle">Titre : ${title} </p>
        <p class="bookId">Id : ${id} </p>
        <p class="bookAuthor" >Auteur : ${author} </p>
        <p class="bookDesc" >Description : ${desc} </p>
        <p class="bookImg" ><img src="${img}" height="200" width="141.41" alt="${title}" </p>
        `;
        booksDiv.append(bookElement);
      });
    }
    }

// Add Item to Session Storage //
function addToBookmark(clicked_id) {
  let bookmarks = JSON.parse(sessionStorage.getItem("bookmarks"));
  if (bookmarks === null) {
    bookmarks = [];
  }
  if (bookmarks.some(bookmark => bookmark === clicked_id)) {
    alert("Vous ne pouvez ajouter deux fois le même livre");
  } else {
    bookmarks.push(clicked_id);
  sessionStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }}

// Remove Item from Session Storage //
function addToTrash(clicked_id) {
	let bookmarks = JSON.parse(sessionStorage.getItem("bookmarks"));
	if (bookmarks.some(bookmark => bookmark === clicked_id)) {
		bookmarks = bookmarks.filter(bookmark => bookmark !== clicked_id);
    sessionStorage.setItem("bookmarks", JSON.stringify(bookmarks));
	  } 
	}

// Display favorite books in Ma poch'liste
  window.addEventListener('load', function fetchStoredBooks() {
		let getValues = JSON.parse(sessionStorage.getItem("bookmarks"));
    console.log(getValues);
    if (getValues != null) {
      for(let i=0;i<getValues.length;i++){
		fetch (urlString + '/' + getValues[i])
		.then(response => {
			console.log(response);
			if(!response.ok){
				throw Error("ERROR");
			}
			return response.json();
		})
    .then(function appendData (data) {
			console.log(data.volumeInfo);
			const title = data.volumeInfo.title;
			const id = data.id;
			const author = typeof data.volumeInfo.authors === 'undefined' ? 'Information manquante' : data.volumeInfo.authors[0];
			const desc = typeof data.volumeInfo.description === 'undefined' ? 'Information manquante' : data.volumeInfo.description.substring(0,199);
			const img = data.volumeInfo.imageLinks === undefined ? 'img/unavailable.png' : `${data.volumeInfo.imageLinks.thumbnail}`;
const storedBookElement = 
`
<div id ="D${id}" class="apiItem" >
<div class="test" id ="T${id}" ><button class="btn"  onclick="addToTrash('${id}')"><i class="fas fa-trash"></i></button></div> 
<p class="bookTitle">Titre : ${title} </p>
<p class="bookId">Id : ${id} </p>
<p class="bookAuthor" >Auteur : ${author} </p>
<p class="bookDesc" >Description : ${desc} </p>
<p class="bookImg" ><img src="${img}" height="200" width="141.41" alt="${title}" </p>
</div>
`;
	console.log(storedBookElement);
	document
	.querySelector(".flexContainer4").insertAdjacentHTML("afterbegin",storedBookElement );
		})
	.catch(error =>{
		console.log(error);
	})}}})



