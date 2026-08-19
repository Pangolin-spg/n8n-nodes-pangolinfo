import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class PangolinfoApi implements ICredentialType {
  name = 'pangolinfoApi';

  displayName = 'Pangolinfo API';

  icon = 'file:../nodes/Pangolinfo/pangolinfo.svg' as const;

  documentationUrl = 'https://docs.pangolinfo.com/en-api-reference/authApi/authApi';

  properties: INodeProperties[] = [
    {
      displayName: 'Permanent API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
      description:
        'Create a permanent key in the Pangolinfo Console under Profile → API Key',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '=Bearer {{$credentials.apiKey}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: 'https://mcp.pangolinfo.com',
      url: '/mcp',
      method: 'POST',
      headers: {
        Accept: 'application/json, text/event-stream',
        'Content-Type': 'application/json',
      },
      body: {
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '2025-03-26',
          capabilities: {},
          clientInfo: { name: 'n8n-credential-test', version: '1.0.0' },
        },
      },
    },
  };
}
