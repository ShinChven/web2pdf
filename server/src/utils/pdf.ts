import { PDFOptions } from './../../node_modules/puppeteer-core/lib/cjs/puppeteer/common/PDFOptions.d';
import puppeteer from 'puppeteer';

const defaultPDFOptions: PDFOptions = {
  format: 'A4',
  margin: undefined,
};

export type WebPageToPdfArgs = {
  url: string, filepath: string,
  pdfOptions?: PDFOptions,
};

const webPageToPdf = async ({ url, filepath, pdfOptions }: WebPageToPdfArgs) => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'google-chrome-stable',
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  await page.goto(url,
    { waitUntil: 'networkidle0' }
  );
  await page.pdf({
    ...(pdfOptions || defaultPDFOptions),
    path: filepath,
  });
  await browser.close();
  return filepath;
};

export default webPageToPdf;
