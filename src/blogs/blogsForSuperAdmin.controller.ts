import { Controller } from "@nestjs/common";
import { BlogsService } from "./blogs.service";
import { QueryService } from "../sup-services/query/query.service";

@Controller("sa/blogs")
export class BlogsControllerForSA {
    constructor(private readonly blogsService: BlogsService, private readonly queryService: QueryService) {}
}
