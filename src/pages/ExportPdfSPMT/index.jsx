import { useState, useEffect } from "react"
import jsPDF from "jspdf";
import html2canvas from "html2canvas"
import { v4 } from "uuid"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFilePdf, faCheck, faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { getDoc, doc, updateDoc, addDoc, collection } from "firebase/firestore"
import { useParams, useNavigate } from "react-router-dom"
import moment from "moment-timezone"
import { db } from "../../config"
import "./style.css"

const ExportPdfSPMT = () => {
    const navigate                              = useNavigate()
    const { id }                                = useParams()
    const spmtColection                         = doc(db, "spmt", id)
    const notifCollection                       = collection(db, "notification")
    const [loadingSetuju, setLoadingSetuju]     = useState(false)
    const [loadingBuatSpmt, setLoadingBuatSpmt] = useState(false)
    const [dataSpmt, setDataSpmt]               = useState("")
    const [role, setRole]                       = useState("")

    useEffect(() => {
        const roles = localStorage.getItem("role")
        const getSpmt = async() => {
            const smpt = await getDoc(spmtColection)
            setDataSpmt(smpt.data())
        }
        
        setRole(roles)
        getSpmt()
    }, [spmtColection])

    const printDocument = () => {
        setLoadingBuatSpmt(true)

        const input = document.getElementById('divToPrint');
        html2canvas(input)
        .then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf     = new jsPDF();

            pdf.addImage(imgData, 'JPEG', 0, 0)
            pdf.save(`SPMT-${v4()}.pdf`)
        });

        setLoadingBuatSpmt(false)
    }

    const moveToHome = () => {
        navigate("/home")
    }

    const aproveSpmt = async () => {
        await updateDoc(spmtColection, {
            isAprove : true
        })

        await addDoc(notifCollection, {
            idLetter : id,
            isRead   : false,
            isFinal  : true,
            role     : "user",
            textNotif: `Pimpinan telah menyetujui surat SPMT.`,
            createdAt: Date.now()
        })
    }

    return (
        <div className="d-flex flex-column w-100">
            <div className="d-flex w-100 justify-content-center">
                {
                    dataSpmt !== "" &&
                        <div id="divToPrint" className="mt-4 border style-paper">
                            <div className="text-center fw-bold my-4 text-decoration-underline" style={{fontSize:"x-small"}}>SURAT PERNYATAAN MELAKSANAKAN TUGAS</div>
                            <div className="d-flex mt-5 flex-column" style={{fontSize:"7px"}}>
                                <div className="d-flex">
                                    <b>Yang bertanda tangan di bawah ini atas nama pimpinan dengan ini menyatakan bahwa :</b>
                                </div>
                                <div className="d-flex w-100 flex-column mt-3 mb-2">
                                    <div className="row w-100 mx-0">
                                        <div className="col-1 px-0">
                                        </div>
                                        <div className="col-4 px-0">
                                            <span>Nama Bidang</span>
                                        </div>
                                        <div className="col-6 px-0">
                                            <b>: {dataSpmt.namaBidang}</b>
                                        </div>
                                    </div>
                                    <div className="row w-100 mx-0">
                                        <div className="col-1 px-0">
                                        </div>
                                        <div className="col-4 px-0">
                                            <span>Nama Kepala Bidang</span>
                                        </div>
                                        <div className="col-6 px-0">
                                            <b>: {dataSpmt.namaKepalaBidang}</b>
                                        </div>
                                    </div>
                                    <div className="row w-100 mx-0">
                                        <div className="col-1 px-0">
                                        </div>
                                        <div className="col-4 px-0">
                                            <span>NIP Kepala Bidang</span>
                                        </div>
                                        <div className="col-6 px-0">
                                            <b>: {dataSpmt.nipKepalaBidang}</b>
                                        </div>
                                    </div>

                                    <div className="row w-100 mx-0 mt-2">
                                        <div className="col-1 px-0">
                                        </div>
                                        <div className="col-4 px-0">
                                            <span>Nama Kepala Seksi</span>
                                        </div>
                                        <div className="col-6 px-0">
                                            <b>: {dataSpmt.namaKepalaSeleksi}</b>
                                        </div>
                                    </div>
                                    <div className="row w-100 mx-0">
                                        <div className="col-1 px-0">
                                        </div>
                                        <div className="col-4 px-0">
                                            <span>NIP Kepala Seksi</span>
                                        </div>
                                        <div className="col-6 px-0">
                                            <b>: {dataSpmt.nipKepalaSeleksi}</b>
                                        </div>
                                    </div>
                                    <div className="row w-100 mx-0 mt-2">
                                        <div className="col-1 px-0">
                                        </div>
                                        <div className="col-4 px-0">
                                            <span>Nama Program</span>
                                        </div>
                                        <div className="col-6 px-0">
                                            <b>: {dataSpmt.namaProgram}</b>
                                        </div>
                                    </div>
                                    <div className="row w-100 mx-0">
                                        <div className="col-1 px-0">
                                        </div>
                                        <div className="col-4 px-0">
                                            <span>Kode Program</span>
                                        </div>
                                        <div className="col-6 px-0">
                                            <b>: {dataSpmt.nipKepalaBidang}</b>
                                        </div>
                                    </div>
                                    <div className="row w-100 mx-0 mt-2">
                                        <div className="col-1 px-0">
                                        </div>
                                        <div className="col-4 px-0">
                                            <span>Nama Sub Kegiatan</span>
                                        </div>
                                        <div className="col-6 px-0">
                                            <b>: {dataSpmt.namaSubKegiatan}</b>
                                        </div>
                                    </div>
                                    <div className="row w-100 mx-0">
                                        <div className="col-1 px-0">
                                        </div>
                                        <div className="col-4 px-0">
                                            <span>Kode Sub Kegiatan</span>
                                        </div>
                                        <div className="col-6 px-0">
                                            <b>: {dataSpmt.kodeSubKegiatan}</b>
                                        </div>
                                    </div>

                                    <div className="row w-100 mx-0 mt-2">
                                        <div className="col-1 px-0">
                                        </div>
                                        <div className="col-4 px-0">
                                            <span>Nama Rincian Sub Kegiatan</span>
                                        </div>
                                        <div className="col-6 px-0">
                                            <b>: {dataSpmt.namaRincianSubKegiatan}</b>
                                        </div>
                                    </div>
                                    <div className="row w-100 mx-0">
                                        <div className="col-1 px-0">
                                        </div>
                                        <div className="col-4 px-0">
                                            <span>Kode Rincian Sub Kegiatan</span>
                                        </div>
                                        <div className="col-6 px-0">
                                            <b>: {dataSpmt.kodeRincianSubKegiatan}</b>
                                        </div>
                                    </div>

                                    <div className="row w-100 mx-0 mt-2">
                                        <div className="col-1 px-0">
                                        </div>
                                        <div className="col-4 px-0">
                                            <span>Nama Paket Di Tagih</span>
                                        </div>
                                        <div className="col-6 px-0">
                                            <b>: {dataSpmt.namaPaketDitagih}</b>
                                        </div>
                                    </div>
                                    <div className="row w-100 mx-0">
                                        <div className="col-1 px-0">
                                        </div>
                                        <div className="col-4 px-0">
                                            <span>Nilai Ditagih</span>
                                        </div>
                                        <div className="col-6 px-0">
                                            <b>: {dataSpmt.nilaiDitagih}</b>
                                        </div>
                                    </div>
                                    <div className="row w-100 mx-0 mt-2">
                                        <div className="col-1 px-0">
                                        </div>
                                        <div className="col-4 px-0">
                                            <span>Nilai Kontrak</span>
                                        </div>
                                        <div className="col-6 px-0">
                                            <b>: {dataSpmt.nilaiKontrak}</b>
                                        </div>
                                    </div>
                                    <div className="row w-100 mx-0">
                                        <div className="col-1 px-0">
                                        </div>
                                        <div className="col-4 px-0">
                                            <span>Nomor Kontrak</span>
                                        </div>
                                        <div className="col-6 px-0">
                                            <b>: {dataSpmt.nomorKontrak}</b>
                                        </div>
                                    </div>
                                    <div className="row w-100 mx-0 mt-2">
                                        <div className="col-1 px-0">
                                        </div>
                                        <div className="col-4 px-0">
                                            <span>Tahun Angaran</span>
                                        </div>
                                        <div className="col-6 px-0">
                                            <b>: {dataSpmt.tahunAngaran}</b>
                                        </div>
                                    </div>
                                    <div className="row w-100 mx-0">
                                        <div className="col-1 px-0">
                                        </div>
                                        <div className="col-4 px-0">
                                            <span>Kode Rekening</span>
                                        </div>
                                        <div className="col-6 px-0">
                                            <b>: {dataSpmt.kodeRekening}</b>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center my-3">
                                    <span>Pimpinan menyatakan : </span>
                                    &nbsp;
                                    <b>Setuju</b>/<span className="text-decoration-line-through">Tidak Setuju</span>
                                </div>
                                <div className="d-flex mt-1 mb-1">
                                    <span>Demikian surat ini dibuat dengan sesunguhnya untuk dapat dipergunakan seperlunya.</span>
                                </div>
                                <div className="d-flex mt-3 align-items-end flex-column">
                                    <div className="col-4">
                                        <div className="d-flex flex-column">
                                            <div className="d-flex justify-content-center">
                                                <b>{moment().tz("Asia/Jakarta").format("D MMM YYYY")}</b>
                                            </div>
                                            <div className="d-flex justify-content-center">
                                                <span>Yang membuat pernyataan</span>
                                            </div>
                                        </div>
                                        <div className="d-flex flex-column mt-5">
                                            <div className="d-flex justify-content-center">
                                                <b className="text-decoration-underline">Pimpinan</b>
                                            </div>
                                            <div className="d-flex justify-content-center">
                                                <span>NIP. 12324124123</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                }
            </div>
            <div className="d-flex justify-content-center w-100 mt-4">
                {
                    role === "pimpinan" ?
                    <>
                        {
                            dataSpmt.isAprove === "waiting" &&
                            <button onClick={() => aproveSpmt()} className="btn btn-success mx-2">
                                <div className="d-flex align-items-center justify-content-center">
                                    {
                                        loadingSetuju === true ?
                                            <div className="d-flex">
                                                <div className="spinner-border text-light spinner-border-sm" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            </div>
                                        :
                                            <div className="d-flex">
                                                <FontAwesomeIcon icon={faCheck} size="lg"/>
                                            </div>
                                    }
                                    <div className="d-flex mx-3">
                                        Setujui surat SMTP
                                    </div>
                                </div>
                            </button>
                        }
                        <button onClick={() => printDocument()} className="btn btn-primary mx-2" disabled={`${dataSpmt.isAprove === "waiting" ? "disabled" : ""}`}>
                            <div className="d-flex align-items-center justify-content-center">
                                {
                                    loadingBuatSpmt === true ?
                                        <div className="d-flex">
                                            <div className="spinner-border text-light spinner-border-sm" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                    :
                                        <div className="d-flex">
                                            <FontAwesomeIcon icon={faFilePdf} size="lg"/>
                                        </div>
                                }
                                <div className="d-flex mx-3">
                                    Export surat SMTP
                                </div>
                            </div>
                        </button>
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
                }
            </div>
        </div>
    )
}

export default ExportPdfSPMT