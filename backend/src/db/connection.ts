import { connect, disconnect } from "mongoose";

async function connectToDatabase() {
  try {
    await connect(process.env.MONGODB_URL);
  } catch (error) {
    console.log(error);
    throw new Error("Can't zconnect to Database");
  }
}



async function disconnectFromDatabase() {

    try{
            await disconnect()
    }
    catch(error){
        console.log(error)
        throw new Error("Couldn't disconnect from db")
    }
    
}


export {connectToDatabase,disconnectFromDatabase}