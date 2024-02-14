import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Field, Form, Formik, FormikValues} from "formik";
import {useEventsApiContext} from "@/api/events/EventsContext";
import {memo, useState} from "react";
import {ReloadIcon} from "@radix-ui/react-icons"
import {EventsStatusEnum, SessionPromiseData} from "@/api/events/EventsDTO";
import {useToast} from "@/components/ui/use-toast";

interface Props {
    readonly open: boolean;
    readonly close: () => void;
    readonly setNewData: (value: SessionPromiseData[]) => void;
}

export default memo(function AddModal({open, close, setNewData}: Props) {
    const [loading, setLoading] = useState(false);
    const {EventsApi} = useEventsApiContext();
    const { toast } = useToast()

    const createPlate = (values: FormikValues) => {
        setLoading(true)
        EventsApi.createPlate({plateNumber: values.plateNumber}).then(res => {
            if (res.id) {
                EventsApi.getFile().then(file => {
                    if (file?.data?.length > 0) {
                       EventsApi.createSession({
                           plateNumber: values?.plateNumber,
                           enterDate: new Date(),
                           fileId: file?.data[0]?.id
                       }).then(() => {
                           toast({
                               title: "Успешно создан",
                               // description: "Friday, February 10, 2023 at 5:57 PM",
                           })
                           setLoading(false)
                           close();
                           EventsApi.getEventsList({
                               status: EventsStatusEnum.NEW
                           }).then((res) => {
                               setLoading(false)
                                   setNewData(res.data)
                           }).catch((error) => {
                               toast({
                                   title: error.data,
                                   // description: "Friday, February 10, 2023 at 5:57 PM",
                               })
                               setLoading(false)
                           })
                       }).catch((error) => {
                           setLoading(false)
                           toast({
                               title: error.data,
                               // description: "Friday, February 10, 2023 at 5:57 PM",
                           })
                       })
                    }
                })
            }
        }).catch((error) => {
            toast({
                title: error.data,
                // description: "Friday, February 10, 2023 at 5:57 PM",
            })
            setLoading(false)
        })
    }
    return (
        <Dialog open={open} onOpenChange={close}>
            <DialogContent className="max-w-none w-[550px]">
                <DialogHeader className="border-b pb-2">
                    <DialogTitle>Добавление Транспорта</DialogTitle>
                    {/*<DialogDescription>*/}
                    {/*    вся информация о транспорте.*/}
                    {/*</DialogDescription>*/}
                </DialogHeader>
                <div className="flex gap-4 w-full">
                    <Formik initialValues={{plateNumber: ""}} onSubmit={(values) => createPlate(values)}>
                        {({handleSubmit}) => (
                            <Form onSubmit={handleSubmit} className="w-full">
                                <label htmlFor="" className="">Номер транспорта</label>
                                <Field name="plateNumber"
                                       className="shadow appearance-none bg-white border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                                <DialogFooter className="mt-4">
                                    <button type="submit" disabled={loading}
                                            className={`${loading && "opacity-50"} relative bg-red-500 flex items-center text-[14px] text-white py-2 px-8 rounded-l`}>
                        <span className="mx-2">
                        {loading ? "Загрузка" : "Создать"}
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
})