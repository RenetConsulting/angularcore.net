import { IError } from "../interfaces/error";

export const filterError = (e?: { error?: IError }) => e && e.error && !!e.error.error_description;