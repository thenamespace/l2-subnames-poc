import { BrowserRouter, Route, Routes } from "react-router-dom"
import { MintPage } from "./pages/MintPage"
import { NameSelectorPage } from "./pages/NameSelectorPage"

export const AppRouter = () => {
    return <BrowserRouter>
        <Routes>
            <Route path="/mint/:parentName" element={<MintPage />}></Route>
            <Route index element={<NameSelectorPage/>}></Route>
        </Routes>
    </BrowserRouter>
}