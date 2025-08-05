import { MissingApiKeyError, NetworkError, ValidationError } from "../../utils/error-instances.js";
import { errorMessageHandler } from "../../utils/error-messages-handler.js"

export function isExpired(createdAt) {
  if(!createdAt)return true
  const expiryTs = createdAt + 60 * 60 * 1000;
  return Date.now() > expiryTs;
}

export async function GNOSISPAY() {

  try {
    const GNOSIS_PAY_ACCESS = window.localStorage.getItem('GNOSIS_PAY_ACCESS');

    if(!GNOSIS_PAY_ACCESS){
        throw new ValidationError('Gnosispay access is required. Grant access to query your account')
    }
    const access = JSON.parse(GNOSIS_PAY_ACCESS)
    if(!access?.token || isExpired(access?.createdAt)){
      throw new ValidationError('Expired or invalid access token')
    }

    const url = new URL(`https://api.gnosispay.com/api/v1/transactions`);
    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${access.token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) throw new NetworkError('GNOSIS_PAY', res.status);

    const json = await res.json();
    if(!Array.isArray(json)){
      return [{message: 'Unexpected response'}]
    }
    const result = json.map((transactions) => {
      return {
        createdAt: transactions.createdAt,
        clearedAt: transactions.clearedAt,
        country: transactions.country?.name || '',
        isPending: transactions.isPending,
        mcc: transactions.mcc,
        merchant: transactions.merchant?.name || '',
        billingAmount: transactions.billingAmount,
        billingCurrency: transactions.billingCurrency,
        transactionAmount: transactions.transactionAmount,
        transactionCurrency: transactions.transactionCurrency,
        transactionType: transactions.transactionType,
        kind: transactions.kind,
        status: transactions.status
      }
    })
    return result 
  } catch (err) {
    return errorMessageHandler(err, 'GNOSISPAY')
  }
}
