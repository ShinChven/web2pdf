import { PDFOptions } from './../../node_modules/puppeteer-core/lib/cjs/puppeteer/common/PDFOptions.d';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs-extra';
import webPageToPdf from '../utils/pdf';
import dayjs from 'dayjs';
import { GeneralError } from '@feathersjs/errors';

const OUTPUT_DIR_NAME = 'output';

const pdfPublicDir = path.resolve(`./public/${OUTPUT_DIR_NAME}`);

type GeneratePDFOptions = {
  url: string,
  filename?: string,
  pdfOptions?: PDFOptions,
  redirect?: boolean,
};

export default () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return async (req: Request, res: Response) => {
    try {
      const body = req.body as Partial<GeneratePDFOptions>;
      const query = req.query as Partial<GeneratePDFOptions>;

      const url = body.url || query.url;
      const filename = (body.filename || query.filename || uuidv4()) + '.pdf';
      const pdfOptions = body.pdfOptions;
      const redirect = body.redirect || query.redirect;

      console.log('printing', JSON.stringify({
        url, filename, pdfOptions, redirect,
      }, null, 2));

      if (typeof url !== 'string') {
        res.status(400).send('url is required');
        return;
      }

      const dateString = dayjs().format('YYYY-MM-DD');

      const fileDir = path.resolve(pdfPublicDir, dateString);
      fs.ensureDirSync(fileDir);
      const filepath = path.resolve(fileDir, filename);
      await webPageToPdf({
        url, filepath,
        pdfOptions,
      });

      console.log(`PDF generated: ${filepath}`);

      const file_url = `/${OUTPUT_DIR_NAME}/${dateString}/${filename}`;

      if (redirect) {
        res.redirect(file_url);
        return;
      }

      return res.status(200).send({
        file_url: file_url,
        file_path: `/${dateString}/${filename}`,
      });
    } catch (err) {
      console.error(err);
    }
    const error = new GeneralError('Error generating PDF');
    res.status(error.code).json(error.toJSON());
  };
};
