let deletebtns = document.querySelectorAll(".deleteBtn");
let closeBtn = document.querySelector(".btn-close");
let createBtns = document.querySelectorAll(".btn-create");
let exportBtns = document.querySelectorAll(".btn-export");
let importBtns = document.querySelectorAll(".btn-import");
let importInput = document.querySelector("input#import");
let modal = document.querySelector(".modal");
let modelName = document.getElementById("model-name").dataset.model;
let form = document.getElementById("myform");
let html = document.querySelector("html");
let searchForm = document.querySelector("form.search-input");
let page = 1;
let notyf = new Notyf({
  duration: 3000,
});

let trs = document.querySelectorAll("tbody .trss");
trs.forEach((tr) => {
  tr.addEventListener("click", (e) => {
    if (e.target == tr || e.target.classList.contains("deleteBtn")) {
      return
    }
    e.currentTarget.querySelector("a").click();
  })
})

function isFloat(n) {
  return Number(n) === n && n % 1 !== 0;
}

function switchTime(name) {
  let tds = document.querySelectorAll(`td.timeFormat-${name}`);
  if (localTime) {
    tds.forEach(std => {
      std.dataset.prev = std.textContent;
      let date = new Date(std.textContent * 1000);
      std.textContent = date.toLocaleString("fr-FR");
    })
  } else {
    tds.forEach(std => {
      if (std.dataset.prev) {
        std.textContent = std.dataset.prev;
      }
    })
  }
}

let allTimes = document.querySelectorAll(`td[class*="timeFormat-"]`);
allTimes.forEach(t => {
  t.dataset.prev = t.textContent;
  let date = new Date(t.textContent * 1000);
  t.textContent = date.toLocaleString("fr-FR");
})
var localTime = true;

let inputsTime = document.querySelectorAll("th.timeFormat");
inputsTime.forEach((inputt) => {
  inputt.addEventListener("click", (e) => {
    e.preventDefault();
    localTime = !localTime;
    let name = e.target.dataset.name;
    switchTime(name);
  })
})

let handlePostSearch = (data) => {
  if (data.rows != null) {
    page = 1;
    document.querySelector(".tbody").innerHTML = "";
    if (data.rows.length > 0) {
      data.rows.forEach((row) => {
        let tr = document.createElement("tr");
        data.cols.forEach((key) => {
          key = snakeCase(key)
          let typ = data.types[key];
          let content;
          let td = document.createElement("td");
          switch (key) {
            case pk:
              td.innerHTML = `
              <p style="overflow-wrap:break-word;max-width: 20vw;margin:0 auto;">
                    <a href="${admin_path}/get/${modelName}/${row[key]}">${row[key]}</a>
              </p>
              `;
              break;
            case "image" || "photo" || "img" || "url":
              td.innerHTML = `
                    <img src="${row[key]}" alt="image">
              `;
              break;
            default:
              switch (typeof (row[key])) {
                case "number":
                  if ((key !== pk) && typ.includes("bool")) {
                    if (row[key] == 1) {
                      i++;
                      td.innerHTML = `
                        <input id="check-${i}" name="check-${i}" type="checkbox" class="checkbox" checked disabled>
                        <label style="display: none;" for="check-${i}" >Checkbox</label> 
                      `;
                    } else if (row[key] == 0) {
                      i++;
                      td.innerHTML = `
                        <input id="check-${i}" name="check-${i}" type="checkbox" class="checkbox" disabled>
                        <label style="display: none;" for="check-${i}" >Checkbox</label> 
                      `;
                    }
                    break;
                  } else if (typ.includes("int")) {
                    td.innerHTML = `
                      <p>
                          ${row[key]}
                      </p>
                    `;
                  } else if (typ.includes("time")) {
                    td.classList.add(`timeFormat-${key}`);
                    if (localTime) {
                      td.dataset.prev = row[key];
                      let date = new Date(row[key] * 1000);
                      row[key] = date.toLocaleString("fr-FR");
                    }
                    td.innerHTML = `
                      <p>
                          ${row[key]}
                      </p>
                    `;
                  } else {
                    td.innerHTML = `
                      <p>
                          ${row[key]}
                      </p>
                    `;
                  }
                  break;
                case "boolean":
                  if (row[key]) {
                    i++;
                    td.innerHTML = `
                    <input id="check-${i}" name="check-${i}" type="checkbox" class="checkbox" checked disabled>
                    <label style="display: none;" for="check-${i}" >Checkbox</label> 
                  `;
                  } else {
                    i++;
                    td.innerHTML = `
                      <input id="check-${i}" name="check-${i}" type="checkbox" class="checkbox" disabled>
                      <label style="display: none;" for="check-${i}" >Checkbox</label> 
                    `;
                  }
                  break;
                case "string":
                  if (isNaN(row[key])) {
                    const span = document.createElement('span');
                    span.innerHTML = row[key];
                    if (row[key].length > 50) {
                      truncateNode(span, 50);
                    }
                    if (row[key].includes("/") && row[key].includes(":")) {
                      td.classList.add(`timeFormat-${key}`);
                      if (localTime) {
                        td.dataset.prev = row[key];
                        let date = new Date(row[key] * 1000);
                        row[key] = date.toLocaleString("fr-FR");
                      }
                    }
                    td.innerHTML = `
                    <p>
                        ${span.textContent}
                    </p>
                  `;
                  } else if ((row[key] == '0' || row[key] == '1')) {
                    let checked = "";
                    if (row[key] == '1') {
                      checked = "checked"
                    }
                    i++;
                    td.innerHTML = `
                      <input id="check-${i}" name="check-${i}" type="checkbox" class="checkbox" ${checked} disabled>
                      <label style="display: none;" for="check-${i}" >Checkbox</label> 
                    `;
                  } else {
                    if (!isNaN(row[key])) {
                      let date = Date.parse(row[key]);
                      if (date !== undefined) {
                        td.classList.add(`timeFormat-${key}`);
                        if (localTime) {
                          td.dataset.prev = row[key];
                          let date = new Date(row[key] * 1000);
                          row[key] = date.toLocaleString("fr-FR");
                        }
                      }
                    }
                    td.innerHTML = `
                      <p>
                          ${row[key]}
                      </p>
                    `;
                  }
                  break;
                default:
                  td.innerHTML = `
                    <p>
                        ${row[key]}
                    </p>
                  `;
                  break;
              }

          }
          tr.insertAdjacentElement("beforeend", td);
        })
        let td_delete = document.createElement("td");
        td_delete.innerHTML = `
            <button class="btn btn-danger deleteBtn" data-id="${row.id}">X</button>
          `;
        tr.insertAdjacentElement("beforeend", td_delete);
        document.querySelector(".tbody").appendChild(tr);
        let del_btn = document.querySelector(`.deleteBtn[data-id='${row.id}']`);
        del_btn.addEventListener("click", (e) => {
          e.preventDefault();
          deleteFunc(del_btn);
        });
      })
    }
  } else {
    if (data.error) {
      notyf.error(data.error);
    }
  }
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let data = searchForm.search.value;
  let orderBy = searchForm.orderby.value;
  let d = {};
  if (data !== "") {
    d.query = data;
  }
  if (orderBy !== "") {
    d.orderby = orderBy;
  }
  postData(`${admin_path}/table/${modelName}/search`, d, handlePostSearch);
})


// initialise editor if exist on page
document.querySelectorAll("textarea.editor").forEach((ed) => {
  Jodit.make(ed, {
    enableDragAndDropFileToEditor: true,
    useSearch: false,
    uploader: {
      "insertImageAsBase64URI": true
    }
  });
})

createBtns.forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    modal.classList.toggle('active');
  })
})

closeBtn.addEventListener("click", (e) => {
  e.preventDefault();
  modal.classList.toggle('active');
})




/* close modal on click outside */

document.addEventListener("click", function (e) {
  if (e.target == document.body || e.target == document.querySelector(".wrapper")) {
    if (modal.classList.contains("active")) {
      modal.classList.remove("active");
    }
  }
});

/* CREATE ROW */

let handlepostCreate = (data) => {
  if (data.success) {
    form.reset();
    modal.classList.remove('active');
    window.location.reload();
  } else if (data.error) {
    notyf.error(data.error);
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let inputs = document.querySelectorAll(".input");

  let data = new FormData();
  inputs.forEach(input => {
    if (input.type == "file") {
      if (input.files) {
        data.set(input.getAttribute("name"), input.files[0]);
      }
    } else if (input.type == "datetime-local") {
      val = Date.parse(input.value).toString().substring(0, 10);
      if (!isNaN(val)) {
        data.set(input.getAttribute("name"), val);
      }
    } else {
      let val = input.value;
      let name = input.getAttribute("name");
      if (val == "on" || val == "off") {
        if (input.checked) {
          val = 1
        } else {
          val = 0
        }
      }
      data.set(name, val)
    }
  });
  if (document.querySelectorAll("textarea.editor").length > 0) {
    document.querySelectorAll("textarea.editor").forEach(ed => {
      let name = ed.dataset.key;
      data.set(name, ed.value);
    })
  }
  data.set("table", modelName)
  postFormData(`${admin_path}/create/row`, data, handlepostCreate);
})


/* IMPORT EXPORT */
exportBtns.forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    let mytype = e.target.dataset.type;
    if (mytype == undefined) {
      mytype = e.target.closest("svg").dataset.type;
    }
    Ask(`Do you confirm export ${modelName} ?`).then(confirmed => {
      if (confirmed) {
        if (mytype === "json") {
          window.location.href = `${admin_path}/export/${modelName}`;
        } else if (mytype === "csv") {
          window.location.href = `${admin_path}/export/${modelName}/csv`;
        } else {
          console.log(mytype)
        }
      }
    })
  })
})

importBtns.forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    importInput.click();
  })
})

let callbackImport = (data) => {
  if (data) {
    if (data.success) {
      notyf.success(data.success);
    } else if (data.error) {
      notyf.error(data.error);
    }
  }
}
importInput.addEventListener("change", () => {
  let data = new FormData();
  if (importInput.files) {
    data.set("thefile", importInput.files[0]);
    data.set("table", modelName);
  }
  //post file to server
  postFormData(admin_path + "/import", data, callbackImport);
})



/* DELETE ROW */
let handlepostDelete = (data) => {
  if (data.success) {
    notyf.success(data.success);
    document.querySelector(`.deleteBtn[data-id='${data.id}']`).closest('tr').remove();
  } else if (data.error) {
    notyf.error(data.error);
  }
}

let deleteFunc = (btn) => {
  let idd = btn.dataset.id;
  Ask(`Are your sure u want to delete ?`).then(confirmed => {
    if (confirmed == true) {
      postData(admin_path + `/delete/row`, {
        "mission": "delete_row",
        "model_name": modelName,
        "id": idd,
      }, handlepostDelete);
    }
  })
}

deletebtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    deleteFunc(btn);
  })
})

/* Infinite Scroll */
let lastRow = document.querySelector(".box-inf-scroll");
let i = 10;
let handlepostScroll = (data) => {
  if (data.rows != null) {
    if (data.rows.length > 0) {
      data.rows.forEach((row) => {
        let tr = document.createElement("tr");
        data.cols.forEach(key => {
          key = snakeCase(key);
          let typ = data.types[key];
          let content;
          let td = document.createElement("td");
          switch (key) {
            case pk:
              td.innerHTML = `
              <p>
                    <a href="${admin_path}/get/${modelName}/${row[key]}">${row[key]}</a>
              </p>
              `;
              break;
            case "image" || "photo" || "img" || "url":
              td.innerHTML = `
                    <img src="${row[key]}" alt="image">
              `;
              break;
            default:
              switch (typeof (row[key])) {
                case "number":
                  if ((key !== pk) && typ.includes("bool")) {
                    if (row[key] == 1) {
                      i++;
                      td.innerHTML = `
                        <input id="check-${i}" name="check-${i}" type="checkbox" class="checkbox" checked disabled>
                        <label style="display: none;" for="check-${i}" >Checkbox</label> 
                      `;
                    } else if (row[key] == 0) {
                      i++;
                      td.innerHTML = `
                        <input id="check-${i}" name="check-${i}" type="checkbox" class="checkbox" disabled>
                        <label style="display: none;" for="check-${i}" >Checkbox</label> 
                      `;
                    }
                    break;
                  } else if (typ.includes("int")) {
                    td.innerHTML = `
                      <p>
                          ${row[key]}
                      </p>
                    `;
                  } else if (typ.includes("time")) {
                    td.classList.add(`timeFormat-${key}`);
                    if (localTime) {
                      td.dataset.prev = row[key];
                      let date = new Date(row[key] * 1000);
                      row[key] = date.toLocaleString("fr-FR");
                    }
                    td.innerHTML = `
                      <p>
                        ${row[key]}
                      </p>
                    `;
                  } else {
                    td.innerHTML = `
                      <p>
                        ${row[key]}
                      </p>
                    `;
                  }
                  break;
                case "boolean":
                  if (row[key]) {
                    i++;
                    td.innerHTML = `
                    <input id="check-${i}" name="check-${i}" type="checkbox" class="checkbox" checked disabled>
                    <label style="display: none;" for="check-${i}" >Checkbox</label> 
                  `;
                  } else {
                    i++;
                    td.innerHTML = `
                      <input id="check-${i}" name="check-${i}" type="checkbox" class="checkbox" disabled>
                      <label style="display: none;" for="check-${i}" >Checkbox</label> 
                    `;
                  }
                  break;
                case "string":
                  if (isNaN(row[key])) {
                    const span = document.createElement('span');
                    span.innerHTML = row[key];
                    if (row[key].length > 50) {
                      truncateNode(span, 50);
                    }

                    td.innerHTML = `
                    <p>
                        ${span.textContent}
                    </p>
                  `;
                  } else if ((row[key] == '0' || row[key] == '1') || key.startsWith("is_")) {  
                    let checked = "";
                    if (row[key] == '1') {
                      checked = "checked"
                    }
                    i++;
                    td.innerHTML = `
                      <input id="check-${i}" name="check-${i}" type="checkbox" class="checkbox" ${checked} disabled>
                      <label style="display: none;" for="check-${i}" >Checkbox</label> 
                    `;
                  }
                  break;
                default:
                  td.innerHTML = `
                    <p>
                        ${row[key]}
                    </p>
                  `;
                  break;
              }
          }
          Object.keys(data.fkeys).forEach(fkey => {
            if (fkey == key) {
              data.fkeys[fkey].forEach((fk,index) => {
                if (fk == row[key]) {
                  // prettify json
                  let json = JSON.stringify(data.fkeysModels[fkey][index], null, 2);
                  td.style.color = "yellow";
                  td.innerHTML = `
                    <span data-tippy-content='<pre><code>${json}</code></pre>'>${row[key]}</span>
                  `; 
                  let mm = td.querySelector("[data-tippy-content]")
                  tippy(mm, {
                    arrow: true,
                    allowHTML: true,
                    placement: 'right-start',
                    interactive: true
                  });
                  return;
                }
              })
            }
          })
          tr.insertAdjacentElement("beforeend", td);
        })

        let td_delete = document.createElement("td");
        td_delete.innerHTML = `
            <button class="btn btn-danger deleteBtn" data-id="${row.id}">X</button>
          `;
        tr.insertAdjacentElement("beforeend", td_delete);
        document.querySelector(".tbody").appendChild(tr);
        let del_btn = document.querySelector(`.deleteBtn[data-id='${row.id}']`);
        del_btn.addEventListener("click", (e) => {
          e.preventDefault();
          deleteFunc(del_btn);
        });
      })
    } else {
      observer.unobserve(lastRow);
    }
  }
}


const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) {
      return;
    }
    page++;
    let data = {
      "page_num": `${page}`,
    };
    if (searchForm.orderby.value != "") {
      data.orderby = searchForm.orderby.value;
    }
    if (searchForm.orderby.query != "") {
      data.query = searchForm.search.value;
    }
    let head = {
      "Content-type": "application/json; charset=UTF-8"
    }

    fetch(`${admin_path}/table/${modelName}/search`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: head
    })
      .then(res => res.json())
      .then(data => {
        handlepostScroll(data);
      })
      .catch(() => {
        observer.unobserve(lastRow);
      })
  }, { threshold: 1 })
});

observer.observe(lastRow);



/* Helpers */
const snakeCase = (str) => str.split(/(?=[A-Z])/).join('_').toLowerCase();


function truncateNode(node, limit) {
  if (node.nodeType === Node.TEXT_NODE) {
    node.textContent = node.textContent.substring(0, limit);
    return limit - node.textContent.length;
  }

  node.childNodes.forEach((child) => {
    limit = truncateNode(child, limit);
  });

  return limit;
}