'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Eslam Omar',
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
    '2024-11-12T10:51:36.790Z',
  ],
  currency: 'EGP',
  locale: 'ar-EG', // ar-EGP
};

const account2 = {
  owner: 'Mahmoud Faisal',
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
    '2024-11-13T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

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

//TODO calc current day
const calcCurrDay = acc => {
  const now = new Date();
  // labelDate.textContent = `${String(now.getDate()).padStart(2, 0)}/${String(
  //   now.getMonth() + 1
  // ).padStart(2, 0)}/${String(now.getFullYear()).padStart(2, 0)}, ${String(
  //   now.getHours()
  // ).padStart(2, 0)}:${String(now.getMinutes()).padStart(2, 0)}`;
  const options = {
    dateStyle: 'full',
    timeStyle: 'long',
  };
  labelDate.textContent = Intl.DateTimeFormat(acc.locale, options).format(now);
};

//TODO calc local curr
const calcLocalCurr = (acc, curr) => {
  const options = {
    style: 'currency',
    currency: acc.currency,
  };
  return Intl.NumberFormat(acc.locale, options).format(curr);
};

//TODO display movements on application
const displayMovements = (acc, sort = false) => {
  containerMovements.innerHTML = '';
  let movs;
  if (!sort) {
    movs = acc.movements.slice('').sort((a, b) => a - b);
  } else {
    movs = acc.movements.slice();
  }
  movs.forEach((mov, idx) => {
    let txt;
    const index_real_movement = acc.movements.indexOf(mov);
    const date = Math.round(
      (new Date() - new Date(acc.movementsDates[index_real_movement])) /
        (1000 * 60 * 60 * 24)
    );
    if (date < 1) {
      txt = 'Today';
    } else if (date === 1) {
      txt = 'yesterday';
    } else {
      txt = `${date} days ago`;
    }
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      idx + 1
    } ${type.toUpperCase()}</div>
          <div class="movements__date">${txt}</div>
          <div class="movements__value">${calcLocalCurr(
            acc,
            mov.toFixed(2)
          )}</div>
        </div>`;
    containerMovements.insertAdjacentHTML('beforeend', html);
  });
};

//TODO print current balance
const calcCurrentBalance = function (acc) {
  const global = acc.movements.reduce((acc, mov) => {
    return acc + mov;
  }, 0);
  labelBalance.textContent = `${calcLocalCurr(acc, global)}`;
};

//TODO calculate income, outcome, interest
const calculateAccountStatus = function (account) {
  const income = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${calcLocalCurr(account, income.toFixed(2))}`;

  const outcome = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${calcLocalCurr(
    account,
    Math.abs(+outcome.toFixed(2))
  )}`;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(mov => mov * (account.interestRate / 100))
    .filter(mov => mov >= 1)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${calcLocalCurr(
    account,
    interest.toFixed(2)
  )}`;
};

//TODO update UI
const updateUI = currentAccount => {
  // Display movements
  displayMovements(currentAccount, true);

  //Display account balance
  calcCurrentBalance(currentAccount);

  //Display account status
  calculateAccountStatus(currentAccount);

  //display currrent date
  calcCurrDay(currentAccount);
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
//implement log after interval
let timer;
const logOut = function () {
  let time = 2 * 60 * 1000;
  const x = setInterval(() => {
    if (time === 0) {
      labelWelcome.textContent = 'Wellcome to Aramit Bank';
      containerApp.style.opacity = 0;
      clearInterval(x);
    }
    labelTimer.textContent = `${new Date(time).getMinutes()}:${new Date(
      time
    ).getSeconds()}`;
    time -= 1000;
  }, 1000);
  return x;
};
btnLogin.addEventListener('click', function (event) {
  event.preventDefault();

  clearInterval(timer);
  timer = logOut();

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

  clearInterval(timer);
  timer = logOut();

  const sendTo = inputTransferTo.value;
  const amount = Number(inputTransferAmount.value);
  const accountBalance = currentAccount.movements.reduce(
    (acc, mov) => acc + mov,
    0
  );
  const newBalance = accountBalance - amount;
  console.log(accountBalance);
  const sentAccount =
    accounts.find(acc => acc.userName === sendTo) || currentAccount;

  if (newBalance >= 0 && sentAccount.owner !== currentAccount.owner) {
    currentAccount.movements.push(-amount);
    sentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    sentAccount.movementsDates.push(new Date().toISOString());
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

  clearInterval(timer);
  timer = logOut();

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

  clearInterval(timer);
  timer = logOut();

  const loan = Number(inputLoanAmount.value);
  const condition = currentAccount.movements.some(function (mov) {
    return mov >= loan * 0.1;
  });
  setTimeout(() => {
    if (condition) {
      currentAccount.movements.push(Math.abs(loan));
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
      remove({ input1: inputLoanAmount });
    } else {
      console.log("You can' request loan");
    }
  }, 3000);
});

//TODO implement sorting
let sorted = false;
btnSort.addEventListener('click', event => {
  event.preventDefault();

  clearInterval(timer);
  timer = logOut();

  displayMovements(currentAccount, sorted);
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

// //exercise 1# calculate overall bank deposite
// const bankDeposites = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov > 0)
//   .reduce((acc, mov) => acc + mov, 0);

// console.log(bankDeposites);

// //exercise 2# calculate number of deposites at least 1000$
// const bankDeposites_1000$ = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov >= 1000)
//   .reduce((acc, mov) => acc + 1, 0);
// console.log(bankDeposites_1000$);

// //exercise 3# create a title case converter that if it have one word it will not capitalize it
// const titleCaseConverter = function (str) {
//   const titleCasStr = str
//     .split(' ')
//     .map(word =>
//       word.length === 1 ? word : word[0].toUpperCase().concat(word.slice(1))
//     )
//     .join(' ');

//   console.log(titleCasStr);
// };

// titleCaseConverter('my name is eslam omar i am a soft ware engineer');
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// //Challange #4

// const check = dog => {
//   if (dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1) {
//     return `${dog.owners[0]}'s dog is eating recommended portion`;
//   } else if (dog.curFood > dog.recFood * 1.1) {
//     return `${dog.owners[0]}'s dog is eating too much`;
//   } else {
//     return `${dog.owners[0]}'s dog is eating too little`;
//   }
// };

// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] },
// ];

// //first require
// dogs.forEach(dog => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));
// console.log(dogs);

// //second require
// const sarahDog = dogs.find(dog => dog.owners.includes('Sarah'));
// console.log(check(sarahDog));

// //third require
// const ownersEatTooMuch = dogs
//   .filter(dog => dog.curFood > dog.recFood)
//   .flatMap(dog => dog.owners);

// const ownersEatTooLittle = dogs
//   .filter(dog => dog.curFood < dog.recFood)
//   .flatMap(dog => dog.owners);

// console.log(ownersEatTooMuch);
// console.log(ownersEatTooLittle);

// //fourth require
// console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);
// console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`);

// //fifth require
// console.log(dogs.some(dog => dog.curFood === dog.recFood));

// //sixth require
// console.log(
//   dogs.some(
//     dog => dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1
//   )
// );

// //require num 7
// const ownersEatGood = dogs.filter(
//   dog => dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1
// );
// console.log(ownersEatGood);

// //require num 8
// const dogs2 = dogs.slice('').sort((a, b) => a.recFood - b.recFood);
// console.log(dogs2);
