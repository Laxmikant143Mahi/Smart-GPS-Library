const popupId = document.getElementById("pop-up-container");
const infoContainer = document.getElementById("info-container");
function closePopUp() {
  popupId.classList.toggle("active");
}
// Displaying Book Pup-Up
const showPopUp = async (book_id) => {
  // console.log(book_id);
  const response = await fetch("/admin/getBookData", {
    method: "POST",
    body: JSON.stringify({ book_id }),
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  // console.log(data);
  popupId.classList.toggle("active");
  popupId.innerHTML = getPopUp(data.book);
};
// Display issue PopUp
const showIssuePopUp = async (issue_id, isReturn) => {
  const response = await fetch("/admin/getIssueData", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ issue_id }),
  });
  const data = await response.json();
  popupId.classList.toggle("active");
  popupId.innerHTML = getIssueData(
    data.issue,
    data.book,
    data.student,
    isReturn
  );
};
// Searching Using book scheme searching
try {
  book_scheme.addEventListener("change", async (e) => {
    if (book_scheme.value == "All Books") {
      location.reload();
    } else if (book_scheme.value == "+ Add Schema") {
      popupId.classList.toggle("active");
      popupId.innerHTML = addScheme("/admin/addScheme");
    } else {
      try {
        const schema = book_scheme.value;
        const res = await fetch("/admin/books/search/scheme", {
          method: "POST",
          body: JSON.stringify({ schema }),
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        document.querySelector("#myTableRow").innerHTML = "";
        if (data.books.length > 0) {
          data.books.forEach((book) => {
            document.querySelector("#myTableRow").innerHTML +=
              get_BookTable(book);
          });
        } else {
          document.querySelector(
            "#myTableRow"
          ).innerHTML = `<div class="all-i-b" style="position: absolute;top: 40%; left: 35%; font-size: 30px; font-weight: 700; color: #e9e9e9; pointer-events: none;">Books Not Found</div>`;
        }
      } catch (err) {
        console.log(err);
      }
    }
  });
} catch (err) {
  console.log();
}
// Admin -> code to get data using departments
try {
  departments.addEventListener("change", async (e) => {
    if (departments.value == "All Departments") {
      location.reload();
    }
    if (departments.value == "+ Add Department") {
      popupId.classList.toggle("active");
      popupId.innerHTML = addScheme("/admin/addDepartment");
    } else {
      try {
        const department = departments.value;
        const res = await fetch("/admin/books/search/department", {
          method: "POST",
          body: JSON.stringify({ department }),
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        document.querySelector("#myTableRow").innerHTML = "";
        if (data.books.length > 0) {
          data.books.forEach((book) => {
            document.querySelector("#myTableRow").innerHTML +=
              get_BookTable(book);
          });
        } else {
          document.querySelector(
            "#myTableRow"
          ).innerHTML = `<div class="all-i-b" style="position: absolute;top: 40%; left: 35%; font-size: 30px; font-weight: 700; color: #e9e9e9; pointer-events: none;">Books Not Found</div>`;
        }
      } catch (err) {
        console.log(err);
      }
    }
  });
} catch (err) {
  console.log();
}
function closeForm(id) {
  // document.getElementById(id).style.display='none'
  popupId.classList.toggle("active");
}
// Admin -> Add New Schema & Department Pop-Up
function addScheme(type) {
  let scheme;
  let label;
  if (type == "/admin/addScheme") {
    scheme = type;
    label = "Add Scheme";
  } else if (type == "/admin/addDepartment") {
    scheme = type;
    label = "Add Department";
  }
  return `
  <form id="addschemeform" action="${scheme}" method="post">
    <div class="input-field" style="width: 180px;">
      <input type="text" name="newScheme" required>
      <span>${label}</span>
    </div>
    <div class="input-field ">
      <button class="btn-f">${label}</button>
    </div>
    <p class="close" onclick="closeForm('addschemeform')">X</p>
  </form>
`;
}

const showStudentPopUp = async (_id) => {
  // alert("Student Id : " + _id);
  // send post request for getting single student data
  try {
    const response = await fetch("/admin/getStudentData", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id }),
    });
    const data = await response.json();
    popupId.classList.toggle("active");
    popupId.innerHTML = getStudentData(data.student);
  } catch (error) {
    console.log(error);
  }
};
/*
----------------------------------------------------------- POP-UP ---------------------------------------------------------
                                                DISPLAY SINGLE BOOK POP-UP
----------------------------------------------------------------------------------------------------------------------------
*/
// for only book
function getPopUp(book) {
  let acc_no =
    book.accession_no[0] +
    " To " +
    book.accession_no[book.accession_no.length - 1];
  let book_issues = book.issued_no.length;
  return `
<div class="info-container book" id="info-container">
  <div class="book-info i-box">
    <div class="img i-box">
      <img src="/${book.book_img}" alt="">
    </div>
    <div class="books-info i-box">
      <p class="b-title head">${book.book_title}</p>
      <div class="desc-con">
        <div class="description i-box">
          <p class="p1 head">Author</p>
          <p class="p2 para2">${book.book_author}</p>
        </div>
        <div class="description i-box">
          <p class="p1 head">Edition</p>
          <p class="p2 para2">${book.book_edition}</p>
        </div>
        <div class="description i-box">
          <p class="p1 head">Issued</p>
          <p class="p2 para2">${book_issues}</p>
        </div>
        <div class="description i-box">
          <p class="p1 head">Acc No's</p>
          <p class="p2 para2">${acc_no}</p>
        </div>
      </div>
      <div class="actions i-box">
        <button class="btn-e" style="width: 110px; margin-right:20px; height: 25px;" onclick="closePopUp()">ok</button>
        <a href="/admin/books/update/?book=${book._id}" class="btn-s"
          style="width: 110px; text-align:center; font-size: 14px; font-weight: 500;">Update</a>
      </div>
    </div>
    <div class="ac-no">AC NO : ${acc_no}</div>
  </div>
</div>
`;
}
/*
----------------------------------------------------------- POP-UP ---------------------------------------------------------
                                                DISPLAY SINGLE STUDENT POP-UP
----------------------------------------------------------------------------------------------------------------------------
*/
function getStudentData(student) {
  return `
<div class="info-container active" id="info-container">
  <div class="user-info active i-box">
    <div class="img i-box">
      <img src="/${student.stud_img}" alt="">
    </div>
    <div class="stud-info i-box">
      <p class="s-name head">${student.username}</p>
      <p class="s-enroll head2">En - ${student.enrollment_no}</p>
      <p class="s-about para">Bio : ${student.bio}</p>
      <p class="s-about para">Branch : ${student.branch}</p>
      <p class="s-about para">Status : ${student.status}</p>
      <p class="s-about para">Mobile No : ${student.mobile_no}</p>
      <p class="s-about para">Email : ${student.email}</p>
    </div>
    <div class="actions i-box">
      <button class="btn-e" style=" margin-right:5px;padding: 2px 8px; min-width:90px;" onclick="closePopUp()">Ok</button>
      <a href="/admin/students/update/?student=${student._id}" class="btn-s"
          style="width: 110px; text-align:center; font-size: 14px; font-weight: 500;" >Update</a>
    </div>
  </div>
</div>
`;
}
/*
----------------------------------------------------------- POP-UP ---------------------------------------------------------
                                              DISPLAY ISSUED BOOK POP-UP [ STUDENT + BOOK ]
----------------------------------------------------------------------------------------------------------------------------
*/
// for only issue book
function getIssueData(issue, book, student, isReturn) {
  let acc_no =
    book.accession_no[0] +
    " To " +
    book.accession_no[book.accession_no.length - 1];

  if (isReturn) {
    return `
<div class="info-container" id="info-container">
  <div class="user-info i-box">
    <div class="img i-box">
      <img src="/${student.stud_img}" alt="">
    </div>
    <div class="stud-info i-box">
      <p class="s-name head">${student.username}</p>
      <p class="s-enroll head2">En - ${student.enrollment_no}</p>
      <p class="s-about para">${student.bio}</p>
    </div>
    <div class="actions i-box">
    <a href="/admin/students/update/?student=${student._id}" class="btn-s"
    style="width: 110px; text-align:center; font-size: 14px; font-weight: 500;" >Update</a>
    </div>
  </div>
  <div class="book-info i-box">
    <div class="img i-box">
      <img src="/${book.book_img}" alt="">
    </div>
    <div class="books-info i-box">
      <p class="b-title head">${book.book_title}</p>
      <div class="desc-con">
        <div class="description i-box">
          <p class="p1 head">Author</p>
          <p class="p2 para2">${book.book_author}</p>
        </div>
        <div class="description i-box">
          <p class="p1 head">Edition</p>
          <p class="p2 para2">${book.book_edition}</p>
        </div>
        <div class="description i-box">
          <p class="p1 head">Acc No's</p>
          <p class="p2 para2">${acc_no}</p>
        </div>
      </div>
      <div class="actions i-box">
        <button class="btn-e" style="width: 110px; margin-right:20px ; " onclick="closePopUp()">ok</button>
        <a href="/admin/books/update/?book=${book._id}" class="btn-s"
          style="width: 110px; text-align:center; font-size: 14px; font-weight: 500;">Update</a>
      </div>
    </div>
    <div class="ac-no">Issue Acc : ${issue.book_info.accession_no}</div>
  </div>
</div>
`;
  } else {
    return `
    <div class="info-container" id="info-container">
  <div class="user-info i-box">
    <div class="img i-box">
      <img src="/${student.stud_img}" alt="">
    </div>
    <div class="stud-info i-box">
      <p class="s-name head">${student.username}</p>
      <p class="s-enroll head2">En - ${student.enrollment_no}</p>
      <p class="s-about para">${student.bio}</p>
    </div>
    <div class="actions i-box">
    <button class="btn-e" onclick="closePopUp()">Send Warning</button>
    <a href="/admin/books/return/?en=${student.enrollment_no}" class="btn-s" >Return</a>
    </div> 
  </div>
  <div class="book-info i-box">
    <div class="img i-box">
      <img src="/${book.book_img}" alt="">
    </div>
    <div class="books-info i-box">
      <p class="b-title ">${book.book_title}</p>
      <div class="desc-con">
        <div class="description i-box">
          <p class="p1 ">Author</p>
          <p class="p2 ">${book.book_author}</p>
        </div>
        <div class="description i-box">
          <p class="p1 ">Edition</p>
          <p class="p2 ">${book.book_edition}</p>
        </div>
        <div class="description i-box">
          <p class="p1 ">Acc No's</p>
          <p class="p2 ">${acc_no}</p>
        </div>
      </div>
      <div class="actions i-box">
        <button class="btn-e" style="width: 110px; margin-right:20px ; " onclick="closePopUp()">ok</button>
        <a href="/admin/books/update/?book=${book._id}" class="btn-s"
          style="width: 110px; text-align:center; font-size: 14px; font-weight: 500;">Update</a>
      </div>
    </div>
    <div class="ac-no">Issue Acc : ${issue.book_info.accession_no}</div>
  </div>
</div>
`;
  }
}

function get_BookTable(book) {
  let acc_no =
    book.accession_no[0] +
    " To " +
    book.accession_no[book.accession_no.length - 1];
  let b_class;
  if (book.book_status == "In-Active") {
    b_class = "btn-e";
  } else {
    b_class = "btn-s";
  }
  return `
<tr class="solid ">
  <td class="img-book"><img src="/${book.book_img}" alt=""></td>
  <td class="book-ac-no">${acc_no}</td>
  <td class="book_name">${book.book_title}</td>
  <td class="author">${book.book_author}</td>
  <td class="edition">${book.book_edition}</td>
  <td class="book_scheme">${book.book_schema}</td>
  <td class="book_cost">${book.book_cost}  &#8377</td>
  <td class="btns"><button class="${b_class}" style="width: 100px; font-weight: normal;">${book.book_status} </button>
  <td class="btns"><button class="btn-s" style="width: 100px; font-weight: normal;"
      onclick="showPopUp('${book._id}')">View</button>
</tr>
`;
}

// @Ani_1988
