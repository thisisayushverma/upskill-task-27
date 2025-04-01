import express from "express";
import fs from "node:fs/promises";
import path from "node:path"
import { todo } from "node:test";

const app = express();
app.use(express.json());

app.get('/get-todo',async (req,res)=>{

    const todoList =await fs.readdir('./todos')

    if(todoList.length === 0){
        return res.status(200).json({
            message:"No todos found",
            data:todoList
        })
    }
    // first way to do this
    // const todoData = await Promise.all(
    //     todoList.map(async(todo)=>{
    //         const todoContent = await fs.readFile(path.join('./todos',todo),{encoding:'utf-8'})
    //         // console.log("todoData",todoData,Date.now());
    //         return {
    //             id:todo,
    //             data:todoContent
    //         }
    //     })
    // )

    // console.log("32:- todoData",todoData,Date.now());

    // second way to do this
    const todoData = [];
    for(const todo of todoList){
        const todoContent = await fs.readFile(path.join('./todos',todo),{encoding:'utf-8'})
        todoData.push({
            id:todo,
            data:todoContent
        })
        console.log("42:-todoContentEach",todoData,Date.now());
    }
    
    console.log("45:-todoData",todoData,Date.now());
    

    // Wrong way i did this
    // const todoData = [];
    // todoList.forEach(async (todo)=>{
    //     // console.log(process.cwd());
    //     const todoContent = await fs.readFile(path.join('./todos',todo),{encoding:'utf-8'})
    //     // console.log(todo,todoContent);
    //     todoData.push({
    //         id:todo,
    //         data:todoContent
    //     })
    //     console.log("todoData",todoData,Date.now());
    // })
    // console.log("todo",todoData,Date.now());
    res.status(200).json({
        success:true,
        data:todoData,
    })
})

app.get('/todo',async (req,res)=>{
    const {id} = req.query
    // console.log(req.query);
    await fs.readFile(path.join('./todos',`${id}.txt`),{encoding:'utf-8'})
    .then((data)=>{
        res.status(200).json({
            success:true,
            data:{
                id,
                data
            }
        })
    })
    .catch((error)=>{
        res.status(500).json({
            success:false,
            message:error.message
        })
    })

})


app.post('/add-todo',async (req,res)=>{
    console.log(req.body);
    const {data} = req.body
    const fileName = `${Date.now()}.txt`
    try {
        await fs.writeFile(path.join('./todos',fileName),data)
        res.status(200).json({
            success:true,
            message:"Todo added successfully",
            data:{
                id:fileName,
                data
            }
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
})

app.put('/update-todo',async (req,res)=>{
    const {id,data} = req.body
    try {
        await fs.writeFile(path.join('./todos',`${id}.txt`),data)
        res.status(200).json({
            success:true,
            message:"Todo updated successfully",
            data:{
                id,
                data
            }
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }

})

app.delete('/delete-todo',async (req,res)=>{
    const {id} = req.body
    try {
        await fs.unlink(path.join('./todos',`${id}.txt`))
        res.status(200).json({
            success:true,
            message:"Todo deleted successfully"
        })
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })   
    }
})


app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})