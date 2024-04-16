import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {memo, useState} from "react";
import {AccessLogsPromiseData, EventsStatusEnum} from "@/api/events/EventsDTO";
import {useNavigate} from "react-router";
import {RoutesEnum} from "@/components/routes/Routes";
import {ReloadIcon} from "@radix-ui/react-icons";
import {useEventsApiContext} from "@/api/events/EventsContext";
import {useToast} from "@/components/ui/use-toast";

interface Props {
    readonly open: boolean;
    readonly close: () => void;
    readonly data: AccessLogsPromiseData | Record<string, any>;
    readonly plate: { number: string, id: string };
    readonly openGate: (sessionId: string) => void;
    readonly outGate: (sessionId: string) => void;
    readonly loadingOpen: boolean;
}

export default memo(function ShowDetailsModal({open, close, data, plate, openGate, loadingOpen, outGate}: Props) {
    const navigate = useNavigate();
    const {EventsApi} = useEventsApiContext();
    const { toast } = useToast()

    const [edit, setEdit] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [licenseNumber, setLicenseNumber] = useState<string>(plate?.number);

    const editLicenseNumber = () => {
        setLoading(true);
        EventsApi.changeLicenseNumber(data?.id, licenseNumber).then(() => {
            setLoading(false);
            setEdit(false);
        }).catch((error) => {
            setLoading(false);
            toast({
                title: error.data,
                // description: "Friday, February 10, 2023 at 5:57 PM",
            })
        })
    }

    return (
        <>
            <Dialog open={open} onOpenChange={close}>
                <DialogContent className="max-w-none w-[550px]">
                    <DialogHeader className="border-b pb-2">
                        <div className="flex text-center items-center justify-between mx-4">
                            <DialogTitle>О транспорте</DialogTitle>
                            {/*<DialogDescription>*/}
                            {/*    вся информация о транспорте.*/}
                            {/*</DialogDescription>*/}
                            {data?.session?.status === EventsStatusEnum.IN_PROGRESS &&
                                <button type="submit" onClick={() => outGate(data?.session?.id)}
                                        className={`${loadingOpen && "opacity-50"} outline-0 flex relative bg-teal-500 text-[14px] text-white py-2 px-8 rounded-l`}>
                                <span>
                                  {loadingOpen ? "Загрузка..." : "Выход"}
                                </span>
                                    {loadingOpen && <ReloadIcon className="absolute right-3 top-2.5 h-4 w-4 animate-spin"/>}
                                </button>}
                        </div>
                    </DialogHeader>
                    <div className="flex gap-4 w-full border-b pb-4">
                        <div className="">
                            <img
                                width={200}
                                height={200}
                                className="object-cover"
                                src={data?.file?.url}
                                alt=""/>
                        </div>
                        <div className="flex flex-col w-1/2 gap-4">
                            <div className="flex justify-between">
                                <span className="text-start opacity-50 text-[15px]">Номер транспорта: </span>
                                <p className="text-end">{data?.vehicle?.licenseNumber}</p>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-start opacity-50 text-[15px]">Статус: </span>
                                <p className="text-end text-[15px]">{data?.session?.status}</p>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className=" w-full">
                    <div className="flex justify-between w-full">
                            <button type="submit" onClick={() => {
                                setEdit(true);
                                setLicenseNumber(plate?.number)
                            }}
                                    className="bg-red-500 outline-0 text-[14px] text-white py-2 px-8 rounded-l">Изменить номер
                                транспорта
                            </button>
                        {data?.session?.status === EventsStatusEnum.NEW ?
                            <button type="submit" onClick={() => openGate(data?.session?.id)}
                            className={`${loadingOpen && "opacity-50"} outline-0 flex relative bg-teal-500 text-[14px] text-white py-2 px-8 rounded-l`}>
                                <span>
                                  {loadingOpen ? "Загрузка..." : "Открыть шлакбаум"}
                                </span>
                                {loadingOpen && <ReloadIcon className="absolute right-3 top-2.5 h-4 w-4 animate-spin"/>}
                            </button>
                            : <button type="submit" onClick={() => navigate(RoutesEnum.EventService + `?id=${data?.session?.id}`)}
                                 className="bg-teal-500 text-[14px] outline-0 text-white py-2 px-8 rounded-l">Перейти к услугам
                        </button>}
                    </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={edit} onOpenChange={() => setEdit(false)}>
                <DialogContent className="max-w-none w-[550px]">
                    <DialogHeader className="border-b pb-2">
                        <DialogTitle>Редактирование номера транспорта</DialogTitle>
                        {/*<DialogDescription>*/}
                        {/*    вся информация о транспорте.*/}
                        {/*</DialogDescription>*/}
                    </DialogHeader>
                    <input value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} className="shadow mt-2 appearance-none bg-white border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    <DialogFooter className="mt-2">
                        <button type="submit" onClick={editLicenseNumber} disabled={loading}
                                className={`${loading && "opacity-50"} relative bg-red-500 flex outline-0 items-center text-[14px] text-white py-2 px-8 rounded-l`}>
                        <span className="mx-2">
                        {loading ? "Загрузка" : "Изменить"}
                        </span>
                            {loading && <ReloadIcon className="absolute right-3 h-4 w-4 animate-spin"/>}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
})