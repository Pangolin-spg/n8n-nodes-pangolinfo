import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  IHttpRequestOptions,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

const marketplaces = [
  { name: 'United States', value: 'amz_us' },
  { name: 'Germany', value: 'amz_de' },
  { name: 'United Kingdom', value: 'amz_uk' },
  { name: 'Japan', value: 'amz_jp' },
  { name: 'France', value: 'amz_fr' },
  { name: 'Italy', value: 'amz_it' },
  { name: 'Spain', value: 'amz_es' },
  { name: 'Canada', value: 'amz_ca' },
];

export class Pangolinfo implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Pangolinfo',
    name: 'pangolinfo',
    icon: 'file:pangolinfo.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description: 'Get real-time Amazon, Alexa, AI SERP, niche, and category data',
    documentationUrl: 'https://www.pangolinfo.com/amazon-scraper-api/',
    defaults: { name: 'Pangolinfo' },
    inputs: ['main'],
    outputs: ['main'],
    usableAsTool: true,
    credentials: [{ name: 'pangolinfoApi', required: true }],
    requestDefaults: {
      baseURL: 'https://scrapeapi.pangolinfo.com',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    },
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'Advanced', value: 'advanced' },
          { name: 'AI Commerce & Search', value: 'ai' },
          { name: 'Amazon Data', value: 'amazon' },
          { name: 'Market Intelligence', value: 'market' },
        ],
        default: 'amazon',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'Get Amazon Product', value: 'amazonProduct', action: 'Get an amazon product' },
          { name: 'Get Amazon Reviews', value: 'amazonReviews', action: 'Get amazon reviews' },
          { name: 'Get Best Sellers', value: 'bestSellers', action: 'Get best sellers' },
          { name: 'Get New Releases', value: 'newReleases', action: 'Get new releases' },
          { name: 'List Seller Products', value: 'sellerProducts', action: 'List seller products' },
          { name: 'Search Amazon', value: 'amazonSearch', action: 'Search amazon' },
        ],
        default: 'amazonProduct',
        displayOptions: { show: { resource: ['amazon'] } },
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'Ask Amazon Alexa', value: 'alexa', action: 'Ask amazon alexa for shopping' },
          { name: 'Get AI Overview', value: 'aiOverview', action: 'Get a google ai overview' },
          { name: 'Get Keyword Trends', value: 'keywordTrends', action: 'Get keyword trends' },
        ],
        default: 'alexa',
        displayOptions: { show: { resource: ['ai'] } },
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'Filter Categories', value: 'filterCategories', action: 'Filter amazon categories' },
          { name: 'Filter Niches', value: 'filterNiches', action: 'Filter amazon niches' },
        ],
        default: 'filterCategories',
        displayOptions: { show: { resource: ['market'] } },
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'Custom API Request', value: 'custom', action: 'Make a custom api request' },
        ],
        default: 'custom',
        displayOptions: { show: { resource: ['advanced'] } },
      },
      {
        displayName: 'ASIN', name: 'asin', type: 'string', required: true, default: '',
        displayOptions: { show: { operation: ['amazonProduct', 'amazonReviews'] } },
      },
      {
        displayName: 'Keyword', name: 'keyword', type: 'string', required: true, default: '',
        displayOptions: { show: { operation: ['amazonSearch', 'bestSellers', 'newReleases'] } },
      },
      {
        displayName: 'Seller ID', name: 'sellerId', type: 'string', required: true, default: '',
        displayOptions: { show: { operation: ['sellerProducts'] } },
      },
      {
        displayName: 'Marketplace', name: 'site', type: 'options', options: marketplaces,
        default: 'amz_us',
        displayOptions: { show: { operation: ['amazonProduct', 'amazonSearch', 'amazonReviews', 'sellerProducts', 'bestSellers', 'newReleases'] } },
      },
      {
        displayName: 'ZIP Code', name: 'zipcode', type: 'string', default: '10041',
        displayOptions: { show: { operation: ['amazonProduct', 'amazonSearch', 'sellerProducts', 'bestSellers', 'newReleases'] } },
      },
      {
        displayName: 'Page Count', name: 'pageCount', type: 'number', default: 1,
        typeOptions: { minValue: 1, maxValue: 3 },
        displayOptions: { show: { operation: ['sellerProducts', 'amazonReviews'] } },
      },
      {
        displayName: 'Review Star Filter', name: 'starFilter', type: 'options', default: 'all_stars',
        options: [
          { name: '1 Star', value: 'one_star' }, { name: '2 Stars', value: 'two_star' },
          { name: '3 Stars', value: 'three_star' }, { name: '4 Stars', value: 'four_star' },
          { name: '5 Stars', value: 'five_star' }, { name: 'All Stars', value: 'all_stars' },
        ],
        displayOptions: { show: { operation: ['amazonReviews'] } },
      },
      {
        displayName: 'Review Sort', name: 'reviewSort', type: 'options', default: 'recent',
        options: [{ name: 'Most Recent', value: 'recent' }, { name: 'Most Helpful', value: 'helpful' }],
        displayOptions: { show: { operation: ['amazonReviews'] } },
      },
      {
        displayName: 'Prompt(s)', name: 'prompts', type: 'string', typeOptions: { rows: 4 },
        required: true, default: '',
        description: 'One prompt per line; Amazon Alexa for Shopping supports up to five prompts per request',
        displayOptions: { show: { operation: ['alexa'] } },
      },
      {
        displayName: 'Context URL', name: 'contextUrl', type: 'string', default: '',
        displayOptions: { show: { operation: ['alexa'] } },
      },
      {
        displayName: 'Capture Screenshot', name: 'screenshot', type: 'boolean', default: false,
        displayOptions: { show: { operation: ['alexa', 'aiOverview'] } },
      },
      {
        displayName: 'Google Search URL', name: 'googleUrl', type: 'string', required: true,
        default: 'https://www.google.com/search?q=',
        description: 'Google results URL to process with the Pangolinfo AI Overview SERP API',
        displayOptions: { show: { operation: ['aiOverview'] } },
      },
      {
        displayName: 'Keywords', name: 'trendKeywords', type: 'string', required: true, default: '',
        description: 'Comma-separated keywords',
        displayOptions: { show: { operation: ['keywordTrends'] } },
      },
      {
        displayName: 'Region', name: 'region', type: 'string', default: 'US',
        displayOptions: { show: { operation: ['keywordTrends'] } },
      },
      {
        displayName: 'Time Range', name: 'timeRange', type: 'string', default: 'today 12-m',
        displayOptions: { show: { operation: ['keywordTrends'] } },
      },
      {
        displayName: 'Marketplace ID', name: 'marketplaceId', type: 'string', default: 'US',
        displayOptions: { show: { operation: ['filterNiches', 'filterCategories'] } },
      },
      {
        displayName: 'Filter JSON', name: 'filterJson', type: 'json', default: '{\n  "page": 1,\n  "size": 10\n}',
        description: 'Additional filters from the Pangolinfo Niche or Category API documentation',
        displayOptions: { show: { operation: ['filterNiches', 'filterCategories'] } },
      },
      {
        displayName: 'API Path', name: 'apiPath', type: 'string', default: '/api/v1/scrape', required: true,
        description: 'Path relative to https://scrapeapi.pangolinfo.com',
        displayOptions: { show: { operation: ['custom'] } },
      },
      {
        displayName: 'Request Body', name: 'requestBody', type: 'json', default: '{}', required: true,
        displayOptions: { show: { operation: ['custom'] } },
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const results: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const operation = this.getNodeParameter('operation', i) as string;
        let url = 'https://scrapeapi.pangolinfo.com/api/v1/scrape';
        let body: IDataObject;

        if (operation.startsWith('amazon') || ['sellerProducts', 'bestSellers', 'newReleases'].includes(operation)) {
          const parserMap: Record<string, string> = {
            amazonProduct: 'amzProductDetail', amazonSearch: 'amzKeyword', sellerProducts: 'amzProductOfSeller',
            bestSellers: 'amzBestSellers', newReleases: 'amzNewReleases',
          };
          if (operation === 'amazonReviews') {
            body = {
              url: 'https://www.amazon.com', site: this.getNodeParameter('site', i) as string,
              parserName: 'amzReviewV2', format: 'json', formatType: 'all_formats', mediaType: 'all_contents',
              bizContext: {
                bizKey: 'review', asin: this.getNodeParameter('asin', i) as string,
                pageCount: this.getNodeParameter('pageCount', i) as number,
                filterByStar: this.getNodeParameter('starFilter', i) as string,
                sortBy: this.getNodeParameter('reviewSort', i) as string,
              },
            };
          } else {
            const content = operation === 'amazonProduct' ? this.getNodeParameter('asin', i) as string
              : operation === 'sellerProducts' ? this.getNodeParameter('sellerId', i) as string
                : this.getNodeParameter('keyword', i) as string;
            body = {
              parserName: parserMap[operation], site: this.getNodeParameter('site', i) as string,
              content, format: 'json', bizContext: { zipcode: this.getNodeParameter('zipcode', i) as string },
            };
            if (operation === 'sellerProducts') body.pageCount = this.getNodeParameter('pageCount', i) as number;
          }
        } else if (operation === 'alexa') {
          const prompts = (this.getNodeParameter('prompts', i) as string)
            .split('\n').map((value) => value.trim()).filter(Boolean);
          if (prompts.length === 0 || prompts.length > 5) {
            throw new NodeOperationError(this.getNode(), 'Provide between one and five Alexa prompts');
          }
          url = 'https://scrapeapi.pangolinfo.com/api/v2/scrape';
          body = {
            parserName: 'amazonAlexa',
            param: prompts,
            url: this.getNodeParameter('contextUrl', i) as string,
            screenshot: this.getNodeParameter('screenshot', i) as boolean,
          };
        } else if (operation === 'aiOverview') {
          url = 'https://scrapeapi.pangolinfo.com/api/v2/scrape';
          body = { parserName: 'googleSearch', url: this.getNodeParameter('googleUrl', i) as string,
            screenshot: this.getNodeParameter('screenshot', i) as boolean };
        } else if (operation === 'keywordTrends') {
          const keywords = (this.getNodeParameter('trendKeywords', i) as string)
            .split(',').map((value) => value.trim()).filter(Boolean);
          if (keywords.length === 0 || keywords.length > 5) {
            throw new NodeOperationError(this.getNode(), 'Provide between one and five trend keywords');
          }
          url = 'https://scrapeapi.pangolinfo.com/api/v2/google/trends';
          body = {
            keywords,
            timeRange: this.getNodeParameter('timeRange', i) as string,
            region: this.getNodeParameter('region', i) as string,
          };
        } else if (operation === 'filterNiches' || operation === 'filterCategories') {
          const filters = JSON.parse(this.getNodeParameter('filterJson', i) as string) as IDataObject;
          url = `https://scrapeapi.pangolinfo.com/api/v1/amzscope/${operation === 'filterNiches' ? 'niches' : 'categories'}/filter`;
          body = { marketplaceId: this.getNodeParameter('marketplaceId', i) as string, ...filters };
        } else if (operation === 'custom') {
          const path = this.getNodeParameter('apiPath', i) as string;
          if (!path.startsWith('/api/')) throw new NodeOperationError(this.getNode(), 'API Path must start with /api/');
          url = `https://scrapeapi.pangolinfo.com${path}`;
          body = JSON.parse(this.getNodeParameter('requestBody', i) as string) as IDataObject;
        } else {
          throw new NodeOperationError(this.getNode(), `Unsupported operation: ${operation}`);
        }

        const options: IHttpRequestOptions = { method: 'POST', url, body, json: true, timeout: 180000 };
        const response = await this.helpers.httpRequestWithAuthentication.call(this, 'pangolinfoApi', options) as IDataObject;
        results.push({ json: response, pairedItem: { item: i } });
      } catch (error) {
        if (this.continueOnFail()) {
          results.push({ json: { error: error instanceof Error ? error.message : String(error) }, pairedItem: { item: i } });
          continue;
        }
        throw error;
      }
    }

    return [results];
  }
}
