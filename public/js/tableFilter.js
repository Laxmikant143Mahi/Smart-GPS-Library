const searchForm = document.querySelector(".searchForm");
const searchIssueForm = document.querySelector(".searchIssueForm");
const searchStudentForm = document.querySelector(".searchStudentForm");
const suggestionText = document.querySelector("#searchData");
const suggestionBox = document.querySelector("#suggestion-box");
const departments = document.querySelector("#departments");
const s_departments = document.querySelector("#s-departments");
const overdue_department = document.querySelector("#overdue-department");
const book_scheme = document.querySelector("#book_scheme");
const addMenuContainer = document.querySelector("#addMenuContainer0");
// code for getting suggestions
try {
  suggestionText.addEventListener("input", async (e) => {
    const serachData = suggestionText.value;
    try {
      if (serachData.length == 0) {
        suggestionBox.classList.remove("show");
      } else {
        suggestionBox.classList.add("show");
        const res = await fetch("/admin/books/search", {
          method: "POST",
          body: JSON.stringify({ serachData }),
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        suggestionBox.innerHTML = "";
        if (data.books.length == 0) {
          suggestionBox.classList.remove("show");
        }
        data.books.forEach((book) => {
          suggestionBox.innerHTML += `<li id="sug-data">${book.book_title}</li>`;
          const bookItem = document.querySelector("#sug-data");
          bookItem.addEventListener("click", () => {
            searchData.value = book.book_title;
            suggestionBox.classList.remove("show");
          });
          suggestionBox.appendChild(bookItem);
        });
      }
    } catch (err) {
      console.log(err);
    }
  });
} catch (err) {}

// Function for search book by using search box
try {
  searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const serachData = searchForm.search.value;
    try {
      const res = await fetch("/admin/books/show", {
        method: "POST",
        body: JSON.stringify({ serachData }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      document.querySelector("#myTableRow").innerHTML = "";
      if (data.books.length == 0) {
        document.querySelector(
          "#myTableRow"
        ).innerHTML = `<div class="all-i-b" style="position: absolute;top: 40%; left: 35%; font-size: 30px; font-weight: 700; color: #e9e9e9; pointer-events: none;">No Issued Books</div>`;
      }
      let status, label;
      data.books.forEach((book) => {
        if (book.book_status == "Active") {
          status = "Active";
          label = "btn-s";
        } else {
          status = "In-active";
          label = "btn-e";
        }
        document.querySelector("#myTableRow").innerHTML += getBookTable(
          book,
          status,
          label
        );
      });
    } catch (err) {
      console.log();
    }
  });
} catch (err) {
  console.log();
}

// search issue book using student enrollment no
try {
  searchIssueForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const enrollment = searchIssueForm.search.value;
      // postIssuedBooks()
      const res = await fetch("/admin/books/issuedBooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      document.querySelector("#myTableRow").innerHTML = "";
      const data = await res.json();
      let book_count = 0;
      if (data.books.length > 0) {
        data.books.forEach((book) => {
          if (book.student_info.enrollment_no == enrollment && !book.isReturn) {
            document.querySelector("#myTableRow").innerHTML +=
              getIssueBooksTable(book);
            book_count++;
          }
        });
        if (book_count == 0) {
          document.querySelector(
            "#myTableRow"
          ).innerHTML = `<div class="all-i-b" style="position: absolute;top: 50%; left: 35%; font-size: 30px; font-weight: 700; color: #e9e9e9; pointer-events: none;">No Issued Books </div>`;
        }
      } else {
        document.querySelector("#myTableRow").innerHTML = data.msg;
      }
    } catch (err) {
      console.log(err);
    }
  });
} catch (error) {
  console.log();
}
// search issue book using student enrollment no
try {
  searchStudentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const enrollment = searchStudentForm.search.value;
      const statusData = enrollment;
      const res = await fetch("/admin/students/enrollment", {
        method: "POST",
        body: JSON.stringify({ statusData }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      document.querySelector("#myTableRow").innerHTML = "";
      let status, label;
      if (data.students.length == 0) {
        document.querySelector(
          "#myTableRow"
        ).innerHTML = `<div class="all-i-b" style="position: absolute;top: 40%; left: 35%; font-size: 30px; font-weight: 700; color: #e9e9e9; pointer-events: none;">Student Not Found</div>`;
      }
      data.students.forEach((student) => {
        if (student.status == "Active") {
          status = "Active";
          label = "btn-s";
        } else {
          status = "In-active";
          label = "btn-e";
        }
        document.querySelector("#myTableRow").innerHTML += getStudentTable(
          student,
          status,
          label
        );
      });
    } catch (err) {
      console.log(err);
    }
  });
} catch (error) {
  console.log();
}
// Search Students Using Departments
// Admin -> code to get data using departments
try {
  s_departments.addEventListener("change", async (e) => {
    if (s_departments.value == "All Departments") {
      location.reload();
    }
    if (s_departments.value == "+ Add Department") {
      popupId.classList.toggle("active");
      popupId.innerHTML = addScheme("/admin/addDepartment");
    } else {
      try {
        const department = s_departments.value;
        const res = await fetch("/admin/student/search/department", {
          method: "POST",
          body: JSON.stringify({ department }),
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        document.querySelector("#myTableRow").innerHTML = "";
        if (data.students.length > 0) {
          data.students.forEach((student) => {
            let label, status;
            if (student.status == "Active") {
              status = "Active";
              label = "btn-s";
            } else {
              status = "In-active";
              label = "btn-e";
            }
            document.querySelector("#myTableRow").innerHTML += getStudentTable(
              student,
              status,
              label
            );
          });
        } else {
          document.querySelector(
            "#myTableRow"
          ).innerHTML = `<div class="all-i-b" style="position: absolute;top: 40%; left: 35%; font-size: 30px; font-weight: 700; color: #e9e9e9; pointer-events: none;">Student Not Found</div>`;
        }
      } catch (err) {
        console.log(err);
      }
    }
  });
} catch (err) {
  console.log();
}
// Admin -> code to get overdue Books data using departments
try {
  overdue_department.addEventListener("change", async (e) => {
    if (overdue_department.value == "All Departments") {
      location.reload();
    }
    if (overdue_department.value == "+ Add Department") {
      popupId.classList.toggle("active");
      popupId.innerHTML = addScheme("/admin/addDepartment");
    } else {
      try {
        const branch = overdue_department.value;
        // postIssuedBooks()
        const res = await fetch("/admin/books/issuedBooks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        document.querySelector("#myTableRow").innerHTML = "";
        const data = await res.json();
        let book_count = 0;
        if (data.books.length > 0) {
          data.books.forEach((book) => {
            if (book.student_info.branch == branch && !book.isReturn && book.overDue) {
              document.querySelector("#myTableRow").innerHTML +=
                getIssueBooksTable(book);
              book_count++;
            }
          });
          if (book_count == 0) {
            document.querySelector(
              "#myTableRow"
            ).innerHTML = `<div class="all-i-b" style="position: absolute;top: 50%; left: 35%; font-size: 30px; font-weight: 700; color: #e9e9e9; pointer-events: none;">No Issued Books </div>`;
          }
        } else {
          document.querySelector("#myTableRow").innerHTML = data.msg;
        }
      } catch (err) {
        console.log(err);
      }
    }
  });
} catch (err) {
  console.log();
}
// Code to search book by using status
const BookStatus = async (id, type) => {
  if (type == "student") {
    try {
      const statusData = id;
      const res = await fetch("/admin/students/status", {
        method: "POST",
        body: JSON.stringify({ statusData }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      document.querySelector("#myTableRow").innerHTML = "";
      let status, label;
      data.students.forEach((student) => {
        if (student.status == "Active") {
          status = "Active";
          label = "btn-s";
        } else {
          status = "In-active";
          label = "btn-e";
        }
        document.querySelector("#myTableRow").innerHTML += getStudentTable(
          student,
          status,
          label
        );
      });
    } catch (err) {
      console.log(err);
    }
  } else {
    try {
      const statusData = id;
      const res = await fetch("/admin/books/status", {
        method: "POST",
        body: JSON.stringify({ statusData }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      document.querySelector("#myTableRow").innerHTML = "";
      let status, label;
      data.books.forEach((book) => {
        if (book.book_status == "Active") {
          status = "Active";
          label = "btn-s";
        } else {
          status = "In-active";
          label = "btn-e";
        }
        document.querySelector("#myTableRow").innerHTML += getBookTable(
          book,
          status,
          label
        );
      });
    } catch (err) {
      console.log(err);
    }
  }
};

// get issued books
const getIssuedBooks = async () => {
  try {
    // postIssuedBooks()
    const res = await fetch("/admin/books/issuedBooks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    document.querySelector("#myTableRow").innerHTML = "";
    const data = await res.json();
    let issue_count = 0;
    data.books.forEach((book) => {
      if (!book.isReturn) {
        document.querySelector("#myTableRow").innerHTML +=
          getIssueBooksTable(book);
          issue_count=0;
      }else{
        issue_count++;
      }
    });
    if (issue_count != 0) {
      document.querySelector(
        "#myTableRow"
      ).innerHTML = `<div class="all-i-b" style="position: absolute;top: 40%; left: 35%; font-size: 30px; font-weight: 700; color: #e9e9e9; pointer-events: none;">Books Not Found</div>`;
    }
  } catch (err) {
    console.log(err);
  }
};
// get returned books
const getReturnedBooks = async () => {
  try {
    // postIssuedBooks()
    const res = await fetch("/admin/books/issuedBooks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    document.querySelector("#myTableRow").innerHTML = "";
    const data = await res.json();
    if (data.books.length > 0) {
      data.books.forEach(async (issue) => {
        if (issue.isReturn) {
          document.querySelector("#myTableRow").innerHTML +=
            getIssueBooksTable(issue);
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/* 
------------------------------------------------- Tables--------------------------------------------------------
                                              GET BOOKS USING BOOK STATUS
----------------------------------------------------------------------------------------------------------------
 */
function getBookTable(book, status, label) {
  let acc_no =
    book.accession_no[0] +
    " To " +
    book.accession_no[book.accession_no.length - 1];
  return `
<tr class="solid ">
  <td class="img-book"><img src="/${book.book_img}" alt=""></td>
  <td class="book-ac-no">${acc_no}</td>
  <td class="book_name">${book.book_title}</td>
  <td class="author">${book.book_author}</td>
  <td class="edition">${book.book_edition}</td>
  <td class="book_scheme">${book.book_schema}</td>
  <td class="book_cost">${book.book_cost}</td>
  <td class="btns"><button class="${label}" style="width: 100px; font-weight: normal;">${status} </button>
  <td class="btns"><button class="btn-s" style="width: 100px; font-weight: normal;"
      onclick="showPopUp('${book._id}')">View</button>
</tr>
`;
}
/*
----------------------------------------------------------- Tables ---------------------------------------------------------
                                              GET STUDENT USING STUDENT STATUS
----------------------------------------------------------------------------------------------------------------------------
 */
function getStudentTable(student, status, label) {
  return `
<tr class=" solid ">
  <td class="img"><img src="/${student.stud_img}" onerror="this.onerror=null; this.src='/profile.png'" alt=""></td>
  <td class="s-name name">${student.username}</td>
  <td class="en-no">${student.enrollment_no}</td>
  <td class="en-no">${student.branch}</td>
  <td class="mo-no">${student.current_year}</td>
  <td class="brach">${student.gender}</td>
  <td class="en-no">${student.mobile_no}</td>
  <td class="btns"><button class="${label}" style="width: 100px; font-weight: normal;">${status} </button>
  <td class="btns"><button class="btn-s" style="width: 100px; font-weight: normal;" onclick="showStudentPopUp('${student._id}')">View</button>
  </td>
</tr>
`;
}
/*
----------------------------------------------------------- Tables ---------------------------------------------------------
                                              GET ISSUED BOOKS [ ISSUED & RETURN BOTH ]
----------------------------------------------------------------------------------------------------------------------------
 */
function getIssueBooksTable(issues) {
  let date = new Date(issues.book_info.issueDate);
  date = date.toLocaleDateString();
  let r_date = new Date(issues.book_info.returnDate);
  r_date = r_date.toLocaleDateString();
  let action, text, new_class;
  if (!issues.isReturn) {
    action = "btn-e";
    text = "Issued";
    new_param = "";
  }
  if (issues.isReturn) {
    action = "btn-s";
    text = "Returned";
    new_param = "true";
  }
  return `
<div class="myrow">
  <tr class="solid ">
    <td class="img"><img src="/${issues.student_info.stud_img}" alt=""></td>
    <td class="s-name name">${issues.student_info.username}</td>
    <td class="en-no">${issues.student_info.enrollment_no}</td>
    <td class="book-ac-no">${issues.book_info.accession_no}</td> 
    <td class="book_name">${issues.book_info.book_title}</td>
    <td class="issue_date">${date}</td>
    <td class="retrun_date">${r_date}</td>
    <td class="">${issues.student_info.fines}</td>
    <td class="btns"><button class="${action}" style="width: 100px; font-weight: normal;")">${text}</button></td>
    <td><button class="btn-s" style="width: 100px; font-weight: normal;" onclick="showIssuePopUp('${issues._id}','${new_param}')">View</button></td>
  </tr>
</div>
`;
}
