const postData = async() => {
    try {
        const response = await fetch('http://localhost:3000/api/total')
        const { data } = await response.json()
        return data
    } catch (err) {
        console.error(`Error: ${err} `)
    }
}
var llenartabla=async (data)=>{
   try{
    $('#loader').show()
    var datos=await data
    //Filtrar datos confirmados
    var datosPaises= datos.filter(el => el.confirmed>100000)
    var tablaDeDatos=document.getElementById('tablaDeDatos')
    var tabla=document.createElement('table')
    tabla.className="table table-striped table-hover table-bordered"
    var thead=document.createElement('thead')
    thead.className="sticky-top"
    var tbody=document.createElement('tbody')
    tbody.className=""
    var tr=document.createElement('tr')
    var th=document.createElement('th')
    th.innerHTML="N°"
    th.className="colNum"
    tr.appendChild(th)
    var th=document.createElement('th')
    th.className="colPais"
    th.innerHTML="País"
    tr.appendChild(th)
    var th=document.createElement('th')
    th.className="colConfirm"
    th.innerHTML="Confirmados"
    tr.appendChild(th)
    var th=document.createElement('th')
    th.className="colMuertos"
    th.innerHTML="Fallecidos"
    tr.appendChild(th)
    var th=document.createElement('th')
    th.className="colRec"
    th.innerHTML="Recuperados"
    tr.appendChild(th)
    var th=document.createElement('th')
    th.className="colActives"
    th.innerHTML="Activos"
    tr.appendChild(th)
    var th=document.createElement('th')
    th.innerHTML="Acción"
    th.className="colAccion"
    tr.appendChild(th)

    thead.appendChild(tr)
    tabla.appendChild(thead)
    tablaDeDatos.appendChild(tabla)
    datosPaises.forEach((el, index)=>{
        var tr =document.createElement('tr')
        var td= document.createElement('td')
        td.innerHTML=(index+1)
        td.className="colNum"
        tr.appendChild(td)
        var td= document.createElement('td')
        td.className="colPais"
        td.innerHTML=el.location
        tr.appendChild(td)
        var td= document.createElement('td')
        td.className="colConfirm"
        td.innerHTML=el.confirmed
        tr.appendChild(td)
        var td= document.createElement('td')
        td.className="colMuertos"
        td.innerHTML=el.deaths
        tr.appendChild(td)
        var td= document.createElement('td')
        td.className="colRec"
        td.innerHTML=el.recovered
        tr.appendChild(td)
        var td= document.createElement('td')
        td.className="colActives"
        td.innerHTML=el.active
        tr.appendChild(td)
        var td=document.createElement('td')
        td.className="colAccion"
        var btnInfo = document.createElement('button')
        btnInfo.className="btn btn-outline-info"
        btnInfo.innerHTML="Ver detalle"
        btnInfo.setAttribute("onclick", `modalbtn("${el.location}")`)
        btnInfo.setAttribute('data-bs-toggle','modal')
        btnInfo.setAttribute('data-bs-target','#exampleModal')
        btnInfo.style.width="100%"
        td.appendChild(btnInfo)
        tr.appendChild(td)
        tbody.appendChild(tr)
    })
    tabla.appendChild(tbody)
    var contmo =document.getElementById('contMo')
    contmo.innerHTML=`
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content d-flex" id="contenidoModal">
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                <canvas id="grafpais" ></canvas>
            </div>
        </div>
    </div>
    `
    $('#loader').hide()
    
   } catch (error) {
       console.error(`Error: ${error}`)
   }
}
llenartabla(postData());

async function modalbtn(nacion){
    var intMo =document.getElementById('contenidoModal')
    intMo.innerHTML=` 
    <button type="button" class="btn-close  ms-auto" data-bs-dismiss="modal" aria-label="Close"></button>
      <canvas id="grafpais" ></canvas>
    `
    const response = await fetch(`http://localhost:3000/api/countries/${nacion}`)
    const { data } = await response.json()
    // console.log(nacion)
    // console.log(data)
    var graf = document.getElementById('grafpais').getContext("2d")
    var chart =new Chart(graf, {
        type:"bar",
        data:{
           labels:[nacion],
           datasets:[
               {
                 label:"Casos activos",
                 backgroundColor:"rgb(255,0,0)",
                 data:[data.active]
               },
               {
                label:"Casos confirmados",
                backgroundColor:"rgb(255,255,0)",
                data:[data.confirmed]
              },
              {
                label:"Casos muertos",
                backgroundColor:"rgb(192,192,192)",
                data:[data.deaths]
              },
              {
                label:"Casos recuperados",
                backgroundColor:"rgb(0,255,255)",
                data:[data.recovered]
              }
           
           ] 
        }
    })
}

//situacion mundial; grafica situación de Paises con covid19
async function mundial(){
    try{
      $('#loader').show()
    const grafmunDiv=document.getElementById('graficamundial')
    grafmunDiv.innerHTML=`
    <h1 id="paisesdelmundo"class='p-4 text-center fw-bold fs-1'>Paises con Covid19</h1>
    <canvas id="grafmundo" class="img-fluid" ></canvas>`
    const response = await fetch(`http://localhost:3000/api/total`)
    const { data } = await response.json()    
    datos=data.filter(x=>x.confirmed>2000000)
    var nompaises=datos.map(x=>x.location)
    var datosActivos=datos.map(el=>el.active)
    var datosConfirmados=datos.map(el=>el.confirmed)
    var datosMuertos=datos.map(el=>el.deaths)
    var datosRecuperados=datos.map(el=>el.recovered)
    var graf = document.getElementById('grafmundo').getContext("2d")
    var chart =new Chart(graf, {
        type:"bar",
        data:{
           labels:nompaises,
           datasets:[
               {
                 label:"Casos activos",
                 backgroundColor:"rgb(255,0,0)",
                 data: datosActivos
               },
               {
                label:"Casos confirmados",
                backgroundColor:"rgb(255,255,0)",
                data: datosConfirmados
              },
              {
                label:"Casos muertos",
                backgroundColor:"rgb(192,192,192)",
                data: datosMuertos
              },
              {
                label:"Casos recuperados",
                backgroundColor:"rgb(0,255,255)",
                data:datosRecuperados
              }           
           ] 
        }
    })
    }catch(err){
        alert("Ha ocurrido un error al procesar los datos")
        console.log(`Error: ${err}`)
    }
    $('#loader').hide()
}
mundial()