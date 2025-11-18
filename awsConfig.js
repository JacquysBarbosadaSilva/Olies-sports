// awsConfig.js
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDBClient = new DynamoDBClient({
  region: "us-east-1", 
  credentials: {
    accessKeyId: "ASIAZYPPXAY4UCK2QQ6I",
    secretAccessKey: "qeu1sPTqc003+7r4wjfucUVnT3ZPPdzq88c2jvJL",
    sessionToken: "IQoJb3JpZ2luX2VjEP///////////wEaCXVzLXdlc3QtMiJHMEUCIQD3V4T6wnd0meGwc00SObC4oQnhvIxZDr2pPS8zvQXbugIgX/50XtgozI+StJztL7psDgzezq13vXWHh7hYftKmwRYqwQIIyP//////////ARAAGgw2NzEwNTQ0OTczMzciDGk4v3KPb0JM+VFOsyqVAi9bLrU2nZ2Ll4NiHXTdDGhDREZVHeCFMVkhYKaWNlRrvdGXGdAQtyO8uEpobPhXCX4JvQHx+rWJvkCyiLGUIJ8+D7W3M2hJXIK5P8sW9B/j4pn5pVxao3E+hMc5Ax2ruSm7yvbHEiIg52Uc5bt+OqSVTwsnecbIMl22i5y8hjXou12WdjcHdUddHQV1aNGlSgc67F9Xeqh9deagvxWLfMrRz5H9VtOtARQHrn3vyIiiTwFOTCaExX6oEr3E+C8DR0RNxWzYDf8tXPCqL3izX4D+pWX6aS0/VNq7xmDTlyjJhNx0YnXUBoxmd9lxY68FdF54vmPacBfkqXl7C3kl7nvrxSws2Mh9SFWd3XKHq/SEToC7n2owl5XyyAY6nQEavOxmo8++q79XdvwJ53+JrFB9gmG52D4QGwo7rNA+sJKB244WwnyakgfCV8r/ovO+Ag5sgD0CkfLcoaKKdAEb4yA8egtMNq/Ngnr2s1LEohOaYF0Jj6qGrvKMuElEla1xx+Kipq+wwqSBR4ICcqcDejfqAFuken/oa+0ZqwAQRYgH+ZHpzkzKXZeBs5UaeATWcmRH5NlAgu0EJdkE",
  
  },
});

const dynamoDB = DynamoDBDocumentClient.from(dynamoDBClient);

export default dynamoDB;