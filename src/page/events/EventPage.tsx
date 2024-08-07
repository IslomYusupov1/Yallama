import {useCallback, useEffect, useMemo, useState} from "react";
import {useEventsApiContext} from "@/api/events/EventsContext";
import {AccessLogsPromiseData, EventsStatusEnum, SessionPromiseData} from "@/api/events/EventsDTO";
import {useIsMountHook} from "@/hooks/useIsMountHook";
import ShowDetailsModal from "@/page/events/ShowDetailsModal";
import {motion} from "framer-motion";
import {useToast} from "@/components/ui/use-toast";
import ShowDetailsModalOut from "@/page/events/ShowDetailsModalOut";
import {useSearchParams} from "react-router-dom";
import {useLocationHelpers} from "@/hooks/useLocationHelpers";

function EventPage() {
    const {EventsApi} = useEventsApiContext();
    const isMount = useIsMountHook();
    const {toast} = useToast()
    const locationHelpers = useLocationHelpers();
    const [searchParams] = useSearchParams();
    const code = searchParams.get("code");

    const [data, setData] = useState<AccessLogsPromiseData[] | []>([]);
    const [dataOut, setDataOut] = useState<AccessLogsPromiseData[] | []>([]);
    const [dataNew, setDataNew] = useState<SessionPromiseData[] | []>([]);
    const [open, setOpen] = useState(false);
    const [openOut, setOpenOut] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [loadingOpen, setLoadingOpen] = useState(false);
    const [plateDetails, setPlateDetails] = useState<AccessLogsPromiseData | Record<string, any>>({});
    const [plate, setId] = useState({id: "", number: ""});

    const getAccessLogsIn = () => {
        setLoading(true);
        EventsApi.getAccessLogs("IN", "NEW").then((res) => {
            setLoading(false)
            if (isMount.current) {
                setData(res?.data)
            }
        }).catch((error) => {
            setLoading(false)
            toast({
                title: error.data,
                description: "error",
            })
        })
    }
    const getAccessLogsOut = () => {
        setLoading2(true);
        EventsApi.getAccessLogs("OUT", "NEW").then((res) => {
            setLoading2(false)
            if (isMount.current) {
                setDataOut(res?.data)
            }
        }).catch((error) => {
            setLoading2(false)
            toast({
                title: error.data,
                description: "error",
            })
        })
    }


    const getAllSessions = () => {
        setLoading1(true);
        EventsApi.getEventsList({status: EventsStatusEnum.IN_PROGRESS}).then((res) => {
            setDataNew(res.data);
            setLoading1(false)
        }).catch((error) => {
            setLoading1(false)
            toast({
                title: error.data,
                description: "error",
            })
        })
    }

    // const getSessions = () => {
    //     EventsApi.getVehicles(EventsStatusEnum.IN_PROGRESS).then(res => {
    //         setVehicles(res.data)
    //     })
    // }
    const openPlateDeitals = (id: string) => {
        setLoadingDetails(true);
        EventsApi.getAccessLogsDetailsNew(id).then((res) => {
            if (res.id) {
                if (res?.direction === "IN") {
                    setOpen(true);
                } else {
                    setOpenOut(true);
                }
                getAllSessions();
                setPlateDetails(res)
                setLoadingDetails(false)
            }
        }).catch((error) => {
            toast({
                title: error.data,
                description: "error",
            })
            setLoadingDetails(false)
        })
    }
    const openPlateDeitalsProgress = (data: any) => {
        setLoadingDetails(true);
        const filteredId = data?.find((x: {id: string, gate: {key: string}}) => x?.gate?.key === "camera_in")
        EventsApi.getAccessLogsDetailsNew(filteredId?.id ?? "").then((res) => {
            if (res.id) {
                if (res?.direction === "IN") {
                    setOpen(true);
                } else {
                    setOpenOut(true);
                }
                getAllSessions();
                setPlateDetails(res)
                setLoadingDetails(false)
            }
        }).catch((error) => {
            toast({
                title: error.data,
                description: "error",
            })
            setLoadingDetails(false)
        })
    }

    const openGate = useCallback((sessionId: string) => {
        setLoadingOpen(true);
        EventsApi.openGate(sessionId).then(() => {
            getAccessLogsIn();
            getAccessLogsOut();
            getAllSessions();
            setOpen(false);
            setLoadingOpen(false)
            toast({
                title: "Транспорт успешно впушен",
                // description: "Friday, February 10, 2023 at 5:57 PM",
            })
        }).catch((error) => {
            setLoadingOpen(false)
            toast({
                title: error?.data,
                description: "error",
            })
        })
    }, [])
    const outGate = useCallback((sessionId: string, accessLogId: string) => {
        setLoadingOpen(true);
        EventsApi.outGate({ accessLogId: accessLogId}, sessionId).then(() => {
            getAccessLogsOut();
            getAccessLogsIn();
            getAllSessions();
            setOpenOut(false);
            setLoadingOpen(false)
            toast({
                title: "Транспорт успешно выпушен",
                // description: "Friday, February 10, 2023 at 5:57 PM",
            })
        }).catch((error) => {
            setLoadingOpen(false)
            toast({
                title: error?.data,
                description: "error",
            })
        })
    }, [])
    const closeModal = () => {
        setOpen(false)
    }
    const onChangeSearchKey = useCallback((value: string) => {
        if (code !== null && value?.length === 0) {
            return locationHelpers.replaceQuery({code: undefined})
        }
        locationHelpers.replaceQuery({code: value})
    }, [code])

    const dataFilteredIn = useMemo(() => {
        const arr = []
         if (code !== null) {
             arr.push(...data?.filter(item => item?.vehicle?.licenseNumber?.toLowerCase()?.includes(code?.toLowerCase())))
         }
         return arr;
    }, [code, data]);
    const dataFilteredOut = useMemo(() => {
        const arr = []
        if (code !== null) {
            arr.push(...dataOut?.filter(item => item?.vehicle?.licenseNumber?.toLowerCase()?.includes(code?.toLowerCase())))
        }
        return arr;
    }, [code, dataOut]);
    const dataFilteredNew = useMemo(() => {
        const arr = []
        if (code !== null) {
            arr.push(...dataNew?.filter(item => item?.vehicle?.licenseNumber?.toLowerCase()?.includes(code?.toLowerCase())))
        }
        return arr;
    }, [code, dataNew]);
    useEffect(() => {
        // EventsApi.createFile({ name: "ANPR-797AWN02-camera_out-20240620130612833.jpg", path: "ANPR-10618UBA-camera_out-20240504165142953.jpg" }).then(res => {
        //     console.log(res, "res")
        // })
        getAccessLogsIn();
        getAccessLogsOut();
    }, [EventsApi, isMount])

    useEffect(() => {
        getAllSessions()
    }, []);
    return (
        <div className="flex flex-col overflow-hidden">
            <div className="mt-4 gap-16 w-full flex justify-between">
                <button
                    className="relative opacity-0 bg-red-500 flex items-center text-[14px] text-white py-2 px-8 rounded-l">Список
                </button>
                <input value={code ?? ""} onChange={(event) => onChangeSearchKey(event.target.value)}
                       placeholder="Поиск"
                       className="shadow w-2/3 appearance-none bg-white border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
            </div>
            <div className="font-sans flex flex-row justify-between mt-10">
                <motion.div
                    initial={{
                        y: 100
                    }}
                    animate={{y: 0}}
                    transition={{duration: 0.3, ease: "easeIn"}}
                    className="flex flex-col min-h-[100px] w-1/4 shadow-lg p-3">
                    <h3 className="font-medium  text-[17px] mb-2">Вход</h3>
                    <div className="flex flex-wrap gap-4">
                        {loading ? Array.from({length: 4}, (_, key) => (
                            <div key={key}
                                 className="animate-pulse lg:w-[47%] w-[98%] cursor-pointer font-semibold bg-[#e6e6e6] border-black rounded-xl py-2 px-3">
                                <span className="opacity-0">01h434hh</span>
                            </div>
                        )) : data?.filter((x) => x?.session?.status === EventsStatusEnum.NEW)?.length > 0
                            ? (code !== null ? dataFilteredIn : data)?.map(x => (
                                <span key={x.id} onClick={() => openPlateDeitals(x?.id)}
                                      className="border-2 lg:w-[47%] w-[98%] cursor-pointer font-semibold bg-[#e6e6e6] border-black rounded-xl py-2 text-center items-center">{x?.vehicle?.licenseNumber}</span>))
                            : <span className="w-full text-center items-center">Нет транспорта</span>}
                    </div>
                </motion.div>
                <motion.div
                    initial={{
                        y: 100
                    }}
                    animate={{y: 0}}
                    transition={{duration: 0.3, ease: "easeIn"}}
                    className="flex min-h-[100px] flex-col w-2/4 shadow-lg p-3">
                    <h3 className="font-medium text-[17px] mb-2">На терминале</h3>
                    <div className="flex flex-wrap gap-4 mx-1">
                        {loading1 ? Array.from({length: 6}, (_, key) => (
                            <div key={key}
                                 className="animate-pulse lg:w-[31.5%] w-[47%] cursor-pointer font-semibold bg-[#e6e6e6] border-black rounded-xl py-2 px-3">
                                <span className="opacity-0">01h434hh</span>
                            </div>
                        )) : dataNew?.length > 0 ? (code !== null ? dataFilteredNew : dataNew)?.map((x: any) =>
                                <>
                        <span
                            onClick={() => {
                                setId({id: x.id, number: x.vehicle?.licenseNumber})
                                openPlateDeitalsProgress(x.accessLogs)
                            }}
                            key={x.id}
                            className={`${loadingDetails && plate?.id === x.id && "animate-pulse"} border-2 lg:w-[31.5%] w-[47%] cursor-pointer font-semibold bg-[#e6e6e6] border-black rounded-xl py-2 text-center items-center`}>
                            {x?.vehicle?.licenseNumber ?? "Неизвестно"}</span>
                                </>
                        ) : <span className="w-full">Нет транспорта</span>}
                    </div>
                </motion.div>
                <motion.div
                    initial={{
                        y: 100
                    }
                    }
                    animate={{y: 0}}
                    transition={{duration: 0.3, ease: "easeIn"}}
                    className="flex min-h-[100px] flex-col w-1/4 shadow-lg p-3">
                    <h3 className="font-medium text-[17px] mb-2">Выход</h3>
                    <div className="flex flex-wrap gap-4 mx-1">
                        {loading2 ? Array.from({length: 4}, (_, key) => (
                            <div key={key}
                                 className="animate-pulse lg:w-[47%] w-[98%]  cursor-pointer font-semibold bg-[#e6e6e6] border-black rounded-xl py-2 px-3">
                                <span className="opacity-0">01h434hh</span>
                            </div>
                        )) : (code !== null ? dataFilteredOut : dataOut)?.map(x =>
                                <>
                        <span
                            onClick={() => {
                                setId({id: x.id, number: x.vehicle.licenseNumber})
                                openPlateDeitals(x.id)
                            }}
                            key={x.id}
                            className={`${loadingDetails && plate?.id === x.id && "animate-pulse"} lg:w-[47%] w-[98%] border-2 cursor-pointer text-center items-center font-semibold bg-[#e6e6e6] border-black rounded-xl py-2 px-3`}>
                            {x.vehicle?.licenseNumber}</span>
                                </>
                        )}
                    </div>
                </motion.div>
                <ShowDetailsModal loadingOpen={loadingOpen} data={plateDetails} open={open} close={closeModal}
                                  openGate={openGate}/>
                <ShowDetailsModalOut outGate={outGate} plate={plate} data={plateDetails} loadingOpen={loadingOpen}
                                     open={openOut} close={() => setOpenOut(false)} vehicles={dataNew}/>
                {/*<AddModal open={openAdd} close={closeAddModal} setNewData={setNewData} />*/}
            </div>

        </div>
    );
}

export default EventPage;