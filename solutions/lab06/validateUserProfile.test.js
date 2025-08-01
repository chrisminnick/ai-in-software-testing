import { validateUserProfile } from './validateUserProfile.js';

const validUsers = [
  { name: 'Alice Johnson', email: 'alice@example.com', age: 30 },
  { name: 'Bob Lee', email: 'bob.lee@mail.com', age: 45 },
  { name: 'Carmen Díaz', email: 'c.diaz@domain.co', age: 27 },
  { name: "David O'Connor", email: 'd.oconnor@gmail.com', age: 60 },
  { name: 'Eun-Ji Kim', email: 'eunji.kim@korea.kr', age: 38 },
  { name: 'Fatima Al-Sayed', email: 'fatima@me.net', age: 22 },
  { name: 'George Smith', email: 'george.smith123@yahoo.com', age: 51 },
  { name: 'Haruto Tanaka', email: 'haruto@tokyo.jp', age: 19 },
  { name: 'Isabelle Dupont', email: 'isa.dupont@france.fr', age: 34 },
  { name: 'Jamal Nkrumah', email: 'jamal@nkrumah.org', age: 67 },
];

const invalidUsers = [
  { name: '', email: 'no.name@example.com', age: 25 }, // empty name
  { name: 'Kara', email: 'kara[at]mail.com', age: 40 }, // invalid email format
  { name: 'Liam', email: 'liam@mail.com', age: -5 }, // age below 0
  { name: 'Mia', email: 'mia@mail.com', age: 130 }, // age above 120
  { name: 'Noah', email: 12345, age: 28 }, // email not a string
];

test.each(validUsers)('valid user: %#', (user) => {
  expect(validateUserProfile(user)).toBe(true);
});

test.each(invalidUsers)('invalid user: %#', (user) => {
  expect(validateUserProfile(user)).toBe(false);
});
