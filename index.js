const transactionFormEl = document.getElementById("transactionForm");



const state = {
    earning: 0,
    expense: 0,
    net: 0,
    transaction: []
}

let isUpdate = false;
let tid;

const renderTransaction = () => {
    const transactionContainerEl = document.querySelector(".transactions")
    const netAmountEl = document.getElementById("netAmount")
    const earningEl = document.getElementById("earning")
    const expenseEl = document.getElementById("expense")
    const transaction = state.transaction
    let earning = 0;
    let expense = 0;
    let net = 0;

    transactionContainerEl.innerHTML = "";

    transaction.forEach((transaction) => {
        const { id, amount, text, type } = transaction;
        const isCredit = type == 'credit' ? true : false
        const sign = isCredit ? '+' : '-';
        const transactionEl = `

        <div class="transaction" id="${id}">
        <div class="content" onclick="showEdit(${id})">
        <div class="left">
          <p>${text}</p>
          <p>${sign} ₹ ${amount} </p>
        </div>
        <div class="status ${isCredit ? "credit" : "debit"}">${isCredit ? "C" : "D"}</div>
        </div>
        <div class="lower">
          <div class="icon" onclick="handleUpdate(${id})">
              <img src="./icons/pen.svg" alt="pen">
          </div>
          <div class="icon" onclick="handleDelete(${id})">
              <img src="./icons/bin.svg" alt="bin">
          </div>
        </div>
        </div>
        </div>
        `

        earning += isCredit ? amount : 0;
        expense += !isCredit ? amount : 0;
        net = earning - expense;

        transactionContainerEl.insertAdjacentHTML("afterbegin", transactionEl)
    });

    netAmountEl.innerHTML = `₹ ${net}`
    earningEl.innerHTML = `₹ ${earning}`
    expenseEl.innerHTML = `₹ ${expense}`

}

const addTransaction = (e) => {
    e.preventDefault()
    console.log(e.submitter.id);

    const isEarn = e.submitter.id == 'earnBtn' ? true : false;

    const formData = new FormData(transactionFormEl);
    const tData = {};

    formData.forEach((value, key) => {
        tData[key] = value;
    });

    const { text, amount } = tData;

    const transaction = {

        id: isUpdate ? tid : Math.floor(Math.random() * 1000),
        text: text,
        amount: +amount,
        type: isEarn ? "credit" : "debit",

    };

    if (isUpdate) {
        const tIndex = state.transaction.findIndex((t) => t.id == tid)
        state.transaction[tIndex] = transaction;
        isUpdate = false;
        tid = null
    }
    else {
        state.transaction.push(transaction)
    }



    console.log({ state });
    renderTransaction()
};

const showEdit = (id) => {
    const selectedTransaction = document.getElementById(id)
    const lowerEl = selectedTransaction.querySelector(".lower")

    lowerEl.classList.toggle("showTransaction")
}


const handleUpdate = (id) => {
    const transaction = state.transaction.find((t) => t.id == id)
    const { text, amount } = transaction
    const textInput = document.getElementById("text")
    const amountInput = document.getElementById("amount")
    textInput.value = text;
    amountInput.value = amount
    tid = id;
    isUpdate = true;
}

const handleDelete = (id) => {

    const filteredTransaction = state.transaction.filter((t) => t.id !== id);
    state.transaction = filteredTransaction;
    renderTransaction()

}

transactionFormEl.addEventListener("submit", addTransaction);