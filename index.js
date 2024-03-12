 
 const bodyparser=require('body-parser')
 
 const mongoose=require('mongoose') 
  const express=require('express')
  const{Expense} =require('./schema.js')
  /**
 * Expense Tracker
 * Adding a new expense-->add expense
 * post  :  expenses
 * displaying existing records -->get-expense
 * get
 * delete an expense-->delete-expenses
 * post  :  id of the entry
 *updating an existing one--> update-expense 
 * post  :  id of the enry,expenses details  
 * 
 * Database Schema:
 * amount,category,date
 * 
 * 
 * 
 */
const app=express()
app.use(bodyparser.json())
app.use(cors())
  async function connectToDb(){

   try{
    await mongoose.connect("mongodb+srv://dhanushya23:1234@cluster0.36sqxhd.mongodb.net/expensedetails?retryWrites=true&w=majority&appName=Cluster0")

     console.log("DB connection Establised")
     const port=process.env.port|| 9000
         app.listen(9000,function(){
        
      console.log(`Listening on port ${port} ....`)
 
})

   }
   catch(error)
{
    console.log(error)
    console.log("could not establish the connection")
}

}connectToDb()

 app.post('/add-expense', async function(request,response){
  try{
    await Expense.create({
        "amount":request.body.amount,
        "category":request.body.category,
        "date":request.body.date
    })
    response.status(201).json({
        "status" :"success",
        "message":"entry created"
    })
  }
  catch(error){
    response.status(500).json({
        "status" :"failure",
        "message":"entry not  created",
        "error":error

    })}
 })

 app.get('/get-expense',async function(request,response){
    
    try{
        const expenseDetails=await Expense.find()
        response.status(200).json(expenseDetails)
    }catch(error){
        response.status(500).json({
            "status":"failed",
            "message":"could not fetch data",
            "error":error
        })

    }
})

 app.delete('/delete-expense/:id', async function(request, response) {
    try {
        const expenseEntry = await Expense.findById(request.params.id)
        if(expenseEntry) {
            await Expense.findByIdAndDelete(request.params.id)
            response.status(200).json({
                "status" : "success",
                "message" : "entry deleted"
            })
        } else {
            response.status(404).json({
                "status" : "failure",
                "message" : "entry not found"
            })
        }
    } catch(error) {
        response.status(500).json({
            "status" : "failure",
            "message" : "could not delete entry",
            "error" : error
        })
    }
})

app.patch('/update-expense/:id', async function(request, response) {
    try {
        const expenseEntry = await Expense.findById(request.params.id)
        if(expenseEntry) {
            await expenseEntry.updateOne({
                "amount" : request.body.amount,
                "category" : request.body.category,
                "date" : request.body.date
            })
            response.status(200).json({
                "status" : "success",
                "message" : "entry updated"
            })
        } else {
            response.status(404).json({
                "status" : "failure",
                "message" : "entry not found"
            })
        }
    } catch(error) {
        response.status(500).json({
            "status" : "failure",
            "message" : "could not update entry",
            "error" : error
        })
    }
})

