 export  const API_URL = '';   //aqui se colocaria la api del backend deplecago



export async function apiFecth (endpoint, options = {}){

  const token = localStorage.getItem("token");


  const headers ={
    "Constent-Type": "aplication/json",
    ...(token ? { Authorization })
  }

}