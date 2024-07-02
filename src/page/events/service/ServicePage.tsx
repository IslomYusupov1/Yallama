import {ArrowLeftIcon, CheckIcon, PlusIcon} from "@radix-ui/react-icons"
import ServiceEventTable from "@/page/events/service/ServiceEventTable";
import {useNavigate} from "react-router";
import {useSearchParams} from "react-router-dom";
import {useCallback, useEffect, useMemo, useState} from "react";
import {useEventsApiContext} from "@/api/events/EventsContext";
import {EventSessionServicePromiseData, ServicesPromiseData} from "@/api/events/EventsDTO";
import ServiceModalAdd from "@/page/events/service/ServiceModalAdd";
import {FormikValues} from "formik";
import {useToast} from "@/components/ui/use-toast";
import {useShallowEqualSelector} from "@/hooks/useShallowSelector";
import {tokenSelector} from "@/reducers/AuthReducer";
import jwt_decode from "jwt-decode";
import {RolesEnum} from "@/api/MainDTO";

function ServicePage() {
    const { toast } = useToast()
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { EventsApi } = useEventsApiContext();

    const [data, setData] = useState<EventSessionServicePromiseData[]>([])
    const [totalPrice, setTotalPrice] = useState<number>(0)
    const [services, setServices] = useState<ServicesPromiseData[]>([])
    const [loadingCreate, setLoadingCreate] = useState(false);
    const [selectedData, setSelectedData] = useState<EventSessionServicePromiseData | Record<string, any>>({});
    const [open, setOpen] = useState(false);
    const token = useShallowEqualSelector(tokenSelector);
    const tokenInfo = token && (jwt_decode(token ? token : "") as any);

    const payBtnCheck =  useMemo(() => Boolean(data?.find(x => x.tookDate === null)), [data]);
    const payedCheck =  useMemo(() => Boolean(data?.find(x => !x.isPaid)), [data]);

    const closeFunc = useCallback(() => {
        setOpen(false);
        setSelectedData({})
    }, [])

    const selectServiceOptions = useMemo(() => {
        const data: {label: string, value: string, data: ServicesPromiseData}[] = [];
        services?.forEach((service) => {
            data.push({label: service.name, value: service.id, data: service})
        })
        return data;
    }, [services])

    const tookFunc = useCallback((serviceId: string) => {
        EventsApi.serviceTook(serviceId).then(() => {
            EventsApi.getEventSessionServices({
                limit: -1,
                sessionId: searchParams?.get("id") as string
            }).then(res => {
                setData(res.data);
                toast({
                    title: "Успешно принято",
                    // description: "Friday, February 10, 2023 at 5:57 PM",
                })
            }).catch((error) => {
                toast({
                    title: error.data,
                    // description: "Friday, February 10, 2023 at 5:57 PM",
                })
            })
        })
    }, [EventsApi, searchParams, toast])

    const deleteItem = useCallback((sessionId: string) => {
        EventsApi.deleteServiceSession(sessionId).then(() => {
            EventsApi.getEventSessionServices({
                limit: 10,
                sessionId: searchParams?.get("id") as string
            }).then(res => {
                setData(res.data);
                toast({
                    title: "Успешно удален",
                    // description: "Friday, February 10, 2023 at 5:57 PM",
                })
            })
            EventsApi.getEventSessionServicesTotalPrice(searchParams?.get("id") as string).then(res => {
                setTotalPrice(res.totalPrice)
            }).catch((error) => {
                toast({
                    title: error.data,
                    // description: "Friday, February 10, 2023 at 5:57 PM",
                })
            })
        }).catch((error) => {
            toast({
                title: error.data,
                // description: "Friday, February 10, 2023 at 5:57 PM",
            })
        })
    }, [EventsApi, searchParams, toast])

    const addService = useCallback((values: FormikValues) => {
        setLoadingCreate(true)
        EventsApi.createServiceSession({
            countTime: values?.countTime > 0 ? values?.countTime : undefined,
            sessionId: searchParams?.get("id") as string,
            serviceId: values?.serviceId,
            countItem:  values?.countItem > 0 ? values?.countItem : undefined,
            countVolume:  values?.countVolume > 0 ? values?.countVolume : undefined,
            countWeight:  values?.countWeight > 0 ? values?.countWeight : undefined
        }).then(() => {
            toast({
                title: "Успешно добавлен",
                // description: "Friday, February 10, 2023 at 5:57 PM",
            })
            setLoadingCreate(false);
            closeFunc();
            EventsApi.getEventSessionServices({
                limit: -1,
                sessionId: searchParams?.get("id") as string
            }).then(res => {
                setData(res.data)
            })
            EventsApi.getEventSessionServicesTotalPrice(searchParams?.get("id") as string).then(res => {
                setTotalPrice(res.totalPrice)
            })
        }).catch((error) => {
            toast({
                title: error.data,
                // description: "Friday, February 10, 2023 at 5:57 PM",
            })
            setLoadingCreate(false)
        })
    }, [EventsApi, searchParams, closeFunc, toast])
    const editService = useCallback((values: FormikValues) => {
        setLoadingCreate(true)
        EventsApi.editServiceSession(selectedData?.id, {
            countTime: values?.countTime > 0 ? values?.countTime : undefined,
            sessionId: searchParams?.get("id") as string,
            serviceId: values?.serviceId,
            countItem:  values?.countItem > 0 ? values?.countItem : undefined,
            countVolume:  values?.countVolume > 0 ? values?.countVolume : undefined,
            countWeight:  values?.countWeight > 0 ? values?.countWeight : undefined
        }).then(() => {
            toast({
                title: "Успешно изменен",
                // description: "Friday, February 10, 2023 at 5:57 PM",
            })
            setLoadingCreate(false);
            closeFunc();
            EventsApi.getEventSessionServices({
                limit: -1,
                sessionId: searchParams?.get("id") as string
            }).then(res => {
                setData(res.data)
            })
            EventsApi.getEventSessionServicesTotalPrice(searchParams?.get("id") as string).then(res => {
                setTotalPrice(res.totalPrice)
            })
        }).catch((error) => {
            toast({
                title: error.data,
                // description: "Friday, February 10, 2023 at 5:57 PM",
            })
            setLoadingCreate(false)
        })
    }, [EventsApi, searchParams, closeFunc, toast, selectedData])
    const openEdit = useCallback((value: EventSessionServicePromiseData) => {
        setSelectedData(value);
        setOpen(true);
    }, [])

    const payToSessions = () => {
        setLoadingCreate(true);
        EventsApi.payToServices(searchParams?.get("id") as string).then(() => {
            setLoadingCreate(false);
            toast({
                title: "Успешно оплачено",
                // description: "Friday, February 10, 2023 at 5:57 PM",
            })
            setLoadingCreate(false);
            EventsApi.getEventSessionServices({
                limit: -1,
                sessionId: searchParams?.get("id") as string
            }).then(res => {
                setData(res.data)
            })
            EventsApi.getEventSessionServicesTotalPrice(searchParams?.get("id") as string).then(res => {
                setTotalPrice(res.totalPrice)
            });
        }).catch((error) => {
            setLoadingCreate(false);
            toast({
                title: error.data,
                // description: "Friday, February 10, 2023 at 5:57 PM",
            })
        })
    }

    const checkCustom = () => {
        EventsApi.checkCustom(searchParams?.get("id") as string).then(res => {
            console.log(res, "res")
        })
    }

    useEffect(() => {
        if (open) {
           EventsApi.getAllServices(100).then((res) => {
            setServices(res.data)
           }).catch((error) => {
               toast({
                   title: error.data,
                   // description: "Friday, February 10, 2023 at 5:57 PM",
               })
           })
        }
    }, [EventsApi, open])

    useEffect(() => {
        if (searchParams?.get("id")) {
            EventsApi.getEventSessionServices({
                limit: -1,
                sessionId: searchParams?.get("id") as string
            }).then(res => {
                setData(res.data)
            })
            EventsApi.getEventSessionServicesTotalPrice(searchParams?.get("id") as string).then(res => {
                setTotalPrice(res.totalPrice)
            }).catch((error) => {
                toast({
                    title: error.data,
                    // description: "Friday, February 10, 2023 at 5:57 PM",
                })
            })
        }
    }, [searchParams, EventsApi])
    return (
        <div className="flex flex-col mt-5 font-sans">
            <div className="w-full flex justify-between">
                <button onClick={() => navigate(-1)} className="relative w-[100px] bg-[#61686b] flex items-center text-[14px] text-white py-2 px-8 rounded-sm">
                    <ArrowLeftIcon className="absolute left-4 h-4 w-4"/>
                    <span className="mx-2">Назад</span>
                </button>
                <button className="relative w-[250px] bg-teal-500 flex items-center text-[14px] text-white py-2 px-8 rounded-sm">
                    <CheckIcon className="absolute left-4 h-4 w-4"/>
                    <span className="mx-2" onClick={checkCustom}>Проверить задолжность</span>
                </button>
            </div>
            <div className="mt-4">
                {tokenInfo?.role !== RolesEnum.ACCOUNTANT && <button onClick={() => setOpen(true)}
                         className="relative bg-teal-500 flex items-center text-[14px] text-white py-2 px-8 rounded-sm">
                    <span className="mx-2">Добавить</span>
                    <PlusIcon className="absolute right-2 h-5 w-5"/>
                </button>}
                {data?.length > 0 ? <div className="overflow-auto">
                    <ServiceEventTable openEdit={openEdit} data={data} deleteItem={deleteItem} totalPrice={totalPrice}
                                       tookFunc={tookFunc}/>
                </div> : <span className="" />}
                {data?.length > 0 && (tokenInfo?.role !== RolesEnum.WAREHOUSE_MANAGER && tokenInfo?.role !== RolesEnum.OPERATOR) && <div className="w-full text-end items-end flex justify-end mt-3">
                    {payedCheck ? <button onClick={payToSessions} disabled={payBtnCheck || loadingCreate}
                                          className="bg-red-600 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed px-8 py-2 rounded-sm text-white">Оплата</button> :
                        <span className="bg-teal-500 px-8 py-2 rounded-sm text-white">Оплачено</span>}
                </div>}
            </div>
            <ServiceModalAdd selectedData={selectedData} editService={editService} open={open} serviceData={services} selectServiceOptions={selectServiceOptions} close={closeFunc} createService={addService} loading={loadingCreate} />
        </div>
    );
}
export default ServicePage;