import { middyfy } from '@libs/lambda';
import { APIGatewayTokenAuthorizerHandler } from 'aws-lambda';

enum EFFECT {
  ALLOW = 'Allow',
  DENY = 'Deny'
}

const basicAuthorizer: APIGatewayTokenAuthorizerHandler = async (event) => {

  const { authorizationToken = '', methodArn } = event;
  if(event?.type !== 'TOKEN') {    
    return generateAWSPolicy(authorizationToken, methodArn, EFFECT.DENY);
  }

  
  try{

    const userCredentials = getCredentialsFromAuthToken(authorizationToken);    
    
    const userPassword = process.env[userCredentials.username];

    const policyEffect = userPassword && userPassword === userCredentials.password ? EFFECT.ALLOW : EFFECT.DENY;

    return generateAWSPolicy(authorizationToken, event.methodArn, policyEffect);
  } catch (error) {
    return generateAWSPolicy(authorizationToken, methodArn, EFFECT.DENY);
  }
  
};

function getCredentialsFromAuthToken(token: string) {
	const encodedToken = token.split(' ')[1];
	    const buff = Buffer.from(encodedToken, 'base64');
	    const decodedCreds = buff.toString('utf-8').split(':');
	    // const [ username, password ] = decodedCreds;
      const username = decodedCreds[0];
      const password = decodedCreds[1];
	
	    console.log(`User login with username: ${username} and password: ${password}`);
      
      return { username, password };	
};

const generateAWSPolicy = (principalId, resource, effect: EFFECT) => {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource,
      }
    ]
    }
  }
}
export const main = middyfy(basicAuthorizer);
