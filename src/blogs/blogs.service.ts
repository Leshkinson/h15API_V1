import { RefType, SortOrder } from "mongoose";
import { BlogModel } from "./schema/blog.schema";
import { IBlog } from "./interface/blog.interface";
import { Inject, Injectable } from "@nestjs/common";
import { BlogsRepository } from "./blogs.repository";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { UpdateBlogDto } from "./dto/update-blog.dto";

@Injectable()
export class BlogsService {
    constructor(@Inject("blogRepository") private readonly blogRepository: BlogsRepository) {
        this.blogRepository = new BlogsRepository(BlogModel);
    }

    public async createBlog(createBlogDto: CreateBlogDto): Promise<IBlog> {
        return this.blogRepository.create(createBlogDto);
    }

    public async findAllBlogs(
        searchNameTerm: string | undefined | object,
        pageNumber = 1,
        pageSize = 10,
        sortBy = "createdAt",
        sortDirection: SortOrder | undefined = "desc",
    ): Promise<IBlog[]> {
        if (searchNameTerm)
            searchNameTerm = {
                name: { $regex: new RegExp(`.*${searchNameTerm}.*`, "i") },
            };
        const skip = Number((pageNumber - 1) * pageSize);
        return this.blogRepository.findAll(searchNameTerm, skip, pageSize, sortBy, sortDirection);
    }

    public async findOne(id: RefType): Promise<IBlog | undefined> {
        const blog = await this.blogRepository.find(id);
        if (!blog) throw new Error();

        return blog;
    }

    public async update(id: RefType, updateBlogDto: UpdateBlogDto): Promise<IBlog | undefined> {
        const updateBlog: IBlog | undefined | null = await this.blogRepository.updateBlog(id, updateBlogDto);
        if (updateBlog) return updateBlog;
        throw new Error();
    }

    public async delete(id: RefType): Promise<IBlog> {
        const deleteBlog = await this.blogRepository.delete(id);
        if (deleteBlog) return deleteBlog;
        throw new Error();
    }

    public async getTotalCountForBlogs(searchNameTerm: string | undefined | object): Promise<number> {
        if (searchNameTerm) searchNameTerm = { name: { $regex: new RegExp(`.*${searchNameTerm}.*`, "i") } };

        return await this.blogRepository.getBlogsCount(searchNameTerm);
    }

    public async testingDelete(): Promise<void> {
        await this.blogRepository.deleteAll();
    }
}
