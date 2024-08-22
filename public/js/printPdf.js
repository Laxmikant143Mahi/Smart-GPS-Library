const printOverDueList = async () => {
  const pdf = document.getElementById("pdf");
  selected_department = overdue_department.value;
  let myDepartment = "";
  // fetch overdue books
  try {
    let isDepartmentSelected = false;
    document.querySelector("#pdf").innerHTML = "";
    if (
      selected_department == "Select Department" ||
      selected_department == "All Departments"
    ) {
      isDepartmentSelected = true;
      myDepartment = "All";
    }else{

    }
    document.querySelector("#pdf").innerHTML = getOverDueHeader(selected_department);
    const res = await fetch("/admin/books/issuedBooks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    let book_count = 0;
    if (data.books.length > 0) {
      data.books.forEach((book, index) => {
        if (
          !book.isReturn &&
          book.overDue &&
          book.student_info.branch == selected_department &&
          !isDepartmentSelected
        ) {
          myDepartment = selected_department;
          let r_date = new Date(book.book_info.returnDate);
          r_date = r_date.toLocaleDateString();
          document.querySelector("#pdf-tbody").innerHTML += `
            <tr>
              <td><p class="sr-no"> ${index + 1}</p></td>
              <td><p class="enrollment"> ${
                book.student_info.enrollment_no
              } </p></td>
              <td><p class="std-name"> ${book.student_info.username} </p></td>
              <td><p class="book-title"> ${book.book_info.book_title} </p></td>
              <td><p class="acc-no"> ${book.book_info.accession_no}</p></td>
              <td><p class="return-date"> ${r_date} </p></td>
              <td><p class="branch"> ${book.student_info.branch} </p></td>
              <td><p class="fine"> ${book.student_info.fines} &#8377</p></td>
            </tr>
          `;
        }
        if (isDepartmentSelected) {
          let r_date = new Date(book.book_info.returnDate);
          r_date = r_date.toLocaleDateString();
          document.querySelector("#pdf-tbody").innerHTML += `
            <tr>
              <td><p class="sr-no"> ${index + 1}</p></td>
              <td><p class="enrollment"> ${
                book.student_info.enrollment_no
              } </p></td>
              <td><p class="std-name"> ${book.student_info.username} </p></td>
              <td><p class="book-title"> ${book.book_info.book_title} </p></td>
              <td><p class="acc-no"> ${book.book_info.accession_no}</p></td>
              <td><p class="return-date"> ${r_date} </p></td>
              <td><p class="branch"> ${book.student_info.branch} </p></td>
              <td><p class="fine"> ${book.student_info.fines} &#8377</p></td>
            </tr>
          `;
        }
      });
    }
    if(document.querySelector('#pdf-tbody').innerHTML !=""){

      const element = document.getElementById("pdf");
      const options = {
      filename: `library-overdue-list-${myDepartment}-department.pdf`,
      margin: 1,
      html2canvas: { scale: 2 },
      jsPDF: {
        unit: "cm",
        format: "a4",
        orientation: "landscape",
      },
    };
    html2pdf().set(options).from(element).save();
  }else{
    alert("No Overdue Books")
  }

  } catch (error) {
    console.log(error);
  }
};

function getOverDueHeader(department) {
  return `<div class="pdf-header">
  <h3 class="title">GOVERNMENT POLYTECHNIC SOLAPUR LIBRARY</h3>
  <h4 class="description">List Of All OverDue Students ( ${department} ) Department</h4>
</div>
<table id="pdf-table">
  <thead id="pdf-head">
    <tr>
      <th><p class="sr-no"> S/N </p></th>
      <th><p class="enrollment"> Enrollment </p></th>
      <th><p class="std-name"> Name </p></th>
      <th><p class="book-title"> Book Title </p></th>
      <th><p class="acc-no"> Acc No </p></th>
      <th><p class="return-date"> Return Date </p></th>
      <th><p class="branch"> Branch </p></th>
      <th><p class="fine"> Fine </p></th>
    </tr>
  </thead>
  <tbody id="pdf-tbody"></tbody>
  <table>`;
}
