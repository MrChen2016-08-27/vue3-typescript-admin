import { reactive } from "vue";

export default function () {
    let formActionState = reactive({
        // 提交状态
        loading: false,
        // 节流
        timer: null,
    });
    async function submitAction(callback) {
        formActionState.loading = true;
        clearTimeout(formActionState.timer);
        formActionState.timer = setTimeout(async () => {
            try {
                await callback();
            } catch(e) {
                console.log('submit action error:', e);
            } finally {
                clearTimeout(formActionState.timer);
                formActionState.loading = false;
            }
        }, 300);
    }
    return {
        formActionState,
        submitAction,
    };
}


export const deleteService = () => {
    interface DeleteDataInterface {
        id: number,
        [attr: string]: any
    };
    let deleteServiceState = {
        delShow: false,
        deleteRow: <DeleteDataInterface>{
            id: -1
        }
    }

    function viewDeleteAction(delRow: any) {
       deleteServiceState.selectRow = fromJS(delRow).toJS();
       deleteServiceState.delShow = true;
    }
    return {
        deleteServiceState,
        viewDeleteAction
    }
}
