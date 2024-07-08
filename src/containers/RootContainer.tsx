import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import MainLayout from "@/components/layouts/MainLayout";
import EventPage from "@/page/events/EventPage";
import {RoutesEnum} from "@/components/routes/Routes";
import {ProviderContainer} from "@/containers/ProviderContainer";
import ServicePage from "@/page/events/service/ServicePage";
import {Toaster} from "@/components/ui/toaster"
import Services from "@/page/services/Services";
import {useEffect, useMemo} from "react";
import {resetToken, tokenSelector} from "@/reducers/AuthReducer";
import {useShallowEqualSelector} from "@/hooks/useShallowSelector";
import Auth from "@/page/auth/Auth";
import jwt_decode from "jwt-decode";
import {RolesEnum} from "@/api/MainDTO";
import {useDispatch} from "react-redux";
// import MainLayout from "../components/layouts/MainLayout";
// import Pay from "../pages/pay/Pay";
// import {ProviderContainer} from "./ProviderContainer";
// import Receipt from "../pages/receipt/Receipt";
// import FailedReceipt from "../pages/receipt/FailedReceipt";
// import PartnersPay from "../pages/partnersPay/PartnersPay";

function RootContainer() {
    const token = useShallowEqualSelector(tokenSelector);
    const dispatch = useDispatch()
    const tokenInfo = token && (jwt_decode(token ? token : "") as any);
    const isAuthorized = useMemo(() => Boolean(token), [token]);
    useEffect(() => {
        if(!isAuthorized) {
            dispatch(resetToken());
        }
    }, [])

    return (
        <>
            {isAuthorized ?
                <BrowserRouter>
                    <MainLayout>
                        <ProviderContainer>
                            <Toaster/>
                            <Routes>
                                <Route path="/auth" element={<Navigate replace={true} to={RoutesEnum.Events} />} />
                                <Route path={RoutesEnum.Events} element={<EventPage/>}/>
                                <Route path={RoutesEnum.EventService} element={<ServicePage/>}/>
                                {tokenInfo?.role !== RolesEnum.ACCOUNTANT && tokenInfo?.role !== RolesEnum.OPERATOR &&
                                    <Route path={RoutesEnum.Services} element={<Services/>}/>}
                                {/*<Route path={"/partners-pay"} element={<PartnersPay/>} index={true}/>*/}
                                {/*<Route path={"/receipt"} element={<Receipt/>}/>*/}
                                {/*<Route path={"/failed-receipt"} element={<FailedReceipt/>}/>*/}
                            </Routes>
                        </ProviderContainer>
                    </MainLayout>
                </BrowserRouter> :
                <BrowserRouter>
                    <Toaster/>
                    <Navigate replace={true} to={RoutesEnum.Auth} />
                    <Routes>
                        <Route path={RoutesEnum.Auth} element={<Auth />} />
                    </Routes>
                </BrowserRouter>
            }
        </>
    );
}

export default RootContainer;