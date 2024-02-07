import { Controller, Delete, Get, Post, Put, UseInterceptors, UploadedFile, ParseFilePipe, FileTypeValidator, Param, ParseIntPipe, Res, StreamableFile, Query } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { BookService } from "./books.service";
import { Response } from "express";



@Controller('books')
export class BooksController {
    constructor(private BookService: BookService) { }


    @Get('getbooks?')
    getBookByName(@Query('name') name:string){
        return this.BookService.getBookByName(name)
    }

    @Get(':id')
    async getBookById(@Param('id',ParseIntPipe) bookId:number, @Res({passthrough : true}) response: Response ) {
       return this.BookService.getBooksById(bookId, response)
    }

   

    @Post('addbook')
    @UseInterceptors(FileInterceptor('file'))
    postBooks(@UploadedFile(new ParseFilePipe(
            { 
                validators: [new FileTypeValidator({ fileType: '.(pdf|doc|docx)'})] 
        }
        )) file: Express.Multer.File, 
        ) {
            return this.BookService.postBook(file)
        }
    

    @Put('updateBook/:id')
    @UseInterceptors(FileInterceptor('file'))
    updateBook(@Param('id',ParseIntPipe) bookId:number,
            @UploadedFile(new ParseFilePipe({
                validators : [new FileTypeValidator({fileType: '.(pdf|doc|docx)'})]
            }) ) file : Express.Multer.File
    ) { 
        return this.BookService.updateBook(bookId,file)
    }

    @Delete('deleteBook/:id')
    deleteBook(@Param('id', ParseIntPipe) bookId : number) {
        return this.BookService.deleteBook(bookId)
    }
}

