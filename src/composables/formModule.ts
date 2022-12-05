import { reactive } from "vue";
import { fromJS } from "immutable";

export function submitService() {
    let formActionState = reactive({
        // 提交状态
        loading: false,
        // 节流
        timer: null as NodeJS.Timeout | null,
    });
    async function submitAction(callback: Function) {
        formActionState.loading = true;
        if (formActionState.timer) {
            clearTimeout(formActionState.timer);
        }
        // 防止快速的重复点击
        formActionState.timer = setTimeout(async () => {
            try {
                await callback();
            } catch (e) {
                console.log("submit action error:", e);
            } finally {
                if (formActionState.timer) {
                    clearTimeout(formActionState.timer);
                }
                formActionState.loading = false;
            }
        }, 200);
    }
    return {
        formActionState,
        submitAction,
    };
}

export const deleteService = () => {
    interface DeleteDataInterface {
        id: number;
        [attr: string]: any;
    }
    let deleteServiceState = reactive({
        delShow: false,
        deleteRow: <DeleteDataInterface>{
            id: -1,
        },
    });

    function viewDeleteAction(delRow: any) {
        deleteServiceState.deleteRow = fromJS(
            delRow
        ).toJS() as DeleteDataInterface;
        deleteServiceState.delShow = true;
    }
    return {
        deleteServiceState,
        viewDeleteAction,
    };
};
