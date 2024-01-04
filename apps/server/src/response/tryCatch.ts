import { ERROR } from "./error"
import {ResponseForm} from "./responseForm";

export type Try<T> = ResponseForm<T>;
export type TryCatch<T, E extends ERROR> = ResponseForm<T> | E;
