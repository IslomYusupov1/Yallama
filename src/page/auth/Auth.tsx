import logo from "@/assets/logo-auth.jpeg";
import {Field, Form, Formik, FormikValues} from "formik";
import {useEventsApiContext} from "@/api/events/EventsContext";
import {useDispatch} from "react-redux";
import {setRefreshToken, setToken} from "@/reducers/AuthReducer";
import {useState} from "react";
import {ReloadIcon, EyeOpenIcon, EyeNoneIcon} from "@radix-ui/react-icons";
import {useToast} from "@/components/ui/use-toast";

function Auth() {
    const {EventsApi} = useEventsApiContext();
    const dispatch = useDispatch();
    const {toast} = useToast()
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const authSubmit = (values: FormikValues) => {
        setLoading(true);
        EventsApi.auth({
            phone: values.phone,
            password: values.password,
        }).then(x => {
            setLoading(false)
            dispatch(setToken({token: x.accessToken}));
            dispatch(setRefreshToken({refreshToken: x.refreshToken}));
        }).catch((error) => {
            toast({title: error?.data})
            setLoading(false)
        })
    }
    console.log(showPassword, "d")
    return (
        <div
            className="flex h-screen justify-center m-auto w-screen items-center align-middle text-center font-sans font-normal">
            <div className="w-[500px] h-[500px]"
                 style={{boxShadow: "rgba(16, 24, 40, 0.03) 0px 8px 8px 8px, rgba(16, 24, 40, 0.08) 8px 20px 24px 8px"}}>
                <img src={logo} alt="" className="w-full object-cover h-full"/>
            </div>
            <div className="w-[500px] h-[500px] px-20 bg-white flex flex-col justify-center text-center"
                 style={{boxShadow: "rgba(16, 24, 40, 0.03) 0px 8px 8px 8px, rgba(16, 24, 40, 0.08) 8px 20px 24px 8px"}}>
                <h3 className="text-black text-[25px]">Вход</h3>
                <div className="bg-white rounded px-8 pt-6 pb-8 mb-4">
                    <Formik initialValues={{phone: "", password: ""}} onSubmit={(values) => authSubmit(values)}>
                        {({handleSubmit}) => (
                            <Form onSubmit={handleSubmit} className="w-full">
                                <div className="mb-4">
                                    <label className="block text-start text-gray-700 text-sm font-bold mb-2">
                                        Логин
                                    </label>
                                    <Field
                                        name="phone"
                                        className="shadow appearance-none bg-white border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="username" placeholder="Введите логин"/>
                                </div>
                                <div className="mb-6 relative">
                                    <label className="block text-start text-gray-700 text-sm font-bold mb-2">
                                        Пароль
                                    </label>
                                    <Field
                                        name="password"
                                        className="shadow appearance-none items-center bg-white border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                        id="password" type={`${showPassword ? "text" : "password"}`} placeholder="Введите пароль"/>
                                    <div className="absolute right-5 top-1/2 cursor-pointer" onClick={() => setShowPassword(prevState => !prevState)}>
                                        {showPassword ? <EyeNoneIcon/> :
                                            <EyeOpenIcon/>}
                                    </div>
                                    {/*<p className="text-red-500 text-xs italic">Please choose a password.</p>*/}
                                </div>
                                <div className="relative">
                                    <button
                                        className="bg-green-500 w-full text-white font-bold select-none py-2 px-4 rounded focus:outline-none disabled:opacity-50 focus:shadow-outline"
                                        type="submit" disabled={loading}>
                                        Войти
                                    </button>
                                    {loading && <ReloadIcon
                                        className="absolute right-3 top-3 text-white h-4 w-4 animate-spin"/>}
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
}

export default Auth;