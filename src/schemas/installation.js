import employee from "./employee"

export default {
    name: "",
    address: "",
    business_id: null,
    auditable_id: null,
    province_id: null,
    periodicity: null,
    file_document: {
        base64: "",
        file: []
    },
    auditable: null,
    operation_types_ids: [],
    deposit_types_ids: [],
    equipments_ids: [],
    responsible: employee,
}