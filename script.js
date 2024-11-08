'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// let arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

// //The slice() method of Array instances returns a shallow copy of a portion of an array into a new array object selected from start to end (end not included) where start and end represent the index of items in that array. The original array will not be modified

// console.log(arr.slice(2)); // the start in element so it will begin with 'c' element

// console.log(arr.slice(2, 5)); //the start qwith element 2 so it will start with 'c' and end with 'e' (endIndex - 1)

// //The splice() method of Array instances changes the contents of an array by removing or replacing existing elements and/or adding new elements

// arr.splice(4); // it will remain the elements untill the element 3 ==> (index - 1) ('d')
// //the result will be {'a', 'b', 'c', 'd'}
// console.log(arr);

// arr.splice(2, 1);
// //the result will be {'a', 'b', 'd'}
// console.log(arr);

// //the reverse() method make array reversed
// const arr2 = [2, 10, 5, 12];
// arr2.reverse();
// console.log(arr2); // it will be [12, 5, 10, 2]

// //the concant() method join 2 arrays
// const arr3 = arr.concat(arr2);
// console.log(arr3);

// //the join() method will make the array into string

// console.log(arr.join('$'));

// // the at() method will get you the index of element (it is like python with indexing)
// console.log(arr.at(0));
// console.log(arr.at(-1));

// //the for of loop
// for (let [idx, movement] of movements.entries()) {
//   let str = movement > 0 ? 'deposited' : 'withdrew';
//   console.log(
//     `(Movement num ${idx + 1}) The user ${str} : ${Math.abs(movement)}`
//   );
// }

// // the forEach method
// movements.forEach(function (movement, index, arr) {
//   let str = movement > 0 ? 'deposited' : 'withdrew';
//   console.log(
//     `(Movement num ${index + 1}) The user ${str} : ${Math.abs(movement)}`
//   );
//   console.log(arr);
// });
