import {useCallback, useEffect, useMemo, useState} from "react";
import {useEventsApiContext} from "@/api/events/EventsContext";
import {AccessLogsPromiseData, EventsStatusEnum, SessionPromiseData, VehicleProps} from "@/api/events/EventsDTO";
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
    const { toast } = useToast()
    const locationHelpers = useLocationHelpers();
    const [searchParams] = useSearchParams();
    const code = searchParams.get("code");

    const [data, setData] = useState<AccessLogsPromiseData[] | []>([]);
    const [dataNew, setDataNew] = useState<SessionPromiseData[] | []>([]);
    const [vehicles, setVehicles] = useState<VehicleProps[]>([]);
    const [open, setOpen] = useState(false);
    const [openOut, setOpenOut] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const [loadingOpen, setLoadingOpen] = useState(false);
    const [plateDetails, setPlateDetails] = useState<AccessLogsPromiseData | Record<string, any>>({});
    const [plate, setId] = useState({id: "", number: ""});

    const getAccessLogs = () => {
        setLoading(true);
        EventsApi.getAccessLogs().then((res) => {
            setLoading(false)
            if (isMount.current) {
                setData(res?.data)
            }
        }).catch((error) => {
            setLoading(false)
            toast({
                title: error.data,
                // description: "Friday, February 10, 2023 at 5:57 PM",
            })
        })
    }

    const getAllSessions = () => {
        setLoading1(true);
        EventsApi.getEventsList({ status: EventsStatusEnum.IN_PROGRESS }).then((res) => {
            setDataNew(res.data);
            setLoading1(false)
        }).catch((error) => {
            setLoading1(false)
            toast({
                title: error.data,
                // description: "Friday, February 10, 2023 at 5:57 PM",
            })
        })
    }

    const getSessions = () => {
        EventsApi.getVehicles(EventsStatusEnum.IN_PROGRESS).then(res => {
            setVehicles(res.data)
        })
    }
    const openPlateDeitals = (id: string) => {
        setLoadingDetails(true);
        EventsApi.getAccessLogsDetails(id).then((res) => {
                if (res.id) {
                    if (res?.direction === "IN") {
                        setOpen(true);
                    } else {
                        setOpenOut(true);
                    }
                    getSessions()
                    setPlateDetails(res)
                    setLoadingDetails(false)
                }
        }).catch((error) => {
            toast({
                title: error.data,
                // description: "Friday, February 10, 2023 at 5:57 PM",
            })
            setLoadingDetails(false)
        })
    }

    const openGate = useCallback((sessionId: string) => {
        setLoadingOpen(true);
        EventsApi.openGate(sessionId).then(() => {
            getAccessLogs();
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
                // description: "Friday, February 10, 2023 at 5:57 PM",
            })
        })
    }, [])
    const outGate = useCallback((sessionId: string) => {
        setLoadingOpen(true);
        EventsApi.outGate(sessionId).then(() => {
            getAccessLogs();
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
                // description: "Friday, February 10, 2023 at 5:57 PM",
            })
        })
    }, [])
    const closeModal = () => {
        setOpen(false)
    }
    const onChangeSearchKey = useCallback((value: string) => {
        if (code !== null && value?.length === 0) {
            return locationHelpers.replaceQuery({ code: undefined})
        }
        locationHelpers.replaceQuery({ code: value })
    }, [code])

    const dataFiltered = useMemo(() => {
        const arr = []
         if (code !== null) {
            arr.push(...data?.filter(item => item?.vehicle?.licenseNumber?.toLowerCase()?.includes(code?.toLowerCase())))
         }
         return arr;
    }, [code, data]);
    const dataFilteredNew = useMemo(() => {
        const arr = []
        if (code !== null) {
            arr.push(...dataNew?.filter(item => item?.vehicle?.licenseNumber?.toLowerCase()?.includes(code?.toLowerCase())))
        }
        return arr;
    }, [code, dataNew]);
    useEffect(() => {
        EventsApi.getFile().then(res => {
            console.log(res, "res")
        })
        getAccessLogs()
    }, [EventsApi, isMount])

    useEffect(() => {
        getAllSessions()
    }, []);

    return (
        <div className="flex flex-col">
            <div className="mt-4 gap-16 w-full flex justify-between">
              <button className="relative bg-red-500 flex items-center text-[14px] text-white py-2 px-8 rounded-l">Список</button>
              <input value={code ?? ""} onChange={(event) => onChangeSearchKey(event.target.value)} placeholder="Поиск" className="shadow w-2/3 appearance-none bg-white border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
            </div>
            <div className="font-sans flex mt-10">
                <motion.div
                    initial={{
                        y: 100                }
                    }
                    animate={{ y: 0 }}
                    transition={{ duration: 0.3, ease: "easeIn" }}
                    className="flex flex-col min-h-[100px] w-1/4 shadow-lg p-3">
                    <h3 className="font-medium  text-[17px] mb-2">Вход</h3>
                    <div className="flex flex-wrap gap-4 mx-1">
                        {loading ? Array.from({ length: 4 }, (_, key) => (
                            <div key={key} className="animate-pulse  cursor-pointer font-semibold bg-[#e6e6e6] border-black rounded-xl py-2 px-3">
                                <span className="opacity-0">01h434hh</span>
                            </div>
                        )) : (code !== null ? dataFiltered : data)?.filter((x) => x?.direction === "IN" && x?.session?.status === EventsStatusEnum.NEW)?.length > 0
                            ? (code !== null ? dataFiltered : data)?.map(x => (<span key={x.id} onClick={() => openPlateDeitals(x?.vehicle?.licenseNumber)}
                              className="border-2 cursor-pointer font-semibold bg-[#e6e6e6] border-black rounded-xl py-2 px-3">{x?.vehicle?.licenseNumber}</span>))
                            : <span>Нет транспорта</span>}
                    </div>
                </motion.div>
                <motion.div
                    initial={{
                        y: 100}}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.3, ease: "easeIn" }}
                    className="flex min-h-[100px] flex-col w-2/4 shadow-lg p-3">
                    <h3 className="font-medium text-[17px] mb-2">На терминале</h3>
                    <div className="flex flex-wrap gap-4 mx-1">
                        {loading1 ? Array.from({ length: 6 }, (_, key) => (
                            <div key={key} className="animate-pulse  cursor-pointer font-semibold bg-[#e6e6e6] border-black rounded-xl py-2 px-3">
                                <span className="opacity-0">01h434hh</span>
                            </div>
                        )) : (code !== null ? dataFilteredNew : dataNew)?.map(x =>
                                <>
                        <span
                            onClick={() => {
                                setId({id: x.id, number: x.vehicle?.licenseNumber})
                                openPlateDeitals(x.vehicle.licenseNumber)
                            }}
                            key={x.id}
                            className={`${loadingDetails && plate?.id === x.id && "animate-pulse"} border-2 cursor-pointer font-semibold bg-[#e6e6e6] border-black rounded-xl py-2 px-3`}>
                            {x?.vehicle?.licenseNumber}</span>
                                </>
                        )}
                    </div>
                </motion.div>
                <motion.div
                    initial={{
                        y: 100                }
                    }
                    animate={{ y: 0 }}
                    transition={{ duration: 0.3, ease: "easeIn" }}
                    className="flex min-h-[100px] flex-col w-1/4 shadow-lg p-3">
                    <h3 className="font-medium text-[17px] mb-2">Выход</h3>
                    <div className="flex flex-wrap gap-4 mx-1">
                        {loading ? Array.from({ length: 4 }, (_, key) => (
                            <div key={key} className="animate-pulse  cursor-pointer font-semibold bg-[#e6e6e6] border-black rounded-xl py-2 px-3">
                                <span className="opacity-0">01h434hh</span>
                            </div>
                        )) : (code !== null ? dataFiltered : data)?.filter((x) => x.direction === "OUT")?.map(x =>
                                <>
                        <span
                            onClick={() => {
                                setId({id: x.id, number: x.vehicle.licenseNumber})
                                openPlateDeitals(x.vehicle?.licenseNumber)
                            }}
                            key={x.id}
                            className={`${loadingDetails && plate?.id === x.id && "animate-pulse"} border-2 cursor-pointer font-semibold bg-[#e6e6e6] border-black rounded-xl py-2 px-3`}>
                            {x.vehicle?.licenseNumber}</span>
                                </>
                        )}
                    </div>
                </motion.div>
                <ShowDetailsModal outGate={outGate} loadingOpen={loadingOpen} plate={plate} data={plateDetails} open={open} close={closeModal} openGate={openGate}/>
                <ShowDetailsModalOut plate={plate} data={plateDetails} open={openOut} close={() => setOpenOut(false)} vehicles={vehicles}/>
                {/*<AddModal open={openAdd} close={closeAddModal} setNewData={setNewData} />*/}
            </div>

        </div>
    );
}

export default EventPage;