import cryptoRandomString from "crypto-random-string";
import dayjs from "dayjs";

import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

// Covert date to UTC
export const dateUtc = (date?: any) => {
  let finalDate = date ? dayjs(date).utc().format() : dayjs().utc().format();

  return finalDate;
};

export const stringGen = () => {
  const urlCode = cryptoRandomString({
    length: 10,
    characters: "alphanumeric"
  });

  return urlCode;
};
