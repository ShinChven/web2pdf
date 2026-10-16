import assert from 'assert';
import { Server } from 'http';
import { AddressInfo } from 'net';
import express from '@feathersjs/express';
import { Request, Response } from 'express';
import axios from 'axios';

import apiToken from '../src/middleware/api-token';

const startServer = (token?: string): Promise<{ server: Server, baseUrl: string }> => {
  const app = express();
  app.use(express.json());
  app.use('/protected', apiToken(token), (req: Request, res: Response) => {
    res.status(200).send('ok');
  });

  return new Promise(resolve => {
    const server = app.listen(0, () => {
      const { port } = server.address() as AddressInfo;
      resolve({ server, baseUrl: `http://localhost:${port}/protected` });
    });
  });
};

const status = async (request: Promise<any>): Promise<number> => {
  try {
    return (await request).status;
  } catch (error: any) {
    return error.response.status;
  }
};

describe('API token middleware', () => {
  describe('when no token is configured', () => {
    let server: Server;
    let baseUrl: string;

    before(async () => ({ server, baseUrl } = await startServer(undefined)));
    after(done => { server.close(done); });

    it('allows requests without a token', async () => {
      assert.equal(await status(axios.get(baseUrl)), 200);
    });
  });

  describe('when the configured token is empty', () => {
    let server: Server;
    let baseUrl: string;

    before(async () => ({ server, baseUrl } = await startServer('  ')));
    after(done => { server.close(done); });

    it('allows requests without a token', async () => {
      assert.equal(await status(axios.get(baseUrl)), 200);
    });
  });

  describe('when a token is configured', () => {
    let server: Server;
    let baseUrl: string;

    before(async () => ({ server, baseUrl } = await startServer('s3cret')));
    after(done => { server.close(done); });

    it('rejects requests without a token', async () => {
      try {
        await axios.get(baseUrl);
        assert.fail('should never get here');
      } catch (error: any) {
        const { response } = error;

        assert.equal(response.status, 401);
        assert.equal(response.data.name, 'NotAuthenticated');
      }
    });

    it('rejects a wrong token', async () => {
      const headers = { Authorization: 'Bearer wrong' };
      assert.equal(await status(axios.get(baseUrl, { headers })), 401);
    });

    it('accepts a matching Bearer token', async () => {
      const headers = { Authorization: 'Bearer s3cret' };
      assert.equal(await status(axios.get(baseUrl, { headers })), 200);
    });

    it('accepts a matching token query parameter', async () => {
      assert.equal(await status(axios.get(`${baseUrl}?token=s3cret`)), 200);
    });

    it('accepts a matching token in the request body', async () => {
      assert.equal(await status(axios.post(baseUrl, { token: 's3cret' })), 200);
    });
  });
});
