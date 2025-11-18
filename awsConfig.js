// awsConfig.js
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDBClient = new DynamoDBClient({
  region: "us-east-1", 
  credentials: {
    accessKeyId: "ASIAZYPPXAY4WLS646WN",
    secretAccessKey: "Pq7pSc48uQusdesFcCWL+Cq4j5HRAjUukAmiKqFS",
    sessionToken: "IQoJb3JpZ2luX2VjEPv//////////wEaCXVzLXdlc3QtMiJIMEYCIQCilVFH/STMm92TzDv7BWK/XCXHTuQmcBvetOLcTRLWiQIhAIF8SqfDTGUVoRycemJllbvM/rJnz0ox19lHb/Kj/KB9KsECCMT//////////wEQABoMNjcxMDU0NDk3MzM3IgzAuWZmInPo9R3Bz/cqlQIQow2oUaa+Y8uuE7nuXYuhfuP0pq90ZRKqh2qvrgVPNBMS1y9aH07pmxSGHJRaskS3FkxAct1Hayit5NDqKAZWsRnGFdCnIkJsoNkfTyEuBGo83n969h0Cl0rcZ//Yaw0qXR15DptqZCZNeEVDYUKTDbj6DfkqgtvmeKPAG4H40ZDciG6NiCz+aET6AQ0dShS4pqXZdAFAopnR/TW8iw+yo4oU6rdtg7TW95Cju50csbhG2g8f6++WbnaZHLBjhhQapKiad8eifn6JQ4l+Pvyk28yKngd7wakvFCLwdDWdLFOThs5MsTbMwshHJvd/JH4QnvJqimFlJpcT3G3zBM+87J2RqLmLNI7W9faUsrGCY+kbWvl+MO6p8cgGOpwBoywhYjnmC3wuP9zHX0GyEBdi4Iu+q6WRo2qPY7LxZ5SBFkonh/VKwu2pjhIaSxFE8vnwRR/iquHp3+K0BcOeI+G/Bk5v182/QOoiVLVAiQtNLaxwpRfc3fiKRvbppPJpiimlumYSFFikXKUz7+NSSpBeDGMVgWHbQP9ZJTDTsPEfZDNoLc157u4awjUW1tfBcOnb/TbQfFH88pWN",
  
  },
});

const dynamoDB = DynamoDBDocumentClient.from(dynamoDBClient);

export default dynamoDB;