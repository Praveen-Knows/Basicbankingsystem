let data;
function main() {
  readTextFile("userData.json", createTable);
}

//Reads The TextFile
function readTextFile(file, callback) {
  var rawFile = new XMLHttpRequest();
  rawFile.overrideMimeType("application/json");
  rawFile.open("GET", file, true);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4 && rawFile.status == "200") {
      callback(rawFile.responseText);
    }
  };
  rawFile.send(null);
}

//create Table
function createTable(text) {
  console.log(typeof text);
  if (typeof text == "string") {
    data = JSON.parse(text);
  } else {
    data = text;
  }
  console.log(data);
  let table = document.querySelector("table");
  let count = 1;
  for (let obj of data) {
    let tr = document.createElement("tr");
    tr.setAttribute("idx", count);
    let td1 = document.createElement("td");
    td1.innerText = obj["name"];
    let td2 = document.createElement("td");
    td2.innerText = obj["email"];
    let td3 = document.createElement("td");
    td3.innerText = obj["phoneno"];
    let td4 = document.createElement("td");
    td4.innerText = obj["balance"];
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    table.appendChild(tr);
    count++;
  }
  //table.style.display = "block";
  addevent();
}
//Adding Event in every row
function addevent() {
  let table = document.querySelectorAll("tr");
  for (row of table) {
    let idx = row.getAttribute("idx");
    if (idx > 0 && idx <= 10) {
      row.addEventListener("click", handleEvent);
    }
  }
}
function handleEvent(event) {
  let heading = document.createElement("h1");
  let nameIdx = event.currentTarget.getAttribute("idx") - 1;
  heading.innerText = `WELCOME ${data[nameIdx]["name"]}`;
  let transferBlock = document.querySelector(".transfer-money");
  transferBlock.style.height = "50vh";
  window.scrollBy(0, 300);
  transferBlock.appendChild(heading);
  let tableBlock = document.querySelector(".table-block");
  //tableBlock.style.display = "none";
  let payBtn = document.createElement("button");
  payBtn.innerText = "TRANSFER MONEY";
  payBtn.style.padding = "5px";
  payBtn.style.margin = "3px";
  let viewBtn = document.createElement("button");
  viewBtn.innerText = "VIEW ALL CUSTOMERS";
  viewBtn.style.padding = "5px";
  transferBlock.appendChild(payBtn);
  transferBlock.appendChild(viewBtn);
  transferBlock.appendChild(document.createElement("br"));

  payBtn.addEventListener("click", () => {
    createSelectBlock(transferBlock, nameIdx);
  });

  viewBtn.addEventListener("click", () => {
    transferBlock.style.display = "none";
    let table = document.querySelectorAll("tr");
    for (row of table) {
      let idx = row.getAttribute("idx");
      if (idx > 0 && idx <= 10) {
        row.remove();
      }
    }
    createTable(data);
  });
}

//Creating Select tag
function createSelectBlock(transferBlock, nameIdx) {
  let head = document.createElement("h3");
  head.innerText = "Transfer Money To:\n";
  transferBlock.appendChild(head);
  let select = document.createElement("select");
  for (let obj of data) {
    let option = document.createElement("option");
    option.innerText = obj["name"];
    select.appendChild(option);
  }
  transferBlock.appendChild(select);
  let input = document.createElement("input");
  input.placeholder = "Enter Amount";
  transferBlock.appendChild(input);
  let submit = document.createElement("button");
  submit.type = "submit";
  submit.value = "submit";
  submit.innerText = "SUBMIT";
  transferBlock.appendChild(submit);
  submit.addEventListener("click", () => {
    processInfo(transferBlock, input, select, nameIdx);
  });
}

// taking input and processing output
function processInfo(transferBlock, input, select, nameIdx) {
  let name = select.value;
  let moneyTransfer = input.value;
  let receiverBalance;
  let senderBalance = data[nameIdx]["balance"];
  if (Number(senderBalance) < Number(moneyTransfer)) {
    alert("WARNING!!!\n INSUFFICIENT BALANCE");
  } else {
    for (let obj of data) {
      if (obj["name"] == name) {
        receiverBalance = obj["balance"];
        obj["balance"] = Number(receiverBalance) + Number(moneyTransfer);
      }
    }
    data[nameIdx]["balance"] = Number(senderBalance) - Number(moneyTransfer);
    alert("TRANSACTION SUCESSFULL");
  }
}
