import { ERROR } from "./error"
import {ResponseForm} from "./response";

export type Try<T> = ResponseForm<T>;
export type TryCatch<T, E extends ERROR> = ResponseForm<T> | E;
