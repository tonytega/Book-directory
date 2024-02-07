import { Module } from "@nestjs/common";
import { BooksController } from "./books.controller";
import { BookService } from "./books.service";

@Module({
    controllers:[BooksController],
    providers:[BookService]
})
export class BooksModule{}