import { successCharge } from "./resolve_transaction";

// Decide which transaction to resolve after webhook
export const paymentSelector = (event: string, data: any) => {
  switch (event) {
    case "charge.success":
      successCharge(data);
      break;
  }
};
