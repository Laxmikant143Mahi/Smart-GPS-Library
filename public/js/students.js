function AlertClose() {
  document.getElementById("AlertClose").style.display = "none";
}
function ReturnBook(){
  alert("Hey User Go To Library And Return Book !!!");
}
// student bio
function setEditable() {
  document.getElementById("aboutStudent").readOnly = false;
  document.getElementById("saveBio").classList.toggle("active");
}
// post request sent for save bio
const saveBio = async (stud_id) => {
  let bio = document.getElementById("aboutStudent").value;
  if (bio == "") {
    alert("You can't save empty bio !!!");
  } else {
    alert("Your Bio : " + bio);
    await addBio(stud_id, bio);
    document.getElementById("aboutStudent").readOnly = true;
    document.getElementById("saveBio").classList.toggle("active");
  }
};
// submit bio to database
const addBio = async (stud_id, bio) => {
  try {
    const res = await fetch("/user/1/profile/bio", {
      method: "POST",
      body: JSON.stringify({ stud_id, bio }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (data.msg == "success") {
      alert("Bio Updated successfully");
    } else {
      alert("Error To Change Bio !!!");
    }
  } catch (err) {
    console.log(err);
  }
};

const issueBook = async (stud_id, book_id, acc_no) => {
  try {
    const res = await fetch("/user/1/books/issue", {
      method: "POST",
      body: JSON.stringify({ stud_id, book_id, acc_no }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    alert(data.msg)
    location.reload()
  } catch (err) {
    console.log(err);
  }
};
function viewBook(book_name, book_id) {
  alert("Your Book : " + book_name + " Book Id : " + book_id);
}

function showNotification() {
  document.getElementById("notification_drawer").classList.toggle("active");
}

const getStudentNotification = async () => {
  try {
    let count = 0;
    const stud_id = await document.getElementById("user_id").value;
    const res = await fetch("/user/1/notification", {
      method: "POST",
      body: JSON.stringify({ stud_id }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    document.querySelector("#all_notifications").innerHTML = "";
    if (data.notification.length != "0") {
      data.notification.forEach((notification) => {
        if (!notification.isRead && notification.status === "success") {
          document.querySelector("#all_notifications").innerHTML +=
            getUserNotification(notification);
          count += 1;
        }
        if (!notification.isRead && notification.status === "return") {
          document.querySelector("#all_notifications").innerHTML +=
            getUserReturnNotification(notification);
          count += 1;
        }
        if (notification.status === "error" && !notification.isRead) {
          document.querySelector("#all_notifications").innerHTML +=
            getUserErrorNotification(notification);
          count += 1;
        }
      });
      document.querySelector("#ntcount").innerHTML = count;
    }
    if (count == 0) {
      document.querySelector("#all_notifications").innerHTML =
        "Empty Notifications";
    }
  } catch (err) {
    console.log(err);
  }
};
getStudentNotification();

// sent post req to set notification read
const setRead = async (book_id) => {
  try {
    const stud_id = await document.getElementById("user_id").value;
    const res = await fetch("/user/1/notification/read", {
      method: "POST",
      body: JSON.stringify({ stud_id, book_id }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    // location.reload()
    await getStudentNotification()
  } catch (err) {
    console.log(err);
  }
};

function getUserNotification(notification) {
  return `
   <div class="not-box user" style="min-height:130px;">
    <div class="user-info" style="height:70px;">
      <div class="img book">
        <img src="/java1.jpg" alt="">
      </div>
      <div class="dec user" style="padding: 5px;">
        <div class="head" style="font-size: 13px;">Congratulations !!!</div>
        <div class="para2" style="line-height:17px;">Your requested book <b>${notification.book_title}</b> Come Tomorrow Morn10:30AM to Evening 4PM and Get Your Book </div>
      </div>
    </div>
    <div class="actions" style=" justify-content:space-between; padding-left:15px;">
        <button class="btn-s" style="width: 25%; height:20px;font-weight: normal;" onclick="setRead('${notification.book_id}')">Ok</button>
    </div>
  </div>
  `;
}
// getting all user notification
function getUserReturnNotification(notification) {
  return `
  <div class="not-box user" style="min-height:130px;">
    <div class="user-info" style="height:70px;">
      <div class="img book">
        <img src="/java1.jpg" alt="">
      </div>
      <div class="dec user" style="padding: 5px;">
      <div class="head" style="font-size: 13px;">Hey Student !!!</div>
        <div class="para2" style="line-height:17px;">Your Book <b>${notification.book_title}</b> This ${notification.msg} </div>
      </div>
    </div>
    <div class="actions" style=" justify-content:space-between; padding-left:15px;">
      <button class="btn-s" style="width: 25%; height:20px;font-weight: normal;" onclick="setRead('${notification.book_id}')">Ok</button>
    </div>
  </div>
  `;
}
// get error
function getUserErrorNotification(notification) {
  return `
  <div class="not-box user" style="min-height:130px;">
    <div class="user-info" style="height:70px;">
      <div class="img book">
          <img src="/${notification.book_img}" alt="">
      </div>
      <div class="dec user" style="padding: 5px;">
          <div class="head" style="font-size: 13px;">Book Issue Rejected!!!</div>
          <div class="para2" style="line-height:17px;">Your requested book <b>${notification.book_title}</b> Has been rejected ${notification.msg} </div>
      </div>
    </div>
    <div class="actions" style=" justify-content:space-between; padding-left:15px;">
        <button class="btn-s" style="width: 25%; height:20px;font-weight: normal;" onclick="setRead('${notification.book_id}')">Ok</button>
    </div>
  </div>
  `;
}

// updating image open popup
function updateProfile() {
 document.getElementById("pop_form").classList.toggle('active');
}
// updating image open popup
function closeUpdateProfile() {
 document.getElementById("pop_form").classList.toggle('active');
}