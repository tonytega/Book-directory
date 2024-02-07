import { Injectable, StreamableFile } from "@nestjs/common";
import { Response } from "express";
import { PrismaService } from "src/prisma/prisma.service";
import { Readable } from "stream";

@Injectable({})

export class BookService{
    constructor(private prisma: PrismaService){}

     async getBooksById(bookId:number,response: Response){
       const book = await this.prisma.book.findFirst({where :{
            id:bookId
        }})

        const stream = Readable.from(book.file)

        response.set({
            'Content-Type': 'application/pdf',
            'Content.disposition' : `inline; fileName = "${book.fileName}"`,
            
        })
        

       return new StreamableFile(stream)
    }

    async getBookByName(name:string){
        const books = await this.prisma.book.findMany(
            {
                where:{
                    fileName:{
                        contains:name
                    }
                }
            }
        )
        return books
    }

    async postBook(file :Express.Multer.File){
        const book = await this.prisma.book.create({
            data : {
                fileName : file.originalname,
                file : file.buffer
            }
        })
       
        return book
    }

    async updateBook(bookId:number,file:Express.Multer.File){
        const book = await this.prisma.book.update(
            {
                where : {
                    id : bookId
                },
                data : {
                    file: file.buffer,
                    fileName : file.originalname
                }
            }
        )

        return book;
    }

    deleteBook(bookId){
        const book =  this.prisma.book.delete({
            where : {
                id : bookId
            }
        })

        return book;
    }


}