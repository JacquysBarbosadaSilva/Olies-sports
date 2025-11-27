import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";

const AWS_ACCESS_KEY_ID = "ASIAZYPPXAY4UJI6E6QQ";
const AWS_SECRET_ACCESS_KEY = "K28gVpRtTilQMjRtSAb/ZPSBhxb1jH3RV+u4hvdQ";
const AWS_SESSION_TOKEN = "IQoJb3JpZ2luX2VjEMr//////////wEaCXVzLXdlc3QtMiJHMEUCIGB4975OJKIW0UAHkW2z8tRcA+jT7H53R5tSeiCnOv1LAiEAg75a/UUiaU3fD5JB3sSelQ5iFAJR+aPaiDLE9epoIDgqwQIIk///////////ARAAGgw2NzEwNTQ0OTczMzciDL2grvXCBiM/mXDxviqVAvQpDTLU2VdF502Q4rdF10RVy0tgM2hHzC5lc0vMlj0lMaJU6AGo5hg2dxChmf9B5Xd+EoWxRxFQm2aK/Xd0PnLwkxMQ+5KeKLROEVlvPUPVfKDQdAaYHvZ2qSLaG2e1d/hj9eHWf8tRUSMDrmLRAx+YEk7JRJiyT7wpOJCpI7egTSkMaSR5BzvdyXPbSuPo0OQhZFukWJrcfyFDAQwelnYJUcZcc46gqVlS5WVouTwTrWZG2BPiRxDdXveUrrclDqBiHZemjAww0I6lrl6psav4MQHyP3WO+kC6fVOyQ9U2+eQpR/aSDJVFbPYegxxTzD6xgPEnfwoIWZcuwPLIh8DTxjHN1ImcR607A/Fu+V0dma9Siaww/OaeyQY6nQEyDlyO0vH9pFpPPll0iQuP/d183bruHE5E3wtloF5ohwCAEa9pmW4ao+C6RKysx06u8IrU+C72rSn+XimsY4zXs+hV5PArSpop/vNlNGzEDZqVOGXv+q9yTMJj8g7aH2/0RlcSY03QA2psOpTKm8HKmFYEkEvJ5zI5Dd0Yce886o+czHQewlmZRfwlYBHKoBNq5B8XwLBFviw/ztUC"
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