import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";

const AWS_ACCESS_KEY_ID = "ASIAZYPPXAY4SO3IG5OZ";
const AWS_SECRET_ACCESS_KEY = "gAmGXB4nUoiBe/NK51qPH15ph+q1HFBYzaaYwrQS";
const AWS_SESSION_TOKEN = "IQoJb3JpZ2luX2VjEEEaCXVzLXdlc3QtMiJHMEUCIQDu4Te8GKziomaJCQxEyBqWRFHLeADV0nhAdfoivwnU8gIgdcVQ4YcC2aiw+sxiOlpniF+w1gMiLNcGyVciwxDSCFUquAIIChAAGgw2NzEwNTQ0OTczMzciDDWAYj7nOhmlYxjPuyqVAkldmRRkuuQelNTk5BAzhjx4xEW5vWK+un+hquerSMgPzOf08QEHLCAfGeQcvHsvxoImFABPpXM1XafUo6h6hlOvYAZVJciPbBsIjNsntIemqt3r7t/Itbihz29SUu0Hlf6TAd2ds/q4xMsgquO7V1KVJyCJ71XN7QdQcPpsn3Z6lcUL0zNJKyAGxgvCziq4S6XUcr4EWK18ymNlOfLAGULhAlhCcksouBbFrTKEXsJdmK5YDfGu4Pq8uqmf+b5kI9koZC5uuWWjNJrGxPBFyARWoehMYJJgYyIY4l16pmC3U/x8GIm/Tf1tzR4T0jopb1vVyDZWDT8+rsJwjtybWBJFvGLyXwRDoA7tzh26GeaSRKtmsDswxe+4yQY6nQGUVAVpayDi++xCVKPDyDiMkk3OAfokhV2H6S2sbRuVa+Vnll9xBO5mwI9Gw7ar3ms6h+8hNVb7sYcSQLTAbZ8mPlu3+wjfSAunJnE6XH3UbgbDlfx6bKHIrctBDR9vAapLPj39itpRhlqgqWdgfU81nEvxw7hmNs4K2d4l7U33YwMSsqvWVpSqh98Q6txrQ91aYyTsJSDu+toRmbZT"
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