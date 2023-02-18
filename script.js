'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
/////////////////////////////////////////////////////////////////
// display date formated
function movementsDateFormated(date, locale) {
  function days(date, date2) {
    return Math.round(Math.abs((date - date2) / (1000 * 60 * 60 * 24)));
  }
  const daysPassed = days(date, new Date());
  console.log(daysPassed);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} Days Ago`;

  return Intl.DateTimeFormat(locale).format(date);
}
/////////////////////////////////////////////////////////////////
// formate number
const formatted = (value, locale, currency) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};
/////////////////////////////////////////////////////////////////
let currentAccount;
/////////////////////////////////////////////////
// display movements

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const mov = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  mov.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    // const displayDate = movementsDateFormated(new Date(acc.movementsDates[i]));
    const displayDate = movementsDateFormated(
      new Date(acc.movementsDates[i]),
      acc.locale
    );
    labelDate.textContent = displayDate;
    const formattedMov = formatted(mov, acc.locale, acc.currency);
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}"> ${
      i + 1
    }  ${type}</div>
    <div class="movements__date">${displayDate}</div>
      <div class="movements__value"> ${formattedMov}</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

/////////////////////////////////////////////////
// compute username

// which is initials of the username of accounts
const createUserName = function (accounts) {
  accounts.forEach(account => {
    account.userName = account.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUserName(accounts);
/////////////////////////////////////////////////

// display balance
const displayBalance = function (acc) {
  acc.balance = acc.movements.reduce((sum, current) => sum + current, 0);
  labelBalance.textContent = formatted(acc.balance, acc.locale, acc.currency);
};
/////////////////////////////////////////////////

// display summary
const displaySummary = acc => {
  const income = acc.movements
    .filter(cash => cash > 0)
    .reduce((sum, current) => sum + current, 0);
  labelSumIn.textContent = formatted(income, acc.locale, acc.currency);

  const outcome = acc.movements
    .filter(cash => cash < 0)
    .reduce((sum, current) => sum + Math.abs(current), 0);
  labelSumOut.textContent = formatted(outcome, acc.locale, acc.currency);

  const interest = acc.movements
    .filter(cash => cash > 0)
    .map(cash => (cash * acc.interestRate) / 100)
    .reduce((sum, int) => sum + int, 0);
  labelSumInterest.textContent = formatted(interest, acc.locale, acc.currency);
};

/////////////////////////////////////////////////
const updateUI = () => {
  // display balance
  displayBalance(currentAccount);
  // display movements
  displayMovements(currentAccount);
  // display summary
  displaySummary(currentAccount);
};
/////////////////////////////////////////////////
// login logic

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
  }
  // display message
  labelWelcome.textContent = `Welcome ${currentAccount.owner.split(' ')[0]}`;
  // display UI
  containerApp.style.opacity = '100%';
  // update UI
  updateUI();
  // clear input fields
  inputLoginUsername.value = inputLoginPin.value = '';
  // display dates
  const date = new Date();
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  };
  const local = currentAccount.locale;
  labelDate.textContent = new Intl.DateTimeFormat(local, options).format(date);
});

/////////////////////////////////////////////////
// transfer logic

btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  // match the input account with the accounts
  const receiverAccount = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  const TransferAmount = Number(inputTransferAmount.value);
  if (
    receiverAccount !== currentAccount &&
    TransferAmount <= currentAccount.balance &&
    TransferAmount > 0
  ) {
    // transfer the amount to the input account
    receiverAccount.movements.push(TransferAmount);
    // deposit amount from current account
    currentAccount.movements.push(-TransferAmount);
    // create date
    receiverAccount.movementsDates.push(new Date().toISOString());
    currentAccount.movementsDates.push(new Date().toISOString());
    // update UI
    updateUI();
    //clear input fields
    inputTransferTo.value = inputTransferAmount.value = '';
  }
});
/////////////////////////////////////////////////
// close account
btnClose.addEventListener('click', e => {
  e.preventDefault();
  const confirmName = inputCloseUsername.value;
  const confirmPassword = Number(inputClosePin.value);
  if (
    currentAccount.userName === confirmName &&
    currentAccount.pin === confirmPassword
  ) {
    // find index of the currentAccount
    const closeAccountIndex = accounts.findIndex(
      acc => acc.userName === confirmName
    );
    accounts.splice(closeAccountIndex, 1);
    containerApp.style.opacity = 0;

    inputCloseUsername.value = inputClosePin.value = '';
  }
});
/////////////////////////////////////////////////
// Request loan logic
btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const RequestedLoan = Number(inputLoanAmount.value);

  const tenOfLoan = currentAccount.movements.some(
    mov => mov >= RequestedLoan * (10 / 100)
  );
  if (tenOfLoan && RequestedLoan > 0) {
    setTimeout(() => {
      currentAccount.movements.push(RequestedLoan);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI();
    }, 2500);
  }
});
/////////////////////////////////////////////////
// count overall balance
const overallBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((sum, current) => sum + current);
/////////////////////////////////////////////////
// sort logic
let sorted = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
// Nodelist logic
// const movementsUI = Array.from(document.querySelectorAll('.movements__value'));
// console.log(movementsUI);
const movementsUI2 = [...document.querySelectorAll('.movememnts__value')];
/////////////////////////////////////////////////
// Array method practice

// get total deposits across accounts

const totalDeposit = accounts
  .map(acc => acc.movements)
  .flat()
  .filter(mov => mov > 0)
  .reduce((total, current) => total + current);

/////////////////////////////////////////////////

// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// fake accoung login

currentAccount = account2;
updateUI(currentAccount);
containerApp.style.opacity = '100%';

// set timer
