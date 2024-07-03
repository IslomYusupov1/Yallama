import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {memo, useEffect, useMemo, useState} from "react";
import {AccessLogsPromiseData, EventsStatusEnum, SessionPromiseData} from "@/api/events/EventsDTO";
// import {useEventsApiContext} from "@/api/events/EventsContext";
// import {useToast} from "@/components/ui/use-toast";
import Select from "react-select";
import {customStyles} from "@/page/events/service/ServiceModalAdd";
import {ReloadIcon} from "@radix-ui/react-icons";
import {motion} from "framer-motion";
import {useEventsApiContext} from "@/api/events/EventsContext";

interface SelectProps {
    label: string,
    value: string,
    info: AccessLogsPromiseData | Record<string, any>
}

interface Props {
    readonly open: boolean;
    readonly close: () => void;
    readonly data: AccessLogsPromiseData | Record<string, any>;
    readonly plate: { number: string, id: string }
    readonly vehicles: SessionPromiseData[];
    readonly outGate: (sessionId: string) => void;
    readonly loadingOpen: boolean;
}

export default memo(function ShowDetailsModalOut({open, close, data, vehicles, outGate, loadingOpen}: Props) {
    const {EventsApi} = useEventsApiContext();
    // const { toast } = useToast()
    //
    // const [loading, setLoading] = useState<boolean>(false);
    const [licenseNumber, setLicenseNumber] = useState<SelectProps | any>({});
    const vehiclesOptions = useMemo(() => {
        const arr: SelectProps[] = [];
        vehicles?.forEach((x) => arr?.push({label: x?.vehicle?.licenseNumber, value: x?.vehicle?.id, info: x}))
        return arr;
    }, [vehicles])

    useEffect(() => {
        if (vehicles?.length > 0) {
        setLicenseNumber({label: data?.vehicle?.licenseNumber, value: data?.vehicle?.id, info: data})
        }
    }, [data, vehicles]);
    console.log(licenseNumber, "ff");
    const selectToCompare = (data: SelectProps) => {
        EventsApi.getAccessLogsDetails(data.label).then((res) => {
            setLicenseNumber({ label: data?.label, value: data?.value, info: res})
        })
    }
    return (
        <>
            <Dialog open={open} onOpenChange={close} modal={false}>
                {open && <div className="fixed top-0 left-0 w-screen h-screen"
                      style={{background: "rgba(0, 0, 0, 0.4)", zIndex: "1"}}/>}
                <DialogContent className="max-w-none max-w-[800px] h-[400px]">
                    <DialogHeader className="border-b pb-2">
                        <div className="flex justify-between text-center items-center mx-7">
                            <DialogTitle>О транспорте</DialogTitle>
                            {licenseNumber?.info?.session?.status === EventsStatusEnum.IN_PROGRESS &&
                                <button type="submit" onClick={() => outGate(licenseNumber?.info?.session?.id)}
                                        className={`${loadingOpen && "opacity-50"} outline-0 flex relative w-[150px] bg-teal-500 text-[14px] text-white py-2 px-8 rounded-l`}>
                            <span className="text-center items-center w-full">
                              {loadingOpen ? "Загрузка..." : "Выход"}
                            </span>
                                    {loadingOpen &&
                                        <ReloadIcon className="absolute right-3 top-2.5 h-4 w-4 animate-spin"/>}
                                </button>}
                        </div>
                    </DialogHeader>
                    <div className="flex gap-1">
                        <div className="w-1/2 border-r mx-1">
                            <div className="flex w-full flex-col pb-4">
                                <div className="gap-2 z-50 w-[350px] h-[210px] border-2">
                                    <motion.img
                                        className="object-cover bg-white w-full h-full"
                                        src={data?.file?.url}
                                        alt=""/>
                                </div>
                                <div className="flex flex-col w-11/12 gap-5 mt-4 z-40">
                                    <div className="flex justify-between">
                                        <span className="text-start opacity-75 text-[15px]">Номер: </span>
                                        <p className="text-end text-[13px]">{data?.vehicle?.licenseNumber}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-start opacity-75 text-[15px]">Статус: </span>
                                        <p className="text-end text-[13px]">{data?.session?.status}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-1/2">
                            <div className="flex w-full flex-col pb-4">
                                <div className="z-50 w-[350px] h-[210px] border-2">
                                    <motion.img
                                        className="object-cover bg-white "
                                        src={licenseNumber?.info?.file?.url}
                                        alt="Фото транспорта"/>
                                </div>
                                <div className="flex flex-col w-11/12 gap-2 mt-2 z-40">
                                    <div className="flex justify-between text-center items-center w-full">
                                        <span className="text-start opacity-50 text-[15px]">Номер: </span>
                                        <div className="text-[12px]">
                                            <Select
                                                className="w-full p-0"
                                                value={{value: licenseNumber?.value, label: licenseNumber.label}}
                                                onChange={(e: any) => selectToCompare(e)}
                                                options={vehiclesOptions}
                                                styles={customStyles}/>
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-start opacity-50 text-[15px]">Статус: </span>
                                        <p className="text-end text-[13px]">{licenseNumber?.info?.session?.status ?? licenseNumber?.info?.status}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*<div className="flex justify-between">*/}
                    {/*    <DialogFooter className="">*/}
                    {/*        <button type="submit" onClick={() => {*/}
                    {/*            setEdit(true);*/}
                    {/*            setLicenseNumber(plate?.number)*/}
                    {/*        }}*/}
                    {/*                className="bg-red-500 text-[14px] text-white py-2 px-8 rounded-l">Изменить номер*/}
                    {/*            транспорта*/}
                    {/*        </button>*/}
                    {/*    </DialogFooter>*/}
                    {/*</div>*/}
                </DialogContent>
            </Dialog>
            {/*<Dialog open={edit} onOpenChange={() => setEdit(false)}>*/}
            {/*    <DialogContent className="max-w-none w-[550px]">*/}
            {/*        <DialogHeader className="border-b pb-2">*/}
            {/*            <DialogTitle>Редактирование номера транспорта</DialogTitle>*/}
            {/*            /!*<DialogDescription>*!/*/}
            {/*            /!*    вся информация о транспорте.*!/*/}
            {/*            /!*</DialogDescription>*!/*/}
            {/*        </DialogHeader>*/}
            {/*        <input value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} className="shadow mt-2 appearance-none bg-white border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />*/}
            {/*        <DialogFooter className="mt-2">*/}
            {/*            <button type="submit" onClick={editLicenseNumber} disabled={loading}*/}
            {/*                    className={`${loading && "opacity-50"} relative bg-red-500 flex items-center text-[14px] text-white py-2 px-8 rounded-l`}>*/}
            {/*            <span className="mx-2">*/}
            {/*            {loading ? "Загрузка" : "Изменить"}*/}
            {/*            </span>*/}
            {/*                {loading && <ReloadIcon className="absolute right-3 h-4 w-4 animate-spin"/>}*/}
            {/*            </button>*/}
            {/*        </DialogFooter>*/}
            {/*    </DialogContent>*/}
            {/*</Dialog>*/}
        </>
    );
})