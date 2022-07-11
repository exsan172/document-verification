import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFilePdf, faCheck, faTimes, faPencil, faCloudArrowUp, faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { useParams, useNavigate } from "react-router-dom"
import { getDoc, doc, updateDoc, addDoc, collection } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytesResumable, deleteObject } from "firebase/storage"
import { v4 } from "uuid"
import Modal from 'react-bootstrap/Modal';
import { db, storage } from "../../config"
import "./style.css"

const Review = () => {
    const navigate                                              = useNavigate()
    const { id }                                                = useParams()
    const spmtCollection                                        = collection(db, "spmt")
    const notifCollection                                       = collection(db, "notification")
    const detailLetter                                          = doc(db, "letter", id)
    const formCollectionRef                                     = doc(db, "letter", id)
    const [dataReview, setData]                                 = useState([])
    const [show, setShow]                                       = useState(false)
    const [showEdit, setShowEdit]                               = useState(false)
    const [penolakan, setPenolakan]                             = useState("")
    const [role, setRole]                                       = useState("")
    const [loadingSetuju, setLoadingSetuju]                     = useState(false)
    const [loadingDitolak, setLoadingDitolak]                   = useState(false)
    const [loadingBuatSpmt, setLoadingBuatSpmt]                 = useState(false)
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

    const handleClose = () => {
        setShow(false);
        setPenolakan("")
    }

    const handleCloseEdit = () => {
        setShowEdit(false);
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
        // setLoading(false)
    }

    const handleShow = () => {
        setShow(true);
        setPenolakan("")
    }

    const handleShowEdit = () => {
        setShowEdit(true);
        setNamaBidang(dataReview.namaBidang)
        setNamaKepalaBidang(dataReview.namaKepalaBidang)
        setNipKepalaBidang(dataReview.nipKepalaBidang)
        setNamaKepalaSeleksi(dataReview.namaKepalaSeleksi)
        setNipKepalaSeleksi(dataReview.nipKepalaSeleksi)
        setKodeProgram(dataReview.kodeProgram)
        setNamaProgram(dataReview.namaProgram)
        setKodeSubKegiatan(dataReview.kodeSubKegiatan)
        setNamaSubKegiatan(dataReview.namaSubKegiatan)
        setKodeRekening(dataReview.kodeRekening)
        setNamaPaketDitagih(dataReview.namaPaketDitagih)
        setNomorKontrak(dataReview.nomorKontrak)
        setNilaiKontak(dataReview.nilaiKontrak)
        setNilaiDitagih(dataReview.nilaiDitagih)
        setTahunAngaran(dataReview.tahunAngaran)
        setKodeRincianSubKegiatan(dataReview.kodeRincianSubKegiatan)
        setNamaRincianSubKegiatan(dataReview.namaRincianSubKegiatan)
        
    }

    useEffect(() => {
        const getRole = localStorage.getItem("role")
        setRole(getRole)
        const getDetailData = async () => {
            try {
                
                const data = await getDoc(detailLetter)
                setData(data.data())
                
            } catch (error) {
                alert("Gagal mengambil data, refresh halaman.")
            }
        }
        
        getDetailData()
    }, [detailLetter])
    

    const setujuiDokumen = async () => {
        try {
            setLoadingSetuju(true)
            await updateDoc(detailLetter, {
                isVerify : true
            })
    
            await addDoc(notifCollection, {
                idLetter : id,
                isRead   : false,
                role     : "user",
                textNotif: `Verificator telah menyetujui dokumen anda, dokumen akan di teruskan ke bendahara.`,
                createdAt: Date.now()
            })
    
            await addDoc(notifCollection, {
                idLetter : id,
                isRead   : false,
                role     : "bendahara",
                textNotif: `Verificator telah menyetujui dokumen, periksa dan ajukan surat SPMT ke pimpinan sekarang.`,
                createdAt: Date.now()
            })
            
            alert("Sukses menyetujui dokumen, notifikasi akan di kirimkan ke user dan bendahara.")
            setLoadingSetuju(false)

        } catch (error) {
            alert("Gagal menyetujui dokumen, coba lagi.")
            setLoadingSetuju(false)
        }
    }

    const tolakDokumenMessage = async () => {
        try {
            setLoadingDitolak(true)
            await updateDoc(detailLetter, {
                textReviewer : penolakan,
                isVerify : false
            })

            await addDoc(notifCollection, {
                idLetter : id,
                isRead   : false,
                role     : "user",
                textNotif: `Verificator telah menolak dokumen anda, perbaiki dokumen anda. berikut detailnya "${penolakan}"`,
                createdAt: Date.now()
            })

            handleClose()
            alert("Sukses menolak dokumen, notifikasi akan di kirimkan ke user.")
            setLoadingDitolak(false)

        } catch (error) {
            handleClose()
            alert("Gagal menolak dokumen, coba lagi.")
            setLoadingDitolak(false)
        }
    }

    const createSPTM = async () => {
        try {
            setLoadingBuatSpmt(true)
            await updateDoc(detailLetter, {
                isSpmtCreated : true
            })

            const smpt = await addDoc(spmtCollection, {
                nomor                   : v4(),
                isAprove                : "waiting",
                createdAt               : new Date(),
                namaBidang              : dataReview.namaBidang,
                namaKepalaBidang        : dataReview.namaKepalaBidang,
                nipKepalaBidang         : dataReview.nipKepalaBidang,
                namaKepalaSeleksi       : dataReview.namaKepalaSeleksi,
                nipKepalaSeleksi        : dataReview.nipKepalaSeleksi,
                kodeProgram             : dataReview.kodeProgram,
                namaProgram             : dataReview.namaProgram,
                kodeSubKegiatan         : dataReview.kodeSubKegiatan,
                namaSubKegiatan         : dataReview.namaSubKegiatan,
                kodeRincianSubKegiatan  : dataReview.kodeRincianSubKegiatan,
                namaRincianSubKegiatan  : dataReview.namaRincianSubKegiatan,
                kodeRekening            : dataReview.kodeRekening,
                namaPaketDitagih        : dataReview.namaPaketDitagih,
                nomorKontrak            : dataReview.nomorKontrak,
                nilaiKontrak            : dataReview.nilaiKontrak,
                nilaiDitagih            : dataReview.nilaiDitagih,
                tahunAngaran            : dataReview.tahunAngaran
            })

            await addDoc(notifCollection, {
                idLetter : id,
                isRead   : false,
                role     : "user",
                textNotif: `Bendahara telah membuat surat SPMT, sedang menungu persetujuan pimpinan.`,
                createdAt: Date.now()
            })
    
            await addDoc(notifCollection, {
                idLetter : smpt.id,
                isFinal  : true,
                isRead   : false,
                role     : "pimpinan",
                textNotif: `Bendahara telah membuat surat SPMT, periksa dan cetak.`,
                createdAt: Date.now()
            })

            setLoadingBuatSpmt(false)
            navigate(`../spmt/${smpt.id}`)
        } catch (error) {
            alert("Gagal membuat surat SPTM, coba lagi!")
            setLoadingBuatSpmt(false)
        }
    }

    const moveToHome = () => {
        navigate("/home")
    }

    const perbaruiPengajuan = async () => {
        if(namaBidang !== "" && namaKepalaBidang !== "" && nipKepalaBidang !== "" && namaKepalaSeleksi !== "" && nipKepalaSeleksi !== "" && kodeProgram !== "" && namaProgram !== "" && kodeSubKegiatan !== "" && namaSubKegiatan !== "" && kodeRincianSubKegiatan !== "" && namaRincianSubKegiatan !== "" && nomorKontrak !== "" && nilaiKontrak !== "" && nilaiDitagih !== "" && tahunAngaran !== "") {
            setLoading(true)
            try {
                if(file !== "") {
                    const delFilePdf = ref(storage, `/pdf/${dataReview.fileName}`);
                    await deleteObject(delFilePdf)

                    const storageRef = ref(storage, `/pdf/document-${v4()}`)
                    const uploadTask = uploadBytesResumable(storageRef, file)
    
                    uploadTask.on("state_changed", snapshot => {
                        const progress = Math.round(snapshot.bytesTransferred/snapshot.totalBytes*100)
                        setProgress(progress)
                        
                    }, err => {
                        alert("Gagal melakukan pembaruan pengajuan, coba lagi!")
                        setLoading(false)
                    }, async () => {
                        getDownloadURL(uploadTask.snapshot.ref).then(async link => {
                            const dataToPost = {
                                pdfUrl                  : link,
                                fileName                : storageRef.name,
                                namaBidang              : namaBidang,
                                namaKepalaBidang        : namaKepalaBidang,
                                nipKepalaBidang         : nipKepalaBidang,
                                namaKepalaSeleksi       : namaKepalaSeleksi,
                                nipKepalaSeleksi        : nipKepalaSeleksi,
                                kodeProgram             : kodeProgram,
                                namaProgram             : namaProgram,
                                kodeSubKegiatan         : kodeSubKegiatan,
                                namaSubKegiatan         : namaSubKegiatan,
                                kodeRincianSubKegiatan  : kodeRincianSubKegiatan,
                                namaRincianSubKegiatan  : namaRincianSubKegiatan,
                                kodeRekening            : kodeRekening,
                                namaPaketDitagih        : namaPaketDitagih,
                                nomorKontrak            : nomorKontrak,
                                nilaiKontrak            : nilaiKontrak,
                                nilaiDitagih            : nilaiDitagih,
                                tahunAngaran            : tahunAngaran
                            }
                            
                            await updateDoc(formCollectionRef, dataToPost)
                        })
                    })
                    
                } else {
                    const dataToPost = {
                        namaBidang              : namaBidang,
                        namaKepalaBidang        : namaKepalaBidang,
                        nipKepalaBidang         : nipKepalaBidang,
                        namaKepalaSeleksi       : namaKepalaSeleksi,
                        nipKepalaSeleksi        : nipKepalaSeleksi,
                        kodeProgram             : kodeProgram,
                        namaProgram             : namaProgram,
                        kodeSubKegiatan         : kodeSubKegiatan,
                        namaSubKegiatan         : namaSubKegiatan,
                        kodeRincianSubKegiatan  : kodeRincianSubKegiatan,
                        namaRincianSubKegiatan  : namaRincianSubKegiatan,
                        kodeRekening            : kodeRekening,
                        namaPaketDitagih        : namaPaketDitagih,
                        nomorKontrak            : nomorKontrak,
                        nilaiKontrak            : nilaiKontrak,
                        nilaiDitagih            : nilaiDitagih,
                        tahunAngaran            : tahunAngaran
                    }
                    
                    await updateDoc(formCollectionRef, dataToPost)
                }
                
                const getName   = localStorage.getItem("name")
                const notifData = {
                    idLetter : id,
                    isRead   : false,
                    role     : "verificator",
                    textNotif: `${getName} telah memperbarui dokumen, periksa sakarang.`,
                    createdAt: Date.now()
                }

                await addDoc(notifCollection, notifData)
                await updateDoc(detailLetter, {
                    isVerify : "waiting"
                })
                alert("Sukses melakukan pembaruan pengajuan, tunggu beberapa saat hinga verifikator menyetujui!")
                setLoading(false)
                handleCloseEdit()

            } catch (error) {
                alert("Gagal melakukan pengajuan, coba lagi!")
                setLoading(false)
            }
        } else {
            alert("Isi semua isian yang di sediakan !")
        }
    }

    return (
        <>
            {
                dataReview !== null ?
                    <div className="d-flex flex-fill flex-column align-items-center">
                        <div className="d-flex my-5">
                            <h2>Review Dokumen</h2>
                        </div>
                        <div className="d-flex my-4">
                            <a href={dataReview.pdfUrl} target="_blank" rel="noreferrer">
                                <button className="px-4 py-2 bg-primary text-white border-0 rounded">
                                    <div className="d-flex">
                                        <div className="d-flex mx-3">
                                            <FontAwesomeIcon icon={faFilePdf} size="lg"/>
                                        </div>
                                        <div className="d-flex">
                                            Lihat dokumen
                                        </div>
                                    </div>
                                </button>
                            </a>
                        </div>
                        <div className="d-flex my-4 w-100 justify-content-center">
                            <div className="col-11 col-md-6">
                                {
                                    dataReview.isVerify === false &&
                                    <>
                                        <div className="d-flex flex-fill mb-2 border-bottom pb-2">
                                            <b>Detail Perbaikan : </b>
                                        </div>
                                        <div className="d-flex mb-5">
                                            <sapan>- {dataReview.textReviewer}</sapan>
                                        </div>
                                        <div className="d-flex flex-fill mb-4 border-bottom pb-2">
                                            <b>Detail Pengajuan : </b>
                                        </div>
                                    </>
                                }

                                <div className="d-flex flex-fill my-2 flex-column">
                                    <div className="d-flex flex-column my-2">
                                        <div className="d-flex">
                                            <span className="fw-semibold">#Nama bidang</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>- {dataReview.namaBidang}</span>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column my-2">
                                        <div className="d-flex">
                                            <span className="fw-semibold">#Nama kepala bidang</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>- {dataReview.namaKepalaBidang}</span>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column my-2">
                                        <div className="d-flex">
                                            <span className="fw-semibold">#NIP kepala bidang</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>- {dataReview.nipKepalaBidang}</span>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column my-2">
                                        <div className="d-flex">
                                            <span className="fw-semibold">#Nama kepala seksi/PPTK</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>- {dataReview.namaKepalaSeleksi}</span>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column my-2">
                                        <div className="d-flex">
                                            <span className="fw-semibold">#NIP kepala seksi/PPTK</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>- {dataReview.nipKepalaSeleksi}</span>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column my-2">
                                        <div className="d-flex">
                                            <span className="fw-semibold">#Kode program</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>- {dataReview.kodeProgram}</span>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column my-2">
                                        <div className="d-flex">
                                            <span className="fw-semibold">#Nama program</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>- {dataReview.namaProgram}</span>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column my-2">
                                        <div className="d-flex">
                                            <span className="fw-semibold">#Kode sub kegiatan</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>- {dataReview.kodeSubKegiatan}</span>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column my-2">
                                        <div className="d-flex">
                                            <span className="fw-semibold">#Nama sub kegiatan</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>- {dataReview.namaSubKegiatan}</span>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column my-2">
                                        <div className="d-flex">
                                            <span className="fw-semibold">#Kode rincian sub kegiatan</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>- {dataReview.kodeRincianSubKegiatan}</span>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column my-2">
                                        <div className="d-flex">
                                            <span className="fw-semibold">#Nama rincian sub kegiatan</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>- {dataReview.namaRincianSubKegiatan}</span>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column my-2">
                                        <div className="d-flex">
                                            <span className="fw-semibold">#Kode rekening</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>- {dataReview.kodeRekening}</span>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column my-2">
                                        <div className="d-flex">
                                            <span className="fw-semibold">#Nama paket pekerjaan yang di tagih</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>- {dataReview.namaPaketDitagih}</span>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column my-2">
                                        <div className="d-flex">
                                            <span className="fw-semibold">#Nomor kontrak/SPK</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>- {dataReview.nomorKontrak}</span>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column my-2">
                                        <div className="d-flex">
                                            <span className="fw-semibold">#Nilai kontrak/SPK</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>- {dataReview.nilaiKontrak}</span>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column my-2">
                                        <div className="d-flex">
                                            <span className="fw-semibold">#Nilai yang di tagih</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>- {dataReview.nilaiDitagih}</span>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column my-2">
                                        <div className="d-flex">
                                            <span className="fw-semibold">#Tahun angaran</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>- {dataReview.tahunAngaran}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex flex-fill my-5 justify-content-center">
                                    {
                                        role === "verificator" ?
                                            dataReview.isVerify === "waiting" ?
                                                <>
                                                    <div className="d-flex flex-fill">
                                                        <button className="btn btn-primary w-100 p-2" onClick={() => setujuiDokumen()}>
                                                            <div className="d-flex align-items-center justify-content-center">
                                                                {
                                                                    loadingSetuju === true ?
                                                                        <div className="d-flex mx-3">
                                                                            <div className="spinner-border text-light spinner-border-sm" role="status">
                                                                                <span className="visually-hidden">Loading...</span>
                                                                            </div>
                                                                        </div>
                                                                    :
                                                                        <div className="d-flex mx-3">
                                                                            <FontAwesomeIcon icon={faCheck} size="lg"/>
                                                                        </div>
                                                                }
                                                                <div className="d-flex">
                                                                    Setuju
                                                                </div>
                                                            </div>
                                                        </button>
                                                    </div>
                                                    <div className="mx-2"></div>
                                                    <div className="d-flex flex-fill">
                                                        <button className="btn btn-danger w-100 p-2" onClick={() => handleShow()}>
                                                            <div className="d-flex align-items-center justify-content-center">
                                                                {
                                                                    loadingDitolak === true ?
                                                                        <div className="d-flex mx-3">
                                                                            <div className="spinner-border text-light spinner-border-sm" role="status">
                                                                                <span className="visually-hidden">Loading...</span>
                                                                            </div>
                                                                        </div>
                                                                    :
                                                                        <div className="d-flex mx-3">
                                                                            <FontAwesomeIcon icon={faTimes} size="lg"/>
                                                                        </div>
                                                                }
                                                                <div className="d-flex">
                                                                    Tolak
                                                                </div>
                                                            </div>
                                                        </button>
                                                    </div>
                                                </>
                                            :
                                                <button onClick={() => moveToHome()} className="btn btn-primary mx-2">
                                                    <div className="d-flex align-items-center justify-content-center">
                                                        {
                                                            <div className="d-flex">
                                                                <FontAwesomeIcon icon={faArrowLeft} size="lg"/>
                                                            </div>
                                                        }
                                                        <div className="d-flex mx-3">
                                                            Kembali Home
                                                        </div>
                                                    </div>
                                                </button>

                                        : role === "bendahara" ?
                                            dataReview.isSpmtCreated === false ?
                                                <div className="d-flex flex-fill">
                                                    <button className="btn btn-primary w-100 p-2" onClick={() => createSPTM()}>
                                                        <div className="d-flex align-items-center justify-content-center">
                                                            {
                                                                loadingBuatSpmt === true ?
                                                                    <div className="d-flex mx-3">
                                                                        <div className="spinner-border text-light spinner-border-sm" role="status">
                                                                            <span className="visually-hidden">Loading...</span>
                                                                        </div>
                                                                    </div>
                                                                :
                                                                    <div className="d-flex mx-3">
                                                                        <FontAwesomeIcon icon={faFilePdf} size="lg"/>
                                                                    </div>
                                                            }
                                                            <div className="d-flex">
                                                                Buat surat SMTP
                                                            </div>
                                                        </div>
                                                    </button>
                                                </div>
                                            :
                                                <button onClick={() => moveToHome()} className="btn btn-primary mx-2">
                                                    <div className="d-flex align-items-center justify-content-center">
                                                        {
                                                            <div className="d-flex">
                                                                <FontAwesomeIcon icon={faArrowLeft} size="lg"/>
                                                            </div>
                                                        }
                                                        <div className="d-flex mx-3">
                                                            Kembali Home
                                                        </div>
                                                    </div>
                                                </button>
                                        :
                                            dataReview.isVerify === false ?
                                                <div className="d-flex flex-fill">
                                                    <button className="btn btn-primary w-100 p-2" onClick={() => handleShowEdit()} disabled={dataReview.length <= 0 ? "disabled" : ""}>
                                                        <div className="d-flex align-items-center justify-content-center">
                                                            {
                                                                loading === true || dataReview.length <= 0 ?
                                                                    <div className="d-flex mx-3">
                                                                        <div className="spinner-border text-light spinner-border-sm" role="status">
                                                                            <span className="visually-hidden">Loading...</span>
                                                                        </div>
                                                                    </div>
                                                                :
                                                                    <div className="d-flex mx-3">
                                                                        <FontAwesomeIcon icon={faPencil} size="lg"/>
                                                                    </div>
                                                            }
                                                            <div className="d-flex">
                                                                Perbarui pengajuan
                                                            </div>
                                                        </div>
                                                    </button>
                                                </div>
                                            :
                                                <button onClick={() => moveToHome()} className="btn btn-primary mx-2">
                                                    <div className="d-flex align-items-center justify-content-center">
                                                        {
                                                            <div className="d-flex">
                                                                <FontAwesomeIcon icon={faArrowLeft} size="lg"/>
                                                            </div>
                                                        }
                                                        <div className="d-flex mx-3">
                                                            Kembali Home
                                                        </div>
                                                    </div>
                                                </button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                :
                    <div className="d-flex align-items-center justify-content-center w-100 mt-5">
                        Data tidak tersedia...
                    </div>
            }

            {/* modals tolak dokumen */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Penolakan Dokumen</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex">
                        <textarea rows="10" placeholder='Masukan alasan penolakan dokumen ...' className='w-100 border rounded p-2' onChange={(e) => setPenolakan(e.target.value)} value={penolakan}/>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={handleClose} className="btn btn-secondary">
                        Tutup
                    </button>
                    <button onClick={() => tolakDokumenMessage()} className="btn btn-primary">
                        <div className="d-flex align-items-center justify-content-center">
                            {
                                loadingDitolak === true &&
                                    <div className="d-flex mx-1">
                                        <div className="spinner-border text-light spinner-border-sm" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                            }
                            <div className="d-flex">
                                Kirim
                            </div>
                        </div>
                    </button>
                </Modal.Footer>
            </Modal>


            {/* modals perbarui data */}
            <Modal show={showEdit} onHide={handleCloseEdit}>
                <Modal.Header closeButton>
                    <Modal.Title>Perbarui Dokumen</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex flex-column">
                        {
                            loading === true &&
                            <div className="d-flex flex-fill">
                                <div className="progress w-100">
                                    <div className="progress-bar progress-bar-striped" role="progressbar" style={{width: progress+"%"}} aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </div>
                        }
                        <div className="d-flex my-4">
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
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={handleCloseEdit} className="btn btn-secondary">
                        Tutup
                    </button>
                    <button onClick={() => perbaruiPengajuan()} className="btn btn-primary">
                        <div className="d-flex align-items-center justify-content-center">
                            {
                                loading === true &&
                                    <div className="d-flex mx-1">
                                        <div className="spinner-border text-light spinner-border-sm" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                            }
                            <div className="d-flex">
                                Kirim
                            </div>
                        </div>
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Review