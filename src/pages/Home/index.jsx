import { useState, useEffect } from "react"
import FormPengajuan from "../../components/FormPengajuan"
import LetterList from "../../components/LetterList"
import SpmtList from "../../components/SpmtList"

const Home = () => {
    const [role, setRole] = useState("")

    useEffect(() => {
        const getRole = localStorage.getItem("role")
        setRole(getRole)
    }, [])

    return (
        <div className="d-flex flex-fill">
            {
                role === "user" &&
                <FormPengajuan/>
            }

            {
                role === "pimpinan" &&
                <SpmtList/>
            }

            {
                role === "verificator" &&
                <LetterList/>
            }

            {
                role === "bendahara" &&
                <LetterList/>
            }
        </div>
    )
}

export default Home