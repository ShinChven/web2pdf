import { Application } from '../declarations';
import apiToken from './api-token';
import generatePdf from './generate-pdf';
// Don't remove this comment. It's needed to format import lines nicely.

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
export default function (app: Application): void {
  app.use('/action/generate-pdf', apiToken(process.env.API_TOKEN), generatePdf());
}
