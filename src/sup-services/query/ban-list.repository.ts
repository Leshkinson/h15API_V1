import { Model, RefType } from "mongoose";
import { Inject, Injectable } from "@nestjs/common";
import { IBanList } from "./interface/ban-list.interface";

@Injectable()
export class BanListRepository {
    constructor(@Inject("BanList") private readonly banListModel: Model<IBanList>) {}

    public async addUserInBanList(userId: RefType | string): Promise<IBanList> {
        console.log("userId in addUserInBanList", userId);
        console.log("here addUserInBanList");
        return this.banListModel.create({ userId });
    }

    public async findAllUserInBanList(): Promise<IBanList[]> {
        return this.banListModel.find({}, { _id: 0 });
    }

    public async deleteUserFromBanList(userId: RefType | string): Promise<void> {
        console.log("userId in deleteUserFromBanList", userId);
        console.log("here deleteUserFromBanList");
        return this.banListModel.findOneAndDelete({ userId });
    }
}
