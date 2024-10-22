const userList = document.querySelector(".userInfo");
let ouput = " ";
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

function preLoadCalculations() {
  array = getData;
  arrayLength = array.length;
  maxIndex = arrayLength / tableSize;

  if (arrayLength % tableSize > 0) {
    maxIndex++;
  }
}

function displayIndexBtn() {
  preLoadCalculations();

  const pagination = document.querySelector(".pagination");

  pagination.innerHTML = "";

  pagination.innerHTML =
    '<button onclick="prev()" class="prev">Previous</button>';

  for (let i = 1; i <= maxIndex; i++) {
    pagination.innerHTML +=
      '<button onclick= "paginationBtn(' +
      i +
      ')" index="' +
      i +
      '">' +
      i +
      "</button>";
  }

  pagination.innerHTML += '<button onclick="next()" class="next">Next</button>';

  highlightIndexBtn();
}

function highlightIndexBtn() {
  startIndex = (currentIndex - 1) * tableSize + 1;
  endIndex = startIndex + tableSize - 1;

  if (endIndex > arrayLength) {
    endIndex = arrayLength;
  }

  if (maxIndex >= 2) {
    var nextBtn = document.querySelector(".next");
    nextBtn.classList.add("act");
  }

  entries.textContent = `Showing ${startIndex} to ${endIndex} of ${arrayLength} entries`;

  var paginationBtns = document.querySelectorAll(".pagination button");
  paginationBtns.forEach((btn) => {
    btn.classList.remove("active");
    if (btn.getAttribute("index") === currentIndex.toString()) {
      btn.classList.add("active");
    }
  });
}

tabSize.addEventListener("change", () => {
  var selectedValue = parseInt(tabSize.value);
  tableSize = selectedValue;
  currentIndex = 1;
  startIndex = 1;
  displayIndexBtn();
});

function paginationBtn(i) {
  currentIndex = i;

  var prevBtn = document.querySelector(".prev");
  var nextBtn = document.querySelector(".next");

  highlightIndexBtn();

  if (currentIndex > maxIndex - 1) {
    nextBtn.classList.remove("act");
  } else {
    nextBtn.classList.add("act");
  }

  if (currentIndex > 1) {
    prevBtn.classList.add("act");
  }

  if (currentIndex < 2) {
    prevBtn.classList.remove("act");
  }
}

function next() {
  var prevBtn = document.querySelector(".prev");
  var nextBtn = document.querySelector(".next");

  if (currentIndex <= maxIndex - 1) {
    currentIndex++;
    prevBtn.classList.add("act");

    highlightIndexBtn();
  }

  if (currentIndex > maxIndex - 1) {
    nextBtn.classList.remove("act");
  }
}

function prev() {
  var prevBtn = document.querySelector(".prev");

  if (currentIndex > 1) {
    currentIndex--;
    prevBtn.classList.add("act");
    highlightIndexBtn();
  }

  if (currentIndex < 2) {
    prevBtn.classList.remove("act");
  }
}

//Function display user
// Method: GET
const renderUser = (users) => {
  users.forEach((user) => {
    ouput += `
         <tr data-id = ${user.id}>
         <td>${user.id}</td>
         <td><img src="./img/pic1.png" alt="" width="40" height="40"></td>
         <td>${user.FirstName + " " + user.LastName}</td>
         <td>${user.Age}</td>
         <td>${user.City}</td>
         <td>${user.Position}</td>
         <td>${user.Salary}</td>
         <td>${user.StartDate}</td>
         <td>${user.Email}</td>
         <td>${user.Phone}</td>
         <td>${user.Email}</td>
         <td>
            <button><i class="fa-regular fa-eye"></i></button>
            <button><i class="fa-regular fa-pen-to-square" id="edit-user"></i></button>
            <button><i class="fa-regular fa-trash-can" id="delete-user"></i></button>
         </td>
     </tr>
          `;
  });
  userList.innerHTML = ouput;
};

fetch(url)
  .then((res) => res.json())
  .then((data) => renderUser(data));

// Function Create new User
// Method: POST
form.addEventListener("submit", (e) => {
  e.preventDefault();
  fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
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
      const dataArr = [];
      dataArr.push(data);
      renderUser(dataArr);
    });
  submitBtn.innerHTML = "Submit";
  modalTitle.innerHTML = "Fill the Form";
  darkBg.classList.remove("active");
  popupForm.classList.remove("active");
  form.reset();

  highlightIndexBtn();
  displayIndexBtn();
  var nextBtn = document.querySelector(".next");
  var prevBtn = document.querySelector(".prev");
  if (Math.floor(maxIndex) > currentIndex) {
    nextBtn.classList.add("act");
  } else {
    nextBtn.classList.remove("act");
  }

  if (currentIndex > 1) {
    prevBtn.classList.add("act");
  }
});

// Function delete and edit user
// METHOD: Delete

userList.addEventListener("click", (e) => {
  e.preventDefault();
  let trElement = e.target.closest("tr");
  let id = trElement ? trElement.dataset.id : null;
  // Delete
  if (confirm("Are you sure want to delete")) {
    fetch(`${url}/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => location.reload());
  }
});

// Function edit user
// METHOD: PATCH

userList.addEventListener("click", (e) => {
  e.preventDefault();
  let trElement = e.target.closest("tr");
  let id = trElement ? trElement.dataset.id : null;
  console.log(id);
  fetch(`${url}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
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
    .then(() => location.reload());

  submitBtn.innerHTML = "Submit";
  modalTitle.innerHTML = "Fill the Form";
  darkBg.classList.remove("active");
  popupForm.classList.remove("active");
  form.reset();

  highlightIndexBtn();
  displayIndexBtn();
  var nextBtn = document.querySelector(".next");
  var prevBtn = document.querySelector(".prev");
  if (Math.floor(maxIndex) > currentIndex) {
    nextBtn.classList.add("act");
  } else {
    nextBtn.classList.remove("act");
  }

  if (currentIndex > 1) {
    prevBtn.classList.add("act");
  }
});
