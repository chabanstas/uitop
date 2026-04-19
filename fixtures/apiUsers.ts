import { faker } from '@faker-js/faker';

export type ValidUser = {
  name: string;
  email: string;
  password: string;
  title: string;
  birth_date: string;
  birth_month: string;
  birth_year: string;
  firstname: string;
  lastname: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  zipcode: string;
  state: string;
  city: string;
  mobile_number: string;
};

export type InvalidUser = {
  email: string;
  password: string;
};

const ALLOWED_COUNTRIES = ['India', 'United States', 'Canada', 'Australia', 'New Zealand', 'Singapore'];

export function generateValidUser(): ValidUser {
  const firstname = faker.person.firstName();
  const lastname = faker.person.lastName();

  return {
    name: `${firstname} ${lastname}`,
    email: faker.internet.email({ firstName: firstname, lastName: lastname }),
    password: faker.internet.password({ length: 12 }),
    title: faker.helpers.arrayElement(['Mr', 'Mrs', 'Miss']),
    birth_date: String(faker.number.int({ min: 1, max: 28 })),
    birth_month: String(faker.number.int({ min: 1, max: 12 })),
    birth_year: String(faker.number.int({ min: 1950, max: 2000 })),
    firstname,
    lastname,
    company: faker.company.name(),
    address1: faker.location.streetAddress(),
    address2: faker.location.secondaryAddress(),
    country: faker.helpers.arrayElement(ALLOWED_COUNTRIES),
    zipcode: faker.location.zipCode(),
    state: faker.location.state(),
    city: faker.location.city(),
    mobile_number: faker.phone.number(),
  };
}

export function generateInvalidUser(): InvalidUser {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
}
