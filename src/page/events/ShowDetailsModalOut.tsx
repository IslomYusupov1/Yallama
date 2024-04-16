import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {memo, useEffect, useMemo, useState} from "react";
import {AccessLogsPromiseData, VehicleProps} from "@/api/events/EventsDTO";
// import {useEventsApiContext} from "@/api/events/EventsContext";
// import {useToast} from "@/components/ui/use-toast";
import Select from "react-select";
import {customStyles} from "@/page/events/service/ServiceModalAdd";

interface Props {
    readonly open: boolean;
    readonly close: () => void;
    readonly data: AccessLogsPromiseData | Record<string, any>;
    readonly plate: { number: string, id: string }
    readonly vehicles: VehicleProps[];
}

export default memo(function ShowDetailsModalOut({open, close, data, vehicles}: Props) {
    // const {EventsApi} = useEventsApiContext();
    // const { toast } = useToast()
    //
    // const [loading, setLoading] = useState<boolean>(false);
    const [licenseNumber, setLicenseNumber] = useState<{ label: string, value: string } | any>({});
    const vehiclesOptions = useMemo(() => {
        const arr: {label: string, value: string}[] = [];
        vehicles?.forEach((x) => arr?.push({ label: x.licenseNumber, value: x.id }))
        return arr;
    }, [vehicles])

    useEffect(() => {
        setLicenseNumber({label: data?.vehicle?.licenseNumber, value: data?.vehicle?.id})
    }, [data]);

    return (
        <>
            <Dialog open={open} onOpenChange={close}>
                <DialogContent className="max-w-none max-w-[700px]">
                    <DialogHeader className="border-b pb-2">
                        <DialogTitle>О транспорте</DialogTitle>
                        {/*<DialogDescription>*/}
                        {/*    вся информация о транспорте.*/}
                        {/*</DialogDescription>*/}
                    </DialogHeader>
                    <div className="flex gap-1">
                        <div className="w-1/2 border-r mx-6">
                            <div className="flex w-full pb-4">
                                <div className="gap-2">
                                    <img
                                        width={200}
                                        height={200}
                                        className="object-cover"
                                        src="https://static5.depositphotos.com/1038117/449/i/600/depositphotos_4494762-stock-photo-truck-on-highway-and-sunset.jpg"
                                        alt=""/>
                                </div>
                                <div className="flex flex-col w-3/4 gap-2 mx-2">
                                    <div className="flex justify-between">
                                        <span className="text-start opacity-50 text-[12px]">Номер: </span>
                                        <p className="text-end text-[13px]">{data?.vehicle?.licenseNumber}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-start opacity-50 text-[12px]">Статус: </span>
                                        <p className="text-end text-[13px]">{data?.session?.status}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-1/2 mx-6">
                            <div className="flex w-full pb-4">
                                <div className="gap-2">
                                    <img
                                        width={200}
                                        height={200}
                                        className="object-cover"
                                        src="https://static5.depositphotos.com/1038117/449/i/600/depositphotos_4494762-stock-photo-truck-on-highway-and-sunset.jpg"
                                        alt=""/>
                                </div>
                                <div className="flex flex-col w-3/4 gap-2 mx-2">
                                    <div className="flex justify-between text-center items-center w-full">
                                        <span className="text-start opacity-50 text-[12px]">Номер: </span>
                                        <div className="text-[13px]">
                                            <Select
                                                className="w-full p-0"
                                                value={licenseNumber}
                                                onChange={(e: any) => setLicenseNumber({ label: e.label, value: e.value })}
                                                options={vehiclesOptions} styles={customStyles} />
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-start opacity-50 text-[12px]">Статус: </span>
                                        <p className="text-end text-[13px]">{data?.session?.status}</p>
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