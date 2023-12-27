function servercheck(req,res,next)
{

    const {username,email,password}=req.body;

    console.log(username);
    const passpattern=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}<>])[A-Za-z\d!@#$%^&*(),.?":{}<>]{8,}$/;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const crtpass=passpattern.test(password);
    const crtemail=emailPattern.test(email);

    if(crtpass==true&&crtemail==true){
        next()
    }else{
        res.redirect('/')
        console.log("gfikhsodnpksn");
    }
}

module.exports=servercheck;