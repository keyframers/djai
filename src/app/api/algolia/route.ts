// File: helloAlgolia.mjs
import { algoliasearch } from 'algoliasearch';

const appID = process.env.ALGOLIA_APPLICATION_ID!!!!!!!!!!!!;
// API key with `addObject` and `editSettings` ACL
const apiKey = process.env.ALGOLIA_API_KEY!!!!!!!!!!!!!!!!!!!!!;
const indexName = process.env.ALGOLIA_INDEX_NAME!!!!!!!!!!!!;

const client = algoliasearch(appID, apiKey);

const record = { objectID: 'object-1', name: 'test record' };

// Add record to an index
const { taskID } = await client.saveObject({
  indexName,
  body: record,
});

// Wait until indexing is done
await client.waitForTask({
  indexName,
  taskID,
});

// Search for "test"
const { results } = await client.search({
  requests: [
    {
      indexName,
      query: 'test',
    },
  ],
});

console.log(JSON.stringify(results));
