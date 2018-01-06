import gql from 'graphql-tag'

export default {
	createAccountMutation: gql`
    mutation createUser(
      $email: String!, $password: String!, $name: String!, $nickname: String!, 
      $gender: String!, $birthYear: String!, $phone: String!
    ) 
    {
      createUser(
        data: {
          email: $email, password: $password, name: $name, nickname: $nickname, 
          gender: $gender, birthYear: $birthYear, phone: $phone
        }
      )
    {
      email
    }
  }
  `,
  
  billingHistoryQuery: gql`
    query BillingHistoryQuery($userId: Int!) {
      billingHistories(
        userId: $userId, orderBy: [["createdAt", "desc"]]
      ) {
        productId, orderId, productName, price, purchaseToken, purchaseTime,
        purchaseState, receiptSignature, receiptData,
        developerPayload, createdAt
      }
    }
  `
}
