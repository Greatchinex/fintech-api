import { getConnection } from "typeorm";

//========= Models ==========//
import { User } from "../../entity/User";
import { Card } from "../../entity/Cards";
import { FundHistory } from "../../entity/FundHistory";

// Update user details after they funded their account for a first time
// payment(Payment without saved card) or other means of payment (Like transfer)
export const successCharge = async (data: any) => {
  try {
    if (data.data.status === "success") {
      if (data.data.metadata.paid_with_saved_card === "false") {
        const {
          reference,
          amount,
          paid_at,
          currency,
          metadata: { id },
          authorization
        } = data.data;

        // get amount back in naira
        const original_amount = amount / 100;
        // Parse user id back to integer as paystack changes them to strings
        const intId = parseFloat(id);

        // Update User
        const updatedUser = await getConnection()
          .createQueryBuilder()
          .update(User)
          .set({ wallet_balance: () => "wallet_balance + :original_amount" })
          .setParameter("original_amount", original_amount)
          .where("id = :id", { id: intId })
          .returning("*")
          .updateEntity(true)
          .execute();

        // Is user paid with card save card
        if (authorization.reusable) {
          const card = {
            authorization_code: authorization.authorization_code,
            card_type: authorization.card_type.trim(),
            last4: authorization.last4.trim(),
            exp_month: authorization.exp_month,
            exp_year: authorization.exp_year,
            bin: authorization.bin,
            bank: authorization.bank.trim(),
            channel: authorization.channel,
            signature: authorization.signature,
            reusable: authorization.reusable,
            country_code: authorization.country_code,
            account_name: authorization.account_name,
            user: updatedUser.raw[0]
          };

          const newCard = Card.create(card);

          await newCard.save();
        }

        // Save Funds History
        const newFundHistory = FundHistory.create({
          reference,
          amount_funded: original_amount,
          transaction_date: paid_at,
          currency,
          channel: authorization.channel,
          card_type: authorization.card_type.trim(),
          user: updatedUser.raw[0]
        });

        await newFundHistory.save();
      }
    }
  } catch (err) {
    throw err;
  }
};

// Update user details after they funded their account, This will be called if a user
// funded their account with an already saved card
export const successCardCharge = async (data: any, user_id: number) => {
  try {
    if (data.data.status === "success") {
      const { reference, amount, transaction_date, currency, authorization } =
        data.data;

      // get amount back in naira
      const original_amount = amount / 100;

      // Update User
      const updatedUser = await getConnection()
        .createQueryBuilder()
        .update(User)
        .set({ wallet_balance: () => "wallet_balance + :original_amount" })
        .setParameter("original_amount", original_amount)
        .where("id = :id", { id: user_id })
        .returning("*")
        .updateEntity(true)
        .execute();

      // Save Funds History
      const newFundHistory = FundHistory.create({
        reference,
        amount_funded: original_amount,
        transaction_date,
        currency,
        channel: authorization.channel,
        card_type: authorization.card_type.trim(),
        user: updatedUser.raw[0]
      });

      await newFundHistory.save();

      return true;
    }

    return false;
  } catch (err) {
    return false;
  }
};
