main();
function main() {
  const mainmenu = document.querySelectorAll(".mainmenu");
  const arrow = document.getElementsByClassName("arrow");
  const showMenus = (id) => {
    if (/manage_book/i.test(id)) {
      document.getElementById(id).classList.toggle("active");
      document.getElementById("menu1").classList.toggle("active");
      arrow[0].classList.toggle("active");
    }
    if (/book_maintence/i.test(id)) {
      document.getElementById(id).classList.toggle("active");
      document.getElementById("menu2").classList.toggle("active");
      arrow[1].classList.toggle("active");
    }
    if (/manage_student/i.test(id)) {
      document.getElementById(id).classList.toggle("active");
      document.getElementById("menu3").classList.toggle("active");
      arrow[2].classList.toggle("active");
    }
  };
  mainmenu.forEach((btn) => {
    btn.addEventListener("click", () => showMenus(btn.id));
  });
}

function AlertClose() {
  document.getElementById("AlertClose").style.display = "none";
}

function closeMenu() {
  document.getElementById("addMenuContainer0").style.display = "none";
}

const getNotifications = async () => {
  try {
    const res = await fetch("/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    document.querySelector("#all_notifications").innerHTML = "";
    document.querySelector("#ntcount").innerHTML = data.notification.length;

    if (data.notification.length != "0") {
      data.notification.forEach((notification) => {
        document.querySelector("#all_notifications").innerHTML +=
          getNotIficationData(notification);
      });
    } else {
      document.querySelector("#all_notifications").innerHTML =
        "Empty Notifications";
    }
  } catch (err) {
    console.log(err);
  }
};
getNotifications();

function showNotification() {
  document.getElementById("notification_drawer").classList.toggle("active");
}

const NotificationAccepted = async (stud_id, book_id, acc_no, not_id) => {
  // send post request after book issue is accepted
  try {
    const res = await fetch("/admin/issueBookAccepted", {
      method: "POST",
      body: JSON.stringify({ stud_id, book_id, acc_no, not_id }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    await getNotifications();
    alert(data.message);
  } catch (err) {
    console.log(err);
  }
};
const NotificationRejected = async (stud_id, book_id, book_acc, not_id) => {
  try {
    let msg;
    while (true) {
      msg = prompt("Enter Reason For Rejecting Book Issue :");
      if (msg != "") {
        break;
      }
    }
    alert(msg);
    const res = await fetch("/admin/issueBookRejected", {
      method: "POST",
      body: JSON.stringify({ stud_id, book_id, book_acc, not_id, msg }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    alert(data.message)
    await getNotifications();

  } catch (err) {
    console.log(err);
  }
};
// return book 
const getIssuedBook = async ()=>{
  const en_no = document.getElementById('studentEnrollment').value;
  if(en_no!=""){
    try {
      // postIssuedBooks()
      const res = await fetch("/admin/getIssuedBook", {
      method: "POST",
      body: JSON.stringify({ en_no }),
      headers: { "Content-Type": "application/json" },
      });
      document.querySelector("#r-b-container").innerHTML="";
      const data = await res.json();
      let book_count=0
      if(data.books.length >0){
        data.books.forEach((book) => {
          if(!book.isReturn){
            book_count++;
            document.querySelector("#r-b-container").innerHTML +=getStudentIssuedBooks(book);
          }
        });
      }
      if(book_count==0){ 
        document.querySelector("#r-b-container").innerHTML=`<div class="head">0 Issued Books </div><div class="img"><img src="/no_books.png" alt=""></div>`;
      }
    } catch (err) {
      console.log(err);
    }
  }else{
    alert("Enrollment Can't Be Empty !!!")
  }
}

function getStudentIssuedBooks(book){
  let date = new Date(book.book_info.issueDate);
  date = date.toLocaleString();
  let r_date = new Date(book.book_info.returnDate);
  r_date = r_date.toLocaleString();
  return`
  <div class="card">
  <div class="imgContainer">
      <img src="/${book.book_info.book_img}" alt="">
  </div>
  <div class="infoBox">
      <div class="ac-no" style="height: 30px; min-width: 100px;">AC NO : ${book.book_info.accession_no}</div>
      <div class="title"> ${book.book_info.book_title}</div>
      <div class="description">
          <div class="div">
              <p>Issue date </p><span>: ${date}</span>
          </div>
          <div class="div">
              <p>Return date</p><span>: ${r_date}</span>
          </div>
      </div>
      <div class="buttonGroup">
          <button class="btn-e" onclick="returnBook('${book._id}')">Return</button>
          <button class="btn-s">Re-Issue</button>
      </div>
  </div>
</div>
  `;
}

const returnBook = async (issue_id) => {
  try {
    const res = await fetch("/admin/returnBook", {
      method: "POST",
      body: JSON.stringify({ issue_id }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    // console.log(data.message);
    alert(data.message);
    location.reload()
  } catch (err) {
    console.log(err);
  }
};
/*
---------------------------------------- ADMIN DYNAMIC CODES -----------------------------------------------
                                  DYNAMIC NOTIFICATION DISPLAYING
------------------------------------------------------------------------------------------------------------
*/
function getNotIficationData(notification) {
  let date = new Date(notification.book_info.issueDate);
  date = date.toLocaleString();
  return `
<div class="not-box" id="not_box">
  <div class="user-info">
    <div class="img">
      <img src="/${notification.student_info.stud_img}" alt="opps image can't load">
    </div>
    <div class="dec ">
      <div class="head" style="font-size: 13px;">${notification.student_info.username}</div>
      <div class="para2">Issue Date : ${date}</div>
    </div>
  </div>
  <div class="user-info">
    <div class="img book">
      <img src="/${notification.book_info.book_img}" alt="">
    </div>
    <div class="dec " style="padding-left: 12px;">
      <div class="head" style="font-size: 13px;">Requested For : ${notification.book_info.book_title}</div>
      <div class="para2">Accession No : ${notification.book_info.accession_no} </div>
    </div>
  </div>
  <div class="actions">
    <button class="btn-e" style="width: 100px; font-weight: normal; " onclick="NotificationRejected('${notification.student_info.id}','${notification.book_info.id}','${notification.book_info.accession_no}','${notification._id}')">Reject</button>
    <button class="btn-s" style="width: 100px; font-weight: normal; " onclick="NotificationAccepted('${notification.student_info.id}','${notification.book_info.id}','${notification.book_info.accession_no}','${notification._id}')">Accept</button>
  </div>
</div>
`;
}