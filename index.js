const express = require("express");
const mongoose =require ("mongoose");
const Recipes = require('./recipes'); 

const app = express();
const port = 3002;


const startserver = async () =>{
    try{
        await mongoose.connect("mongodb+srv://salmaelhani7:fAmsuG8J9bNtlzWs@cluster0.kthjlmt.mongodb.net/");
        console.log("connexion réussie avec la bdd");
        
        app.listen(port,()=>{
            console.log("Server is running on port "+port);
        })
    }catch(error){
        console.log(error.message);
    }
}
startserver();

app.get("/recipes",async (req,res)=>{
    try{
        const result= await Recipes.find({});
        res.send(result);
    }catch(err){
        console.log(err);
    }
   
});

app.use(express.json());
app.post("/recipes", async (req,res)=>{
   try{
      const recipe = new Recipes(
        {
            category: req.body.category,
            name: req.body.name,
            description: req.body.description,
            ingredients: req.body.ingredients,
            instructions: req.body.instructions,
        }
      );
      const findRecipe =await Recipes.findOne({ name: recipe.name });
      if (findRecipe){
          res.status(400).send('Recipe already exists');
          return
      }
      const savedRecipe = await recipe.save();
      console.log(savedRecipe);
      res.status(201).send("Created");
   }catch(err){
    console.log(err);
   }
});

app.delete("/recipes/:name",async (req,res)=>{
    try{
        const {name} = req.params;
        const findRecipe =await Recipes.findOne({ name:name });
        if (!findRecipe){
            res.status(400).send('Recipe no exist');
            return
        }
        await Recipes.findOneAndDelete({name:name});
        res.send("recipe deleted");gi
    }catch(err){
        console.log(err);
    }
    
});

app.put("/recipes/:name", async (req, res) => {
    try {
        const { name } = req.params;
        const findRecipe = await Recipes.findOne({ name: name });

        if (!findRecipe) {
            res.status(404).send('Recipe not found');
            return;
        }

        const updatedRecipe = await Recipes.findOneAndUpdate(
            { name: name },
            {
                category: req.body.category,
                name: req.body.name,
                description: req.body.description,
                ingredients: req.body.ingredients,
                instructions: req.body.instructions,
            },
            { new: true }, 
        );
        res.send(updatedRecipe); 
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});