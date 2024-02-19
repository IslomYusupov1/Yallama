import {ServicesPromiseData} from "@/api/events/EventsDTO";
import {EditIcon, TrashIcon} from "lucide-react";
import {memo} from "react";

interface Props {
    readonly data: ServicesPromiseData[];
    readonly deleteItem: (sessionId: string) => void;
    readonly openEdit: (value: ServicesPromiseData) => void;
    readonly loading?: boolean;
}

export default memo(function ServiceTable({ data, deleteItem, openEdit }: Props) {
    return (
        <table className="border-spacing-2 text-[15px] table-auto w-full overflow-auto border border-slate-500 mt-5 bg-[#f5f6f7]">
            <thead>
               <tr className="">
                   <th className="text-start py-1 px-2 border border-slate-300">Название</th>
                   <th align="center" className="py-1 px-2 border border-slate-300">Цена</th>
                   <th className="text-center py-1 px-2 border border-slate-300">Приоритет</th>
                   <th className="text-center py-1 px-2 border border-slate-300">Количество</th>
                   <th className="text-center py-1 px-2 border border-slate-300">Время</th>
                   <th className="text-center py-1 px-2 border border-slate-300">Обьем</th>
                   <th className="text-center py-1 px-2 border border-slate-300">Вес</th>
                   <th className="text-center py-1 px-2 border border-slate-300">Действие</th>
               </tr>
            </thead>
            <tbody>
            {data?.map((items) => <tr key={items.id}>
                <td align="left" className="py-1 px-2 border border-slate-300">{items.name}
                </td>
                <td align="right" width={100} className="py-1 px-2 border border-slate-300">{items.price.toLocaleString("ru")}</td>
                <td align="center" className="py-1 px-2 border border-slate-300">{items?.priority}</td>
                <td align="center" className="py-1 px-2 border border-slate-300">{items?.unitItem ?? "0"}</td>
                <td align="center" className="py-1 px-2 border border-slate-300">{items?.unitTime ?? "0"}</td>
                <td align="center" className="py-1 px-2 border border-slate-300">{items?.unitVolume ?? "0"}</td>
                <td align="center" className="py-1 px-2 border border-slate-300">{items?.unitWeight ?? "0"}</td>
                <td align="center" className="py-1 px-2 border border-slate-300">
                    <div className="flex justify-center gap-4">
                        <EditIcon className="w-4 h-4 cursor-pointer" onClick={() => openEdit(items)} />
                        <TrashIcon className="w-4 h-4 cursor-pointer" onClick={() => deleteItem(items.id)}/>
                    </div>
                </td>
            </tr>)}
            </tbody>
        </table>
    );
})

