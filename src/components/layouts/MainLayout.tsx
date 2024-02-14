import {ReactNode} from "react";
import {NavLink} from "react-router-dom";
import {RoutesEnum} from "@/components/routes/Routes";
import logoutIcon from "@/assets/logout.svg";
import {useDispatch} from "react-redux";
import {resetToken, tokenSelector} from "@/reducers/AuthReducer";
import {useShallowEqualSelector} from "@/hooks/useShallowSelector";
import jwt_decode from "jwt-decode";
import {RolesEnum} from "@/api/MainDTO";

interface Props {
    readonly children: ReactNode
}

function MainLayout({ children }: Props) {
    const dispatch = useDispatch();
    const token = useShallowEqualSelector(tokenSelector);
    const tokenInfo = token && (jwt_decode(token ? token : "") as any);

    const logout = () => {
        dispatch(resetToken());
    }
    return (
        <div className="flex flex-col font-sans items-center">
            <div className="bg-[#38454a] h-[50px] w-full text-center items-center flex">
                <div className="container mx-auto flex justify-between text-center items-center">
                    <div className="gap-6 flex">
                      <NavLink to={RoutesEnum.Events} className={`link-header text-[17px] text-white`}>Транспорты</NavLink>
                        {tokenInfo?.role !== RolesEnum.ACCOUNTANT && tokenInfo?.role !== RolesEnum.OPERATOR &&
                            <NavLink to={RoutesEnum.Services} className={` link-header  text-[17px] text-white`}>Сервисы</NavLink> }
                    </div>
                    <div className="flex gap-3 text-center items-center">
                        <span className="text-white text-[15px] font-normal">{tokenInfo?.role}</span>
                        <img onClick={logout} className="cursor-pointer" src={logoutIcon} alt="" width={30}/>
                    </div>
                </div>
            </div>
            <div className="container mx-auto">
            {children}
            </div>
        </div>
    );
}

export default MainLayout;