import { HTTP_HEADER_NAMES } from './http-header-names';

export const HTTP_HEADERS = {
    allowAnonymous: { [HTTP_HEADER_NAMES.allowAnonymous]: 'true' },
    allowExpiredToken: { [HTTP_HEADER_NAMES.allowExpiredToken]: 'true' },
    allowHttpError: { [HTTP_HEADER_NAMES.allowHttpError]: 'true' },
    contentTypeUrlencoded: { [HTTP_HEADER_NAMES.contentType]: 'application/x-www-form-urlencoded', },
};