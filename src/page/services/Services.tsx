import {PlusIcon} from "@radix-ui/react-icons";
import {useCallback, useEffect, useState} from "react";
import {useEventsApiContext} from "@/api/events/EventsContext";
import {ServicesPromiseData} from "@/api/events/EventsDTO";
import ServicesTable from "@/page/services/ServicesTable";
import {useToast} from "@/components/ui/use-toast";
import {FormikValues} from "formik";
import ServiceAddModal from "@/page/services/ServiceAddModal";

function Services() {
    const { toast } = useToast()
    const { EventsApi } = useEventsApiContext();
    const [limit, setLimit] = useState(10);

    const [data, setData] = useState<ServicesPromiseData[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingCreate, setLoadingCreate] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedData, setSelectedData] = useState<ServicesPromiseData | Record<string, any>>({});

    const closeFunc = useCallback(() => setOpen(false),[])
    const openEdit = useCallback((values: ServicesPromiseData) => {
        setSelectedData(values);
        setOpen(true);
    }, []);
    const editService = useCallback((values: FormikValues) => {
        setLoadingCreate(true)
        EventsApi.editService(selectedData?.id, {
            name: values.name,
            price: values.price,
            priority: values.priority,
            type: "NOT_DEFINED",
            isPrimary: false,
            unitItem: values.unitItem.value,
            unitTime: values.unitTime.value,
            unitVolume: values.unitVolume.value,
            unitWeight: values.unitWeight.value
        }).then(() => {
            toast({
                title: "Успешно изменен",
                // description: "Friday, February 10, 2023 at 5:57 PM",
            })
            setLoading(true)
            EventsApi.getAllServices(Number(limit)).then((res) => {
                setData(res.data);
                setLoading(false)
            }).catch((error) => {
                toast({
                    title: error.data,
                    // description: "Friday, February 10, 2023 at 5:57 PM",
                })
                setLoading(false)
            })
            setLoadingCreate(false)
            setOpen(false)
        }).catch((error) => {
            toast({
                title: error.data,
                // description: "Friday, February 10, 2023 at 5:57 PM",
            })
            setLoadingCreate(false)
        })
    }, [EventsApi, selectedData, toast, limit])
    const createService = useCallback((values: FormikValues) => {
        setLoadingCreate(true)
        EventsApi.createService({
            name: values.name,
            price: values.price,
            priority: values.priority,
            type: "NOT_DEFINED",
            isPrimary: false,
            unitItem: values.unitItem.value,
            unitTime: values.unitTime.value,
            unitVolume: values.unitVolume.value,
            unitWeight: values.unitWeight.value
        }).then(() => {
            setLoading(true)
            EventsApi.getAllServices(Number(limit)).then((res) => {
                setData(res.data);
                setLoading(false)
            }).catch((error) => {
                toast({
                    title: error.data,
                    // description: "Friday, February 10, 2023 at 5:57 PM",
                })
                setLoading(false)
            })
            setLoadingCreate(false)
            setOpen(false)
            toast({
                title: "Успешно удален",
                // description: "Friday, February 10, 2023 at 5:57 PM",
            })
        }).catch((error) => {
            toast({
                title: error.data,
                // description: "Friday, February 10, 2023 at 5:57 PM",
            })
            setLoadingCreate(false)
        })
    }, [EventsApi, toast, limit])

    const deleteService = useCallback((id: string) => {
        EventsApi.deleteService(id).then(() => {
            setLoading(true)
            toast({
                title: "Успешно удален",
                // description: "Friday, February 10, 2023 at 5:57 PM",
            })
            EventsApi.getAllServices(Number(limit)).then((res) => {
                setData(res.data);
                setLoading(false)
            }).catch((error) => {
                toast({
                    title: error.data,
                    // description: "Friday, February 10, 2023 at 5:57 PM",
                })
                setLoading(false)
            })
        }).catch((error) => {
            toast({
                title: error.data,
                // description: "Friday, February 10, 2023 at 5:57 PM",
            })
        })
    }, [EventsApi, toast, limit]);

    useEffect(() => {
        setLoading(true)
        EventsApi.getAllServices(Number(limit)).then((res) => {
            setData(res.data);
            setLoading(false)
        }).catch((error) => {
            toast({
                title: error.data,
                // description: "Friday, February 10, 2023 at 5:57 PM",
            })
            setLoading(false)
        })
    }, [EventsApi, limit])

    return (
        <div className="mt-5 w-full">
            <button onClick={() => setOpen(true)} className="relative bg-teal-500 flex items-center text-[14px] text-white py-2 px-8 rounded-sm">
                <span className="">Создать</span>
                <PlusIcon className="absolute right-2 h-5 w-5"/>
            </button>
            <div className="w-full overflow-auto">
            <ServicesTable data={data} openEdit={openEdit} loading={loading} deleteItem={deleteService} />
            </div>
            <div className="flex justify-end mt-5">
                <span onClick={() => setLimit((prev) => prev + 10)} className="bg-green-500 cursor-pointer px-6 py-2 rounded-sm text-white">Показать еше</span>
            </div>
            <ServiceAddModal open={open} loading={loadingCreate} close={closeFunc} selectedData={selectedData} editService={editService} createService={createService}/>
        </div>
    );
}

export default Services;