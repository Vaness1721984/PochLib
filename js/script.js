//Display Search Form after clicking on "Ajouter un livre" button
document.getElementById("btn_add").addEventListener(
  "click",
  function () {
    document.getElementById("btn_add").hidden = true;
    document.getElementById("myform").hidden = false;
  },
  false
);

//Go back to initial screen after clicking on "Annuler" button
document.getElementById("btn_cancel").addEventListener(
  "click",
  function () {
    console.clear();
    document.getElementById("btn_add").hidden = false;
    document.getElementById("content").hidden = false;
    document.getElementById("myform").hidden = true;
    document.getElementById("results").hidden = true;

    //Delete form inputs after clicking on "Annuler" button
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input) => (input.value = ""));
    fetchStoredBooks();
  },
  false
);

//Display results after clicking on "Rechercher" button
document.getElementById("btn_search").addEventListener(
  "click",
  function () {
    // Don't display results if "Titre du Livre" & "Auteur" fields are empty
    if (intitle.value === "" || inauthor.value === "") {
      document.getElementById("results").hidden = true;
      document.getElementById("content").hidden = false;
    } else {
      document.getElementById("results").hidden = false;
      document.getElementById("content").hidden = true;
    }
  },
  false
);

//Initialization of API values
const urlString = "https://www.googleapis.com/books/v1/volumes";
const intitle = document.getElementById("title");
const inauthor = document.getElementById("author");
const printType = "books";
const apiKey = "&key=AIzaSyDayz0L9d9KbYEU17fcqMJ6dU8UDIkJXhQ";

document
  .getElementById("btn_search")
  .addEventListener("click", function fetchData() {
    //Clear the content of div results before fetching data
    document.getElementById("resultOk").innerHTML = "";
    document.getElementById("noResult").innerHTML = "";
    const url =
      urlString +
      "?q=" +
      intitle.value +
      "+inauthor:" +
      inauthor.value +
      "&printType=" +
      printType +
      apiKey;
    //Alert is displayed if "Titre du Livre" & "Auteur" fields are empty
    if (intitle.value === "" || inauthor.value === "") {
      alert("Please enter a title and author before clicking on Search button");
    } else {
      //Execute fetch data if "Titre du Livre" & "Auteur" fields are not empty
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw Error("ERROR");
          }
          return response.json();
        })
        .then((books) => showBooks(books.items));
    }
  });

showBooks = (getBooks) => {
  //If results exist display them in div resultOk
  const booksDiv = document.querySelector("#resultOk");
  //If no book is returned display "Aucun livre n'a été trouvé" in flexContainer2
  if (typeof getBooks === "undefined") {
    console.error("Aucun livre n'a été trouvé");
    document
      .querySelector("#noResult")
      .insertAdjacentHTML("afterbegin", "Aucun livre n'a été trouvé");
    //If no book returned hide div "resultOk"
    document.getElementById("resultOk").hidden = true;
    document.getElementById("noResult").hidden = false;
  } else {
    //If results return books hide div "noResult"
    document.getElementById("resultOk").hidden = false;
    document.getElementById("noResult").hidden = true;
    //Definition of constants to retrieve with API
    getBooks.forEach((book) => {
      //Creation of a constant "Titre"
      const title = book.volumeInfo.title;
      //Creation of a constant "Id"
      const id = book.id;
      /*Creation of a constant "Auteur" limited to 1 author max
       *If no author available display "Information manquante"*/
      const author =
        book.volumeInfo.authors === undefined
          ? "Information manquante"
          : book.volumeInfo.authors[0];
      /*Creation of a constant "Description" limited to 200 caracters
       *If no description available display "Information manquante"*/
      const desc =
        book.volumeInfo.description === undefined
          ? "Information manquante"
          : book.volumeInfo.description.substring(0, 199);
      /*Creation of a constant "Image"
       *If no thumnail available display image "Coming Soon" instead*/
      const img =
        book.volumeInfo.imageLinks === undefined
          ? "img/unavailable.png"
          : `${book.volumeInfo.imageLinks.thumbnail}`;
      //Creation of a dynamic div to store results with HTML structure
      const bookElement = document.createElement("div");
      bookElement.className = "apiItem";
      bookElement.innerHTML = `
        <div id ="B${id}" ><button class="btn-icon" id ="${id}" onclick="addToBookmark(this.id)" ><i class="fas fa-bookmark"></i></button></div>
        <p class="p-bold">Titre : ${title} </p>
        <p class="p-bold p-italic">Id : ${id} </p>
        <p >Auteur : ${author} </p>
        <p >Description : ${desc} </p>
        <p class="p-img" ><img src="${img}" height="200" width="141.41" alt="${title}" </p>
        `;
      booksDiv.append(bookElement);
    });
  }
};

//Add item to Session Storage after clicking on bookmark icon
function addToBookmark(clicked_id) {
  let bookmarks = JSON.parse(sessionStorage.getItem("bookmarks"));
  if (bookmarks === null) {
    bookmarks = [];
  }
  //Alert if item has already been added in Session Storage
  if (bookmarks.some((bookmark) => bookmark === clicked_id)) {
    alert("Vous ne pouvez ajouter deux fois le même livre");
  } else {
    bookmarks.push(clicked_id);
    sessionStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }
}

//Remove Item from Session Storage after clicking on trash icon
function addToTrash(clicked_id) {
  let bookmarks = JSON.parse(sessionStorage.getItem("bookmarks"));
  if (bookmarks.some((bookmark) => bookmark === clicked_id)) {
    bookmarks = bookmarks.filter((bookmark) => bookmark !== clicked_id);
    sessionStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    fetchStoredBooks();
  }
}

//Display favorite books in Ma poch'liste
function fetchStoredBooks() {
  //If results exist display them in div storedResult
  document.getElementById("storedResult").innerHTML = "";
  const getValues = JSON.parse(sessionStorage.getItem("bookmarks"));
  if (getValues != null) {
    for (let i = 0; i < getValues.length; i++) {
      fetch(urlString + "/" + getValues[i])
        .then((response) => {
          if (!response.ok) {
            throw Error("ERROR");
          }
          return response.json();
        })
        .then(function appendData(data) {
          //If results exist display them in div storedResult
          const storedBooksDiv = document.querySelector("#storedResult");
          //Definition of constants to retrieve with API
          const title = data.volumeInfo.title;
          const id = data.id;
          const author =
            data.volumeInfo.authors === undefined
              ? "Information manquante"
              : data.volumeInfo.authors[0];
          const desc =
            data.volumeInfo.description === undefined
              ? "Information manquante"
              : data.volumeInfo.description.substring(0, 199);
          const img =
            data.volumeInfo.imageLinks === undefined
              ? "img/unavailable.png"
              : `${data.volumeInfo.imageLinks.thumbnail}`;
          const storedBookElement = document.createElement("div");
          storedBookElement.className = "apiItem";
          storedBookElement.innerHTML = `
<div id ="T${id}" ><button class="btn-icon"  onclick="addToTrash('${id}')"><i class="fas fa-trash"></i></button></div> 
<p class="p-bold">Titre : ${title} </p>
<p class="p-bold p-italic">Id : ${id} </p>
<p >Auteur : ${author} </p>
<p >Description : ${desc} </p>
<p class="p-img" ><img src="${img}" height="200" width="141.41" alt="${title}" </p>
`;
          storedBooksDiv.append(storedBookElement);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }
}
window.addEventListener("load", fetchStoredBooks());
