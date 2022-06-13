// Запросы, XMLHttpRequest, AJAX.  Домашняя работа

// Создать контактную книжку на основе Todo List.
// Функционал должен включать в себя:

// 1. Создание контакта (Имя, Фамилия, номер телефона)
// 2. Удаление контакта
// 3. Список контактов на главном экране
// 4. Использовать json-server.
// 5. Редактирование контакта
// 6. Пагинация(дополнительно)
// 7. Поиск(дополнительно)

let API = "http://localhost:8001/todo";

let btn = document.querySelector(".btn");
let todoList = document.querySelector(".todo-list");
let send = document.querySelector(".send");
let save = document.querySelector(".save");
let inpFirst = document.querySelector(".inp-first");
let inpLast = document.querySelector (".inp-last")
let inpPhone = document.querySelector(".inp-phone");
let inpWkpi = document.querySelector(".inp-wkpi");
let inpMkpi = document.querySelector(".inp-mkpi")
let mainOl = document.querySelector(".main-ol");
let mainScreen = document.querySelector(".main-screen");
let btnX = document.querySelector(".btn-x");
let disabl = document.querySelector(".disabl");
let pagination = document.querySelector(".pagination");
// let inpSearch = document.querySelector(".inp-search");
btnX.addEventListener("click", function () {
  todoList.style.display = "none";
  mainScreen.style.display = "block";
});

send.addEventListener("click", async function () {
  let obj = {
    // name: inpName.value,
    inpFirst: inpFirst.value,
    inpLast: inpLast.value,
    inpPhone: inpPhone.value,
    inpWkpi:inpWkpi.value,
    inpMkpi: inpMkpi.value
  };

  if (   
    obj.inpFirst.trim() === "" ||
    obj.inpLast.trim() === "" ||
    obj.inpPhone.trim() === "" ||    
    obj.inpWkpi.trim() === "" ||
    obj.inpMkpi.trim() === ""
  ) {
    alert("введите значения");
    return;
  }

  await fetch(API, {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
  });

  todoList.style.display = "none";
  mainScreen.style.display = "block";
  
  inpFirst.value = "";
  inpLast.value = "";
  inpPhone.value = "";  
  inpWkpi.value = "";
  inpMkpi.value = "";


  location.reload();
  getTodoList();
});

btn.addEventListener("click", function () {
  todoList.style.display = "flex";
  mainScreen.style.display = "none";
});

async function getTodoList() {
  // await fetch(`${API}?q=${inpSearch.value}&_page=${page}&_limit=2`);
  let allTodos = await fetch(API)
    .then(res => res.json())
    .catch(error => console.log(error));
  // console.log(allTodos);
  // let lastPage = Math.ceil(allTodos.length / 2);
  allTodos.forEach(element => {
    let div = document.createElement("div");
    div.id = element.id;
    div.style.border = "1px solid black";
    div.style.maxWidth = "300px";
    div.style.padding = "10px";
    div.style.marginBottom = "10px";
    div.style.textTransform = "Uppercase";
    div.style.backgroundColor = "grey";
    div.style.color = "white" ;
    div.innerHTML = `
    <li><strong>First Name:  </strong>   ${element.inpFirst}</li>
    <li><strong>Last Name: </strong>  ${element.inpLast}</li>
    <li><strong>Phone number:  </strong>   ${element.inpPhone}</li>   
    <li><strong>Week KPI: </strong> ${element.inpWkpi}</li>
    <li><strong>Month KPI: </strong> ${element.inpMkpi}</li>
    <button style="margin-top: 10px" class="btn-delete">delete</button>
    <button class="btn-edit">edit</button>
    `;
    mainOl.append(div);
  });
  
}
getTodoList();

save.addEventListener("click", async function () {
  let editedTodo = {
    inpFirst: inpFirst.value,
    inpLast: inpLast.value,
    inpPhone: inpPhone.value,    
    inpWkpi: inpWkpi.value,
    inpMkpi: inpMkpi.value,
  };
  let id = disabl.value;
  // запрос для измениние данных
  await fetch(`${API}/${id}`, {
    method: "PATCH", // указываем метод
    body: JSON.stringify(editedTodo), // указываем что именно нужно запостить
    headers: {
      "Content-type": "application/json; charset=utf-8",
    }, 
  });
  
  todoList.style.display = "none";
  mainScreen.style.display = "block";
 
  location.reload();
});

document.addEventListener("click", async function (e) {
  if (e.target.className === "btn-delete") {
    
    let id = e.target.parentNode.id;
    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });
    location.reload();
  }

  if (e.target.className === "btn-edit") {
    console.log(e.target);
    todoList.style.display = "flex";
    mainScreen.style.display = "none";
    send.style.display = "none";
    save.style.display = "block";
    save.style.width = "258px";
    save.style.height = "35px";
    save.style.marginTop = "25px";
    save.style.marginBottom = "25px";
    save.style.borderRadius = "3px";
    let id = e.target.parentNode.id;
    console.log(id);
    // запрос для получение данных чтоб мы могли отобразить все в модалке для редактирование

    let response = await fetch(`${API}/${id}`)
      .then(res => res.json())
      .catch(err => console.log(error));
    console.log(response);
    //! полученные данные отображаем в инпутах из html
    inpFirst.value = response.inpFirst;
    inpLast.value = response.inpLast;
    inpPhone.value = response.inpPhone;    
    inpWkpi.value = response.inpWkpi;
    inpMkpi.value = response.inpMkpi;
    disabl.value = response.id;
  }
 
});
