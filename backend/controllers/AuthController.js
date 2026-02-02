
const Signup = async (req,res) =>{
    try {
        const {username, email, password} = req.body;
        console.log(username);
        console.log(email);
        console.log(password);
        console.log(req.body);
        res.status(200).send({message:"Signup successfuly."})
    } catch (error) {
        console.log(error)
    }
}

const Signin = async (req,res) =>{
    try {
        const { email, password} = req.body;
        console.log(email);
        console.log(password);
        console.log(req.body);
        res.status(200).send({message:"Signin successfuly."})
    } catch (error) {
        console.log(error)
    }
}



const getAllUsers = async (req, res) =>{
try {
    res.cookie("hi","Adarsh");
    res.send("All users data")
   console.log(req.cookies) 
} catch (error) {
    console.log(error)
}
}

module.exports = {Signup,Signin,getAllUsers};