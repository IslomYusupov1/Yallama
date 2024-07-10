import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Field, Form, Formik, FormikValues} from "formik";
import {ReloadIcon} from "@radix-ui/react-icons";
import {useEffect, useMemo, useState} from "react";
import Select from "react-select";
import {EventSessionServicePromiseData, ServicesPromiseData} from "@/api/events/EventsDTO";
import {SearchIcon} from "lucide-react";

interface Props {
    readonly open: boolean;
    readonly close: () => void;
    readonly loading: boolean;
    readonly createService: (values: FormikValues) => void;
    readonly editService: (values: FormikValues) => void;
    readonly selectServiceOptions: { label: string, value: string, data: ServicesPromiseData }[]
    readonly serviceData: ServicesPromiseData[]
    readonly selectedData: EventSessionServicePromiseData | Record<string, any>;
}

export const customStyles = {
    control: (baseStyles: any, state: any) => ({
        ...baseStyles,
        "&:hover": {
            borderColor: "#00B3A8",
            color: "#00B3A8",
        },
        borderColor: state.isFocused ? "#00B3A8" : "rgba(0, 0, 0, 0.16)",
        borderRadius: "6px",
        border: state.isFocused ? "1px solid #00B3A8" : "1px solid rgba(0, 0, 0, 0.16)",
        boxShadow: 0,
    }),
    menu: (base: any) => ({
        ...base,
        zIndex: 100,
    }),
    dropdownIndicator: (base: any, state: any) => ({
        ...base,
        color: state.isSelected ? "#00B3A8" : "",
    }),
    // singleValue: (base: any) => ({
    //   ...base,
    //   color: "#00B3A8",
    // }),
    option: (styles: any, { isFocused }: any) => ({
        ...styles,
        backgroundColor: isFocused ? "#00B3A8" : "transparent",
        color: isFocused ? "white" : "rgba(0, 0, 0, 0.7)",
        zIndex: 100,
    }),
};

function ServiceModalAdd({open, close, loading, createService, selectServiceOptions, serviceData, selectedData, editService}: Props) {
    const [selectedValue, setSelectedValue] = useState<{label: string, value: string; data: ServicesPromiseData | null}>({label: "", value: "", data: null});
    const [search, setSearch] = useState(false);

    const initialValues = useMemo(() => {
        return {
            serviceId: selectedData?.serviceId,
            countTime: selectedData?.countTime,
            countItem: selectedData?.countItem,
            countWeight: selectedData?.countWeight,
            countVolume: selectedData?.countVolume,
        }
    }, [selectedData]);
    useEffect(() => {
        if (selectedData?.id) {
          const filteredData = serviceData?.find(service => service?.id === selectedData?.serviceId);
          if (filteredData) {
              setSelectedValue({ label: filteredData?.name, value: filteredData?.id, data: filteredData })
          }
        }
    }, [selectedData, serviceData])
    useEffect(() => {
        if (!open) {
            setSelectedValue({label: "", value: "", data: null})
        }
    }, [open])
    return (
        <>
            <Dialog open={open} onOpenChange={close} modal={false}>
                {open && <div className="fixed top-0 left-0 w-screen h-screen"
                              style={{background: "rgba(0, 0, 0, 0.4)", zIndex: "1"}}/>}
                <DialogContent className="max-w-none w-[550px]">
                    <DialogHeader className="border-b pb-2">
                        <DialogTitle>Добавление сервиса</DialogTitle>
                        {/*<DialogDescription>*/}
                        {/*    вся информация о транспорте.*/}
                        {/*</DialogDescription>*/}
                    </DialogHeader>
                    <div className="flex gap-4 w-full">
                        <Formik initialValues={initialValues} onSubmit={(values) => selectedData?.id ? editService(values) : createService(values)} enableReinitialize={true}>
                            {({handleSubmit, setFieldValue}) => (
                                <Form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                                    <div className="w-full relative">
                                        <label htmlFor="" className="">Название</label>
                                        <Select autoFocus={false} isSearchable={false}  className="" options={selectServiceOptions} value={selectedValue} styles={customStyles}
                                                onChange={(e: any) => {setSelectedValue(e)}}/>
                                        <SearchIcon className="absolute bg-white right-12 top-8 cursor-pointer"  onClick={() => setSearch(true)} />
                                    </div>
                                    {selectedValue.data?.id && selectedValue.data?.unitTime !== null && <div className="w-1/4 relative">
                                        <Field name="countTime" type="number" onInput={() => setFieldValue("serviceId", selectedValue?.value)}
                                               className="appearance-none bg-white border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"/>
                                        <span className="absolute text-[12px] bg-white right-2 top-2.5">{selectedValue.data?.unitTime}</span>
                                    </div>}
                                    { selectedValue.data?.id && selectedValue?.data?.unitItem !== null && <div className="w-1/4 relative">
                                        <Field name="countItem" type="number" onInput={() => setFieldValue("serviceId", selectedValue?.value)}
                                               className="appearance-none bg-white border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"/>
                                        <span className="absolute text-[12px] bg-white right-2 top-2.5">{selectedValue?.data?.unitItem}</span>
                                    </div>}
                                    { selectedValue.data?.id && selectedValue?.data?.unitWeight !== null && <div className="w-1/4 relative">
                                        <Field name="countWeight" type="number" onInput={() => setFieldValue("serviceId", selectedValue?.value)}
                                               className="appearance-none bg-white border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"/>
                                        <span className="absolute text-[12px] bg-white right-2 top-2.5">{selectedValue?.data?.unitWeight}</span>
                                    </div>}
                                    { selectedValue.data?.id && selectedValue?.data?.unitVolume !== null && <div className="w-1/4 relative">
                                        <Field name="countVolume" type="number" onInput={() => setFieldValue("serviceId", selectedValue?.value)}
                                               className="appearance-none bg-white border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"/>
                                        <span className="absolute text-[12px] bg-white right-2 top-2.5">{selectedValue?.data?.unitVolume}</span>
                                    </div>}
                                    <DialogFooter className="mt-4">
                                        <button type="submit" disabled={loading}
                                                className={`${loading && "opacity-50"} relative bg-teal-500 flex items-center text-[14px] text-white py-2 px-8 rounded-sm`}>
                        <span className="mx-2">
                        {loading ? "Загрузка" : (selectedData?.id ? "Изменить" : "Добавить")}
                        </span>
                                            {loading && <ReloadIcon className="absolute right-3 h-4 w-4 animate-spin"/>}
                                        </button>
                                    </DialogFooter>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog open={search} onOpenChange={() => setSearch(false)} modal={false}>
                {search && <div className="fixed top-0 left-0 w-screen h-screen"
                              style={{background: "rgba(0, 0, 0, 0.4)", zIndex: "1"}}/>}
                <DialogContent className="max-w-none lg:w-[750px] max-w-[700px] overflow-auto">
                    <DialogHeader className="border-b pb-2">
                        <DialogTitle>Выберите услугу</DialogTitle>
                        <div className="flex gap-4">
                            <input type="search" placeholder="Что искать?" className="appearance-none bg-white border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"/>
                            <button className="bg-red-500 flex items-center text-[14px] text-white py-2 px-8 rounded-sm">Поиск</button>
                        </div>
                    </DialogHeader>
                    <div className="gap-4 text-[12px]" style={{ maxHeight: "550px" }}>
                                   <table className="border-spacing-2 text-[12px] table-fixed border-b">
                                       <thead className="border-b border-black">
                                       <tr>
                                           <th className="text-start py-1 px-2">Название</th>
                                           <th className="text-center py-1 px-2">Количество</th>
                                           <th className="text-center py-1 px-2">Время</th>
                                           <th className="text-center py-1 px-2">Обьем</th>
                                           <th className="text-center py-1 px-2">Вес</th>
                                           <th className="text-center py-1 px-2">Цена</th>
                                           <th className="text-center py-1 px-2">Основной</th>
                                           <th className="text-center py-1 px-2">Тип</th>
                                       </tr>
                                       </thead>
                                       <tbody className="text-start py-1 px-2 border-b border-slate-300 overflow-auto">
                                       {serviceData?.map(service => (
                                           <tr key={service.id}
                                               onClick={() => {
                                                   setSelectedValue({label: service?.name, value: service?.id, data: service});
                                                   setSearch(false)
                                               }}
                                               className="border-b  hover:bg-green-500 hover:text-white transition-all cursor-pointer">
                                               <td align="left">{service?.name}</td>
                                               <td align="center">{service?.unitItem ?? "-"}</td>
                                               <td align="center">{service?.unitTime ?? "-"}</td>
                                               <td align="center">{service?.unitVolume ?? "-"}</td>
                                               <td align="center">{service?.unitWeight ?? "-"}</td>
                                               <td align="center">{service?.price.toLocaleString("ru")}</td>
                                               <td align="center">{service?.isPrimary ? "Да" : "Нет"}</td>
                                               <td align="center">{service?.type}</td>
                                           </tr>
                                           ))
                                       }
                                       </tbody>
                                   </table>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default ServiceModalAdd;