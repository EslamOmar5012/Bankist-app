'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Eslam Omar',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Ahmed Rashad',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Ahmed Samir',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Abdelrahman Fawal',
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

//TODO compute userNames
const createUserNames = accs => {
  accs.forEach(acc => {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(ele => ele[0])
      .join('');
  });
};
createUserNames(accounts);

//TODO display movements on application
const displayMovements = (movement, sort = false) => {
  containerMovements.innerHTML = '';
  let movs;
  if (!sort) {
    movs = movement.slice('').sort((a, b) => a - b);
  } else {
    movs = movement.slice();
  }
  console.log(movement);
  movs.forEach((mov, idx) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      idx + 1
    } ${type.toUpperCase()}</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${mov}€</div>
        </div>`;
    containerMovements.insertAdjacentHTML('beforeend', html);
  });
};

//TODO print current balance
const calcCurrentBalance = function (movements) {
  const global = movements.reduce((acc, mov) => {
    return acc + mov;
  }, 0);
  labelBalance.textContent = `${global}€`;
};

//TODO calculate income, outcome, interest
const calculateAccountStatus = function (account) {
  const income = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income}€`;

  const outcome = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcome)}€`;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(mov => mov * (account.interestRate / 100))
    .filter(mov => mov >= 1)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${Math.round(interest)}€`;
};

//TODO update UI
const updateUI = currentAccount => {
  // Display movements
  displayMovements(currentAccount.movements, true);

  //Display account balance
  calcCurrentBalance(currentAccount['movements']);

  //Display account status
  calculateAccountStatus(currentAccount);
};

//TODO remove values from inputs
const remove = function ({ input1 = undefined, input2 = undefined }) {
  if (input1 !== undefined) input1.value = '';
  if (input2 !== undefined) {
    input2.value = '';
    input2.blur();
  }
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let currentAccount;

//TODO implementing login
btnLogin.addEventListener('click', function (event) {
  event.preventDefault();
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and message
    containerApp.style.opacity = '1';
    labelWelcome.textContent = `Wellcome Back, ${currentAccount.owner}`;

    //update UI
    updateUI(currentAccount);

    //clear inputs
    remove({ input1: inputLoginUsername, input2: inputLoginPin });
  } else console.log("You can't login");
});

//TODO implementing transfare
btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();

  const sendTo = inputTransferTo.value;
  const amount = Number(inputTransferAmount.value);
  const accountBalance = Number(labelBalance.textContent.split('€')[0]);
  const newBalance = accountBalance - amount;

  const sentAccount =
    accounts.find(acc => acc.userName === sendTo) || currentAccount;

  if (newBalance >= 0 && sentAccount.owner !== currentAccount.owner) {
    currentAccount.movements.push(-amount);
    sentAccount.movements.push(amount);
    console.log(sentAccount.movements);
  } else {
    console.log('We cant transfare money');
  }
  //update UI
  updateUI(currentAccount);

  //clear inputs
  remove({ input1: inputTransferAmount, input2: inputTransferTo });
});

//TODO implement delete account
btnClose.addEventListener('click', function (event) {
  event.preventDefault();

  const deletedAccUserName = inputCloseUsername.value;
  const deletedAccPin = Number(inputClosePin.value);

  if (
    currentAccount.userName === deletedAccUserName &&
    currentAccount.pin === deletedAccPin
  ) {
    const accIndex = accounts.findIndex(function (acc) {
      return acc.userName === deletedAccUserName;
    });

    accounts.splice(accIndex, 1);

    //hide UI
    remove({ input1: inputCloseUsername, input2: inputClosePin });
    containerApp.style.opacity = 0;

    labelWelcome.textContent = 'Wellcome to Aramit Bank';
  } else {
    console.log('We cannot delete this Account');
  }
});

//TODO implement loan
btnLoan.addEventListener('click', function (event) {
  event.preventDefault();
  const loan = Number(inputLoanAmount.value);
  const condition = currentAccount.movements.some(function (mov) {
    return mov >= loan * 0.1;
  });
  if (condition) {
    currentAccount.movements.push(Math.abs(loan));
    updateUI(currentAccount);
    remove({ input1: inputLoanAmount });
  } else {
    console.log("You can' request loan");
  }
});

//TODO implement sorting
let sorted = false;
btnSort.addEventListener('click', event => {
  event.preventDefault();
  displayMovements(currentAccount.movements, sorted);
  sorted = !sorted;
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// //Challange 1#

// const julia1 = [3, 5, 2, 12, 7],
//   kate1 = [4, 1, 15, 8, 3],
//   julia2 = [9, 16, 6, 8, 3],
//   kate2 = [10, 5, 6, 1, 4];

// const checkDogs = (dogsJulia, dogsKate) => {
//   const dogsJuliaCopy = [...dogsJulia];
//   const dogsJuliaTrueValues = dogsJuliaCopy.splice(1, 2);
//   const allData = dogsJuliaTrueValues.concat(dogsKate);

//   console.log(allData);

//   allData.forEach(function (dog, i) {
//     if (dog >= 3) {
//       console.log(`Dog number ${i + 1} is an adult, and is ${dog} years old`);
//     } else {
//       console.log(`Dog number ${i + 1} is still a puppy 🐶`);
//     }
//   });
// };

// checkDogs(julia1, kate1);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// //example of map() method
// const USDtoEGP = 49.3;

// const convertToEGP = movements.map(mov => Math.round(mov * USDtoEGP));
// console.log(movements);
// console.log(convertToEGP);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// // example of filter() method
// const deposit = movements.filter(function (mov) {
//   return mov > 0;
// });
// console.log(movements);
// console.log(deposit);

// const withdrawals = movements.filter(mov => mov < 0);
// console.log(withdrawals);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// //example of reduce() method

// const global = movements.reduce(function (acc, mov, i, arr) {
//   console.log(`iteration ${i + 1} : ${acc}`);
//   return acc + mov;
// }, 0);

// console.log(global);

// //second example of reduce() method
// const maxValue = movements.reduce(function (acc, mov) {
//   if (mov > acc) acc = mov;
//   console.log(acc);
//   return acc;
// }, movements.at(0));

// console.log(maxValue);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// //Challange 2#
// const dogs_data1 = [5, 2, 4, 1, 15, 8, 3],
//   dogs_data2 = [16, 6, 10, 5, 6, 1, 4];

// const calcAverageHumanAge = ages => {
//   let human_ages = ages.map(age => {
//     if (age <= 2) return (age *= 2);
//     else return (age = 16 + age * 4);
//   });

//   human_ages = human_ages.filter(age => age >= 18);

//   const total_ages = human_ages.reduce((acc, age) => acc + age, 0);
//   return total_ages / human_ages.length;
// };

// console.log(calcAverageHumanAge(dogs_data1));
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// //example of chaining
// const totalDepositeUSD = movements
//   .filter((mov, i, arr) => {
//     return mov > 0;
//   })
//   .map((mov, i, arr) => {
//     return mov * 1.07;
//   })
//   .reduce((acc, mov, i, arr) => {
//     return acc + mov;
//   }, 0);
// console.log(totalDepositeUSD);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// //Challange 3#
// const dogs_data1 = [5, 2, 4, 1, 15, 8, 3],
//   dogs_data2 = [16, 6, 10, 5, 6, 1, 4];

// const calcAverageHumanAge = ages => {
//   const avg_adult_dogs = ages
//     .map(age => {
//       if (age <= 2) return 2 * age;
//       else return 16 + age * 4;
//     })
//     .filter(age => age >= 18)
//     .reduce((acc, age, _, arr) => acc + age / arr.length, 0);

//   console.log(avg_adult_dogs);
// };

// calcAverageHumanAge(dogs_data1);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// //example on find() method
// //The find() method of Array instances returns the first element in the provided array that satisfies the provided testing function. If no values satisfy the testing function, undefined is returned.

// const firstWithdraw = movements.find(mov => mov < 0);
// console.log(firstWithdraw);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// //example on findIndex() method
// // The findIndex() method of Array instances returns the index of the first element in an array that satisfies the provided testing function. If no elements satisfy the testing function, -1 is returned.

// const found = movements.findIndex(mov => mov < 0);
// console.log(found);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// //example on some() method
// //The some() method of Array instances tests whether at least one element in the array passes the test implemented by the provided function. It returns true if, in the array, it finds an element for which the provided function returns true; otherwise it returns false. It doesn't modify the array.

// const s = movements.some(mov => mov > 0); //it will return true
// console.log(s);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// //example on every method
// //The every() method of Array instances tests whether all elements in the array pass the test implemented by the provided function. It returns a Boolean value.

// const e = movements.every(mov => mov < 0); //it will return false
// console.log(e);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// //example of flat() function
// // The flat() method of Array instances creates a new array with all sub-array elements concatenated into it recursively up to the specified depth.

// const arr = [
//   [1, 2, [3, 'x', 'n']],
//   [4, 5, 6, ['f', 'r', 'm']],
//   [7, 8, 9],
// ];

// const arrFlat = arr.flat();

// //example of flatMap() method
// //The flatMap() method of Array instances returns a new array formed by applying a given callback function to each element of the array, and then flattening the result by one level. It is identical to a map() followed by a flat() of depth 1 (arr.map(...args).flat()), but slightly more efficient than calling those two methods separately.

// const allBalance = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, mov) => acc + mov, 0);

// console.log(allBalance);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// //example of sort() method
// //The sort() method of Array instances sorts the elements of an array in place and returns the reference to the same array, now sorted. The default sort order is ascending, built upon converting the elements into strings, then comparing their sequences of UTF-16 code units values.

// //assending
// movements.sort((a, b) => a - b);
// console.log(movements);

// //dessending
// movements.sort((a, b) => b - a);
// console.log(movements);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// //example of from() method to fill the array
// const rendomDice = Array.from({ length: 100 }, (_, i) =>
//   Math.ceil(Math.random() * 6)
// );
// console.log(rendomDice);

//example of from() method

// document.querySelector('.balance__value').addEventListener('click', () => {
//   const elementsUI = Array.from(document.querySelectorAll('.movements__value'));
//   console.log(elementsUI);
//   const movs = elementsUI.map(ele => Number(ele.textContent.split('€')[0]));
//   console.log(movs);
// });

//exercise
