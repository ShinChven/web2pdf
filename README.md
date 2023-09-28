# WEB2PDF

WEB2PDF is a Docker-based application that leverages Puppeteer to convert web pages into PDF documents. Built on Node.js and FeathersJS, it provides a straightforward and efficient way to generate PDFs from any accessible URL.

## Deployment

[![Docker Image Version (latest by date)](https://img.shields.io/docker/v/shinchven/web2pdf)](https://hub.docker.com/r/shinchven/web2pdf)

To deploy the WEB2PDF service, ensure that Docker and Docker Compose are installed on your system. The WEB2PDF Docker image is publicly available on Docker Hub. You can pull the image using the following command:

```bash
docker pull shinchven/web2pdf
```

After pulling the Docker image, you can run the service using Docker Compose. Create a `docker-compose.yml` file with the following content:

```yaml
version: '3.5'

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    image: shinchven/web2pdf
    container_name: web2pdf
    restart: always
    ports:
      - "3040:3030"
    volumes:
      - ./output:/usr/src/app/public/output
```

This configuration will start the WEB2PDF service, expose it on port 3040, and bind the `./output` directory on your host to the `/usr/src/app/public/output` directory in the container. This is where the generated PDF files will be stored.

To start the service, navigate to the directory containing the `docker-compose.yml` file and run the following command:

```bash
docker-compose up -d
```

This command will start the service in the background.

## Usage

WEB2PDF can be used with either GET or POST HTTP methods.

### GET Method

To generate a PDF using the GET method, use the `curl` command as follows:

```bash
curl "http://localhost:3040/generate-pdf?url=https://www.google.com&filename=google.pdf"
```

In this example, a PDF of the Google homepage is created with the filename `google.pdf`.

### POST Method

To generate a PDF using the POST method, use the `curl` command like so:

```bash
curl -X POST -F "url=https://www.google.com" -F "filename=google.pdf" http://localhost:3040/generate-pdf
```

This command does the same as the previous one, but with the POST method.

## Parameters

The service accepts several parameters to customize the output:

| Parameter | Description | Default Value |
| --- | --- | --- |
| `url` | The URL of the web page to convert into a PDF. | (none) |
| `filename` | The name of the output PDF file. | A UUID |
| `pdfOptions` | Options to pass to the Puppeteer's `pdf` method. | `undefined` |
| `redirect` | If set to `true`, the service will redirect to the generated PDF file. | `false` |

Please note that the `url` parameter is required. If no `filename` is provided, a UUID will be used as the file name. The `pdfOptions` parameter can be used to pass any additional options to the Puppeteer's `pdf` method. If `redirect` is set to `true`, the service will redirect to the generated PDF file instead of returning a JSON response.