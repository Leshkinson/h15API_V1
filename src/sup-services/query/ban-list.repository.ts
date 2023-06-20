import { Model, RefType } from "mongoose";
import { Inject, Injectable } from "@nestjs/common";
import { IBanList } from "./interface/ban-list.interface";

@Injectable()
export class BanListRepository {
    constructor(@Inject("BanList") private readonly banListModel: Model<IBanList>) {}

    public async addUserInBanList(userId: RefType | string): Promise<IBanList> {
        return this.banListModel.create({ userId });
    }

    public async findAllUserInBanList(): Promise<IBanList[]> {
        return this.banListModel.find();
        //{}, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 }
    }

    public async deleteUserFromBanList(userId: RefType | string): Promise<void> {
        return this.banListModel.findOneAndDelete({ userId });
    }
}
