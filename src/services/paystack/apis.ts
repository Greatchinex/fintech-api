import fetch from "node-fetch";
import { config } from "dotenv";

config();

const base_url: string = "https://api.paystack.co";

// Api to verify user account number
export const resolveAcctNumber = async (
  acct_number: string,
  bank_code: string
) => {
  try {
    const url = `${base_url}/bank/resolve?account_number=${acct_number}&bank_code=${bank_code}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        authorization: `Bearer ${process.env.PAY_STACK_SECRET_KEY!}`,
        "Content-Type": "application/json",
        "cache-control": "no-cache"
      }
    });

    const data = await response.json();

    return data;
  } catch (err) {
    throw err;
  }
};

export const listBanks = async () => {
  try {
    const url = `${base_url}/bank/`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        authorization: `Bearer ${process.env.PAY_STACK_SECRET_KEY!}`,
        "Content-Type": "application/json",
        "cache-control": "no-cache"
      }
    });

    const data = await response.json();

    return data;
  } catch (err) {
    throw err;
  }
};

// Initiate a payment
export const initiateUserPay = async (body: any) => {
  try {
    const url = `${base_url}/transaction/initialize`;

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        authorization: `Bearer ${process.env.PAY_STACK_SECRET_KEY!}`,
        "Content-Type": "application/json",
        "cache-control": "no-cache"
      }
    });

    const data = await response.json();

    return data;
  } catch (err) {
    throw err;
  }
};

// Recurring Charges. When a user has previously funded account once and then we use that card for
// Subsequent charges
export const recurringCharge = async (body: any) => {
  try {
    const url = `${base_url}/transaction/charge_authorization`;

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        authorization: `Bearer ${process.env.PAY_STACK_SECRET_KEY!}`,
        "Content-Type": "application/json",
        "cache-control": "no-cache"
      }
    });

    const data = await response.json();

    return data;
  } catch (err) {
    throw err;
  }
};
