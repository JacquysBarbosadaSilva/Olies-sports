import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";

const AWS_ACCESS_KEY_ID = "ASIAZYPPXAY45E4AVDJR";
const AWS_SECRET_ACCESS_KEY = "WcOVOF+6WE+KJapDDp1yFJhi3MUk0a5y83VjrQQq";
const AWS_SESSION_TOKEN = "IQoJb3JpZ2luX2VjEMf//////////wEaCXVzLXdlc3QtMiJGMEQCIAw3gR8AQyYncT2V5VUzw9vjucw/ZviTZz86tK8WhS/LAiBrIllqHbPFfBoEth5rR5pRIjwqoZgf9cv56zKK4kDtUyrBAgiP//////////8BEAAaDDY3MTA1NDQ5NzMzNyIMgxf7ph8idNBITDfZKpUC3X0F9vk80znNSiKMdQn66qB/1X4UYmD3ZD6tZhkAJvea7ZoAGwoWA/2MNk5pQbZMUqa4iFgN9LtbjDxTExwJ4WthvdT1v3rrYNfZ3RMkmPXvzoMxsH/u28r3hyncml92YsMfgedAGBglqYLTBOac4CeM9KXF+NyrhrVRQWRvhBxA4AYLB0sAVyDAJ9k1ddiJ5zmdjx843JZhJeUQEu0NHTWxh/4hV5aNyxpXBNLKMEI3fCvU7/PUQYl6FVhbI4VD3ZyL8XnhslxuG3oFb+rWKbMFHOhq5oohyYAZajUnsjpXr6pOyTbj8Of+6kND3RBSA1fY2HuEKmbaSQ7T7LCSGE8s/2b294vyPw/u7/3zEfphn+OL4jDq+p3JBjqeAQIzbq+RI7KMpMCzK7fNWxifK4BAw9alqEZPFG6hVHAGngmuiY6Bd7Q5qtrXz5ywn7B8ruHYKAvZwoAzHBiyJ44KeLVavNsSEZZrZJrf067/XA0SsQ3S84DMSWZIQG9tpVuvHNdtyWied3baLLVb3XBjbzWLpb2eMaFka2R8xOTIFm5SwFxEcPkeeQjuHwz0y1uYK2fHo5ZraUHxxMLW"
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