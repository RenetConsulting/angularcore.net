import { HTTP_HEADER_NAMES } from './http-header-names.type';

export const HTTP_HEADERS = {
    allowAnonymous: { [HTTP_HEADER_NAMES.allowAnonymous]: 'true' },
    allowExpiredToken: { [HTTP_HEADER_NAMES.allowExpiredToken]: 'true' },
    allowError: { [HTTP_HEADER_NAMES.allowError]: 'true' },
    contentTypeUrlencoded: { [HTTP_HEADER_NAMES.contentType]: 'application/x-www-form-urlencoded', },
};
