import { ERROR } from "./error/error"
import {ResponseForm} from "./responseForm";

export type Try<T> = ResponseForm<T>;
export type TryCatch<T, E extends ERROR> = ResponseForm<T> | E;
