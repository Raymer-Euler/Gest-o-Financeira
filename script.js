const transactionList = document.getElementById('transaction-list');
const financialResultsTableBody = document.getElementById('financial-results-body');
const balanceElement = document.getElementById('balance');
let balance = 0;
let transactions = [];

window.addEventListener('load', function() {
  if (localStorage.getItem('financeData')) {
    const savedData = JSON.parse(localStorage.getItem('financeData'));
    balance = savedData.balance || 0;
    transactions = savedData.transactions || [];
    updateBalance();
    updateTransactionList();
    updateFinancialResultsTable();
  }
});

function addTransaction() {
  const description = document.getElementById('description').value;
  const amount = parseFloat(document.getElementById('amount').value.replace('.', ',')); // Substitui ponto por vírgula
  const month = document.getElementById('month').value;

  if (description.trim() === '' || isNaN(amount)) {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  const currentDate = new Date();
  const transactionDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

  transactions.push({ date: transactionDate, description: description, amount: amount });

  balance -= amount;

  updateBalance();
  updateTransactionList();
  updateFinancialResultsTable();

  document.getElementById('description').value = '';
  document.getElementById('amount').value = '';

  saveDataLocally();
}

function addSalary() {
  const salary = parseFloat(document.getElementById('salary').value.replace('.', ',')); // Substitui ponto por vírgula
  if (!isNaN(salary)) {
    balance += salary;
    updateBalance();
    saveDataLocally();
    document.getElementById('salary').value = '';
  }
}

function deleteTransaction(index) {
  balance += transactions[index].amount;
  transactions.splice(index, 1);

  updateBalance();
  updateTransactionList();
  updateFinancialResultsTable();

  saveDataLocally();
}

function updateBalance() {
  balanceElement.textContent = balance.toLocaleString('pt-BR', {minimumFractionDigits: 2}); // Formata o saldo com vírgulas e duas casas decimais
  if (balance >= 0) {
    balanceElement.classList.remove('negative-balance');
    balanceElement.classList.add('positive-balance');
  } else {
    balanceElement.classList.remove('positive-balance');
    balanceElement.classList.add('negative-balance');
  }
}

function updateTransactionList() {
  transactionList.innerHTML = '';

  transactions.forEach((transaction, index) => {
    const transactionElement = document.createElement('div');
    transactionElement.classList.add('transaction');
    transactionElement.innerHTML = `
      <p><strong>Descrição:</strong> ${transaction.description}</p>
      <p><strong>Valor:</strong> ${transaction.amount.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p> <!-- Formata o valor com vírgulas e duas casas decimais -->
      <p><strong>Data:</strong> ${transaction.date}</p>
      <button class="delete-btn" onclick="deleteTransaction(${index})">Apagar</button>
    `;
    transactionList.appendChild(transactionElement);
  });

  if (transactions.length === 0) {
    transactionList.innerHTML = '<p>Nenhuma transação encontrada.</p>';
  }
}

function updateFinancialResultsTable() {
  financialResultsTableBody.innerHTML = '';

  transactions.forEach(transaction => {
    const row = financialResultsTableBody.insertRow();
    row.innerHTML = `
      <td>${transaction.date}</td>
      <td>${transaction.description}</td>
      <td>${transaction.amount.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td> <!-- Formata o valor com vírgulas e duas casas decimais -->
    `;
  });

  if (transactions.length === 0) {
    financialResultsTableBody.innerHTML = '<tr><td colspan="3">Nenhuma transação encontrada.</td></tr>';
  }
}

function saveDataLocally() {
  const financeData = {
    balance: balance,
    transactions: transactions
  };
  localStorage.setItem('financeData', JSON.stringify(financeData));
}

function confirmClearBalance() {
  const confirmClear = confirm('Tem certeza que deseja zerar o saldo atual?');
  if (confirmClear) {
    balance = 0;
    updateBalance();
    saveDataLocally();
  }
}
