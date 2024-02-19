import {EventSessionServicePromiseData} from "@/api/events/EventsDTO";
import {CheckIcon} from "@radix-ui/react-icons"
import {EditIcon, TrashIcon} from "lucide-react";
import {memo} from "react";
import {useShallowEqualSelector} from "@/hooks/useShallowSelector";
import {tokenSelector} from "@/reducers/AuthReducer";
import jwt_decode from "jwt-decode";
import {RolesEnum} from "@/api/MainDTO";

interface Props {
    readonly data: EventSessionServicePromiseData[];
    readonly deleteItem: (sessionId: string) => void;
    readonly tookFunc: (sessionId: string) => void;
    readonly openEdit: (value: EventSessionServicePromiseData) => void;
    readonly totalPrice: number;
    readonly loading?: boolean;
}

export default memo(function ServiceEventTable({ data, deleteItem, totalPrice, tookFunc, openEdit }: Props) {
    const token = useShallowEqualSelector(tokenSelector);
    const tokenInfo = token && (jwt_decode(token ? token : "") as any);
    return (
        <table className="border-spacing-2 text-[15px] table-auto w-full overflow-auto border border-slate-500 mt-5 bg-[#f5f6f7]">
            <thead>
                <tr className="">
                    <th className="text-start py-1 px-2 border border-slate-300">Название</th>
                    <th align="center" className="py-1 px-2 border border-slate-300">Цена</th>
                    <th className="text-center py-1 px-2 border border-slate-300">Оплачено</th>
                    <th className="text-center py-1 px-2 border border-slate-300">Статус</th>
                    <th className="text-center py-1 px-2 border border-slate-300">Количество</th>
                    <th className="text-center py-1 px-2 border border-slate-300">Время</th>
                    <th className="text-center py-1 px-2 border border-slate-300">Обьем</th>
                    <th className="text-center py-1 px-2 border border-slate-300">Вес</th>
                    <th className="text-center py-1 px-2 border border-slate-300">Сумма</th>
                    <th className="text-center py-1 px-2 border border-slate-300">Услуга предоставлена</th>
                    {tokenInfo?.role !== RolesEnum.ACCOUNTANT && <th className="text-center py-1 px-2 border border-slate-300">Действие</th>}
                </tr>
            </thead>
            <tbody>
            {data?.map((items) => <tr key={items.id}>
                <td align="left" className="py-1 px-2 border border-slate-300">{items.name}
                </td>
                <td align="right" width={100} className="py-1 px-2 border border-slate-300">{items.price.toLocaleString("ru")}</td>
                <td align="center" className="py-1 px-2 border border-slate-300">{items?.isPaid ? "Да" : "Нет"}</td>
                <td align="center" width={50} className="py-1 px-2 border border-slate-300">{items?.status}</td>
                <td align="center" className="py-1 px-2 border border-slate-300">{items?.countItem ?? "0"}</td>
                <td align="center" className="py-1 px-2 border border-slate-300">{items?.countTime ?? "0"}</td>
                <td align="center" className="py-1 px-2 border border-slate-300">{items?.countVolume ?? "0"}</td>
                <td align="center" className="py-1 px-2 border border-slate-300">{items?.countWeight ?? "0"}</td>
                <td align="right" width={100} className="py-1 px-2 border border-slate-300">{items?.totalPrice.toLocaleString("ru")}</td>
                <td align="center" className="py-1 px-2 border border-slate-300">
                    {items?.tookDate ? <CheckIcon className="bg-teal-500 text-white h-4 w-4"/> :
                        <button disabled={tokenInfo?.role === RolesEnum.ACCOUNTANT}
                                className="bg-red-600 cursor-pointer px-2 py-1 rounded-sm text-white"
                                onClick={() => tookFunc(items?.id)}>Взять</button>}
                </td>
                {tokenInfo?.role !== RolesEnum.ACCOUNTANT && <td align="center" className="py-1 px-2 border border-slate-300">
                    <div className="flex justify-center gap-4">
                        <EditIcon className="w-4 h-4 cursor-pointer" onClick={() => openEdit(items)}/>
                        <TrashIcon className="w-4 h-4 cursor-pointer" onClick={() => deleteItem(items.id)}/>
                    </div>
                </td>}
            </tr>)}
            </tbody>
            <tbody>
            <td align="left" className="py-1 px-2 border border-slate-300" />
            <td align="right" width={100} className="py-1 px-2 border border-slate-300" />
            <td align="center" className="py-1 px-2 border border-slate-300" />
            <td align="center" width={50} className="py-1 px-2 border border-slate-300" />
            <td align="center" className="py-1 px-2 border border-slate-300" />
            <td align="center" className="py-1 px-2 border border-slate-300" />
            <td colSpan={2} width={200} align="left" className="py-1 px-2 border font-medium border-slate-300" > Общая сумма:</td>
            <td align="right" width={120} className="py-1 px-2 font-medium border border-slate-300">{totalPrice?.toLocaleString("ru")}</td>
            <td align="center" className="py-1 px-2 border border-slate-300" />
            {tokenInfo?.role !== RolesEnum.ACCOUNTANT && <td align="center" className="py-1 px-2 border border-slate-300" />}
            </tbody>
        </table>
    );
})

