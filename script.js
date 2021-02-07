const Modal = {
  open() {
    document.querySelector('.modal-overlay')
      .classList.add('active')
  },

  close() {
    document.querySelector('.modal-overlay')
      .classList.remove('active')
    //  document.getElementsByClassName('input-group') = ""
    document.getElementById("description").style.border = "none"
    document.getElementById("amount").style.border = "none"
  }
  // Criar uma função toogle() para substituir as informações acima

}

  // If user clicks anywhere outside of the modal, Modal will close

  var modal = document.getElementById('modal-wrapper');
  window.onclick = function (event) {
      if (event.target == modal) {
          modal.style.display = "none";
      }
  }

/*Criar uma cor na borda do first input*/
const Color = {
  NewColor() {
    // document.getElementById("description").style.border = "0.01rem solid #3dd705"
    document.getElementById("amount").style.border = "0.01rem solid #3dd705"

  },
  NewPrintColor() {
    // document.getElementById("description").style.border = "0.01rem solid #e92929"
    document
    .getElementById("amount").style.border = "0.01rem solid #e92929"
    
  }
}

function myFunction(event) {
  document.getElementById("amount").innerHTML = "-" + event;
}


const Storage = {
  get() {
    return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
  },

  set(transactions) {
    localStorage.setItem("dev.finances:transactions",
    JSON.stringify(transactions))
  }
}

const Transaction = {
  all: Storage.get(),

  add(transaction) {
    Transaction.all.push(transaction)

    App.reload()
    console.log(Transaction.all)
  },

  remove(index) {
    Transaction.all.splice(index, 1)

    App.reload()
  },

  incomes() {
    let income = 0
    Transaction.all.forEach(transaction => {
      if (transaction.amount > 0) {
        income += transaction.amount;
      }

    })
    return income;
    // console.log(income)
  },

  expenses() {
    let expense = 0
    Transaction.all.forEach(transaction => {
      if (transaction.amount < 0) {
        expense += transaction.amount;
      }

    })
    return expense;
  },

  total() {
    return Transaction.incomes() + Transaction.expenses()
  }

}

const DOM = {
  transactionsContainer: document.querySelector('#data-table tbody'),

  addTransaction(transaction, index) {
    // console.log(transaction)

    const tr = document.createElement('tr')
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
    tr.dataset.index = index

    DOM.transactionsContainer.appendChild(tr)

    // console.log(tr.innerHTML)
  },

  innerHTMLTransaction(transaction, index) {
    const CSSclass = transaction.amount > 0 ? "income" : "expense"

    const amount = Utils.formatCurrency(transaction.amount)

    const html = `

  <td class="description">${transaction.description}</td>
  <td class="${CSSclass}">${amount}</td>
  <td class="date">${transaction.date}</td>
  <td><img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação"></td>
  `
    return html
  },

  updateBalance() {
    document
      .getElementById('incomeDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.incomes())
    document
      .getElementById('expenseDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.expenses())
    document
      .getElementById('totalDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.total())
  },

  clearTransactions() {
    DOM.transactionsContainer.innerHTML = ""
  }

}

const Utils = {
  formatAmount(value) {
    // value = Number(value.replace(/\,?\.?/g, "")) * 100

    value = value *100
    return Math.round(value)
    // console.log(value)
  },

  formatDate(date) {
    const splittedDate = date.split("-")
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`

    // console.log(splittedDate)
  },

  formatCurrency(value) {
    const signal = Number(value) < 0 ? "-" : ""

    value = String(value).replace(/\D/g, "")

    value = Number(value) / 100

    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    })

    return signal + value

    // console.log(signal + value)

  }
}

const Form = {
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),

  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value,
    }
  },

  validateFields() {
    const { description, amount, date } = Form.getValues()

    if (description.trim() === "" ||
      amount.trim() === "" ||
      date.trim() === "") {
      throw new Error("Please fill in all the fields!")
    }

    // console.log(description)
    // console.log(amount)
    // console.log(date)
  },

  formatValues() {
    let { description, amount, date } = Form.getValues()

    amount = Utils.formatAmount(amount)

    date = Utils.formatDate(date)

    console.log(date)

    return {
      description,
      amount,
      date,
    }

  },

  clearFields() {
    Form.description.value = ""
    Form.amount.value = ""
    Form.date.value = ""
  },

  submit(event) {
    event.preventDefault()

    try {
      Form.validateFields()
      const transaction = Form.formatValues()
      Transaction.add(transaction)
      Form.clearFields()
      Modal.close()

    } catch (error) {
      alert(error.message)
    }


    // console.log(event)
  }
}

const App = {
  init() {
    Transaction.all.forEach(DOM.addTransaction)
   
    DOM.updateBalance()

    Storage.set(Transaction.all)

  },

  reload() {
    DOM.clearTransactions()
    App.init()
  },
}

App.init()

// Transaction.remove(0)