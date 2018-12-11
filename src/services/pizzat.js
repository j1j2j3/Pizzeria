import axios from 'axios'
//const baseUrl = 'http://localhost:3001/pizzat'
//front+backend
const baseUrl = '/api/pizzat'


const getAll = () => {
  const request = axios.get(baseUrl)
  //front+back
  return request.then(response => response.data)
  }

//luonti
const create = (newObject) => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}
//päivitys
const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

export default { getAll, create, update }