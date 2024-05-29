import {IChangeUserProfile} from "../user";

export interface IChangeWriterProfile extends IChangeUserProfile{
    moonjinId?: string;
    description?: string;
}