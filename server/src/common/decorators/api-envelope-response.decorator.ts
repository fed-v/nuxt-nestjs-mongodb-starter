import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiSuccessResponseDto } from '../dto/api-response.dto';

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
