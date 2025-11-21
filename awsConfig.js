import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";

const AWS_ACCESS_KEY_ID = "ASIAZYPPXAY4QOCNJL4Y";
const AWS_SECRET_ACCESS_KEY = "UIBJyxUjA8wbmMj9BG3P/44bY294MsZznvDSIU3d";
const AWS_SESSION_TOKEN = "IQoJb3JpZ2luX2VjEEkaCXVzLXdlc3QtMiJIMEYCIQCy7s8S1jp7iBbRcr+2bJXd5DEECHtFMsmuQ2VXqqVdbwIhANfu+Vl1gskt6BKQRUPJea2yJn6dorRKnKs8dObmVvIwKrgCCBIQABoMNjcxMDU0NDk3MzM3IgzykS4iIH8ErfmQcgoqlQK+BTPtZLWFJBLmSsc7fK/IehPd08kEEyCL5zpL/MpfFQ0qlpM6YQ8nugjvf3ZfZWojcLdCYVFfgXZQD9uMeR2lX1GE6efY7Ty3cXtZ7qZ79U3xdlO+iNbCKXEzSjYBUwNZp8DQQkOjP5UOzqd6c6OEKY/67rH8zzVJnvCn9S/wBA5SxiyqxebO8eTbCbZaJVnrtCLq1VMf6B+MdZgsptbm5SUm8TJR5aFB4bYhsSkmiPFTVlABmWJQVmCYTnwcIxsXk4Np3DlHNR9fF9o4Vm+FPvAVddsfebEReBIAhsLhf9Sd1U6QrCVnuiROTXeHRT/QREWzvL6TjoGTQvjnSVAZwDCfwsXtXd/rvyfTMtkfqCsurYwRMI+ogskGOpwBzgFc4qhFF3CeCanEcoNPvJ1UYV3JJeKa/7K0E3f66HpPfdqreOiX8GNYaFV1P/7+MpbqXX+KT4ZQtYJpR86MJXISsQCl+RmcUrGTFXyPzIznVINuoFaX4v3sLkEiMimRYqViJSwaJWINNdCK+5TfnVFPtD/5y3RqkzrzDHabLwL0IHFxEHPNie5DxTYd+W1N29W+De920v5zg/NH"
export const REGION = "us-east-1";
export const BUCKET_NAME = "produtos-olies-sports";

// Configuração do DynamoDB
export const dynamoDB = new DynamoDBClient({
  region: REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    sessionToken: AWS_SESSION_TOKEN, // apenas se estiver usando credenciais temporárias
  },
});

// Configuração do S3 (caso use upload de imagens)
export const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    sessionToken: AWS_SESSION_TOKEN,
  },
});

export default dynamoDB;