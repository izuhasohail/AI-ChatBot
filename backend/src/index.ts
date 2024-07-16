import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";
import mrorgan from 'morgan'

//connections and listeners

connectToDatabase()
.then(()=>{
    app.listen(5000,()=>{
        console.log("Server Open")
    })
})
.catch((err)=>console.log(err))