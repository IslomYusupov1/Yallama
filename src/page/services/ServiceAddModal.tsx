import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Field, Form, Formik, FormikValues} from "formik";
import Select from "react-select";
import {ReloadIcon} from "@radix-ui/react-icons";
import {useMemo} from "react";
import {ServicesPromiseData} from "@/api/events/EventsDTO";
import {unitItemSelect, unitTimeSelect, unitVolumeSelect, unitWeightSelect} from "@/page/services/Options";

interface Props {
    readonly open: boolean;
    readonly loading: boolean;
    readonly close: () => void;
    readonly selectedData: ServicesPromiseData | Record<string, any>;
    readonly editService: (values: FormikValues) => void;
    readonly createService: (values: FormikValues) => void;
}

const customStyles = {
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
function ServiceAddModal({ open, close, loading, selectedData, editService, createService }: Props) {
    const initialValues = useMemo(() => {
        return {
            name: selectedData?.name ?? "",
            price: selectedData?.price ?? "",
            unitItem: selectedData?.unitItem ? {label: selectedData?.unitItem, value: selectedData?.unitItem} : "",
            unitTime: selectedData?.unitTime ? {label: selectedData?.unitTime, value: selectedData?.unitTime} : "",
            unitVolume: selectedData?.unitVolume ? {label: selectedData?.unitVolume, value: selectedData?.unitVolume} : "",
            unitWeight: selectedData?.unitWeight ? {label: selectedData?.unitWeight, value: selectedData?.unitWeight} : "",
            priority: selectedData?.priority ?? "",
        }
    }, [selectedData])
    return (
        <Dialog open={open} onOpenChange={close} modal={false}>
            {open && <div className="fixed top-0 left-0 w-screen h-screen"
                          style={{background: "rgba(0, 0, 0, 0.4)", zIndex: "1"}}/>}
            <DialogContent className="max-w-none w-[550px] shadow-teal-100 border-2">
                <DialogHeader className="border-b pb-2">
                    <DialogTitle>Добавление Сервиса</DialogTitle>
                    {/*<DialogDescription>*/}
                    {/*    вся информация о транспорте.*/}
                    {/*</DialogDescription>*/}
                </DialogHeader>
                <div className="flex gap-4 w-full">
                    <Formik initialValues={initialValues} onSubmit={(values) => selectedData?.id ? editService(values) : createService(values)} enableReinitialize={true}>
                        {({handleSubmit}) => (
                            <Form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                                <div className="w-full">
                                    <label htmlFor="" className="">Название</label>
                                    <Field name="name">
                                        {({field, form}: any) => (
                                            <textarea
                                                className="appearance-none bg-white border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                                                {...field} cols={20} rows={4} onChange={(e) => form.setFieldValue("name", e.target.value)} />
                                        )}
                                    </Field>
                                </div>
                                <div className="w-full flex gap-2">
                                    <div className="w-full relative">
                                        <label htmlFor="" className="">Единица измерения (время)</label>
                                        <Field name="unitTime">
                                            {({ form, field }: any) => (
                                                <Select
                                                    options={unitTimeSelect}
                                                    placeholder="Выберите" {...field}
                                                    styles={customStyles}
                                                    onChange={(e) => form.setFieldValue("unitTime", e)} />
                                            )}
                                        </Field>
                                    </div>
                                    <div className="w-full relative">
                                        <label htmlFor="" className="">Единица измерения (штук) </label>
                                        <Field name="unitItem">
                                            {({ form, field }: any) => (
                                                <Select
                                                    options={unitItemSelect}
                                                    placeholder="Выберите"
                                                    {...field}
                                                    styles={customStyles}
                                                    onChange={(e) => form.setFieldValue("unitItem", e)} />
                                            )}
                                        </Field>
                                    </div>
                                </div>
                                <div className="w-full flex gap-2">
                                    <div className="w-full relative">
                                        <label htmlFor="" className="">Единица измерения (обьем)</label>
                                        <Field name="unitVolume">
                                            {({ form, field }: any) => (
                                                <Select
                                                    options={unitVolumeSelect}
                                                    placeholder="Выберите"
                                                    {...field}
                                                    styles={customStyles}
                                                    onChange={(e) => form.setFieldValue("unitVolume", e)} />
                                            )}
                                        </Field>
                                    </div>
                                    <div className="w-full relative">
                                        <label htmlFor="" className="">Единица измерения (вес)</label>
                                        <Field name="unitWeight">
                                            {({ form, field }: any) => (
                                                <Select
                                                    options={unitWeightSelect}
                                                    placeholder="Выберите"
                                                    {...field}
                                                    styles={customStyles}
                                                    onChange={(e) => form.setFieldValue("unitWeight", e)} />
                                            )}
                                        </Field>
                                    </div>
                                </div>
                                <div className="w-full flex gap-2">
                                    <div className="w-full relative">
                                        <label htmlFor="" className="">Порядок отображения</label>
                                        <Field
                                            name="priority"
                                            type="number"
                                            className="appearance-none bg-white border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"/>
                                    </div>
                                    <div className="w-full relative">
                                        <label htmlFor="" className="">Цена</label>
                                        <Field
                                            name="price"
                                            type="number"
                                            className="appearance-none bg-white border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"/>
                                    </div>
                                </div>
                                {/*{ selectedValue.data?.id && selectedValue?.data?.unitVolume !== null && <div className="w-1/4 relative">*/}
                                {/*    <Field name="countVolume" type="number" onInput={() => setFieldValue("serviceId", selectedValue?.value)}*/}
                                {/*           className="appearance-none bg-white border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"/>*/}
                                {/*    <span className="absolute text-[12px] bg-white right-2 top-2.5">{selectedValue?.data?.unitVolume}</span>*/}
                                {/*</div>}*/}
                                <DialogFooter className="mt-4">
                                    <button type="submit" disabled={loading}
                                            className={`${loading && "opacity-50"} relative bg-teal-500 flex items-center text-[14px] text-white py-2 px-8 rounded-sm`}>
                        <span className="mx-2">
                        {loading ? "Загрузка" : (selectedData?.id ? "Изменить" : "Создать")}
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
    );
}

export default ServiceAddModal;