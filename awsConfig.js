import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";

const AWS_ACCESS_KEY_ID = "ASIAZYPPXAY4TMAMUUON";
const AWS_SECRET_ACCESS_KEY = "RyisXoJAbUyRRkKL/w1qy3fZtybLiK6x60LYzYa8";
const AWS_SESSION_TOKEN = "IQoJb3JpZ2luX2VjEHYaCXVzLXdlc3QtMiJHMEUCIQDy755KA55DZ6fHj4L8v3dt1noY3swYfK9fm8agyCGduwIge75Hxu28DwHPyp0Flnvz7ciKnNfT0WbnwIiqf2fCbk4quAIIPhAAGgw2NzEwNTQ0OTczMzciDIMfWqrws+nYccoByiqVAjkqpsRtfEPgtrRjgpAe2kQBIkDwz9iZjiXMH53oJtEhMDcj14Z2foCFwpJUVRHpEEknDXSxMSQrsOIcEPYK2D5tH5o8fnnBql0JFL+jumTnDpSbIBTIwna0dgVEZCfCC+4hkDJNKxIfsaJ60KDsZQtUZq8cNjXMAdS2xu49NbxaupjxVcaP28Xo3nNlHaU73jDp7vSWpYPFNLo9IN7a9/JdbDZdXWL0RwbgsHQavaQ6345+jFxrVxfRMxGyZy1nRKBO9ki1pf4GbCJhFV0MLvDXPw5ghaw/nwh28zAJt2WDTif+cb8oU1zeWzR3SQEdzXEd8Tfu2pn2Lv7VT42yK+Z8iIcFfh52fhbpCIUiKRc1miXrYCIw4JOMyQY6nQE43d9zVMCZRsfYlYkmpKR2Im/RqwErxgjLQIoLwbhtWWV/JdMn5VA+ia16/gW+mIdMqk/QdxYpqzVvs1iwBrtbdr+oyxhUqKcN+s/sc3O6YC1oxCXIB+zndVnBy3qzd2nbak89NmpflnhFRSmaYYujCluAwJhelN7YZ5I5rZBOQ6vVz65U8SUdyoQb+uPhqrQBhyCD2TigVFVnYYrq"
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