$( document ).ready(function(){
   
   const inicioapp=()=>{

    if(localStorage.getItem('jwt-token')){
        console.log('existe token')
       $('#situacionMundial').show()
       document.getElementById('accesoChile').className="nav-link "
       document.getElementById('formSesion').className="nav-link d-none"
       document.getElementById('closeSesion').className="nav-link "
    //    $('#loader').show()
       situacionchile(localStorage.getItem('jwt-token'))
       $('#chile').hide()
   }else{
        console.log('token no existe en localStorge')
        $('#chile').hide()
   }
   }

var modalLogin =document.getElementById('modalLogin')
modalLogin.innerHTML=`
<div class="modal fade" id="ModalFormulario" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content d-flex" id="ModalFor">
        <div class="modal-header">
        <h5 class="modal-title">Desafio Latam - Covid19</h5>
            <button type="button" class="btn-close ms-auto" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>    
            <form id="formulario" class="px-4 my-5" >
            <div class="mb-3">
              <label for="inputEmail" class="form-label">Email address</label>
              <input type="email" class="form-control" id="inputEmail" placeholder="alumno@desafio-latam.com"aria-describedby="emailHelp">
              
            </div>
            <div class="mb-3">
              <label for="inputPass" class="form-label">Password</label>
              <input type="password" placeholder="6 dígitos"class="form-control" id="inputPass">
            </div>
            
            <button type="submit" id="btnsubmit"class="btn btn-primary " data-bs-dismiss="modal">Submit</button>
          </form>
        </div>
    </div>
</div>
`
//Formulario de login
document.querySelector('form').addEventListener('submit',async (e)=>{
    e.preventDefault()
    var inputMail=document.getElementById('inputEmail').value
    var inputPass=document.getElementById('inputPass').value
    if(inputMail=='' || inputPass==''){
        alert("Vuelva a intentarlo y complete los datos")
        return
    }
    const JWT =await postData(inputMail, inputPass)
    if(JWT){
        // console.log('token', JWT)
        document.getElementById('accesoChile').className="nav-link "
        document.getElementById('formSesion').className="nav-link d-none"
        document.getElementById('closeSesion').className="nav-link "
        $('#situacionMundial').show()
        situacionchile(JWT)
        $('#chile').hide()
        
    }else{
        alert('Clave y/o contraseña inválida \r Vuelve a intentarlo')
    }
})



const postData =async(email, password)=>{
    try{
        const response= await fetch('http://localhost:3000/api/login',
        {   method: 'POST' ,
            body: JSON.stringify({email:email,password:password})
            })
            const {token}=await response.json()
            localStorage.setItem('jwt-token', token)
            return token
    
    }catch(err){
        console .error( `Error: ${err} ` )
    }
    }

var closesesion=document.getElementById('closeSesion')
closesesion.addEventListener('click',()=>{

    localStorage.clear()
    document.getElementById('accesoChile').className="nav-link d-none "
    document.getElementById('formSesion').className="nav-link "
    document.getElementById('closeSesion').className="nav-link d-none "
    document.getElementById('graficamundial').innerHTML=''
    document.getElementById('tablaDeDatos').innerHTML=''
    
    location.reload()
    $('#situacionMundial').hide()
})

situacionchile=async(jwt)=>{
    //Casos confirmados en chile
    console.log('Cargando datos de chile....')
    $('#loader').show()
    const labels=[]
    const confirmados=[]
    const muertos=[]
    const recuperados=[]
    var incremento=15
    var inicial=0
    try{
        const response= await fetch('http://localhost:3000/api/confirmed' ,
        {
            method: 'GET' ,
            headers: {
                Authorization: `Bearer ${jwt} `
            }
        })
        const {data}=await response.json()
        var labels1=data.map(x=>x.date)        
        for( let i=inicial;i<labels1.length; i=i+incremento){
            if(i>labels1.length){
                break;
            }
            labels.push(labels1[i])
        }
        console.log(`Total de datos:${labels.length}`)
        console.log(`registro cada:${incremento} dias`)
        var confirmados1=data.map(x=>x.total)        
        for( let i=inicial;i<confirmados1.length; i=i+incremento){
            if(i>confirmados1.length){
                break;
            }
            confirmados.push(confirmados1[i])
        }
    } catch(err){
        console.log(`Error al obtener los datos Confirmados en chile :-${err}`)
    }
    //casos muertos en chile
    try{
        const response= await fetch('http://localhost:3000/api/deaths' ,
        {
            method: 'GET' ,
            headers: {
                Authorization: `Bearer ${jwt} `
            }
        })
        const {data}=await response.json()

        var muertos1=data.map(x=>x.total)        
        for( let i=inicial;i<muertos1.length; i=i+incremento){
            if(i>muertos1.length){
                break;
            }
            muertos.push(muertos1[i])
        }
    } catch(err){
        console.log(`Error al obtener los datos de fallecidos en chile :-${err}`)
    }
    //casos recuperados en chile
    try{
        const response= await fetch('http://localhost:3000/api/recovered' ,
        {
            method: 'GET' ,
            headers: {
                Authorization: `Bearer ${jwt} `
            }
        })
        const {data}=await response.json()

        var recuperados1=data.map(x=>x.total)        
        for( let i=inicial;i<recuperados1.length; i=i+incremento){
            if(i>recuperados1.length){
                break;
            }
            recuperados.push(recuperados1[i])
        }
    } catch(err){
        console.log(`Error al obtener los datos de recuperados en chile :-${err}`)
    }

    document.getElementById('chile').innerHTML=`
    <p class='pt-4 text-center fw-bold fs-1'>Situación Chile</p>
    <p class='text-center pb-2  fs-6'>${labels.length} datos obtenidos, con un espaciado de ${incremento} días</p>
    <canvas id="grafchile" class="img-fluid" ></canvas>`

    var graf = document.getElementById('grafchile').getContext("2d")
    var chart =new Chart(graf, {
        type:"line",
        data:{
           labels:labels,
           datasets:[
               
               {
                label:"Casos confirmados",
                backgroundColor:"rgb(255,255,0)",
                data: confirmados,
                fill: false,
                borderColor: 'rgb(255,255,0)',
                tension: 0.1
              },
              {
                label:"Casos muertos",
                backgroundColor:"rgb(192,192,192)",
                data: muertos,
                fill: false,
                borderColor: 'rgb(192, 192, 192)',
                tension: 0.1
              },
              {
                label:"Casos recuperados",
                backgroundColor:"rgb(0,255,255)",
                data:recuperados,
                fill: false,
                borderColor: 'rgb(0, 255, 255)',
                tension: 0.1
              }           
           ] 
        }
    })
    console.log('Datos de chile cargados con éxito')
    $('#loader').hide()
}
var contloader=0
document.getElementById('accesoChile').addEventListener('click',()=>{
    if(contloader>0){
        $('#loader').hide()
    }else{
        $('#loader').show()
        contloader++
    }

    $('#graficamundial').hide()
    $('#tablaDeDatos').hide()
    $('#chile').fadeIn("slow")
       
})
document.getElementById('munmundial').addEventListener('click',()=>{
    $('#chile').fadeOut("slow")
    $('#graficamundial').fadeIn("slow")
    $('#tablaDeDatos').fadeIn("slow")

})
inicioapp()
})
