import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {memo} from "react";
import {SessionPromiseData} from "@/api/events/EventsDTO";
import  moment from "moment";
import {useNavigate} from "react-router";
import {RoutesEnum} from "@/components/routes/Routes";

interface Props {
    readonly open: boolean;
    readonly close: () => void;
    readonly data: SessionPromiseData | Record<string, any>;
    readonly plate: {number: string, id: string}
}

export default memo(function ShowDetailsModal({ open, close, data, plate }: Props) {
    const navigate = useNavigate();
    return (
        <Dialog open={open} onOpenChange={close}>
            <DialogContent className="max-w-none w-[550px]">
                <DialogHeader className="border-b pb-2">
                    <DialogTitle>О транспорте</DialogTitle>
                    {/*<DialogDescription>*/}
                    {/*    вся информация о транспорте.*/}
                    {/*</DialogDescription>*/}
                </DialogHeader>
                <div className="flex gap-4 w-full border-b pb-4">
                    <div className="w-1/2">
                        <img src="https://static5.depositphotos.com/1038117/449/i/600/depositphotos_4494762-stock-photo-truck-on-highway-and-sunset.jpg" alt=""/>
                    </div>
                    <div className="flex flex-col w-1/2 gap-4">
                        <div className="flex justify-between">
                            <span className="text-start opacity-50 text-[15px]">Номер транспорта: </span>
                            <p className="text-end">{plate.number}</p>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-start opacity-50 text-[15px]">Entered Date: </span>
                            <p className="text-end">{moment(data?.enterData).format("DD.MM.YYYY HH:mm")}</p>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-start opacity-50 text-[15px]">Статус: </span>
                            <p className="text-end text-[15px]">{data?.status}</p>
                        </div>
                    </div>
                </div>
                <DialogFooter className="">
                    <button type="submit" onClick={() => navigate(RoutesEnum.EventService + `?id=${data?.id}`)} className="bg-red-500 text-[14px] text-white py-2 px-8 rounded-l">Добавить услугу</button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
})