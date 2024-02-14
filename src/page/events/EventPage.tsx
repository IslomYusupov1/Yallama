import {useCallback, useEffect, useState} from "react";
import {useEventsApiContext} from "@/api/events/EventsContext";
import {EventsStatusEnum, SessionPromiseData} from "@/api/events/EventsDTO";
import {useIsMountHook} from "@/hooks/useIsMountHook";
import ShowDetailsModal from "@/page/events/ShowDetailsModal";
import AddModal from "@/page/events/AddModal";
import { motion } from "framer-motion";

function EventPage() {
    const {EventsApi} = useEventsApiContext();
    const isMount = useIsMountHook();

    const [data, setData] = useState<SessionPromiseData[] | []>([]);
    const [dataNew, setDataNew] = useState<SessionPromiseData[] | []>([]);
    const [open, setOpen] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const [plateDetails, setPlateDetails] = useState<SessionPromiseData | Record<string, any>>({});
    const [plate, setId] = useState({id: "", number: ""});

    const openPlateDeitals = (id: string) => {
        setLoadingDetails(true);
        EventsApi.getEventDetails(id).then((res) => {
                if (res.id) {
                    setPlateDetails(res)
                    setOpen(true);
                    setLoadingDetails(false)
                }
        }).catch(() => {
            setLoadingDetails(false)
        })
    }

    const closeModal = useCallback(() => {
        setOpen(false)
    }, [])
    const closeAddModal = useCallback(() => {
        setOpenAdd(false)
    }, [])
    const setNewData = useCallback((values: SessionPromiseData[]) => {
        setDataNew(values)
    }, [])
    useEffect(() => {
        setLoading(true);
        EventsApi.getEventsList({
            status: EventsStatusEnum.NEW
        }).then((res) => {
            setLoading(false)
            if (isMount.current) {
                setDataNew(res.data)
            }
        }).catch(() => {
            setLoading(false)
        })
    }, [EventsApi, isMount])

    useEffect(() => {
        setLoading1(true);
        EventsApi.getEventsList({
            status: EventsStatusEnum.IN_PROGRESS
        }).then((res) => {
            setLoading1(false)
            if (isMount.current) {
                setData(res.data)
            }
        }).catch(() => {
            setLoading1(false)
        })
    }, [EventsApi, isMount])

    return (
        <div className="font-sans flex flex-col mt-10">
            <motion.div
                initial={{
                    y: 100                }
                }
                animate={{ y: 0 }}
                transition={{ duration: 0.3, ease: "easeIn" }}
                className="flex flex-col min-h-[100px] shadow-lg p-3">
                <h3 className="font-medium text-[17px] mb-2">Активные событии</h3>
                <div className="flex flex-wrap gap-4 mx-1">
                    {loading ? Array.from({ length: 11 }, (_, key) => (
                        <div key={key} className="animate-pulse  cursor-pointer font-semibold bg-[#e6e6e6] border-black rounded-xl py-2 px-3">
                            <span className="opacity-0">01h434hh</span>
                        </div>
                    )) : data?.length > 0 ? data?.map(x => (<span key={x.id} onClick={() => openPlateDeitals(x.id)}
                                           className="border-2 cursor-pointer font-semibold bg-[#e6e6e6] border-black rounded-xl py-2 px-3">{x.vehicle.plateNumber}</span>)) : <span>Нет транспорта</span>}
                </div>
            </motion.div>
            <motion.div
                initial={{
                    y: 100                }
                }
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: "easeIn" }}
                className="flex min-h-[100px] flex-col shadow-lg p-3">
                <h3 className="font-medium text-[17px] mb-2">На регистрацию</h3>
                <div className="flex flex-wrap gap-4 mx-1">
                    {loading1 ? Array.from({ length: 11 }, (_, key) => (
                            <div key={key} className="animate-pulse  cursor-pointer font-semibold bg-[#e6e6e6] border-black rounded-xl py-2 px-3">
                                <span className="opacity-0">01h434hh</span>
                            </div>
                        )) : dataNew?.map(x =>
                       <>
                        <span
                            onClick={() => {
                                setId({id: x.id, number: x.vehicle.plateNumber})
                                openPlateDeitals(x.id)
                            }}
                            key={x.id}
                            className={`${loadingDetails && plate?.id === x.id && "animate-pulse"} border-2 cursor-pointer font-semibold bg-[#e6e6e6] border-black rounded-xl py-2 px-3`}>
                            {x.vehicle.plateNumber}</span>
                        </>
                    )}
                </div>
            </motion.div>
            <motion.button
                initial={{
                    y: 100                }
                }
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: "easeIn" }}
                onClick={() => setOpenAdd(true)}
                className="bg-red-500 w-[120px] focus:outline-0 active:outline-0 outline-0 font-normal text-white py-3 mt-5 rounded-xl">Добавить
            </motion.button>
            <ShowDetailsModal plate={plate} data={plateDetails} open={open} close={closeModal}/>
            <AddModal open={openAdd} close={closeAddModal} setNewData={setNewData} />
        </div>
    );
}

export default EventPage;