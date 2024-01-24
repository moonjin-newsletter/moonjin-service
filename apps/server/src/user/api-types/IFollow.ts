import { tags } from "typia";

export interface IFollow {
    followingId: number & tags.Minimum<1>;
}