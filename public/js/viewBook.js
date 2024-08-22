const viewMyBook = async (book_name, book_id) => {
  document.querySelector("#view-popup").classList.toggle("active");
  // send post req to get single book data
  try {
    const response = await fetch("/admin/getBookData", {
      method: "POST",
      body: JSON.stringify({ book_id }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    document.querySelector("#view-popup").innerHTML = getBookData(data.book);
  } catch (err) {
    location.reload();
  }
};
function closeBookPopup() {
  document.querySelector("#view-popup").classList.toggle("active");
  document.querySelector("#view-popup").innerHTML = "";
}
function CloseForm(){
  document.querySelector("#feedback-con").classList.toggle("active");
}
function OpenForm(){
  document.querySelector("#feedback-con").classList.toggle("active");
}
/*
---------------------------------------------- POP-UP --------------------------------------------------------
                                       DISPLAY SINGLE BOOK POP-UP
--------------------------------------------------------------------------------------------------------------
*/
function getBookData(book){
  return `
  <div class="info-container">
    <div class="ac-no btn-s">AC NO : ${book.un_issued_no[0]}</div>
    <div class="img">
        <img src="/${book.book_img}" alt="">
    </div>
    <div class="info-text">
        <div class="data">
          <div class="b-info">
              <p class="name">Title</p>
              <p class="name-ans">:  ${book.book_title}</p>
          </div>
          <div class="b-info">
              <p class="name">Author </p>
              <p class="name-ans">: ${book.book_author}</p>
          </div>
          <div class="b-info">
              <p class="name">Edition </p>
              <p class="name-ans">: ${book.book_edition}</p>
          </div>
          <div class="b-info">
              <p class="name">Schema </p>
              <p class="name-ans">: ${book.book_schema}</p>
          </div>
          <div class="b-info">
              <p class="name">Related To </p>
              <p class="name-ans">: ${book.related_to}</p>
          </div>
          <div class="b-info">
              <p class="name">Cost </p>
              <p class="name-ans">: ${book.book_cost}</p>
          </div>
          <div class="b-info">
              <p class="name">Quantity </p>
              <p class="name-ans">: ${book.book_quantity}</p>
          </div>
        </div>
        <div class="actions">
            <button class="btn-e" onclick="closeBookPopup()">Close</button>
        </div>
    </div>
  </div>`
}