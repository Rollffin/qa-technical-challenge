import * as dotenv from 'dotenv';

dotenv.config();

export const USERS = {
  standard: {
    username: process.env.STANDARD_USER ?? '',
    password: process.env.STANDARD_PASSWORD ?? '',
  },
  locked: {
    username: process.env.LOCKED_USER ?? '',
    password: process.env.LOCKED_PASSWORD ?? '',
  },
  invalid: {
    username: 'invalid_user',
    password: 'wrong_password',
  },
};

export const CHECKOUT_DATA = {
  firstName: 'Rebu',
  lastName: 'hr',
  zipCode: 'cp2201',
};
