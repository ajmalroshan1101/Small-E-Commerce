function checksign(){
    const passpattern=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}<>])[A-Za-z\d!@#$%^&*(),.?":{}<>]{8,}$/;
    let inputpass=document.getElementById("pass").value;
    
    let show=document.getElementById('show')

    let show2=document.getElementById('show2')

    let conpass=document.getElementById('conpass').value; 

    const correctpass=passpattern.test(inputpass)

    if(!correctpass){
        show.style.display= "block"
        return false
    }
    else if(inputpass!=conpass) {

        show2.style.display="block"
        return false
    }
    else{

        show.style.display="none"
        return true
    }
}