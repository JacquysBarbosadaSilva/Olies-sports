// awsConfig.js
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDBClient = new DynamoDBClient({
  region: "us-east-1", 
  credentials: {
    accessKeyId: "ASIAZYPPXAY42PRUWUMZ",
    secretAccessKey: "Nl7Ldn3YzXaGRvWoabjAvmht69Vfa8Wmj1kTdTjZ",
    sessionToken: "IQoJb3JpZ2luX2VjEOL//////////wEaCXVzLXdlc3QtMiJHMEUCICDdMJDisXdGa7fUGh995ZGwa6kxv4mHd/3MECFobD9zAiEA5Vz4b+pcb8KHWxlZ5zHssh1xhZwkNqRfXCVqGNl5BQkqwQIIq///////////ARAAGgw2NzEwNTQ0OTczMzciDGRjPhW1UfCsll3jyCqVAiVfcOnnIwj3p67fOXT0xqaWtGFbCvHXujdICpqphccCmEPCspimvrxnmZJM9wqCPcs7Q1tmLixB4HUDGQ7XaBYcYvn216oCdXrhULlHUOPZKvy9Ab8EAWpOfpBNLRxU4JG8J0K23CILi7+3G/whC9VFt3gM1i0/OsJMO4zcvChfHwZWyMDqE9J0jRpVd4b7sq4bsEX0OF13H1EhbAjoKH/3Pe8FVXdalf+agTujav3VXt3S1WspG7leEXbgo5Ak6USYD3FzPmAzBuSLnCUqofoA6jLdU8QeMjLWv3Amryn6Lcol1mBcbTv6quo7HVaZO/9/AScwpR21yAe0yhJWGkHfYIjE1HCdDgmAngxVy0BaR1pUpD0wwMmzyAY6nQHu7dw7IOK//xe/mIDJchYaPphO8110ycldWNtCppwBGXbcSi2fIgiNQ50tjjz9SSvHk5j83CqQsJpPCcWeYZxhnT7Zq5sOnQ2TE/lOl4m3AdknOZ84hFtfHko4n7Csiiu/1ub4HxCn01UnI+K29r2kuZui0QlKVlF8ZK/z/cwhY2RIh3IJfpqpG/wtcm+mEOWW1cWvTbi+GthR+Lqe",
  
  },
});

const dynamoDB = DynamoDBDocumentClient.from(dynamoDBClient);

export default dynamoDB;