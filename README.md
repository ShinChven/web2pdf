# WEB2PDF

A simple puppeteer docker container to print web pages to pdf.

## Deploy

```bash
docker-compose up -d
```

## Usage

```bash
# GET
curl "http://localhost:3040/generate-pdf?url=https://www.google.com&filename=google.pdf"
# POST
curl -X POST -F "url=https://www.google.com" -F "filename=google.pdf" http://localhost:3040/generate-pdf
```

## Query or Parameters

| Option | Description | Default |
| --- | --- | --- |
| url | The url to print | |
| filename | The filename to save the pdf as | uuid |
| pdfOptions | The options to pass to the pdf function | undefined |
| redirect | Redirect to the pdf file | `false` |
