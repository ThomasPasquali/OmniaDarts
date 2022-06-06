import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

/* USAGE
1. throw new BadRequestException(payload, error);
2. throw new BadRequestException({
	title: '',
	payload: payload,
	description: '',
	error: '', --> REQUIRED
}, err['error']);
 */

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const content_res: any = exception.getResponse();
    console.log('Response from backend:', content_res);
    delete content_res.statusCode;

    const resObj = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      content: content_res,
    };

    checkProperty(content_res, 'title', resObj);
    checkProperty(content_res, 'description', resObj);
    checkErrorPresent(content_res, resObj);
    checkInvalidProperties(content_res, resObj);

    response.status(status).json(resObj);
  }
}

function checkInvalidProperties(content, resObj) {
  let props = [
    'title',
    'payload',
    'error',
    'description',
    'statusCode',
    'message',
  ];
  for (let prop in content) {
    if (!props.includes(prop)) {
      modifyResObj(500, 'Invalid property on exception', resObj);
      break;
    }
  }
}

function checkErrorPresent(content, resObj) {
  if (!content.hasOwnProperty('message') || content['message'].length == 0) {
    modifyResObj(500, 'Error message not inserted', resObj);
  }
}

function checkProperty(content, name: string, resObj) {
  if (content.hasOwnProperty(name)) {
    console.log(content[name]);
    if (!checkString(content[name])) {
      modifyResObj(
        500,
        name + ' not properly formatted (use _ instead of space)',
        resObj,
      );
    }
  }
}

function modifyResObj(status: number, content: string, resObj) {
  resObj['statusCode'] = status;
  resObj['content'] = content;
}

function checkString(message: string) {
  const RGEX = /(\w+_)*\w+/;
  let match = message.match(RGEX);
  return match[0] == message;
}
