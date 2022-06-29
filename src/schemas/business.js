import address from "./address"

export default {
    name: null,
    property_phone: null,
    property_email: null,
    property_dni: null,
    business_phone: null,
    delegate_id: null,
    address: { ...address },
    business_nif: null,
    property_name: null,
    property_last_name: null,
    province_id: null,
    email: null,
    bank_code: null,
    iban_number: null,
    holder_name: null,
    file_document: {
        base64: null,
        file: null,
        file_name: null
    },
    file_date: "",
}