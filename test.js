const userList = document.querySelector(".userInfo");
const url = "https://67176b46b910c6a6e0280c7e.mockapi.io/user/";

var newMemberAddBtn = document.querySelector(".addMemberBtn"),
  darkBg = document.querySelector(".dark_bg"),
  popupForm = document.querySelector(".popup"),
  crossBtn = document.querySelector(".closeBtn"),
  submitBtn = document.querySelector(".submitBtn"),
  modalTitle = document.querySelector(".modalTitle"),
  popupFooter = document.querySelector(".popupFooter"),
  imgInput = document.querySelector(".img"),
  imgHolder = document.querySelector(".imgholder");
(form = document.querySelector("form")),
  (formInputFields = document.querySelectorAll("form input")),
  (uploadimg = document.querySelector("#uploadimg")),
  (fName = document.getElementById("fName")),
  (lName = document.getElementById("lName")),
  (age = document.getElementById("age")),
  (city = document.getElementById("city")),
  (position = document.getElementById("position")),
  (salary = document.getElementById("salary")),
  (sDate = document.getElementById("sDate")),
  (email = document.getElementById("email")),
  (phone = document.getElementById("phone")),
  (entries = document.querySelector(".showEntries")),
  (tabSize = document.getElementById("table_size")),
  (table = document.querySelector("table")),
  (filterData = document.getElementById("search"));

let isEdit = false;
let editId = null;
let currentPage = 1;
let filterArray = [];

var arrayLength = 0;
var tableSize = 10;
var startIndex = 1;
var endIndex = 0;
var currentIndex = 1;
var maxIndex = 0;

newMemberAddBtn.addEventListener("click", () => {
  isEdit = false;
  submitBtn.innerHTML = "Submit";
  modalTitle.innerHTML = "Fill the Form";
  popupFooter.style.display = "block";
  imgInput.src = "./img/pic1.png";
  darkBg.classList.add("active");
  popupForm.classList.add("active");
});

crossBtn.addEventListener("click", () => {
  darkBg.classList.remove("active");
  popupForm.classList.remove("active");
  form.reset();
});

uploadimg.onchange = function () {
  if (uploadimg.files[0].size < 1000000) {
    // 1MB = 1000000
    var fileReader = new FileReader();

    fileReader.onload = function (e) {
      var imgUrl = e.target.result;
      imgInput.src = imgUrl;
    };

    fileReader.readAsDataURL(uploadimg.files[0]);
  } else {
    alert("This file is too large!");
  }
};

tabSize.addEventListener("change", () => {
  var selectedValue = parseInt(tabSize.value);
  tableSize = selectedValue;
  currentIndex = 1;
  startIndex = 1;
  displayIndexBtn(currentPage);
  fetchData(currentIndex);
});

function fetchData(page) {
  const limit = tableSize;
  fetch(`${url}?page=${page}&limit=${limit}`)
    .then((res) => res.json())
    .then((data) => {
      renderUser(data);
      displayIndexBtn(page);
    });
}

function displayIndexBtn(page) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const totalEntries = data.length;
      const maxIndex = Math.ceil(totalEntries / tableSize); // số trang tương ứng
      const pagination = document.querySelector(".pagination");
      pagination.innerHTML = ""; // xóa các nút phân trang cũ

      // Nút Previous
      pagination.innerHTML =
        '<button onclick="prev()" class="prev">Previous</button>';

      // Tạo các nút phân trang dựa trên số lượng user và số trang
      for (let i = 1; i <= maxIndex; i++) {
        pagination.innerHTML +=
          '<button onclick="paginationBtn(' +
          i +
          ')" index="' +
          i +
          '">' +
          i +
          "</button>";
      }

      // Nút Next
      pagination.innerHTML +=
        '<button onclick="next()" class="next">Next</button>';

      highlightIndexBtn(page, maxIndex); // làm nổi bật nút phân trang hiện tại
    });
}

function highlightIndexBtn(page, maxIndex) {
  entries.textContent = `Showing entries for page ${page} of ${maxIndex}`;

  var paginationBtns = document.querySelectorAll(".pagination button");
  paginationBtns.forEach((btn) => {
    btn.classList.remove("active");
    if (btn.getAttribute("index") === page.toString()) {
      btn.classList.add("active");
    }
  });
}
function paginationBtn(page) {
  currentPage = page;
  fetchData(currentPage);
}

function next() {
  if (currentPage < Math.ceil(arrayLength / tableSize)) {
    currentPage++;
    fetchData(currentPage);
  }
}

function prev() {
  if (currentPage > 1) {
    currentPage--;
    fetchData(currentPage);
  }
}

// function prev() {
//   if (currentPage > 1) {
//     currentPage--;
//     fetchData(currentPage);
//   }
// }

// Initial data fetch
fetchData(currentPage);

// Render user in table
const renderUser = (users) => {
  let ouput = " ";
  users.forEach((user) => {
    ouput += `
         <tr data-id="${user.id}">
         <td><img src="${user.Avatar}" alt="" width="40" height="40"></td>
         <td>${user.FirstName + " " + user.LastName}</td>
         <td>${user.Age}</td>
         <td>${user.City}</td>
         <td>${user.Position}</td>
         <td>${user.Salary}</td>
         <td>${user.StartDate}</td>
         <td>${user.Email}</td>
         <td>${user.Phone}</td>
         <td>
            <button><i class="fa-regular fa-eye" id="view-user"></i></button>
            <button><i class="fa-regular fa-pen-to-square" id="edit-user"></i></button>
            <button><i class="fa-regular fa-trash-can" id="delete-user"></i></button>
         </td>
     </tr>
          `;
  });
  userList.innerHTML = ouput;
  table.style.minWidth = "1400px";
};

// Filter method
filterData.addEventListener("input", () => {
  const searchTerm = filterData.value.toLowerCase().trim();

  if (searchTerm !== "") {
    fetch(`${url}?search=${searchTerm}`)
      .then((res) => res.json())
      .then((filteredData) => {
        renderUser(filteredData);
      })
      .catch((error) => {
        console.error("Error fetching filtered data:", error);
      });
  } else {
    fetch(url)
      .then((res) => res.json())
      .then((originalData) => {
        renderUser(originalData);
      })
      .catch((error) => {
        console.error("Error fetching original data:", error);
      });
  }
});

// Create user method
form.addEventListener("submit", (e) => {
  e.preventDefault();
  submitBtn.innerHTML = "Submit";
  modalTitle.innerHTML = "Fill the Form";
});

// Function delete and edit and view user
// METHOD: Delete, PATCH
userList.addEventListener("click", (e) => {
  e.preventDefault();
  let trElement = e.target.closest("tr");
  let id = trElement ? trElement.dataset.id : null;
  let deleteButtonPressed = e.target.id == "delete-user";
  let editButtonPressed = e.target.id == "edit-user";
  let viewButtonPressed = e.target.id == "view-user";
  editId = id;
  // Delete
  if (deleteButtonPressed) {
    if (confirm("Are you sure want to delete")) {
      fetch(`${url}/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then(() => location.reload());
    }
  }

  // Edit User
  if (editButtonPressed) {
    isEdit = true;
    console.log("user id: ", editId);
    fetch(`${url}/${editId}`)
      .then((res) => res.json())
      .then((userData) => {
        imgInput.src = userData.Avatar;
        fName.value = userData.FirstName;
        lName.value = userData.LastName;
        age.value = userData.Age;
        city.value = userData.City;
        position.value = userData.Position;
        salary.value = userData.Salary;
        sDate.value = userData.StartDate;
        email.value = userData.Email;
        phone.value = userData.Phone;

        darkBg.classList.add("active");
        popupForm.classList.add("active");
        popupFooter.style.display = "block";
        modalTitle.innerHTML = "Update the Form";
        submitBtn.innerHTML = "Update";
        formInputFields.forEach((input) => {
          input.disabled = false;
        });
      });
  }

  // Read User
  if (viewButtonPressed) {
    fetch(`${url}/${editId}`)
      .then((res) => res.json())
      .then((userData) => {
        imgInput.src = userData.Avatar;
        fName.value = userData.FirstName;
        lName.value = userData.LastName;
        age.value = userData.Age;
        city.value = userData.City;
        position.value = userData.Position;
        salary.value = userData.Salary;
        sDate.value = userData.StartDate;
        email.value = userData.Email;
        phone.value = userData.Phone;

        darkBg.classList.add("active");
        popupForm.classList.add("active");
        popupFooter.style.display = "none";
        modalTitle.innerHTML = "Profile";
        formInputFields.forEach((input) => {
          input.disabled = true;
        });
      });
  }
  imgHolder.style.pointerEvents = "none";
});

// Button Submit || Button Update
submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("Submit button clicked, isEdit:", isEdit, "editId:", editId);

  const avatarSrc = document.getElementById("preview").src;

  if (isEdit) {
    fetch(`${url}/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Avatar: avatarSrc,
        FirstName: fName.value,
        LastName: lName.value,
        Age: age.value,
        City: city.value,
        Position: position.value,
        Salary: salary.value,
        StartDate: sDate.value,
        Email: email.value,
        Phone: phone.value,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        darkBg.classList.remove("active");
        popupForm.classList.remove("active");
        form.reset();
        location.reload();
      });
  } else {
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Avatar: avatarSrc === undefined ? "./img/pic1.png" : avatarSrc,
        FirstName: fName.value,
        LastName: lName.value,
        Age: age.value,
        City: city.value,
        Position: position.value,
        Salary: salary.value,
        StartDate: sDate.value,
        Email: email.value,
        Phone: phone.value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        darkBg.classList.remove("active");
        popupForm.classList.remove("active");
        form.reset();
        location.reload();
      })
      .catch((error) => {
        console.error("Error creating user:", error); // Bắt lỗi nếu có
      });
  }
});
