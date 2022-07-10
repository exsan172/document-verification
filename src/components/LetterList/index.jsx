import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { getDocs, collection, query, limit, orderBy } from "firebase/firestore"
import { db } from "../../config"

const LetterList = () => {
    const letterCollection            = collection(db, "letter")
    const [dataLetter, setDataLetter] = useState([])

    useEffect(() => {
        const getList = async () => {
            let dataArray = []
            const queryList = query(letterCollection, limit(20), orderBy("createdAt", "desc"))
            const data = await getDocs(queryList)
            data.docs.map((doc) => (
                dataArray.push({ ...doc.data(), id: doc.id})
            ))

            console.log("dataArray => ", dataArray);
            setDataLetter(dataArray)
        }

        getList()
    }, [])
    
    return (
        <div className="d-flex w-100 flex-column align-items-center">
            <div className="d-flex my-4">
                <h2>List Pengajuan</h2>
            </div>
            <div className="col-11 col-md-6 mt-3">
                <div className="d-flex w-100 flex-column">
                    <div className="row mx-0 w-100 border-bottom pb-2 mb-2">
                        <div className="col-4">
                            <b>Kode ID</b>
                        </div>
                        <div className="col-4">
                            <b>Status</b>
                        </div>
                        <div className="col-4 px-0">
                            <b>Action</b>
                        </div>
                    </div>
                    {
                        dataLetter.length > 0 ?
                            dataLetter.map(list => {
                                return (
                                    <div className="row mx-0 w-100" style={{color:"gray"}}>
                                        <div className="col-4 text-truncate">
                                            <span>{list.id}</span>
                                        </div>
                                        <div className="col-4">
                                            <span>{list.isVerify === true ? "Setuju" : list.isVerify === "waiting" ? "Menungu" : "Ditolak"}</span>
                                        </div>
                                        <div className="col-4 px-0">
                                            <Link to={`review/${list.id}`} className="text-decoration-none" style={{color:"gray"}}>
                                                Lihat detail &nbsp;
                                                <FontAwesomeIcon icon={faArrowRight}/>
                                            </Link>
                                        </div>
                                    </div>
                                )
                            })
                        :
                            <div className="d-flex justify-content-center my-3">
                                <span>Data belum tersedia.</span>
                            </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default LetterList