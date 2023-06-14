import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, Res, UseGuards } from "@nestjs/common";
import { BlogsService } from "../blogs.service";
import { QueryService } from "../../sup-services/query/query.service";
import { AuthGuard } from "../../auth.guard";
import { CreateBlogDto } from "../dto/create-blog.dto";
import { Request, Response } from "express";
import { IBlog } from "../interface/blog.interface";
import { UpdateBlogDto } from "../dto/update-blog.dto";
import { CreatePostDtoWithoutIdAndName } from "../../posts/dto/create-post.dto";
import { IPost } from "../../posts/interface/post.interface";
import { BlogsRequest } from "../types/blog.type";
import { AccessGuard } from "../../auth/access.guard";
import { RequestWithUser } from "../../auth/interface/auth.interface";

@Controller("blogger/blogs")
export class BloggerBlogsController {
    constructor(private readonly blogsService: BlogsService, private readonly queryService: QueryService) {}

    @UseGuards(AccessGuard)
    @Get()
    public async findAllBlogs(@Req() req: Request, @Res() res: Response) {
        try {
            const request = req as RequestWithUser;
            const { userId } = request.user;
            // eslint-disable-next-line prefer-const
            let { pageNumber, pageSize, sortBy, searchNameTerm, sortDirection } = req.query as BlogsRequest;
            pageNumber = Number(pageNumber ?? 1);
            pageSize = Number(pageSize ?? 10);
            const blogs: IBlog[] = await this.blogsService.findAllBlogs(
                searchNameTerm,
                pageNumber,
                pageSize,
                sortBy,
                sortDirection,
                userId,
            );
            const totalCount: number = await this.blogsService.getTotalCountForBlogs(searchNameTerm, userId);

            res.status(HttpStatus.OK).json({
                pagesCount: Math.ceil(totalCount / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: totalCount,
                items: blogs,
            });
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(HttpStatus.NOT_FOUND);
                console.log(error.message);
            }
        }
    }
    @UseGuards(AccessGuard)
    @Post()
    //@AuthGuard()
    public async create(@Body() createBlogDto: CreateBlogDto, @Req() req: Request, @Res() res: Response) {
        try {
            const request = req as RequestWithUser;
            const { userId } = request.user;
            const newBlog: IBlog = await this.blogsService.createBlog(createBlogDto, userId);
            res.status(HttpStatus.CREATED).json(newBlog);
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(HttpStatus.NOT_FOUND);
                console.log(error.message);
            }
        }
    }
    @UseGuards(AccessGuard)
    @Put(":id")
    //@AuthGuard()
    public async update(@Param("id") id: string, @Res() res: Response, @Body() updateBlogDto: UpdateBlogDto) {
        try {
            const updateBlog = await this.blogsService.update(id, updateBlogDto);
            if (updateBlog) {
                res.sendStatus(HttpStatus.NO_CONTENT);
            }
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(HttpStatus.NOT_FOUND);
                console.log(error.message);
            }
        }
    }

    @Delete(":id")
    @AuthGuard()
    public async delete(@Param("id") id: string, @Res() res: Response) {
        try {
            await this.blogsService.delete(id);

            res.sendStatus(HttpStatus.NO_CONTENT);
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(HttpStatus.NOT_FOUND);
                console.log(error.message);
            }
        }
    }

    @Post(":blogId/posts")
    @AuthGuard()
    public async createPostTheBlog(
        @Param("blogId") blogId: string,
        @Body() createPostDtoWithoutIdAndName: CreatePostDtoWithoutIdAndName,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        try {
            const newPost: IPost | undefined = await this.queryService.createPostForTheBlog(
                createPostDtoWithoutIdAndName,
                blogId,
            );
            if (newPost) res.status(HttpStatus.CREATED).json(newPost);
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(HttpStatus.NOT_FOUND);
                console.log(error.message);
            }
        }
    }

    @Put(":blogId/posts/:postId")
    public async updateExistingPost(@Res() res: Response) {
        try {
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(HttpStatus.NOT_FOUND);
                console.log(error.message);
            }
        }
    }

    @Delete(":blogId/posts/:postId")
    public async deletePost(@Res() res: Response) {
        try {
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(HttpStatus.NOT_FOUND);
                console.log(error.message);
            }
        }
    }
}
