import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import {
  ApiErrorResponseDto,
  ApiSuccessResponseDto,
} from '../dto/api-response.dto';

type ApiEnvelopeResponseOptions = {
  /** HTTP status of the response. Defaults to 200. */
  status?: HttpStatus;
  /** Set to true when `data` is an array of `model`. */
  isArray?: boolean;
  description?: string;
};

/**
 * Documents an endpoint whose response is wrapped by ApiResponseInterceptor:
 * { success, data, timestamp, path }, with `data` shaped like `model`.
 *
 * Use instead of @ApiOkResponse / @ApiCreatedResponse.
 */
export const ApiEnvelopeResponse = <TModel extends Type<unknown>>(
  model: TModel,
  options: ApiEnvelopeResponseOptions = {},
) => {
  const { status = HttpStatus.OK, isArray = false, description } = options;

  const dataSchema = isArray
    ? { type: 'array', items: { $ref: getSchemaPath(model) } }
    : { $ref: getSchemaPath(model) };

  return applyDecorators(
    ApiExtraModels(ApiSuccessResponseDto, model),
    ApiResponse({
      status,
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiSuccessResponseDto) },
          {
            type: 'object',
            required: ['data'],
            properties: { data: dataSchema },
          },
        ],
      },
    }),
  );
};

type ApiErrorEnvelopeResponseOptions = {
  description: string;
  /** Value of `error.code` in the example. */
  code: string;
  /** Value of `error.message` in the example. */
  message: string;
  /** Value of `error.details` in the example, if the error has any. */
  details?: unknown;
};

/**
 * Documents an error response produced by ApiExceptionFilter:
 * { success: false, error: { code, message, details? }, timestamp, path }.
 *
 * The shape is the same for every error, so only the example changes per
 * endpoint.
 */
export const ApiErrorEnvelopeResponse = (
  status: HttpStatus,
  options: ApiErrorEnvelopeResponseOptions,
) => {
  const { description, code, message, details } = options;

  return applyDecorators(
    ApiExtraModels(ApiErrorResponseDto),
    ApiResponse({
      status,
      description,
      schema: {
        allOf: [{ $ref: getSchemaPath(ApiErrorResponseDto) }],
        example: {
          success: false,
          error: { code, message, ...(details !== undefined && { details }) },
          timestamp: '2026-10-27T12:00:00.000Z',
          path: '/example',
        },
      },
    }),
  );
};
