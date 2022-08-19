import { filter, forEach, includes, isArray, isEmpty, isEqual, isObject, keys, transform } from "lodash";
import schemasRepo from "../schemas";
// import TimeAgo from 'javascript-time-ago'

// // English.
// import esp from 'javascript-time-ago/locale/es'

// TimeAgo.addDefaultLocale(esp)
// const $timeAgo = new TimeAgo('en-US')

function cleanData(model, excludes = [], includes = [], formData = false) {
    let data = pruneData(copy(model), excludes, includes);
    if (formData) {
        data = toFormData(data);
    }
    return data
}
function toFormData(data, ignore = []) {
    const dataForm = new FormData
    const keysData = keys(data)
    
    forEach(keysData, (k) => {
        let d = data[k]
        if (isObject(d)){
            d = JSON.stringify(d)
        }
        if (!ignore.includes(k)) {
            dataForm.append(k, d)
        }
    })
    return dataForm
}
function pruneData(object, excludes = []) {
    console.log(object, 'keinher');
    Object
        .entries(object)
        .forEach(([k, v]) => {
            if (v && typeof v === 'object')
                pruneData(v);
            if (v &&
                typeof v === 'object' &&
                !Object.keys(v).length ||
                v === null ||
                v === undefined ||
                v.length === 0
            ) {
                if (Array.isArray(object))
                    object.splice(k, 1);
                else if (includes(excludes))
                    delete object[k];
                else
                    delete object[k]
            }
        });
    return object;
}
function copy(data) {
    return JSON.parse(JSON.stringify(data))
}
function rolename(role) {
    switch (role) {
        case 1:
            role = 'admin';
            break;
        case 2:
            role = 'delegate';
            break;
        case 3:
            role = 'auditor';
            break;
        case 4:
            role = 'business';
            break;

        default:
            role = false
            break;
    }
    return role;
}
function pluck(arr, key) {
    return arr.map(i => i[key]);
}
function filterDoc(arr, doc_name) {
    return filter(arr, function (o) { return o.type.name == doc_name })[0]
}

/**
 * 
 * @param {Object} obj Original model data to compare
 * @param {Object} newObj Actual model data to compare
 * @param {Array} ignore Index key to ignore validation
 * @returns 
 */
function difference(obj, newObj, ignore = []) {
    let arrayIndexCounter = 0
    return transform(newObj, function (result, value, key) {
        let resultKey = isArray(obj) ? arrayIndexCounter++ : key
        if (!isEqual(value, obj[key]) && !ignore.includes(key)) {
            result[resultKey] = (isObject(value) && isObject(obj[key])) ? difference(obj[key],value) : value
        }else if(ignore.includes(key)){
            result[resultKey] = value
        }
    })
}

function empty(data) {
    return isEmpty(data)
}
function status(status) {
    let type = "";
    switch (status) {
        case "PENDIENTE":
            type = "danger";
            break;
        case "POR REVISAR":
            type = "warning";
            break;
        case "COMPLETADO":
            type = "success";
            break;

        default:
            break;
    }
    return type;
}
function schemas(type) {
    return copy(schemasRepo[type]) ?? null
}
function toCapitalize(string){
    string = string ? string.toLowerCase() : null; 
    return string ? string.replace(/^\w/, (c) => c.toUpperCase()) : '';
}
function assignSchema(sch, model, relationSchemas = []){
    const schema = schemas(sch);
    const m_keys = keys(model);

    forEach(m_keys, (key) => {
        if (relationSchemas.includes(key)) {
            schema[key] = assignSchema(key, model[key]);
        }else{
            schema[key] = model[key] ? model[key] : schema[key]
        }
    })
    return schema
}
async function compressImage(imgToCompress, resizingFactor = 0.8, quality = 0.6) {
    return new Promise((resolve) => {
        // showing the compressed image
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        const originalWidth = imgToCompress.width;
        const originalHeight = imgToCompress.height;
        console.log(originalHeight, originalWidth);
        if (originalWidth >= 700) {
            resizingFactor = 0.5
        }
        const canvasWidth = originalWidth * resizingFactor;
        const canvasHeight = originalHeight * resizingFactor;

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        context.drawImage(
            imgToCompress,
            0,
            0,
            originalWidth * resizingFactor,
            originalHeight * resizingFactor
        );

        // reducing the quality of the image
        canvas.toBlob(
            (blob) => {
                if (blob) {
                    // let compressedImageBlob = blob;
                    resolve(blob)
                    // let src = URL.createObjectURL(compressedImageBlob);
                }
            },
            "image/jpeg",
            quality
        )
    })
}
function formatDate(date, format = "en-US") {
    return new Date(date).toLocaleDateString(format);
}
function timeAgo(time){
    const date = new Date(time)
    return date;
    // console.log(date);
    // const today = new Date();

    // $timeAgo.format(today - date)
}
function formatDoc(b64) {
    var byteCharacters = atob(b64);
    var byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);
    var file = new Blob([byteArray], {
        type: "application/pdf;base64",
    });
    var fileURL = URL.createObjectURL(file);
    return fileURL;
}

async function toBase64(file) {
    return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}

export default {
    copy,
    rolename,
    pluck,
    filterDoc,
    difference,
    empty,
    status,
    schemas,
    compressImage,
    formatDate,
    formatDoc,
    cleanData,
    toFormData,
    timeAgo,
    assignSchema,
    toBase64,
    toCapitalize
}
