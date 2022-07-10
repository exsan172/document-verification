import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { getDocs, collection, query, where } from "firebase/firestore"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSignIn } from "@fortawesome/free-solid-svg-icons"
import { db } from "../../config"

const Login = () => {
    const collectionUserRef= collection(db, "users")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading]   = useState(false)
    const navigate = useNavigate()

    const loginUser = async () => {
        if(password !== "" && username !== "") {
            try {
                setLoading(true)
                const querys = query(collectionUserRef, where("username", "==", `${username}`))
                const data   = await getDocs(querys)
    
                let dataArray = []
                data.docs.map((doc) => (
                    dataArray.push({ ...doc.data(), id: doc.id})
                ))
                
                if(dataArray.length > 0) {
                    
                    let dataLogin = []
                    dataArray.forEach((dt) => {
                        if(dt.password === password){
                            dataLogin.push(dt)
                        }
                    })
    
                    if(dataLogin.length > 0) {
                        localStorage.setItem("isLogin", "true")
                        localStorage.setItem("role", dataLogin[0].role)
                        localStorage.setItem("name", dataLogin[0].name)
                        navigate("/home")
    
                    } else {
                        alert("Username atau password anda salah !")    
                    }
                } else {
                    alert("Username atau password anda salah !")    
                }
                
                setLoading(false)

            } catch (error) {
                alert("Gagal login, coba lagi nanti!")
                setLoading(false)
            }
        } else {
            alert("Pastikan isi semua isian yang di sediakan!")
        }
    }

    return (
        <div className="d-flex justify-content-center">
            <div className="col-10 col-md-4 col-lg-3 border shadow p-4 mt-5">
                <div className="d-flex w-100 flex-column">
                    <div className="d-flex justify-content-center w-100 mb-3">
                        <h3>Login</h3>
                    </div>
                    <div className="d-flex flex-column">
                        <div className="d-flex my-2">
                            <input type="text" placeholder="Masukan username .." className="py-2 w-100 border rounded px-3" onChange={(e) => setUsername(e.target.value)} value={username}/>
                        </div>
                        <div className="d-flex my-2">
                            <input type="password" placeholder="Masukan password .." className="py-2 w-100 border rounded px-3" onChange={(e) => setPassword(e.target.value)} value={password}/>
                        </div>
                        <div className="d-flex mt-3">
                            <button className="w-100 p-2 border bg-primary text-white rounded" onClick={() => loginUser()}>
                                <div className="d-flex justify-content-center align-items-center">
                                    {
                                        loading === true ?
                                        <div className="d-flex mx-2">
                                            <div className="spinner-border text-light spinner-border-sm" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                        :
                                        <div className="d-flex mx-2">
                                            <FontAwesomeIcon icon={faSignIn} size="1x"/>
                                        </div>
                                    }
                                    <div className="d-flex">
                                        <span>Kirim</span>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login