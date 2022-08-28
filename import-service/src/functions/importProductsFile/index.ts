import { handlerPath } from '../../libs/handler-resolver'

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        // cors: true,
        authorizer: {
          // arn: '${env:AUTHORIZER_LAMBDA}',
          arn: 'BasicAuthorizerLambdaFunction',
          resultTtlInSeconds: 0,
          identitySource: 'method.request.header.Authorization',
          type: 'token'
        },
        description: 'Gets signed URL for csv upload',
        queryStringParameters: {
          name: {
            required: true,
            type: 'string',
          },
        },
        responseData: {
          200: {
            description: 'Signed URL success',
            bodyType: 'SignedUrlResponse',
          },
          400: 'Missing query param "name"',
          500: 'Internal server error',
        },
      },
    },
  ],
};
