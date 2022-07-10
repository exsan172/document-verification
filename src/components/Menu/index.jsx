import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { collection, getDocs, onSnapshot, query, doc, updateDoc, limit, orderBy, where } from "firebase/firestore"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBell, faSignOut } from "@fortawesome/free-solid-svg-icons"
import { db } from "../../config"

const Menu = () => {
    const navigate                          = useNavigate()
    const collectionNotifRef                = collection(db, "notification")
    const [notif, setNotif]                 = useState(false)
    const [listNotif, setListNotif]         = useState([])
    const [name, setName]                   = useState(false)
    const [realtimeNotif, setRealtimeNotif] = useState([])

    useEffect(() => {
        const getName = localStorage.getItem("name")
        setName(getName)

        const getRole       = localStorage.getItem("role")
        const snapshotQuery = query(collectionNotifRef, where("role", "==", `${getRole}`), orderBy("createdAt", "desc"), limit(1));

        onSnapshot(snapshotQuery, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {

                    const latestData = change.doc.data()
                    if(latestData.role === getRole && latestData.isRead === false){
                        
                        let dataNotifExtract = []
                        dataNotifExtract.push(latestData)

                        setRealtimeNotif(dataNotifExtract)
                        setTimeout(() => {
                            setRealtimeNotif([])
                        }, 5000)
                    }

                }
            })

        })

    }, [])

    const getNotification = async () => {
        const getRole = localStorage.getItem("role")
        const data    = query(collectionNotifRef, where("role", "==", `${getRole}`), orderBy("createdAt", "desc"), limit(4))
        const getData = await getDocs(data)
        
        let dataArray = []
        getData.docs.map(doc => (
            dataArray.push({ ...doc.data(), id: doc.id})
        ))
        
        setListNotif(dataArray)
    }

    const showNotification = (val) => {
        setNotif(val)
        if(val === true) {
            getNotification()
        }
    }

    const setNotifRedirect = async (val, id, idLetter, isRead, isFinal) => {
        if(isRead === "false") {
            const notif = doc(db, "notification", id)
            await updateDoc(notif, {
                isRead : true
            })
        }

        setNotif(val)

        if(isFinal === "true") {
            navigate(`spmt/${idLetter}`)
        } else {
            navigate(`review/${idLetter}`)
        }
    }

    const logout = () => {
        localStorage.removeItem("isLogin")
        localStorage.removeItem("role")
        localStorage.removeItem("name")
        navigate("/")
    }

    return (
        <div className="d-flex bg-primary w-100 p-3 justify-content-center sticky-top">
            <div className="d-flex flex-fill">
                <Link to="/home">
                    <span className="text-white">Verifikasi Dokumen</span>
                </Link>
            </div>
            <div className="d-flex">
                <div className="d-none d-md-flex mx-3">
                    <span className="text-white">Hallo, {name}</span>
                </div>
                <div className="d-flex mx-3" onClick={() => showNotification(notif === true ? false : true)} style={{cursor:"pointer"}}>
                    <div className="d-flex align-items-center">
                        <FontAwesomeIcon icon={faBell} size="1x" className="text-white"/>
                    </div>
                    <div className="d-flex align-items-start">
                        <span className="p-1 rounded-circle bg-danger" style={{width:"6px", height:"6px"}}></span>
                    </div>
                </div>
                <div className="d-none d-md-flex mx-2 align-items-center" onClick={() => logout()}>
                    <FontAwesomeIcon icon={faSignOut} size="1x" className="text-white"/>
                </div>
            </div>
            {
                notif === true &&
                <div className="d-flex bg-white p-3 shadow border flex-column" style={{position:"absolute", top:"60px", right: "10px", width:"300px"}}>
                    {
                        listNotif.length > 0 ?
                            listNotif.map((dta, i) => {
                                return (
                                    <div key={dta.id} className="text-decoration-none text-dark" onClick={() => setNotifRedirect(false, `${dta.id}`, `${dta.idLetter}`, `${dta.isRead}`, `${dta.isFinal !== null ? dta.isFinal : "false"}`)}>
                                        <div className={`d-flex align-items-center my-2 ${listNotif.length-1 === i ? "" : "border-bottom pb-3"}`} style={{cursor:"pointer"}}>
                                            <div className="d-flex mx-2 mx-md-3">
                                                <span className={`p-1 rounded-circle ${dta.isRead === true ? "bg-secondary" : "bg-danger"}`} style={{width:"6px", height:"6px"}}></span>
                                            </div>
                                            <div className="d-flex flex-column">
                                                <div className="d-flex">
                                                    <span className="fw-bold fs-6">Pemberitahuan !</span>
                                                </div>
                                                <div className="d-flex">
                                                    <span style={{fontSize:"small"}}>{dta.textNotif}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        :
                            <div className="d-flex align-items-center justify-content-center my-2 py-3 ">
                                <span>Belum ada notifikasi.</span>
                            </div>
                    }
                </div>
            }

            {
                notif === false &&
                    <div className="d-flex bg-white flex-column" style={{position:"absolute", top:"60px", right: "10px", width:"300px"}}>
                        {
                            realtimeNotif.length > 0 &&
                                realtimeNotif.map(realtime => {
                                    return (
                                        <div className={`d-flex align-items-center my-2 shadow border p-3`} style={{cursor:"pointer"}} key={realtime.id} onClick={() => showNotification(notif === true ? false : true)}>
                                            <div className="d-flex mx-2 mx-md-3">
                                                <span className={`p-1 rounded-circle bg-danger`} style={{width:"6px", height:"6px"}}></span>
                                            </div>
                                            <div className="d-flex flex-column">
                                                <div className="d-flex">
                                                    <span className="fw-bold fs-6">Pemberitahuan !</span>
                                                </div>
                                                <div className="d-flex">
                                                    <span style={{fontSize:"small"}}>{realtime.textNotif}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                        }
                    </div>
            }
        </div>
    )
}

export default Menu