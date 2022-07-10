import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperPlane, faCloudArrowUp } from "@fortawesome/free-solid-svg-icons"
import { v4 } from "uuid"
import { db, storage } from "../../config"
import { collection, addDoc } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import "./style.css"

const FormPengajuan = () => {
    const formCollectionRef                                     = collection(db, "letter")
    const notifCollectionRef                                    = collection(db, "notification")
    const [progress, setProgress]                               = useState(0)
    const [loading, setLoading]                                 = useState(false)
    const [file, setFile]                                       = useState("")
    const [namaBidang, setNamaBidang]                           = useState("")
    const [namaKepalaBidang, setNamaKepalaBidang]               = useState("")
    const [nipKepalaBidang, setNipKepalaBidang]                 = useState("")
    const [namaKepalaSeleksi, setNamaKepalaSeleksi]             = useState("")
    const [nipKepalaSeleksi, setNipKepalaSeleksi]               = useState("")
    const [kodeProgram, setKodeProgram]                         = useState("")
    const [namaProgram, setNamaProgram]                         = useState("")
    const [kodeSubKegiatan, setKodeSubKegiatan]                 = useState("")
    const [namaSubKegiatan, setNamaSubKegiatan]                 = useState("")
    const [kodeRincianSubKegiatan, setKodeRincianSubKegiatan]   = useState("")
    const [namaRincianSubKegiatan, setNamaRincianSubKegiatan]   = useState("")
    const [kodeRekening, setKodeRekening]                       = useState("")
    const [namaPaketDitagih, setNamaPaketDitagih]               = useState("")
    const [nomorKontrak, setNomorKontrak]                       = useState("")
    const [nilaiKontrak, setNilaiKontak]                        = useState("")
    const [nilaiDitagih, setNilaiDitagih]                       = useState("")
    const [tahunAngaran, setTahunAngaran]                       = useState("")

    const sendForm = async () => {
        setLoading(true)
        if(file !== "" && namaBidang !== "" && namaKepalaBidang !== "" && nipKepalaBidang !== "" && namaKepalaSeleksi !== "" && nipKepalaSeleksi !== "" && kodeProgram !== "" && namaProgram !== "" && kodeSubKegiatan !== "" && namaSubKegiatan !== "" && kodeRincianSubKegiatan !== "" && namaRincianSubKegiatan !== "" && nomorKontrak !== "" && nilaiKontrak !== "" && nilaiDitagih !== "" && tahunAngaran !== "") {
            try {

                const storageRef = ref(storage, `/pdf/document-${v4()}`)
                const uploadTask = uploadBytesResumable(storageRef, file)
                const getName    = localStorage.getItem("name")

                uploadTask.on("state_changed", snapshot => {
                    const progress = Math.round(snapshot.bytesTransferred/snapshot.totalBytes*100)
                    setProgress(progress)
                    
                }, err => {
                    alert("Gagal melakukan pengajuan, coba lagi!")
                    setLoading(false)

                }, async () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async url => {
                        const dataToPost = {
                            pdfUrl              : url,
                            isVerify            : "waiting",
                            isSpmtCreated       : false,
                            createdAt           : new Date(),
                            fileName            : storageRef.name,
                            textReviewer        : "",
                            textBendahara       : "",
                            namaBidang          : namaBidang,
                            namaKepalaBidang    : namaKepalaBidang,
                            nipKepalaBidang     : nipKepalaBidang,
                            namaKepalaSeleksi   : namaKepalaSeleksi,
                            nipKepalaSeleksi    : nipKepalaSeleksi,
                            kodeProgram         : kodeProgram,
                            namaProgram         : namaProgram,
                            kodeSubKegiatan     : kodeSubKegiatan,
                            namaSubKegiatan     : namaSubKegiatan,
                            kodeRincianSubKegiatan : kodeRincianSubKegiatan,
                            namaRincianSubKegiatan : namaRincianSubKegiatan,
                            kodeRekening        : kodeRekening,
                            namaPaketDitagih    : namaPaketDitagih,
                            nomorKontrak        : nomorKontrak,
                            nilaiKontrak        : nilaiKontrak,
                            nilaiDitagih        : nilaiDitagih,
                            tahunAngaran        : tahunAngaran
                        }
        
                        
                        const letter = await addDoc(formCollectionRef, dataToPost)
                        const notifData = {
                            idLetter : letter.id,
                            isRead   : false,
                            role     : "verificator",
                            textNotif: `${getName} telah mengajukan dokumen, periksa sakarang.`,
                            createdAt: Date.now()
                        }
        
                        await addDoc(notifCollectionRef, notifData)
                        alert("Sukses melakukan pengajuan, tunggu beberapa saat hinga verifikator menyetujui!")
        
                        setFile("")
                        setNamaBidang("")
                        setNamaKepalaBidang("")
                        setNipKepalaBidang("")
                        setNamaKepalaSeleksi("")
                        setNipKepalaSeleksi("")
                        setKodeProgram("")
                        setNamaProgram("")
                        setKodeSubKegiatan("")
                        setNamaSubKegiatan("")
                        setKodeRekening("")
                        setNamaPaketDitagih("")
                        setNomorKontrak("")
                        setNilaiKontak("")
                        setNilaiDitagih("")
                        setTahunAngaran("")
                        setKodeRincianSubKegiatan("")
                        setNamaRincianSubKegiatan("")
                        setLoading(false)
                    })
                })

            } catch (error) {
                alert("Gagal melakukan pengajuan, coba lagi!")
                setLoading(false)
            }
        } else {
            alert("Isi semua isian yang di sediakan !")
            setLoading(false)
        }
    }

    return (
        <div className="d-flex flex-fill my-5 flex-column align-items-center">
            <div className="col-10 col-md-5 col-lg-4">
                <div className="d-flex justify-content-center flex-fill mb-5">
                    <h2>Form Pengajuan Dokumen</h2>
                </div>
                <div className="d-flex my-4 w-100">
                    <div className="image-upload w-100">
                        <label className="w-100" htmlFor="file-input">
                            <div className="d-flex align-items-center w-100 flex-column">
                                <div className="d-lfex">
                                    <FontAwesomeIcon icon={faCloudArrowUp} size="3x"/>
                                </div>
                                <div className="d-flex mt-2">
                                    <span>{file !== "" ? file.name : "Upload file PDF"}</span>
                                </div>
                            </div>
                        </label>
                        <input type="file" id="file-input" onChange={(e) => setFile(e.target.files[0])}/>
                    </div>
                </div>
                {
                    loading === true &&
                    <div className="d-flex flex-fill">
                        <div className="progress w-100">
                            <div className="progress-bar progress-bar-striped" role="progressbar" style={{width: progress+"%"}} aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                }
                <div className="d-flex my-3">
                    <input type="text" placeholder="Masukan nama bidang" className="border w-100 px-3 py-2" onChange={(e) => setNamaBidang(e.target.value)} value={namaBidang}/>
                </div>
                <div className="d-flex my-3">
                    <input type="text" placeholder="Masukan nama kepala bidang" className="border w-100 px-3 py-2" onChange={(e) => setNamaKepalaBidang(e.target.value)} value={namaKepalaBidang}/>
                </div>
                <div className="d-flex my-3">
                    <input type="number" placeholder="Masukan NIP kepala bidang" className="border w-100 px-3 py-2" onChange={(e) => setNipKepalaBidang(e.target.value)} value={nipKepalaBidang}/>
                </div>
                <div className="d-flex my-3">
                    <input type="text" placeholder="Masukan nama kepala seleksi/PPTK" className="border w-100 px-3 py-2" onChange={(e) => setNamaKepalaSeleksi(e.target.value)} value={namaKepalaSeleksi}/>
                </div>
                <div className="d-flex my-3">
                    <input type="number" placeholder="Masukan NIP kepala seleksi/PPTK" className="border w-100 px-3 py-2" onChange={(e) => setNipKepalaSeleksi(e.target.value)} value={nipKepalaSeleksi}/>
                </div>
                <div className="d-flex my-3">
                    <input type="number" placeholder="Masukan kode program" className="border w-100 px-3 py-2" onChange={(e) => setKodeProgram(e.target.value)} value={kodeProgram}/>
                </div>
                <div className="d-flex my-3">
                    <input type="text" placeholder="Masukan nama program" className="border w-100 px-3 py-2" onChange={(e) => setNamaProgram(e.target.value)} value={namaProgram}/>
                </div>
                <div className="d-flex my-3">
                    <input type="number" placeholder="Masukan kode sub kegiatan" className="border w-100 px-3 py-2" onChange={(e) => setKodeSubKegiatan(e.target.value)} value={kodeSubKegiatan}/>
                </div>
                <div className="d-flex my-3">
                    <input type="text" placeholder="Masukan nama sub kegiatan" className="border w-100 px-3 py-2" onChange={(e) => setNamaSubKegiatan(e.target.value)} value={namaSubKegiatan}/>
                </div>
                <div className="d-flex my-3">
                    <input type="number" placeholder="Masukan kode rincian sub kegiatan" className="border w-100 px-3 py-2" onChange={(e) => setKodeRincianSubKegiatan(e.target.value)} value={kodeRincianSubKegiatan}/>
                </div>
                <div className="d-flex my-3">
                    <input type="text" placeholder="Masukan nama rincian sub kegiatan" className="border w-100 px-3 py-2" onChange={(e) => setNamaRincianSubKegiatan(e.target.value)} value={namaRincianSubKegiatan}/>
                </div>
                <div className="d-flex my-3">
                    <input type="number" placeholder="Masukan kode rekening" className="border w-100 px-3 py-2" onChange={(e) => setKodeRekening(e.target.value)} value={kodeRekening}/>
                </div>
                <div className="d-flex my-3">
                    <input type="text" placeholder="Masukan nama paket yang di tagih" className="border w-100 px-3 py-2" onChange={(e) => setNamaPaketDitagih(e.target.value)} value={namaPaketDitagih}/>
                </div>
                <div className="d-flex my-3">
                    <input type="number" placeholder="Masukan nomor kontrak/SPK" className="border w-100 px-3 py-2" onChange={(e) => setNomorKontrak(e.target.value)} value={nomorKontrak}/>
                </div>
                <div className="d-flex my-3">
                    <input type="number" placeholder="Masukan nilai kontrak/SPK" className="border w-100 px-3 py-2" onChange={(e) => setNilaiKontak(e.target.value)} value={nilaiKontrak}/>
                </div>
                <div className="d-flex my-3">
                    <input type="number" placeholder="Masukan nilai yang di tagih" className="border w-100 px-3 py-2" onChange={(e) => setNilaiDitagih(e.target.value)} value={nilaiDitagih}/>
                </div>
                <div className="d-flex my-3">
                    <input type="number" placeholder="Masukan tahun angaran" className="border w-100 px-3 py-2" onChange={(e) => setTahunAngaran(e.target.value)} value={tahunAngaran}/>
                </div>
                <div className="d-flex my-4">
                    <button className="btn btn-primary w-100 p-2" onClick={() => sendForm()}>
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
                                    <FontAwesomeIcon icon={faPaperPlane} size="1x"/>
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
    )
}

export default FormPengajuan